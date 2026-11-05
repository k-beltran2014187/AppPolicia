import { useState } from 'react'
import { tr, useLang, type L } from '../i18n'
import { useAuth, type AuthError } from '../auth'
import { Logo } from '../Logo'
import Legal from './Legal'
import { isDpi, isEmail, isPhone, looksLikeEmail, onlyDigits, passwordIssue } from '../validate'

const T = {
  loginTitle: { es: 'Inicia sesión', en: 'Sign in' },
  loginSub: { es: 'Entra con tu correo o tu celular.', en: 'Sign in with your email or phone.' },
  id: { es: 'Correo o celular', en: 'Email or phone' },
  idHint: { es: 'correo@ejemplo.com o 5555 1234', en: 'you@example.com or 5555 1234' },
  password: { es: 'Contraseña', en: 'Password' },
  show: { es: 'Mostrar', en: 'Show' },
  hide: { es: 'Ocultar', en: 'Hide' },
  enter: { es: 'Entrar', en: 'Sign in' },
  working: { es: 'Un momento…', en: 'One moment…' },
  forgot: { es: '¿Olvidaste tu contraseña?', en: 'Forgot your password?' },
  create: { es: 'Crear cuenta', en: 'Create account' },
  haveAccount: { es: '¿Ya tienes cuenta? Inicia sesión', en: 'Already have an account? Sign in' },
  noAccount: { es: '¿No tienes cuenta?', en: "Don't have an account?" },
  guest: { es: 'Continuar sin cuenta', en: 'Continue without an account' },
  guestNote: { es: 'Sin cuenta puedes usar la app, pero tus ajustes no se guardan en la nube.', en: 'Without an account you can still use the app, but your settings are not saved in the cloud.' },
  registerTitle: { es: 'Crea tu cuenta', en: 'Create your account' },
  registerSub: { es: 'Es gratis y toma un minuto.', en: "It's free and takes a minute." },
  firstName: { es: 'Primer nombre', en: 'First name' },
  secondName: { es: 'Segundo nombre (opcional)', en: 'Middle name (optional)' },
  firstSurname: { es: 'Primer apellido', en: 'First surname' },
  secondSurname: { es: 'Segundo apellido (opcional)', en: 'Second surname (optional)' },
  phone: { es: 'Celular', en: 'Mobile phone' },
  phoneHint: { es: '8 dígitos, sin guiones', en: '8 digits, no dashes' },
  email: { es: 'Correo electrónico', en: 'Email' },
  dpi: { es: 'DPI', en: 'DPI (national ID)' },
  dpiHint: { es: '13 dígitos', en: '13 digits' },
  dpiNote: { es: 'Lo usamos solo para identificarte como titular de la cuenta. Se guarda protegido, nadie más puede verlo y nunca se envía al asesor de IA.', en: 'Used only to identify you as the account holder. It is stored protected, nobody else can see it, and it is never sent to the AI advisor.' },
  password2: { es: 'Repite la contraseña', en: 'Repeat the password' },
  passwordHelp: { es: 'Mínimo 8 caracteres, con letras y números.', en: 'At least 8 characters, with letters and numbers.' },
  consentA: { es: 'Acepto la ', en: 'I accept the ' },
  consentLink: { es: 'Política de privacidad y los Términos', en: 'Privacy Policy and Terms' },
  back: { es: 'Volver', en: 'Back' },
  forgotTitle: { es: 'Recupera tu contraseña', en: 'Reset your password' },
  forgotSub: { es: 'Escribe tu correo y te enviamos un enlace para crear una nueva.', en: "Enter your email and we'll send you a link to create a new one." },
  send: { es: 'Enviar enlace', en: 'Send link' },
  resetSent: { es: 'Si ese correo tiene cuenta, te enviamos un enlace. Revisa también la carpeta de spam.', en: 'If that email has an account, we sent you a link. Check your spam folder too.' },
  recoveryTitle: { es: 'Nueva contraseña', en: 'New password' },
  save: { es: 'Guardar contraseña', en: 'Save password' },
  confirmSent: { es: 'Te enviamos un correo para confirmar tu cuenta. Ábrelo y luego inicia sesión.', en: 'We sent you an email to confirm your account. Open it, then sign in.' },
  eRequired: { es: 'Este dato es obligatorio.', en: 'This field is required.' },
  ePhone: { es: 'Escribe un celular de 8 dígitos.', en: 'Enter an 8-digit phone number.' },
  eEmail: { es: 'Escribe un correo válido.', en: 'Enter a valid email.' },
  eDpi: { es: 'El DPI debe tener 13 dígitos válidos.', en: 'The DPI must have 13 valid digits.' },
  ePassShort: { es: 'Usa al menos 8 caracteres.', en: 'Use at least 8 characters.' },
  ePassWeak: { es: 'Incluye letras y números.', en: 'Include letters and numbers.' },
  eMatch: { es: 'Las contraseñas no coinciden.', en: "Passwords don't match." },
  eConsent: { es: 'Debes aceptar para crear la cuenta.', en: 'You must accept to create the account.' },
  invalid: { es: 'Correo, celular o contraseña incorrectos.', en: 'Wrong email, phone or password.' },
  network: { es: 'No hay conexión. Intenta de nuevo.', en: 'No connection. Try again.' },
  exists: { es: 'Ese correo o celular ya tiene una cuenta.', en: 'That email or phone already has an account.' },
  rate: { es: 'Demasiados intentos. Espera un momento.', en: 'Too many attempts. Wait a moment.' },
  weak: { es: 'Esa contraseña es muy débil. Prueba con otra.', en: 'That password is too weak. Try another.' },
  unconfirmed: { es: 'Falta confirmar tu correo. Revisa tu bandeja de entrada.', en: 'Your email is not confirmed yet. Check your inbox.' },
  unknown: { es: 'Algo salió mal. Intenta de nuevo.', en: 'Something went wrong. Try again.' },
} satisfies Record<string, L>

