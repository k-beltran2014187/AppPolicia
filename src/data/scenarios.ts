import type { L } from '../i18n'

export interface Point {
  text: L
  refs?: string[]
}

export interface Scenario {
  id: string
  icon: string
  title: L
  intro: L
  checklist: Point[]
  civilDo: Point[]
  civilAvoid: Point[]
  say: L[]
  officer: Point[]
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'alto',
    icon: '🚓',
    title: { es: 'Me pararon / retén', en: 'Traffic stop / checkpoint' },
    intro: {
      es: 'Mantén la calma, baja la velocidad, orilla el vehículo con señalización y mantén las manos visibles.',
      en: 'Stay calm, slow down, pull over safely and keep your hands visible.',
    },
    checklist: [
      { text: { es: '¿Quien te para es autoridad de tránsito? En carreteras y la mayoría del país es la Policía de Tránsito de la PNC; en la capital y municipios con competencia trasladada es la policía municipal de tránsito (EMETRA / PMT).', en: 'Is the person a traffic authority? On roads nationwide it is the PNC Traffic Police; in the capital and municipalities with transferred competence it is the municipal traffic police (EMETRA / PMT).' }, refs: ['lt-4', 'lt-6', 'lt-8', 'ag-67-98'] },
      { text: { es: '¿Están uniformados y con insignias o identificación visible (nombre/número)?', en: 'Are they in uniform with visible insignia or ID (name/number)?' }, refs: ['pnc-13', 'cprg-25'] },
      { text: { es: '¿Te explican el motivo de la parada? Deben informar las causas y la finalidad de su intervención.', en: 'Do they explain the reason? They must inform the causes and purpose of their intervention.' }, refs: ['pnc-14'] },
      { text: { es: 'Nota: la ley revisada NO fija un número mínimo de agentes para una parada. No dejes que te digan que "debe haber X agentes" ni lo exijas como requisito.', en: 'Note: the law reviewed does NOT set a minimum number of officers for a stop. Do not claim an "X officers required" rule.' } },
      { text: { es: 'Documentos que sí debes portar: licencia de conducir y tarjeta de circulación (o fotocopia autenticada). Placas visibles delante y detrás.', en: 'Documents you must carry: driver’s license and registration card (or certified copy). Plates visible front and rear.' }, refs: ['lt-14', 'rt-10', 'lt-19'] },
    ],
    civilDo: [
      { text: { es: 'Saluda con respeto y pregunta el motivo de la parada.', en: 'Greet respectfully and ask the reason for the stop.' } },
      { text: { es: 'Entrega licencia y tarjeta de circulación cuando te las pidan (obligación legal).', en: 'Hand over license and registration card when asked (legal duty).' }, refs: ['lt-14', 'rt-10'] },
      { text: { es: 'Si te dan una boleta, revisa que indique infracción, artículo y sanción, y pide tu copia.', en: 'If you receive a ticket, check it states infraction, article and sanction, and keep your copy.' }, refs: ['lt-31', 'rt-186'] },
      { text: { es: 'Anota nombre/número del agente, placa de patrulla, hora y lugar. Puedes usar la sección Informe.', en: 'Note officer name/number, patrol plate, time and place. Use the Report section.' } },
    ],
    civilAvoid: [
      { text: { es: 'No huyas, no insultes ni te resistas: faltar el respeto a la autoridad de tránsito tiene multa y puede retener tu licencia.', en: 'Do not flee, insult or resist: disrespecting traffic authority carries a fine and license retention.' }, refs: ['rt-175', 'rt-180'] },
      { text: { es: 'No pagues dinero al agente en la calle: la multa se paga con la boleta y formulario oficial.', en: 'Do not pay cash to the officer on the street: fines are paid with the ticket and official form.' }, refs: ['rt-188'] },
      { text: { es: 'No firmes nada que no entiendas.', en: 'Do not sign anything you do not understand.' } },
    ],
    say: [
      { es: '“Buenas tardes, agente. ¿Cuál es el motivo de la parada?”', en: '“Good afternoon, officer. What is the reason for the stop?”' },
      { es: '“Aquí tiene mi licencia y tarjeta de circulación.”', en: '“Here is my license and registration card.”' },
      { es: '“¿Me puede indicar su nombre y número de identificación?”', en: '“Could you tell me your name and ID number?”' },
      { es: '“Si hay una infracción, le agradezco la boleta con el artículo indicado.”', en: '“If there is an infraction, please give me the ticket stating the article.”' },
    ],
    officer: [
      { text: { es: 'Tiene facultad de dirigir el tránsito y aplicar sanciones de la Ley de Tránsito.', en: 'You may direct traffic and apply Traffic Law sanctions.' }, refs: ['lt-6', 'lt-31'] },
      { text: { es: 'Puede exigir licencia y tarjeta de circulación; el conductor está obligado a exhibirlas.', en: 'You may require license and registration card; the driver must show them.' }, refs: ['lt-14', 'rt-10'] },
      { text: { es: 'Debe identificarse con insignias, informar causas de su intervención y tratar con respeto.', en: 'You must identify yourself with insignia, state the reasons for your action and treat people with respect.' }, refs: ['pnc-13', 'pnc-14'] },
      { text: { es: 'Si hay infracción: entregue la boleta con infracción, artículo y sanción.', en: 'If there is an infraction: issue the ticket with infraction, article and sanction.' }, refs: ['lt-31', 'rt-186'] },
      { text: { es: 'Faltarle el respeto a la autoridad de tránsito se sanciona con multa y puede retener licencia.', en: 'Disrespecting traffic authority is fined and may lead to license retention.' }, refs: ['rt-175', 'rt-180'] },
    ],
  },
  {
    id: 'registro',
    icon: '🔎',
    title: { es: 'Revisión de vehículo o de mi persona', en: 'Vehicle or personal search' },
    intro: {
      es: 'Un registro solo es legal con causa justificada y cumpliendo requisitos de uniforme, sexo del agente y respeto.',
      en: 'A search is lawful only with justified cause and compliance with uniform, officer sex and respect requirements.',
    },
    checklist: [
      { text: { es: '¿El agente está debidamente uniformado y pertenece al mismo sexo que la persona registrada (requisa corporal)?', en: 'Is the officer in proper uniform and of the same sex as the person searched (body search)?' }, refs: ['cprg-25'] },
      { text: { es: '¿Te explican la causa justificada del registro?', en: 'Do they state the justified cause for the search?' }, refs: ['cprg-25', 'pnc-14'] },
      { text: { es: '¿Respetan tu dignidad, intimidad y decoro? (sin humillaciones, ni en público si es evitable).', en: 'Do they respect your dignity, privacy and decorum? (no humiliation).' }, refs: ['cprg-25', 'cprg-4'] },
      { text: { es: 'Para inspeccionar con sospecha de delito, el Código Procesal Penal pide autorización judicial y acta.', en: 'To inspect on suspicion of a crime, the Criminal Procedure Code requires judicial authorization and a record.' }, refs: ['cpp-187'] },
    ],
    civilDo: [
      { text: { es: 'Pregunta con calma: “¿Cuál es la causa justificada del registro?”.', en: 'Ask calmly: “What is the justified cause for the search?”.' }, refs: ['cprg-25'] },
      { text: { es: 'No te opongas físicamente; si no estás de acuerdo, déjalo dicho en voz alta y documéntalo.', en: 'Do not resist physically; if you disagree, say so out loud and document it.' } },
      { text: { es: 'Observa lo que revisan y que no te metan nada ajeno. Puedes grabar de forma respetuosa.', en: 'Watch what they check and that nothing is planted. You may record respectfully.' }, refs: ['cprg-35'] },
      { text: { es: 'Tu celular, mensajes y documentos privados están protegidos: solo un juez puede ordenar revisarlos.', en: 'Your phone, messages and private documents are protected: only a judge can order them reviewed.' }, refs: ['cprg-24'] },
    ],
    civilAvoid: [
      { text: { es: 'No entregues ni desbloquees tu celular sin orden judicial.', en: 'Do not hand over or unlock your phone without a court order.' }, refs: ['cprg-24'] },
      { text: { es: 'No aceptes “arreglos” con dinero para evitar la revisión.', en: 'Do not accept cash “deals” to avoid the search.' }, refs: ['rt-188'] },
    ],
    say: [
      { es: '“Con respeto, ¿cuál es la causa justificada para el registro?”', en: '“Respectfully, what is the justified cause for the search?”' },
      { es: '“No autorizo la revisión de mi celular sin orden de juez.”', en: '“I do not authorize a search of my phone without a judge’s order.”' },
      { es: '“Le pido que la requisa corporal la haga un agente de mi mismo sexo.”', en: '“I ask that the body search be done by an officer of my same sex.”' },
    ],
    officer: [
      { text: { es: 'El registro de personas y vehículos es válido con causa justificada, uniformado y del mismo sexo en la requisa corporal.', en: 'Searches of persons and vehicles are valid with justified cause, in uniform and same sex for body searches.' }, refs: ['cprg-25'] },
      { text: { es: 'Explique la causa; documentos y comunicaciones privadas requieren orden de juez.', en: 'State the cause; documents and private communications require a judge’s order.' }, refs: ['cprg-24'] },
      { text: { es: 'En flagrancia puede aprehender; fuera de ella, la inspección con sospecha de delito requiere autorización judicial.', en: 'In flagrante you may arrest; otherwise, inspection on suspicion of a crime requires judicial authorization.' }, refs: ['cpp-257', 'cpp-187'] },
      { text: { es: 'Tratar con dignidad evita nulidad de lo actuado y quejas ante la PDH.', en: 'Dignified treatment avoids nullity of your actions and complaints to the PDH.' }, refs: ['cprg-25', 'pnc-14'] },
    ],
  },
  {
    id: 'detencion',
    icon: '⛓️',
    title: { es: 'Me quieren detener / capturar', en: 'I am being detained / arrested' },
    intro: {
      es: 'Una detención solo es legal con orden de juez o en flagrancia. No te resistas: tus derechos se hacen valer por la vía legal.',
      en: 'A detention is lawful only with a judge’s order or in flagrante. Do not resist: your rights are enforced through legal channels.',
    },
    checklist: [
      { text: { es: '¿Hay orden de juez o te sorprendieron cometiendo un delito (flagrancia)? Una infracción de tránsito no es motivo de detención si puedes identificarte.', en: 'Is there a judge’s order, or were you caught in the act (flagrante)? A traffic infraction is no ground for detention if you can identify yourself.' }, refs: ['cprg-6', 'cpp-257', 'cprg-11'] },
      { text: { es: '¿Te informan de inmediato la causa, quién ordenó la detención y dónde estarás, verbal y por escrito?', en: 'Are you told immediately the cause, who ordered it and where you will be, orally and in writing?' }, refs: ['cprg-7'] },
      { text: { es: '¿Te informan tus derechos (abogado, no declarar)?', en: 'Are you told your rights (lawyer, silence)?' }, refs: ['cprg-8', 'pnc-13'] },
      { text: { es: '¿Te llevan a un centro de detención legal y público?', en: 'Are you taken to a legal, public detention center?' }, refs: ['cprg-10'] },
      { text: { es: 'Plazo: máximo 6 horas para ponerte a disposición de un juez; el juez te toma declaración en 24 horas con defensor.', en: 'Deadline: maximum 6 hours to bring you before a judge; the judge takes your statement within 24 hours with a lawyer.' }, refs: ['cprg-6', 'cprg-9', 'cpp-87'] },
    ],
    civilDo: [
      { text: { es: 'Pregunta el motivo, la autoridad que lo ordenó y adónde te llevan.', en: 'Ask the reason, the ordering authority and where you are being taken.' }, refs: ['cprg-7'] },
      { text: { es: 'Pide avisar a un familiar o persona de confianza; la autoridad debe notificarle.', en: 'Ask to notify a relative or trusted person; the authority must notify them.' }, refs: ['cprg-7'] },
      { text: { es: 'Pide un abogado. Si no tienes, tienes derecho a uno; no declares sin él.', en: 'Ask for a lawyer. If you have none, you have the right to one; do not testify without them.' }, refs: ['cprg-8', 'cpp-87'] },
      { text: { es: 'Guarda silencio sobre los hechos; solo da datos de identidad.', en: 'Stay silent about the facts; give only identity details.' }, refs: ['cpp-88', 'cprg-8'] },
    ],
    civilAvoid: [
      { text: { es: 'No firmes declaraciones ni “confesiones” en la comisaría.', en: 'Do not sign statements or “confessions” at the station.' }, refs: ['cprg-9', 'cpp-85'] },
      { text: { es: 'No te resistas ni uses violencia; denuncia después ante el MP o la PDH.', en: 'Do not resist or use violence; report afterwards to the MP or PDH.' } },
    ],
    say: [
      { es: '“¿Cuál es la causa de mi detención y quién la ordenó?”', en: '“What is the cause of my detention and who ordered it?”' },
      { es: '“Quiero que se avise a mi familiar y ejercer mi derecho a un abogado.”', en: '“I want my relative notified and to exercise my right to a lawyer.”' },
      { es: '“Me acojo a mi derecho de no declarar sin abogado y ante juez.”', en: '“I invoke my right not to testify without a lawyer and before a judge.”' },
    ],
    officer: [
      { text: { es: 'Debe aprehender en flagrancia; fuera de ella solo con orden judicial.', en: 'You must arrest in flagrante; otherwise only with a judicial order.' }, refs: ['cpp-257', 'cprg-6'] },
      { text: { es: 'Informe motivos y derechos al detenido y notifique a la persona que designe.', en: 'State the reasons and rights to the detainee and notify their designated person.' }, refs: ['cprg-7', 'cprg-8', 'pnc-13'] },
      { text: { es: 'Solo puede preguntar para constatar identidad; el interrogatorio es judicial.', en: 'You may only ask to confirm identity; interrogation is judicial.' }, refs: ['cpp-88', 'cprg-9'] },
      { text: { es: 'Ponga al detenido a disposición del juez en máximo 6 horas; incumplir es sancionable.', en: 'Bring the detainee before the judge within 6 hours; failure is punishable.' }, refs: ['cprg-6'] },
      { text: { es: 'El uso de la fuerza debe ser legal, necesario y proporcional.', en: 'Use of force must be lawful, necessary and proportional.' }, refs: ['pnc-14'] },
    ],
  },
  {
    id: 'multas',
    icon: '🧾',
    title: { es: 'Multas, boletas y retención', en: 'Fines, tickets and retention' },
    intro: {
      es: 'Conoce qué puede retener la autoridad, cuándo y cómo se paga y se impugna una multa.',
      en: 'Learn what authorities may retain, when, and how a fine is paid and challenged.',
    },
    checklist: [
      { text: { es: 'La boleta debe indicar infracción, artículo transgredido y sanción.', en: 'The ticket must state the infraction, article violated and sanction.' }, refs: ['lt-31', 'rt-186'] },
      { text: { es: 'La licencia solo se retiene en los casos que enumera el Reglamento (alcohol, vencida, accidente, sin tarjeta/placas, etc.).', en: 'The license is held only in cases listed in the Regulation (alcohol, expired, crash, no card/plates, etc.).' }, refs: ['rt-175', 'lt-33', 'lt-43'] },
      { text: { es: 'El vehículo solo se retiene en los casos del art. 176; el conductor solo se detiene en alcohol/drogas o accidentes con víctimas (art. 177).', en: 'The vehicle is held only in cases of art. 176; the driver is only detained for alcohol/drugs or crashes with victims (art. 177).' }, refs: ['rt-176', 'rt-177'] },
      { text: { es: 'El pago se hace con el formulario oficial y la boleta, no en efectivo al agente.', en: 'Payment uses the official form and the ticket, not cash to the officer.' }, refs: ['rt-188'] },
    ],
    civilDo: [
      { text: { es: 'Guarda tu copia de la boleta; el pago oficial agota el trámite.', en: 'Keep your ticket copy; official payment ends the process.' }, refs: ['rt-186'] },
      { text: { es: 'Si no estás de acuerdo, tienes 5 días para manifestar tu desacuerdo por escrito con prueba.', en: 'If you disagree, you have 5 days to state it in writing with evidence.' }, refs: ['rt-186'] },
      { text: { es: 'También puedes presentar recurso de revocatoria (se resuelve en 30 días).', en: 'You may also file a revocatoria appeal (resolved in 30 days).' }, refs: ['lt-47'] },
      { text: { es: 'Consulta la escala de multas para comprobar el monto.', en: 'Check the fine scale to confirm the amount.' }, refs: ['rt-180'] },
    ],
    civilAvoid: [
      { text: { es: 'No pagues “en el momento” a un agente para evitar la boleta.', en: 'Do not pay an officer “on the spot” to avoid the ticket.' }, refs: ['rt-188'] },
      { text: { es: 'No te niegues a recibir la boleta: negarse también tiene multa.', en: 'Do not refuse the ticket: refusing is also fined.' } },
    ],
    say: [
      { es: '“Por favor, indíqueme en la boleta el artículo infringido.”', en: '“Please state the violated article on the ticket.”' },
      { es: '“¿Dónde y cómo hago el pago oficial de esta multa?”', en: '“Where and how do I make the official payment for this fine?”' },
      { es: '“Quiero constancia de la retención de mi licencia.”', en: '“I want a record of the retention of my license.”' },
    ],
    officer: [
      { text: { es: 'Las sanciones administrativas permitidas: amonestación, multa, retención, cepo, incautación, suspensión.', en: 'Allowed administrative sanctions: warning, fine, retention, clamp, impoundment, suspension.' }, refs: ['lt-31'] },
      { text: { es: 'Retenga licencia/vehículo solo en los casos del Reglamento y deje constancia.', en: 'Hold license/vehicle only in Regulation cases and leave a record.' }, refs: ['rt-175', 'rt-176'] },
      { text: { es: 'Entregue la boleta completa; no cobre en efectivo en el lugar.', en: 'Hand the complete ticket; do not collect cash on site.' }, refs: ['rt-186', 'rt-188'] },
      { text: { es: 'Una infracción de tránsito por sí sola no justifica detener a quien puede identificarse.', en: 'A traffic infraction alone does not justify detaining someone who can identify themselves.' }, refs: ['cprg-11'] },
    ],
  },
]
