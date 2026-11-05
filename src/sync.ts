import { supabase } from './supabase'
import { safe } from './privacy'

export interface RemoteSettings { lang?: string | null; role?: string | null; trusted_contact?: string | null }

let uid = ''
let timer: ReturnType<typeof setTimeout> | undefined
let pending: RemoteSettings = {}

export const setSyncUser = (id: string) => { uid = id; if (!id) { pending = {}; clearTimeout(timer) } }

export async function pullSettings(id: string): Promise<RemoteSettings | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('user_settings').select('lang, role, trusted_contact').eq('user_id', id).maybeSingle()
  return error ? null : data
}

/** Guarda ajustes en la nube (se agrupan para no hacer una llamada por tecla). Nunca bloquea la app. */
export function pushSettings(patch: RemoteSettings) {
  if (!supabase || !uid) return
  pending = { ...pending, ...patch }
  clearTimeout(timer)
  timer = setTimeout(async () => {
    const row = { user_id: uid, ...pending, updated_at: new Date().toISOString() }
    pending = {}
    try { await supabase!.from('user_settings').upsert(row) } catch { /* sin conexión: se reintenta con el próximo cambio */ }
  }, 800)
}

/** Aplica lo guardado en la nube al teléfono (el contacto de confianza vive en localStorage). */
export function applyTrusted(v?: string | null) { if (typeof v === 'string') safe.set('poligt:trusted', v) }