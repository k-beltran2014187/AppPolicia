import { useLang, tr, UI, type L } from '../i18n'
import { Icon } from '../icons'
import { ARTICLES, LAW_NAMES } from '../data/laws'

interface Channel {
  name: L
  desc: L
  tel: string
  show: string
  /** 'ok' = confirmed in public reports; 'check' = could not be confirmed independently. */
  status: 'ok' | 'check'
  note?: L
}

// Sources checked on 2026-11-04: Ministerio de Gobernación / AGN (Centro Anticorrupción Policial 1531, July 2024),
// Emisoras Unidas and Prensa Libre (Inspectoría General 3032-7356). 5523-9867 comes from an official-looking PNC poster
// and was NOT found in any independent source, so it is flagged for verification.
const CHANNELS: Channel[] = [
  {
    name: { es: 'Centro Anticorrupción Policial', en: 'Police Anti-Corruption Center' },
    desc: { es: 'Denuncias de actos indebidos de agentes de la PNC. Atiende las 24 horas y acepta denuncias anónimas.', en: 'Reports of improper acts by PNC officers. Open 24 hours; anonymous reports accepted.' },
    tel: '1531',
    show: '1531',
    status: 'ok',
    note: { es: 'En enero de 2025 estuvo fuera de servicio temporalmente. Si no contesta, usa la Inspectoría General.', en: 'It was temporarily down in January 2025. If it does not answer, use the Inspector General’s Office.' },
  },
  {
    name: { es: 'Inspectoría General de la PNC', en: 'PNC Inspector General’s Office' },
    desc: { es: 'Unidad interna que vela por la disciplina y el respeto a los derechos humanos de los agentes. Denuncia confidencial.', en: 'Internal unit that oversees discipline and human rights compliance by officers. Confidential reports.' },
    tel: '30327356',
    show: '3032-7356',
    status: 'ok',
  },
  {
    name: { es: 'Línea del cartel “Denuncia la mala práctica policial”', en: '“Report police misconduct” poster line' },
    desc: { es: 'Número que aparece en el cartel de la Subdirección General de Prevención del Delito.', en: 'Number shown on the poster from the PNC Crime Prevention Sub-directorate.' },
    tel: '55239867',
    show: '5523-9867',
    status: 'check',
    note: { es: 'No lo encontré en fuentes independientes. Confírmalo con la PNC antes de depender de él.', en: 'I could not find it in independent sources. Confirm it with the PNC before relying on it.' },
  },
  {
    name: { es: 'PDH – Procurador de los Derechos Humanos', en: 'PDH – Human Rights Ombudsman' },
    desc: { es: 'Investiga denuncias de violaciones a los derechos humanos de cualquier persona.', en: 'Investigates complaints of human rights violations from anyone.' },
    tel: '1555',
    show: '1555',
    status: 'ok',
  },
  {
    name: { es: 'PNC – Emergencias', en: 'PNC – Emergencies' },
    desc: { es: 'Solo si hay un delito en curso o riesgo inmediato.', en: 'Only for a crime in progress or immediate danger.' },
    tel: '110',
    show: '110',
    status: 'ok',
  },
]

const STEPS: L[] = [
  { es: 'Mantén la calma y no te resistas. Pide el motivo y cumple lo que la ley exige (documentos).', en: 'Stay calm and do not resist. Ask the reason and comply with what the law requires (documents).' },
  { es: 'Anota: fecha, hora, lugar, nombre o número de agente, número de patrulla y qué pasó. Si puedes, graba en la sección Grabar.', en: 'Write down: date, time, place, officer name or number, patrol number and what happened. If you can, record in the Record section.' },
  { es: 'Conserva la boleta, fotos, videos y datos de testigos. No firmes de conformidad si no estás de acuerdo.', en: 'Keep the ticket, photos, videos and witness details. Do not sign as agreeing if you disagree.' },
  { es: 'Si te pidieron dinero (“mordida”), no pagues: es un delito y puedes denunciarlo, incluso de forma anónima.', en: 'If they asked for money (a “bribe”), do not pay: it is a crime and you can report it, even anonymously.' },
  { es: 'Denuncia por teléfono y, si hay delito, ante el Ministerio Público. Pide un número de caso.', en: 'Report by phone and, if a crime is involved, to the Public Ministry. Ask for a case number.' },
]

