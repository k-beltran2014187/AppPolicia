import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase, authEnabled } from './supabase'
import { normPhone } from './validate'

export interface Profile {
  first_name: string
  second_name: string | null
  first_surname: string
  second_surname: string | null
  phone: string
  email: string
  dpi: string
}

export interface SignUpInput {
  firstName: string
  secondName: string
  firstSurname: string
  secondSurname: string
  phone: string
  email: string
  dpi: string
  password: string
}

export type AuthError = 'invalid' | 'network' | 'exists' | 'rate' | 'weak' | 'unconfirmed' | 'unknown'
type Result = AuthError | null

interface Ctx {
  enabled: boolean
  ready: boolean
  user: User | null
  profile: Profile | null
  recovery: boolean
  signInEmail: (email: string, password: string) => Promise<Result>
  signInPhone: (phone: string, password: string) => Promise<Result>
  /** null = cuenta lista; 'confirm' = falta confirmar el correo. */
  signUp: (i: SignUpInput) => Promise<Result | 'confirm'>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<Result>
  updatePassword: (password: string) => Promise<Result>
  deleteAccount: () => Promise<boolean>
}

const off: Ctx = {
  enabled: false, ready: true, user: null, profile: null, recovery: false,
  signInEmail: async () => 'unknown', signInPhone: async () => 'unknown', signUp: async () => 'unknown',
  signOut: async () => {}, resetPassword: async () => 'unknown', updatePassword: async () => 'unknown', deleteAccount: async () => false,
}

const AuthCtx = createContext<Ctx>(off)
export const useAuth = () => useContext(AuthCtx)

function mapErr(e: { message?: string; status?: number } | null): AuthError {
  if (!e) return 'unknown'
  const m = (e.message ?? '').toLowerCase()
  if (e.status === 429 || m.includes('rate limit') || m.includes('too many')) return 'rate'
  if (m.includes('not confirmed')) return 'unconfirmed'
  if (m.includes('already') || m.includes('database error') || m.includes('duplicate')) return 'exists'
  if (m.includes('password') && (m.includes('weak') || m.includes('least') || m.includes('short'))) return 'weak'
  if (m.includes('invalid')) return 'invalid'
  if (m.includes('fetch') || m.includes('network') || e.status === 0) return 'network'
  return 'unknown'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!authEnabled)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [recovery, setRecovery] = useState(false)

  useEffect(() => {
    if (!supabase) return
    let alive = true
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return
      setUser(data.session?.user ?? null)
      setReady(true)
    }).catch(() => alive && setReady(true))
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
      if (event === 'SIGNED_OUT') { setProfile(null); setRecovery(false) }
    })
    return () => { alive = false; sub.subscription.unsubscribe() }
  }, [])

  const uid = user?.id
  useEffect(() => {
    if (!supabase || !uid) { setProfile(null); return }
    let alive = true
    supabase.from('profiles').select('first_name, second_name, first_surname, second_surname, phone, email, dpi').eq('id', uid).maybeSingle()
      .then(({ data }) => { if (alive) setProfile(data as Profile | null) })
    return () => { alive = false }
  }, [uid])

  const signInEmail = useCallback<Ctx['signInEmail']>(async (email, password) => {
    if (!supabase) return 'unknown'
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      return error ? mapErr(error) : null
    } catch { return 'network' }
  }, [])

  const signInPhone = useCallback<Ctx['signInPhone']>(async (phone, password) => {
    if (!supabase) return 'unknown'
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ phone: normPhone(phone), password }),
      })
      if (res.status === 429) return 'rate'
      if (!res.ok) return res.status === 401 ? 'invalid' : 'unknown'
      const t = (await res.json()) as { access_token?: string; refresh_token?: string }
      if (!t.access_token || !t.refresh_token) return 'unknown'
      const { error } = await supabase.auth.setSession({ access_token: t.access_token, refresh_token: t.refresh_token })
      return error ? mapErr(error) : null
    } catch { return 'network' }
  }, [])

  const signUp = useCallback<Ctx['signUp']>(async (i) => {
    if (!supabase) return 'unknown'
    try {
      const { data, error } = await supabase.auth.signUp({
        email: i.email.trim(),
        password: i.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            first_name: i.firstName.trim(),
            second_name: i.secondName.trim(),
            first_surname: i.firstSurname.trim(),
            second_surname: i.secondSurname.trim(),
            phone: normPhone(i.phone),
            dpi: i.dpi.replace(/\D/g, ''),
            consent_at: new Date().toISOString(),
          },
        },
      })
      if (error) return mapErr(error)
      if (data.user && data.user.identities?.length === 0) return 'exists'
      return data.session ? null : 'confirm'
    } catch { return 'network' }
  }, [])

  const signOut = useCallback(async () => {
    try { await supabase?.auth.signOut() } catch { /* aun así se cierra localmente */ }
    setUser(null); setProfile(null)
  }, [])

  const resetPassword = useCallback<Ctx['resetPassword']>(async (email) => {
    if (!supabase) return 'unknown'
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin })
      return error ? mapErr(error) : null
    } catch { return 'network' }
  }, [])

  const updatePassword = useCallback<Ctx['updatePassword']>(async (password) => {
    if (!supabase) return 'unknown'
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (!error) setRecovery(false)
      return error ? mapErr(error) : null
    } catch { return 'network' }
  }, [])

  const deleteAccount = useCallback(async () => {
    if (!supabase) return false
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) return false
      const res = await fetch('/api/delete-account', { method: 'POST', headers: { authorization: `Bearer ${token}` } })
      if (!res.ok) return false
      await signOut()
      return true
    } catch { return false }
  }, [signOut])

  const value = useMemo<Ctx>(
    () => ({ enabled: authEnabled, ready, user, profile, recovery, signInEmail, signInPhone, signUp, signOut, resetPassword, updatePassword, deleteAccount }),
    [ready, user, profile, recovery, signInEmail, signInPhone, signUp, signOut, resetPassword, updatePassword, deleteAccount],
  )
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}