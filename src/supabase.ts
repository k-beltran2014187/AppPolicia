import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Sin estas dos variables la app funciona como antes (sin cuentas). */
export const authEnabled = !!(url && key)

// La clave "anon" es pública por diseño: la seguridad la dan las reglas RLS de supabase/schema.sql.
export const supabase = authEnabled
  ? createClient(url as string, key as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
    })
  : null