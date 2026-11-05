// Eliminar la cuenta propia (obligatorio en App Store y Google Play). Borra el usuario y, en cascada, su perfil y ajustes.
import { isAllowedOrigin } from './lib.js'

const SB = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const ANON = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } })

export async function POST(request) {
  if (!SB || !ANON || !SERVICE) return json({ error: 'not_configured' }, 503)
  if (!isAllowedOrigin(request.headers.get('origin'), request.headers.get('host'), process.env.ALLOWED_ORIGINS)) return json({ error: 'forbidden' }, 403)

  const token = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (!token) return json({ error: 'unauthorized' }, 401)

  try {
    // Quién es: se verifica el token con Supabase; nunca se confía en un id enviado por el navegador.
    const me = await fetch(`${SB}/auth/v1/user`, { headers: { apikey: ANON, authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(8000) })
    if (!me.ok) return json({ error: 'unauthorized' }, 401)
    const { id } = await me.json()
    if (!id) return json({ error: 'unauthorized' }, 401)

    const del = await fetch(`${SB}/auth/v1/admin/users/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { apikey: SERVICE, authorization: `Bearer ${SERVICE}` },
      signal: AbortSignal.timeout(8000),
    })
    return del.ok ? json({ ok: true }) : json({ error: 'upstream' }, 502)
  } catch {
    return json({ error: 'upstream' }, 502)
  }
}