import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { LangContext, UI, tr, type Lang } from './i18n'
import Home from './views/Home'
import Drawer from './Drawer'
import { Logo } from './Logo'
import ErrorBoundary from './ErrorBoundary'
import LockScreen from './LockScreen'
import { Icon } from './icons'
import { hasPin, quickExit, safe } from './privacy'
import { AuthProvider, useAuth } from './auth'
import { disableBio, hasBio } from './biometric'
import { isForeignNationality } from './validate'
import { applyTrusted, pullSettings, pushSettings, setSyncUser } from './sync'

// Heavier or rarely used screens load on demand (faster first paint on slow phones).
const Scenario = lazy(() => import('./views/Scenario'))
const Laws = lazy(() => import('./views/Laws'))
const Record = lazy(() => import('./views/Record'))
const Help = lazy(() => import('./views/Help'))
const Report = lazy(() => import('./views/Report'))
const Chat = lazy(() => import('./views/Chat'))
const Denuncia = lazy(() => import('./views/Denuncia'))
const Account = lazy(() => import('./views/Account'))
const Auth = lazy(() => import('./views/Auth'))
const Foreign = lazy(() => import('./views/Foreign'))

export type Role = 'civil' | 'officer'

const KINDS = ['home', 'chat', 'laws', 'record', 'help', 'report', 'denuncia', 'account', 'foreign', 's'] as const
const parseView = () => {
  const raw = decodeURIComponent(window.location.hash.replace('#', '') || 'chat')
  const [kind, ...rest] = raw.split(':')
  const arg = rest.join(':')
  return (KINDS as readonly string[]).includes(kind) ? { kind, arg } : { kind: 'chat', arg: '' }
}

const asLang = (v: string): Lang => (v === 'en' ? 'en' : 'es')
const asRole = (v: string): Role => (v === 'officer' ? 'officer' : 'civil')

const lockable = () => hasPin() || hasBio()

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

