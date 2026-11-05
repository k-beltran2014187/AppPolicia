import { useEffect, useState } from 'react'
import { tr, useLang, type L } from '../i18n'
import { useAuth } from '../auth'
import { Icon } from '../icons'
import { bioAvailable, disableBio, enableBio, hasBio } from '../biometric'
import { wipeAll } from '../privacy'
import { maskDpi } from '../validate'
import Legal from './Legal'

const T = {
  title: { es: 'Mi cuenta', en: 'My account' },
  guestTitle: { es: 'Estás usando SOSgt sin cuenta', en: "You're using SOSgt without an account" },
  guestSub: { es: 'Crea una cuenta o inicia sesión para guardar tus ajustes en la nube y entrar con rostro o huella.', en: 'Create an account or sign in to save your settings in the cloud and use face or fingerprint sign-in.' },
  signIn: { es: 'Iniciar sesión o crear cuenta', en: 'Sign in or create account' },
  name: { es: 'Nombre', en: 'Name' },
  phone: { es: 'Celular', en: 'Phone' },
  email: { es: 'Correo', en: 'Email' },
  dpi: { es: 'DPI', en: 'DPI' },
  bioTitle: { es: 'Entrar con rostro o huella', en: 'Sign in with face or fingerprint' },
  bioSub: { es: 'Tu teléfono verifica quién eres. SOSgt nunca recibe ni guarda tu rostro ni tu huella. Tu sesión sigue abierta en este teléfono.', en: 'Your phone verifies who you are. SOSgt never receives or stores your face or fingerprint. Your session stays open on this phone.' },
  bioOn: { es: 'Activado', en: 'On' },
  bioOff: { es: 'Activar', en: 'Turn on' },
  bioDisable: { es: 'Desactivar', en: 'Turn off' },
  bioFail: { es: 'No se pudo activar. Revisa que tu teléfono tenga rostro o huella configurados.', en: 'Could not turn it on. Check that your phone has face or fingerprint set up.' },
  bioNone: { es: 'Este teléfono o navegador no permite rostro o huella.', en: "This phone or browser doesn't support face or fingerprint." },
  signOut: { es: 'Cerrar sesión', en: 'Sign out' },
  del: { es: 'Eliminar mi cuenta', en: 'Delete my account' },
  delWarn: { es: 'Se borrarán tu perfil y tus ajustes de la nube y también los datos guardados en este teléfono. No se puede deshacer.', en: 'Your profile and cloud settings will be erased, along with the data saved on this phone. This cannot be undone.' },
  delConfirm: { es: 'Sí, eliminar todo', en: 'Yes, delete everything' },
  cancel: { es: 'Cancelar', en: 'Cancel' },
  delFail: { es: 'No se pudo eliminar. Revisa tu conexión e intenta de nuevo.', en: 'Could not delete. Check your connection and try again.' },
  legal: { es: 'Privacidad y términos', en: 'Privacy and terms' },
} satisfies Record<string, L>

interface Props { isGuest: boolean; onLeaveGuest: () => void; onLockChange: () => void }

export default function Account({ isGuest, onLeaveGuest, onLockChange }: Props) {
  const { lang } = useLang()
  const auth = useAuth()
  const t = (k: keyof typeof T) => tr(T[k], lang)
  const [bio, setBio] = useState(hasBio())
  const [canBio, setCanBio] = useState(false)
  const [note, setNote] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [legal, setLegal] = useState(false)

  useEffect(() => { bioAvailable().then(setCanBio) }, [])

  const p = auth.profile
  const fullName = p ? [p.first_name, p.second_name, p.first_surname, p.second_surname].filter(Boolean).join(' ') : ''

  async function toggleBio() {
    setNote('')
    if (bio) { disableBio(); setBio(false); onLockChange(); return }
    const ok = await enableBio(p?.email ?? auth.user?.email ?? '')
    setBio(ok); onLockChange()
    if (!ok) setNote(t('bioFail'))
  }

  async function remove() {
    setBusy(true); setNote('')
    const ok = await auth.deleteAccount()
    if (ok) { disableBio(); await wipeAll(false); window.location.hash = 'chat'; window.location.reload() }
    else { setBusy(false); setNote(t('delFail')) }
  }

  if (legal) return <div className="stack"><button className="linklike" onClick={() => setLegal(false)}>← {t('title')}</button><Legal /></div>

  if (isGuest || !auth.user) {
    return (
      <div className="stack">
        <h1>{t('title')}</h1>
        <section className="panel stack">
          <h2 className="row-ico"><Icon name="user" /> {t('guestTitle')}</h2>
          <p className="muted">{t('guestSub')}</p>
          <button className="big" onClick={onLeaveGuest}>{t('signIn')}</button>
        </section>
        <button className="btn" onClick={() => setLegal(true)}>{t('legal')}</button>
      </div>
    )
  }

  return (
    <div className="stack">
      <h1>{t('title')}</h1>
      <section className="panel stack">
        <dl className="kv">
          <dt>{t('name')}</dt><dd>{fullName || '…'}</dd>
          <dt>{t('phone')}</dt><dd>{p?.phone ?? '…'}</dd>
          <dt>{t('email')}</dt><dd>{p?.email ?? auth.user.email}</dd>
          {p && <><dt>{t('dpi')}</dt><dd>{maskDpi(p.dpi)}</dd></>}
        </dl>
      </section>

      <section className="panel stack">
        <h2 className="row-ico"><Icon name="lock" /> {t('bioTitle')}</h2>
        <p className="muted">{t('bioSub')}</p>
        {canBio ? (
          <button className={bio ? 'btn' : 'big'} onClick={toggleBio}>{bio ? `${t('bioOn')} · ${t('bioDisable')}` : t('bioOff')}</button>
        ) : <p className="small muted">{t('bioNone')}</p>}
      </section>

      {note && <p className="error" role="alert">{note}</p>}
      <button className="btn" onClick={() => { disableBio(); onLockChange(); void auth.signOut() }}>{t('signOut')}</button>
      <button className="btn" onClick={() => setLegal(true)}>{t('legal')}</button>

      {confirm ? (
        <div className="panel bad stack">
          <p>{t('delWarn')}</p>
          <div className="row">
            <button className="btn danger" onClick={remove} disabled={busy}>{t('delConfirm')}</button>
            <button className="btn" onClick={() => setConfirm(false)} disabled={busy}>{t('cancel')}</button>
          </div>
        </div>
      ) : (
        <button className="btn danger" onClick={() => setConfirm(true)}>{t('del')}</button>
      )}
    </div>
  )
}