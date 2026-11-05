import { useEffect, useRef } from 'react'
import { UI, tr, type Lang, type L } from './i18n'
import { Icon, type IconName } from './icons'
import type { Role } from './App'
import { Logo } from './Logo'

interface Props {
  open: boolean
  onClose: () => void
  kind: string
  go: (v: string) => void
  role: Role
  setRole: (r: Role) => void
  lang: Lang
  setLang: (l: Lang) => void
  canLock: boolean
  onLock: () => void
}

const ITEMS: { id: string; icon: IconName; label: L }[] = [
  { id: 'chat', icon: 'chat', label: UI.chat },
  { id: 'home', icon: 'home', label: UI.guides },
  { id: 'laws', icon: 'laws', label: UI.laws },
  { id: 'denuncia', icon: 'badge', label: UI.denounceTitle },
  { id: 'record', icon: 'record', label: UI.record },
  { id: 'report', icon: 'report', label: UI.report },
  { id: 'help', icon: 'help', label: UI.help },
  { id: 'account', icon: 'user', label: { es: 'Mi cuenta', en: 'My account' } },
]

export default function Drawer({ open, onClose, kind, go, role, setRole, lang, setLang, canLock, onLock }: Props) {
  const closeBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const pick = (id: string) => { go(id); onClose() }
  const active = kind === 's' ? 'home' : kind

  return (
    <div className={`drawer-wrap ${open ? 'open' : ''}`} aria-hidden={!open} inert={!open}>
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={tr(UI.menu, lang)}>
        <div className="drawer-head">
          <span className="logo"><Logo height={34} /></span>
          <button ref={closeBtn} className="back" onClick={onClose} aria-label={tr(UI.closeMenu, lang)}><Icon name="x" size={22} /></button>
        </div>
        <nav className="drawer-nav" aria-label={tr(UI.menu, lang)}>
          {ITEMS.map((it) => (
            <button key={it.id} className={active === it.id ? 'on' : ''} onClick={() => pick(it.id)} aria-current={active === it.id ? 'page' : undefined}>
              <Icon name={it.icon} size={22} /> {tr(it.label, lang)}
            </button>
          ))}
        </nav>
        <div className="drawer-foot">
          <div className="seg" role="group" aria-label={tr(UI.iAm, lang)}>
            <button className={role === 'civil' ? 'on' : ''} onClick={() => setRole('civil')} aria-pressed={role === 'civil'}>
              {tr(UI.roleDriver, lang)}
            </button>
            <button className={role === 'officer' ? 'on' : ''} onClick={() => setRole('officer')} aria-pressed={role === 'officer'}>
              {tr(UI.roleOfficer, lang)}
            </button>
          </div>
          <div className="row wrap">
            <button className="btn" onClick={() => setLang(lang === 'es' ? 'en' : 'es')}>{tr(UI.language, lang)}: {lang === 'es' ? 'English' : 'Español'}</button>
            {canLock && <button className="btn" onClick={() => { onClose(); onLock() }}><Icon name="lock" size={18} /> {tr(UI.lock, lang)}</button>}
          </div>
        </div>
      </aside>
    </div>
  )
}