type Mode = 'login' | 'register' | 'forgot' | 'legal'
type Form = { firstName: string; secondName: string; firstSurname: string; secondSurname: string; phone: string; email: string; dpi: string; password: string; password2: string; consent: boolean }
const EMPTY: Form = { firstName: '', secondName: '', firstSurname: '', secondSurname: '', phone: '', email: '', dpi: '', password: '', password2: '', consent: false }

export default function Auth({ onGuest }: { onGuest: () => void }) {
  const { lang } = useLang()
  const auth = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null)
  const [showPw, setShowPw] = useState(false)
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [f, setF] = useState<Form>(EMPTY)
  const [errs, setErrs] = useState<Partial<Record<keyof Form, string>>>({})

  const t = (k: keyof typeof T) => tr(T[k], lang)
  const fail = (e: AuthError) => setMsg({ kind: 'error', text: t(e) })
  const go = (m: Mode) => { setMode(m); setMsg(null); setErrs({}) }
  const set = <K extends keyof Form>(k: K, v: Form[K]) => { setF((p) => ({ ...p, [k]: v })); setErrs((p) => ({ ...p, [k]: undefined })) }

  if (auth.recovery) return <RecoveryForm />

  async function login(e: React.FormEvent) {
    e.preventDefault()
    const who = id.trim()
    if (!who || !pw) return fail('invalid')
    if (!looksLikeEmail(who) && !isPhone(who)) return setMsg({ kind: 'error', text: t('invalid') })
    setBusy(true); setMsg(null)
    const r = looksLikeEmail(who) ? await auth.signInEmail(who, pw) : await auth.signInPhone(who, pw)
    setBusy(false)
    if (r) fail(r)
  }

  async function register(e: React.FormEvent) {
    e.preventDefault()
    const x: typeof errs = {}
    if (!f.firstName.trim()) x.firstName = t('eRequired')
    if (!f.firstSurname.trim()) x.firstSurname = t('eRequired')
    if (!isPhone(f.phone)) x.phone = t('ePhone')
    if (!isEmail(f.email)) x.email = t('eEmail')
    if (!isDpi(f.dpi)) x.dpi = t('eDpi')
    const pi = passwordIssue(f.password)
    if (pi) x.password = t(pi === 'short' ? 'ePassShort' : 'ePassWeak')
    else if (f.password !== f.password2) x.password2 = t('eMatch')
    if (!f.consent) x.consent = t('eConsent')
    setErrs(x)
    if (Object.keys(x).length) return
    setBusy(true); setMsg(null)
    const r = await auth.signUp(f)
    setBusy(false)
    if (r === 'confirm') { go('login'); setMsg({ kind: 'ok', text: t('confirmSent') }) }
    else if (r) fail(r)
  }

  async function forgot(e: React.FormEvent) {
    e.preventDefault()
    if (!isEmail(f.email)) return setErrs({ email: t('eEmail') })
    setBusy(true); setMsg(null)
    const r = await auth.resetPassword(f.email)
    setBusy(false)
    if (r && r !== 'invalid') fail(r)
    else setMsg({ kind: 'ok', text: t('resetSent') })
  }

  const Err = ({ k }: { k: keyof Form }) => (errs[k] ? <span className="field-err" role="alert">{errs[k]}</span> : null)
  const Msg = () => (msg ? <p className={msg.kind === 'error' ? 'error' : 'ok-note'} role={msg.kind === 'error' ? 'alert' : 'status'}>{msg.text}</p> : null)

  if (mode === 'legal') return <div className="auth"><div className="auth-card"><button className="linklike" onClick={() => go('register')}>← {t('back')}</button><Legal /></div></div>

  return (
    <div className="auth">
      <div className="auth-card stack">
        <div className="auth-logo"><Logo height={56} /></div>

        {mode === 'login' && (
          <form className="stack" onSubmit={login} noValidate>
            <h1>{t('loginTitle')}</h1>
            <p className="muted">{t('loginSub')}</p>
            <label className="lbl">{t('id')}
              <input className="field" autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder={t('idHint')} value={id} onChange={(e) => setId(e.target.value)} />
            </label>
            <label className="lbl">{t('password')}
              <span className="pw-wrap">
                <input className="field" type={showPw ? 'text' : 'password'} autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
                <button type="button" className="linklike pw-toggle" onClick={() => setShowPw((v) => !v)}>{showPw ? t('hide') : t('show')}</button>
              </span>
            </label>
            <Msg />
            <button className="big" type="submit" disabled={busy}>{busy ? t('working') : t('enter')}</button>
            <button type="button" className="linklike" onClick={() => go('forgot')}>{t('forgot')}</button>
            <p className="muted small center">{t('noAccount')} <button type="button" className="linklike" onClick={() => go('register')}>{t('create')}</button></p>
            <hr className="sep" />
            <button type="button" className="btn" onClick={onGuest}>{t('guest')}</button>
            <p className="muted small center">{t('guestNote')}</p>
          </form>
        )}

        {mode === 'register' && (
          <form className="stack" onSubmit={register} noValidate>
            <h1>{t('registerTitle')}</h1>
            <p className="muted">{t('registerSub')}</p>
            <label className="lbl">{t('firstName')}<input className="field" autoComplete="given-name" value={f.firstName} onChange={(e) => set('firstName', e.target.value)} /><Err k="firstName" /></label>
            <label className="lbl">{t('secondName')}<input className="field" autoComplete="additional-name" value={f.secondName} onChange={(e) => set('secondName', e.target.value)} /></label>
            <label className="lbl">{t('firstSurname')}<input className="field" autoComplete="family-name" value={f.firstSurname} onChange={(e) => set('firstSurname', e.target.value)} /><Err k="firstSurname" /></label>
            <label className="lbl">{t('secondSurname')}<input className="field" value={f.secondSurname} onChange={(e) => set('secondSurname', e.target.value)} /></label>
            <label className="lbl">{t('phone')}<input className="field" inputMode="tel" autoComplete="tel-national" maxLength={14} placeholder={t('phoneHint')} value={f.phone} onChange={(e) => set('phone', e.target.value)} /><Err k="phone" /></label>
            <label className="lbl">{t('email')}<input className="field" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" value={f.email} onChange={(e) => set('email', e.target.value)} /><Err k="email" /></label>
            <label className="lbl">{t('dpi')}<input className="field" inputMode="numeric" autoComplete="off" maxLength={17} placeholder={t('dpiHint')} value={f.dpi} onChange={(e) => set('dpi', onlyDigits(e.target.value).slice(0, 13))} /><Err k="dpi" />
              <span className="small muted">{t('dpiNote')}</span>
            </label>
            <label className="lbl">{t('password')}<input className="field" type="password" autoComplete="new-password" value={f.password} onChange={(e) => set('password', e.target.value)} /><Err k="password" />
              <span className="small muted">{t('passwordHelp')}</span>
            </label>
            <label className="lbl">{t('password2')}<input className="field" type="password" autoComplete="new-password" value={f.password2} onChange={(e) => set('password2', e.target.value)} /><Err k="password2" /></label>
            <label className="check">
              <input type="checkbox" checked={f.consent} onChange={(e) => set('consent', e.target.checked)} />
              <span>{t('consentA')}<button type="button" className="linklike" onClick={() => go('legal')}>{t('consentLink')}</button></span>
            </label>
            <Err k="consent" />
            <Msg />
            <button className="big" type="submit" disabled={busy}>{busy ? t('working') : t('create')}</button>
            <button type="button" className="linklike" onClick={() => go('login')}>{t('haveAccount')}</button>
          </form>
        )}

        {mode === 'forgot' && (
          <form className="stack" onSubmit={forgot} noValidate>
            <h1>{t('forgotTitle')}</h1>
            <p className="muted">{t('forgotSub')}</p>
            <label className="lbl">{t('email')}<input className="field" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" value={f.email} onChange={(e) => set('email', e.target.value)} /><Err k="email" /></label>
            <Msg />
            <button className="big" type="submit" disabled={busy}>{busy ? t('working') : t('send')}</button>
            <button type="button" className="linklike" onClick={() => go('login')}>← {t('back')}</button>
          </form>
        )}
      </div>
    </div>
  )
}

