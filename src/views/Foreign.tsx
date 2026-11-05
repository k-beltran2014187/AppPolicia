import { useLang, tr, type L } from '../i18n'
import { Icon } from '../icons'
import { ARTICLES, LAW_NAMES } from '../data/laws'

interface Point { text: L; refs: string[] }

const SECTIONS: { title: L; kind: 'ok' | 'plain'; points: Point[] }[] = [
  {
    title: { es: 'Tus derechos si te para la policía', en: 'Your rights if the police stop you' },
    kind: 'ok',
    points: [
      { text: { es: 'Tienes los mismos derechos que cualquier persona: no pueden discriminarte por tu nacionalidad, idioma o religión.', en: 'You have the same rights as anyone: you cannot be discriminated against because of your nationality, language or religion.' }, refs: ['cm-9', 'cm-8'] },
      { text: { es: 'El Estado debe protegerte la vida, la integridad y la libertad, y no puede pedirte documentos para darte esa protección.', en: 'The State must protect your life, integrity and liberty, and cannot ask for documents before giving you that protection.' }, refs: ['cm-10'] },
      { text: { es: 'Ninguna autoridad puede quedarse con tu pasaporte ni tus documentos de viaje o de identidad. Si te piden mostrarlos, enséñalos pero no los entregues; guarda una foto o copia aparte.', en: 'No authority may keep your passport or your travel or identity documents. If asked, show them but do not hand them over; keep a photo or copy separately.' }, refs: ['cm-17'] },
      { text: { es: 'Tienes derecho a saber el motivo y a recibir información sobre tu situación. Si no entiendes el idioma, pide un intérprete.', en: 'You have the right to know the reason and to receive information about your situation. If you do not understand the language, ask for an interpreter.' }, refs: ['cm-17', 'cprg-7'] },
    ],
  },
  {
    title: { es: 'Si te detienen: tu consulado', en: 'If you are detained: your consulate' },
    kind: 'ok',
    points: [
      { text: { es: 'Pide expresamente que avisen a tu consulado o embajada. Si lo pides, las autoridades deben avisar sin demora y transmitir tus comunicaciones.', en: 'Ask expressly that your consulate or embassy be notified. If you ask, the authorities must notify them without delay and pass on your communications.' }, refs: ['cvrc-36'] },
      { text: { es: 'Nadie puede prohibirte ni negarte comunicarte con los representantes consulares o diplomáticos de tu país.', en: 'Nobody may prohibit or deny you communication with the consular or diplomatic representatives of your country.' }, refs: ['cm-28'] },
      { text: { es: 'Los cónsules pueden visitarte y ayudarte a organizar tu defensa.', en: 'Consuls may visit you and help arrange your defense.' }, refs: ['cvrc-36'] },
      { text: { es: 'Tu familia o cualquier persona puede pedir exhibición personal o amparo a tu favor.', en: 'Your family or anyone else may file habeas corpus or amparo on your behalf.' }, refs: ['cm-205'] },
    ],
  },
  {
    title: { es: 'Documentos y situación migratoria', en: 'Documents and migration status' },
    kind: 'plain',
    points: [
      { text: { es: 'Lleva tu pasaporte o documento de identidad (si eres residente, tu DPI). No presentarlo es una falta administrativa con multa de Q200.', en: 'Carry your passport or identity document (your DPI if you are a resident). Not presenting it is an administrative offense with a Q200 fine.' }, refs: ['cm-193', 'cm-194', 'cm-100', 'cm-101'] },
      { text: { es: 'No tener documentos o no cumplir requisitos administrativos no es delito ni justifica una sanción penal.', en: 'Lacking documents or administrative requirements is not a crime and does not justify a criminal penalty.' }, refs: ['cm-50', 'cm-197'] },
      { text: { es: 'Quedarte más tiempo del autorizado, trabajar sin autorización o entrar por lugares no autorizados son faltas administrativas. Las sanciona el Instituto Guatemalteco de Migración (IGM), no la policía en la calle.', en: 'Overstaying, working without authorization or entering through unauthorized places are administrative offenses. They are sanctioned by the Guatemalan Migration Institute (IGM), not by police on the street.' }, refs: ['cm-193', 'cm-195'] },
      { text: { es: 'Puedes recurrir una sanción con el recurso de reposición.', en: 'You can challenge a sanction with a motion for reconsideration.' }, refs: ['cm-196'] },
      { text: { es: 'Si estás en el país de buena fe pero sin un estatus migratorio ordinario, la ley lo llama situación irregular.', en: 'If you are in the country in good faith but without an ordinary migration status, the law calls it an irregular situation.' }, refs: ['cm-107'] },
    ],
  },
  {
    title: { es: 'Si necesitas refugio o asilo', en: 'If you need refuge or asylum' },
    kind: 'plain',
    points: [
      { text: { es: 'Puedes pedir refugio al ingresar por un puesto migratorio oficial. Guatemala reconoce el derecho de asilo.', en: 'You can request refuge when entering through an official migration post. Guatemala recognizes the right of asylum.' }, refs: ['cm-43', 'cprg-27'] },
      { text: { es: 'Si te lo niegan, no pueden devolverte a un país donde tu vida o libertad estén en grave peligro, y antes deben avisar al ACNUR.', en: 'If it is denied, you cannot be returned to a country where your life or liberty is in grave danger, and UNHCR must be notified first.' }, refs: ['cm-46'] },
      { text: { es: 'En el trámite de refugio tienes derecho a abogado y a intérprete.', en: 'In the refugee procedure you have the right to a lawyer and an interpreter.' }, refs: ['cm-180'] },
    ],
  },
  {
    title: { es: 'Conduciendo en Guatemala', en: 'Driving in Guatemala' },
    kind: 'plain',
    points: [
      { text: { es: 'Con licencia extranjera puedes conducir los vehículos que ella permite mientras tu autorización migratoria esté vigente. Si te haces residente, debes traspasarla a una licencia guatemalteca.', en: 'With a foreign license you may drive the vehicles it covers while your migration authorization is valid. If you become a resident you must convert it to a Guatemalan license.' }, refs: ['lt-24'] },
    ],
  },
  {
    title: { es: 'Tus deberes', en: 'Your duties' },
    kind: 'plain',
    points: [
      { text: { es: 'Respeta la Constitución, las leyes y las culturas del país. Incumplir puede traer responsabilidad administrativa, la orden de salir del país (hasta 10 días) o, en casos justificados, expulsión; si hay delito, se aplican las leyes penales.', en: 'Respect the Constitution, the laws and the cultures of the country. Breaching them may lead to administrative liability, an order to leave the country (up to 10 days) or, in justified cases, expulsion; if a crime is committed, criminal law applies.' }, refs: ['cm-62', 'cm-64', 'cm-195'] },
    ],
  },
]