function AppInner() {
  const auth = useAuth()
  const [lang, setLangState] = useState<Lang>(() => asLang(safe.get('poligt:lang', 'es')))
  const [role, setRoleState] = useState<Role>(() => asRole(safe.get('poligt:role', 'civil')))
  const [view, setView] = useState(parseView)
  const [ack, setAck] = useState(safe.get('poligt:ack') === '1')
  const [locked, setLocked] = useState(lockable())
  const [guest, setGuest] = useState(safe.get('poligt:guest') === '1')
  const [foreignLocal, setForeignLocal] = useState(safe.get('poligt:foreigner') === '1')
  const [, bump] = useState(0)
  const synced = useRef(false)
  const uid = auth.user?.id
  const [menu, setMenu] = useState(false)
  // Con cuenta, la nacionalidad del perfil decide; sin cuenta, la persona lo activa a mano.
  const foreigner = auth.user ? isForeignNationality(auth.profile?.nationality) : foreignLocal
  const setForeigner = (v: boolean) => { setForeignLocal(v); if (v) safe.set('poligt:foreigner', '1'); else safe.del('poligt:foreigner') }

  useEffect(() => { document.documentElement.lang = lang }, [lang])
  useEffect(() => {
    const on = () => { setView(parseView()); setMenu(false) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  // Re-lock when the app goes to the background.
  useEffect(() => {
    const on = () => { if (document.hidden && lockable()) setLocked(true) }
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])
  useEffect(() => { window.scrollTo(0, 0) }, [view.kind, view.arg])

  // Con una sesión abierta ya no se está en modo invitado; al entrar se traen los ajustes guardados en la nube.
  useEffect(() => {
    synced.current = false
    setSyncUser(uid ?? '')
    if (!uid) return
    if (safe.get('poligt:guest')) { safe.del('poligt:guest'); setGuest(false) }
    let alive = true
    pullSettings(uid).then((s) => {
      if (!alive) return
      if (s) {
        if (s.lang) { setLangState(asLang(s.lang)); safe.set('poligt:lang', s.lang) }
        if (s.role) { setRoleState(asRole(s.role)); safe.set('poligt:role', s.role) }
        applyTrusted(s.trusted_contact)
      } else {
        pushSettings({ lang: asLang(safe.get('poligt:lang', 'es')), role: asRole(safe.get('poligt:role', 'civil')), trusted_contact: safe.get('poligt:trusted') })
      }
      synced.current = true
    })
    return () => { alive = false }
  }, [uid])

  const go = (v: string) => { window.location.hash = v }
  const setLang = (l: Lang) => { setLangState(l); safe.set('poligt:lang', l); if (synced.current) pushSettings({ lang: l }) }
  const setRole = (r: Role) => { setRoleState(r); safe.set('poligt:role', r); if (synced.current) pushSettings({ role: r }) }
  const enterGuest = () => { safe.set('poligt:guest', '1'); setGuest(true) }
  const leaveGuest = () => { safe.del('poligt:guest'); setGuest(false) }
  const open = (id: string) => go(`laws:${id}`)

  const { kind, arg } = view

  let page
  if (kind === 's') page = <Scenario id={arg} role={role} openArticle={open} />
  else if (kind === 'chat') page = <Chat role={role} foreigner={foreigner} openArticle={open} go={go} />
  else if (kind === 'laws') page = <Laws key={arg} focus={arg} />
  else if (kind === 'record') page = <Record />
  else if (kind === 'help') page = <Help />
  else if (kind === 'report') page = <Report />
  else if (kind === 'denuncia') page = <Denuncia openArticle={open} />
  else if (kind === 'foreign') page = <Foreign openArticle={open} go={go} canToggle={!auth.user} foreigner={foreigner} setForeigner={setForeigner} />
  else if (kind === 'account') page = <Account isGuest={guest} onLeaveGuest={leaveGuest} onLockChange={() => bump((n) => n + 1)} />
  else page = <Home role={role} setRole={setRole} go={go} />

  const modal = !ack || locked
  const unlock = useCallback(() => setLocked(false), [])
  const needAuth = auth.enabled && auth.ready && ((!auth.user && !guest) || auth.recovery)
  const authLoading = auth.enabled && !auth.ready
  const fallback = () => { disableBio(); setLocked(lockable()); void auth.signOut() }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {authLoading ? (
        <div className="auth"><div className="auth-card center"><Logo height={56} /></div></div>
      ) : needAuth ? (
        <div inert={modal}><Suspense fallback={null}><Auth onGuest={enterGuest} /></Suspense></div>
      ) : (<>
      {/* While a dialog is open the page behind it cannot be focused or read by assistive tech. */}
      <div inert={modal || menu}>
        <header className="top">
          <div className="brand">
            <button className="back" onClick={() => setMenu(true)} aria-label={tr(UI.menu, lang)} aria-expanded={menu}><Icon name="menu" size={24} /></button>
            {kind === 's' && <button className="back" onClick={() => window.history.back()} aria-label={tr(UI.back, lang)}><Icon name="back" size={26} /></button>}
            <button className="logo logo-btn" onClick={() => go('chat')} aria-label={`${UI.appName[lang]} – ${tr(UI.chat, lang)}`}><Logo height={34} /></button>
          </div>
          <div className="top-actions">
            <button className="lang exit" onClick={quickExit} aria-label={tr(UI.quickExit, lang)} title={tr(UI.quickExit, lang)}>
              <Icon name="exit" size={18} />
            </button>
          </div>
        </header>
        <main className={kind === 'chat' ? 'chat-page' : undefined}>
          <ErrorBoundary lang={lang} key={`${kind}:${arg}`}>
            <Suspense fallback={<p className="muted center" role="status">{tr(UI.loading, lang)}</p>}>
              <div className="page">{page}</div>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      <Drawer open={menu && !modal} onClose={() => setMenu(false)} kind={kind} go={go} role={role} setRole={setRole} lang={lang} setLang={setLang} foreigner={foreigner} canLock={lockable()} onLock={() => setLocked(true)} />
      </>)}
      {locked && <LockScreen onUnlock={unlock} onFallback={auth.user ? fallback : undefined} />}
      {!ack && !locked && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="ack-title">
          <div className="modal-box">
            <h2 id="ack-title" className="row-ico"><Icon name="alert" /> {tr(UI.disclaimerTitle, lang)}</h2>
            <p>{tr(UI.disclaimer, lang)}</p>
            <p className="small muted">{tr(UI.aiPrivacy, lang)}</p>
            <button className="big" autoFocus onClick={() => { setAck(true); safe.set('poligt:ack', '1') }}>{tr(UI.accept, lang)}</button>
          </div>
        </div>
      )}
    </LangContext.Provider>
  )
}
