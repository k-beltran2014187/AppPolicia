// Inicio de sesión con celular: busca el correo de esa cuenta en el servidor y valida la contraseña.
// El correo nunca se devuelve al navegador (solo la sesión), para no revelar datos de otras personas.
import { isAllowedOrigin } from './lib.js'

const SB = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const ANON = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } })

const hits = new Map()
function limited(key, max, windowMs) {
  const now = Date.now()
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  arr.push(now)
  hits.set(key, arr)
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > windowMs) hits.delete(k)
  return arr.length > max
}
const clientIp = (request) =>
  (request.headers.get('x-real-ip') || request.headers.get('x-vercel-forwarded-for') || (request.headers.get('x-forwarded-for') ?? '').split(',').pop() || 'anon').trim()

export async function POST(request) {
  if (!SB || !ANON || !SERVICE) return json({ error: 'not_configured' }, 503)
  if (!isAllowedOrigin(request.headers.get('origin'), request.headers.get('host'), process.env.ALLOWED_ORIGINS)) return json({ error: 'forbidden' }, 403)

  let body
  try {
    const raw = await request.text()
    if (raw.length > 2000) return json({ error: 'too_large' }, 413)
    body = JSON.parse(raw)
  } catch { return json({ error: 'bad_request' }, 400) }

  const phone = typeof body?.phone === 'string' ? body.phone.replace(/\D/g, '') : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  if (!/^\d{7,15}$/.test(phone) || !password || password.length > 200) return json({ error: 'invalid' }, 401)

  // Límite por IP y por número, contra adivinar contraseñas.
  if (limited(`ip:${clientIp(request)}`, 15, 60_000) || limited(`ph:${phone}`, 6, 60_000)) return json({ error: 'rate_limited' }, 429)

  try {
    const q = await fetch(`${SB}/rest/v1/profiles?phone=eq.${phone}&select=email&limit=1`, {
      headers: { apikey: SERVICE, authorization: `Bearer ${SERVICE}` },
      signal: AbortSignal.timeout(8000),
    })
    const rows = q.ok ? await q.json() : []
    const email = rows?.[0]?.email
    // Misma respuesta si el celular no existe o la contraseña es incorrecta.
    if (!email) return json({ error: 'invalid' }, 401)

    const t = await fetch(`${SB}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: ANON, 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(8000),
    })
    if (!t.ok) return json({ error: 'invalid' }, 401)
    const s = await t.json()
    return json({ access_token: s.access_token, refresh_token: s.refresh_token })
  } catch {
    return json({ error: 'upstream' }, 502)
  }
}