function RecoveryForm() {
  const { lang } = useLang()
  const auth = useAuth()
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const t = (k: keyof typeof T) => tr(T[k], lang)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const pi = passwordIssue(p1)
    if (pi) return setErr(t(pi === 'short' ? 'ePassShort' : 'ePassWeak'))
    if (p1 !== p2) return setErr(t('eMatch'))
    setBusy(true); setErr('')
    const r = await auth.updatePassword(p1)
    setBusy(false)
    if (r) setErr(t(r))
  }
  return (
    <div className="auth">
      <form className="auth-card stack" onSubmit={submit} noValidate>
        <div className="auth-logo"><Logo height={56} /></div>
        <h1>{t('recoveryTitle')}</h1>
        <label className="lbl">{t('password')}<input className="field" type="password" autoComplete="new-password" value={p1} onChange={(e) => setP1(e.target.value)} /></label>
        <label className="lbl">{t('password2')}<input className="field" type="password" autoComplete="new-password" value={p2} onChange={(e) => setP2(e.target.value)} /></label>
        <span className="small muted">{t('passwordHelp')}</span>
        {err && <p className="error" role="alert">{err}</p>}
        <button className="big" type="submit" disabled={busy}>{busy ? t('working') : t('save')}</button>
      </form>
    </div>
  )
}