import { UI, tr, useLang } from '../i18n'
import { SCENARIOS, type Point } from '../data/scenarios'
import type { Role } from '../App'
import { Icon, type IconName } from '../icons'

interface Props {
  id: string
  role: Role
  openArticle: (id: string) => void
}

function Points({ items, mark, openArticle }: { items: Point[]; mark: IconName; openArticle: (id: string) => void }) {
  const { lang } = useLang()
  return (
    <ul className="points">
      {items.map((p, i) => (
        <li key={i}>
          <span className={`mark mark-${mark}`}><Icon name={mark} size={18} /></span>
          <div>
            <p>{tr(p.text, lang)}</p>
            {p.refs?.map((r) => (
              <button key={r} className="chip" onClick={() => openArticle(r)}>
                {r.split('-')[0].toUpperCase()} {r.split('-').slice(1).join('-')}
              </button>
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function Scenario({ id, role, openArticle }: Props) {
  const { lang } = useLang()
  const s = SCENARIOS.find((x) => x.id === id)
  if (!s) return null
  return (
    <div className="stack">
      <h1 className="scn-title"><span className="ico-circle"><Icon name={s.icon} size={24} /></span>{tr(s.title, lang)}</h1>
      <p className="lead">{tr(s.intro, lang)}</p>
      {role === 'civil' ? (
        <>
          <section className="panel">
            <h2>{tr(UI.checklist, lang)}</h2>
            <Points items={s.checklist} mark="list" openArticle={openArticle} />
          </section>
          <section className="panel ok">
            <h2>{tr(UI.doNow, lang)}</h2>
            <Points items={s.civilDo} mark="check" openArticle={openArticle} />
          </section>
          <section className="panel bad">
            <h2>{tr(UI.dontDo, lang)}</h2>
            <Points items={s.civilAvoid} mark="x" openArticle={openArticle} />
          </section>
          <section className="panel">
            <h2>{tr(UI.say, lang)}</h2>
            {s.say.map((t, i) => (
              <blockquote key={i}>{tr(t, lang)}</blockquote>
            ))}
          </section>
        </>
      ) : (
        <section className="panel">
          <h2>{tr(UI.basis, lang)}</h2>
          <Points items={s.officer} mark="gavel" openArticle={openArticle} />
        </section>
      )}
    </div>
  )
}
