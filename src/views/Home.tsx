import { UI, tr, useLang } from '../i18n'
import { SCENARIOS } from '../data/scenarios'
import { ARTICLES } from '../data/laws'
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
      <button className="stopped" onClick={() => go('s:alto')}>
        <span className="ico-circle"><Icon name="siren" size={22} /></span>
        <span className="stopped-text">
          <strong>{role === 'civil' ? tr(UI.stoppedBtn, lang) : tr(UI.officerBtn, lang)}</strong>
          <small>{tr(UI.stoppedSub, lang)}</small>
        </span>
        <Icon name="arrow" size={20} />
      </button>
      <div className="quick">
        <button className="q rec" onClick={() => go('record')}>
          <span className="qi"><Icon name="record" size={22} /></span>
          {tr(UI.quickRecord, lang)}
        </button>
        <button className="q" onClick={() => go('report')}>
          <span className="qi"><Icon name="report" size={22} /></span>
          {tr(UI.report, lang)}
        </button>
        <button className="q" onClick={() => go('help')}>
          <span className="qi"><Icon name="pin" size={22} /></span>
          {tr(UI.quickShare, lang)}
        </button>
      </div>
      <a className="emergency" href="tel:110">
        <span className="emergency-ico"><Icon name="phone" size={22} /></span>
        <span className="stopped-text">
          <strong>{tr(UI.emergency, lang)} · 110</strong>
          <small>{tr(UI.emergencySub, lang)}</small>
        </span>
      </a>

      <button className="stopped denuncia-card" onClick={() => go('denuncia')}>
        <span className="ico-circle gold-ico"><Icon name="badge" size={22} /></span>
        <span className="stopped-text">
          <strong>{tr(UI.denounceTitle, lang)}</strong>
          <small>{tr(UI.denounceSub, lang)}</small>
        </span>
        <Icon name="arrow" size={20} />
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

      <button className="lawscard" onClick={() => go('laws')}>
        <span className="ico-circle gold-ico"><Icon name="laws" size={22} /></span>
        <span>
          <strong>{tr(UI.lawsCardTitle, lang)}</strong>
          <small>{ARTICLES.length} {tr(UI.lawsCardSub, lang)}</small>
        </span>
        <Icon name="arrow" size={20} />
      </button>
      <p className="muted small">{tr(UI.installTip, lang)}</p>
    </div>
  )
}
