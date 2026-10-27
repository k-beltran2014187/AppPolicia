import { UI, tr, useLang } from '../i18n'
import { SCENARIOS } from '../data/scenarios'
import type { Role } from '../App'
import { Icon } from '../icons'
import Mike from '../Mike'

interface Props {
  role: Role
  setRole: (r: Role) => void
  go: (v: string) => void
}

export default function Home({ role, setRole, go }: Props) {
  const { lang } = useLang()
  return (
    <div className="stack">
      <p className="tagline">{tr(UI.tagline, lang)}</p>
      <div className="seg" role="tablist" aria-label={tr(UI.iAm, lang)}>
        <button className={role === 'civil' ? 'on' : ''} onClick={() => setRole('civil')}>
          <Icon name="user" size={18} /> {tr(UI.civil, lang)}
        </button>
        <button className={role === 'officer' ? 'on' : ''} onClick={() => setRole('officer')}>
          <Icon name="badge" size={18} /> {tr(UI.officer, lang)}
        </button>
      </div>

      <button className="sos" onClick={() => go('chat')}>
        <span className="sos-who"><Mike size={44} /> Mike · {tr(UI.mikeRole, lang)}</span>
        <span className="sos-title">{tr(UI.askBtn, lang)}</span>
        <span className="sos-sub">{tr(UI.askSub, lang)}</span>
        <span className="sos-go"><Icon name="arrow" size={24} /></span>
      </button>
      <button className="btn" onClick={() => go('s:alto')}>
        {role === 'civil' ? tr(UI.stoppedBtn, lang) : tr(UI.officerBtn, lang)} · {tr(UI.stoppedSub, lang)}
      </button>

      <h2>{tr(UI.situations, lang)}</h2>
      <div className="grid">
        {SCENARIOS.map((s) => (
          <button key={s.id} className="card" onClick={() => go(`s:${s.id}`)}>
            <span className="ico-circle"><Icon name={s.icon} size={22} /></span>
            <span>{tr(s.title, lang)}</span>
          </button>
        ))}
      </div>

      <h2>{tr(UI.tools, lang)}</h2>
      <div className="grid">
        <button className="card" onClick={() => go('record')}><span className="ico-circle"><Icon name="record" size={22} /></span><span>{tr(UI.record, lang)}</span></button>
        <button className="card" onClick={() => go('help')}><span className="ico-circle"><Icon name="help" size={22} /></span><span>{tr(UI.help, lang)}</span></button>
        <button className="card" onClick={() => go('report')}><span className="ico-circle"><Icon name="report" size={22} /></span><span>{tr(UI.report, lang)}</span></button>
        <button className="card" onClick={() => go('laws')}><span className="ico-circle"><Icon name="laws" size={22} /></span><span>{tr(UI.laws, lang)}</span></button>
      </div>
      <p className="muted small">{tr(UI.installTip, lang)}</p>
    </div>
  )
}
