import { useEffect, useState } from 'react'
import { LangContext, UI, tr, type Lang } from './i18n'
import Home from './views/Home'
import Scenario from './views/Scenario'
import Laws from './views/Laws'
import Record from './views/Record'
import Help from './views/Help'
import Report from './views/Report'

export type Role = 'civil' | 'officer'

const read = (k: string, d: string) => {
  try { return localStorage.getItem(k) ?? d } catch { return d }
}
const write = (k: string, v: string) => {
  try { localStorage.setItem(k, v) } catch { /* ignore */ }
}

const viewFromHash = () => window.location.hash.replace('#', '') || 'home'

export default function App() {
  const [lang, setLangState] = useState<Lang>(read('poligt:lang', 'es') as Lang)
  const [role, setRoleState] = useState<Role>(read('poligt:role', 'civil') as Role)
  const [view, setView] = useState(viewFromHash())
  const [ack, setAck] = useState(read('poligt:ack', '') === '1')

  useEffect(() => {
    const on = () => setView(viewFromHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  useEffect(() => { window.scrollTo(0, 0) }, [view])

  const go = (v: string) => { window.location.hash = v }
  const setLang = (l: Lang) => { setLangState(l); write('poligt:lang', l); document.documentElement.lang = l }
  const setRole = (r: Role) => { setRoleState(r); write('poligt:role', r) }

  const [kind, arg] = view.split(':')
  const tab = kind === 's' ? 'home' : kind

  let page
  if (kind === 's') page = <Scenario id={arg} role={role} openArticle={(id) => go(`laws:${id}`)} />
  else if (kind === 'laws') page = <Laws key={arg} focus={arg} />
  else if (kind === 'record') page = <Record />
  else if (kind === 'help') page = <Help />
  else if (kind === 'report') page = <Report />
  else page = <Home role={role} setRole={setRole} go={go} />

  const tabs: [string, string, string][] = [
    ['home', '🏠', tr(UI.home, lang)],
    ['laws', '⚖️', tr(UI.laws, lang)],
    ['record', '🎥', tr(UI.record, lang)],
    ['help', '📞', tr(UI.help, lang)],
    ['report', '📝', tr(UI.report, lang)],
  ]

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <header className="top">
        <div className="brand">
          {kind !== 'home' && <button className="back" onClick={() => window.history.back()} aria-label={tr(UI.back, lang)}>‹</button>}
          <span className="logo">🛡️ {UI.appName[lang]}</span>
        </div>
        <button className="lang" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={tr(UI.language, lang)}>
          {lang === 'es' ? 'EN' : 'ES'}
        </button>
      </header>
      <main>{page}</main>
      <nav className="tabs">
        {tabs.map(([id, ico, label]) => (
          <button key={id} className={tab === id ? 'on' : ''} onClick={() => go(id)}>
            <span>{ico}</span>
            <small>{label}</small>
          </button>
        ))}
      </nav>
      {!ack && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-box">
            <h2>⚠️ {tr(UI.disclaimerTitle, lang)}</h2>
            <p>{tr(UI.disclaimer, lang)}</p>
            <button className="big" onClick={() => { setAck(true); write('poligt:ack', '1') }}>{tr(UI.accept, lang)}</button>
          </div>
        </div>
      )}
    </LangContext.Provider>
  )
}