const NOTE: L = {
  es: 'Basado en el Código de Migración (Decreto 44-2016, texto publicado en 2016), la Convención de Viena sobre Relaciones Consulares, la Constitución y la Ley de Tránsito. Pueden existir reformas posteriores. Es información general, no asesoría legal: ante una situación seria, pide un abogado y contacta a tu consulado.',
  en: 'Based on the Migration Code (Decree 44-2016, 2016 text), the Vienna Convention on Consular Relations, the Constitution and the Traffic Law. Later reforms may exist. This is general information, not legal advice: in a serious situation, ask for a lawyer and contact your consulate.',
}

interface Props {
  openArticle: (id: string) => void
  go: (v: string) => void
  /** Persona con sesión: la nacionalidad sale de su perfil. Sin cuenta se puede activar a mano. */
  canToggle: boolean
  foreigner: boolean
  setForeigner: (v: boolean) => void
}

export default function Foreign({ openArticle, go, canToggle, foreigner, setForeigner }: Props) {
  const { lang } = useLang()
  const ids = new Set(ARTICLES.map((a) => a.id))
  return (
    <div className="stack">
      <h1>{tr({ es: 'Si eres extranjero en Guatemala', en: 'If you are a foreign national in Guatemala' }, lang)}</h1>
      <p className="muted">{tr({ es: 'Lo esencial que debes saber si la policía o migración te detienen o te revisan.', en: 'The essentials if police or migration stop or check you.' }, lang)}</p>

      {canToggle && (
        <label className="check">
          <input type="checkbox" checked={foreigner} onChange={(e) => setForeigner(e.target.checked)} />
          <span>{tr({ es: 'Soy extranjero: que el asistente me responda con estas leyes primero', en: 'I am a foreign national: have the assistant answer with these laws first' }, lang)}</span>
        </label>
      )}

      <button className="big" onClick={() => go('chat')}>{tr({ es: 'Preguntar al asesor virtual', en: 'Ask the virtual advisor' }, lang)}</button>

      {SECTIONS.map((s, i) => (
        <section key={i} className={`panel ${s.kind === 'ok' ? 'ok' : ''}`}>
          <h2>{tr(s.title, lang)}</h2>
          <ul className="points">
            {s.points.map((p, j) => (
              <li key={j}>
                <span className="mark"><Icon name="check" size={18} /></span>
                <div>
                  <p>{tr(p.text, lang)}</p>
                  <div className="row wrap">
                    {p.refs.filter((r) => ids.has(r)).map((r) => {
                      const a = ARTICLES.find((x) => x.id === r)!
                      return (
                        <button key={r} className="chip ok" onClick={() => openArticle(r)}>
                          <Icon name="check" size={12} />{LAW_NAMES[a.law].short} art. {a.art}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="panel">
        <h2>{tr({ es: 'A quién acudir', en: 'Who to contact' }, lang)}</h2>
        <p className="small">{tr({ es: 'Tu embajada o consulado en Guatemala: búscalo por el nombre de tu país. Procuraduría de los Derechos Humanos (PDH): 1555. Policía Nacional Civil: 110. Confirma los números antes de llamar.', en: 'Your embassy or consulate in Guatemala: look it up by your country name. Human Rights Ombudsman (PDH): 1555. National Civil Police: 110. Confirm the numbers before calling.' }, lang)}</p>
      </section>

      <p className="small muted row-ico"><Icon name="alert" size={16} /> {tr(NOTE, lang)}</p>
    </div>
  )
}