const BASIS = ['pnc-27', 'cprg-45', 'cprg-275', 'cp-418', 'cp-425', 'cp-439', 'cp-201bis']

export default function Denuncia({ openArticle }: { openArticle: (id: string) => void }) {
  const { lang } = useLang()
  return (
    <div className="stack">
      <h1>{tr({ es: 'Denunciar mala práctica policial', en: 'Report police misconduct' }, lang)}</h1>
      <p className="lead">
        {tr({ es: 'La PNC está para proteger y servir. Si un agente abusó de su autoridad, te pidió dinero o violó tus derechos, puedes denunciarlo.', en: 'The PNC exists to protect and serve. If an officer abused their authority, asked you for money or violated your rights, you can report it.' }, lang)}
      </p>

      {CHANNELS.map((c) => (
        <div key={c.tel} className={`panel channel ${c.status}`}>
          <div className="row between">
            <div>
              <strong>{tr(c.name, lang)}</strong>
              <p className="small muted">{tr(c.desc, lang)}</p>
            </div>
            <a className="btn" href={`tel:${c.tel}`}><Icon name="phone" size={18} /> {c.show}</a>
          </div>
          {c.status === 'check' && <span className="tag pend">{tr({ es: 'Por verificar', en: 'To verify' }, lang)}</span>}
          {c.note && <p className="small muted note">{tr(c.note, lang)}</p>}
        </div>
      ))}

      <section className="panel">
        <h2 className="row-ico"><Icon name="pin" /> {tr({ es: 'Presencial', en: 'In person' }, lang)}</h2>
        <p className="small">
          {tr({ es: 'Centro Anticorrupción Policial (Ministerio de Gobernación): 10a. calle y avenida La Pedrera 10-00, colonia Cipresales, zona 6, Ciudad de Guatemala. Dirección reportada en julio de 2024; confírmala antes de ir.', en: 'Police Anti-Corruption Center (Ministry of the Interior): 10a. calle y avenida La Pedrera 10-00, colonia Cipresales, zona 6, Guatemala City. Address reported in July 2024; confirm before going.' }, lang)}
        </p>
        <p className="small muted">
          {tr({ es: 'También puedes presentar denuncia penal en cualquier oficina del Ministerio Público y quejas ante la PDH.', en: 'You can also file a criminal complaint at any Public Ministry office and complaints with the PDH.' }, lang)}
        </p>
      </section>

      <section className="panel ok">
        <h2>{tr({ es: 'Antes de denunciar', en: 'Before you report' }, lang)}</h2>
        <ul className="points">
          {STEPS.map((s, i) => (
            <li key={i}>
              <span className="mark"><Icon name="check" size={18} /></span>
              <p>{tr(s, lang)}</p>
            </li>
          ))}
        </ul>
        <div className="row wrap">
          <a className="btn" href="#record"><Icon name="record" size={18} /> {tr(UI.record, lang)}</a>
          <a className="btn" href="#report"><Icon name="report" size={18} /> {tr(UI.report, lang)}</a>
        </div>
      </section>

      <section className="panel">
        <h2>{tr(UI.legalBasis, lang)}</h2>
        {BASIS.map((id) => {
          const a = ARTICLES.find((x) => x.id === id)
          return a ? (
            <button key={id} className="chip ok" onClick={() => openArticle(id)}>
              <Icon name="check" size={12} />{LAW_NAMES[a.law].short} art. {a.art}
            </button>
          ) : null
        })}
      </section>

      <p className="small muted row-ico"><Icon name="alert" size={16} /> {tr(UI.verifyNumber, lang)}</p>
    </div>
  )
}
