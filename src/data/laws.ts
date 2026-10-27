import type { L } from '../i18n'

export type Law = 'CPRG' | 'LT' | 'RT' | 'CPP' | 'PNC' | 'EMETRA'

export interface Article {
  id: string
  law: Law
  art: string
  title: L
  summary: L
  /** Fragmento textual del texto oficial leído (cuando existe). */
  quote?: string
  /** 'leido' = texto verificado en la fuente oficial; 'referencia' = no se leyó el texto. */
  verified: 'leido' | 'referencia'
}

export const LAW_NAMES: Record<Law, { name: L; short: string; source: string }> = {
  CPRG: {
    name: { es: 'Constitución Política de la República de Guatemala', en: 'Political Constitution of Guatemala' },
    short: 'Constitución',
    source: 'https://pdba.georgetown.edu/Constitutions/Guate/guate85.html',
  },
  LT: {
    name: { es: 'Ley de Tránsito (Decreto 132-96)', en: 'Traffic Law (Decree 132-96)' },
    short: 'Ley de Tránsito',
    source: 'https://transito.gob.gt/wp-content/uploads/2019/02/Ley-de-Transito.pdf',
  },
  RT: {
    name: { es: 'Reglamento de Tránsito (Acuerdo Gubernativo 273-98 y reformas)', en: 'Traffic Regulation (Gov. Agreement 273-98 and reforms)' },
    short: 'Reglamento de Tránsito',
    source: 'https://www.soy502.com/sites/default/files/reglamento_de_transito.pdf',
  },
  CPP: {
    name: { es: 'Código Procesal Penal (Decreto 51-92)', en: 'Criminal Procedure Code (Decree 51-92)' },
    short: 'Código Procesal Penal',
    source: 'https://portal.pnc.edu.gt/wp-content/uploads/2024/02/CODIGO-PROCESAL-PENAL.pdf',
  },
  PNC: {
    name: { es: 'Ley de la Policía Nacional Civil (Decreto 35-2024)', en: 'National Civil Police Law (Decree 35-2024)' },
    short: 'Ley PNC',
    source: 'https://www.policinglaw.info/assets/downloads/LEY-PNC-DECRETO-No.-35-2024.pdf',
  },
  EMETRA: {
    name: { es: 'Acuerdo Gubernativo 67-98 (tránsito de la capital)', en: 'Gov. Agreement 67-98 (capital traffic)' },
    short: 'AG 67-98',
    source: 'https://www.google.com/search?q=Acuerdo+Gubernativo+67-98+tr%C3%A1nsito+Municipalidad+de+Guatemala',
  },
}

export const ARTICLES: Article[] = [
  // ---------- Constitución ----------
  {
    id: 'cprg-4', law: 'CPRG', art: '4', verified: 'leido',
    title: { es: 'Libertad e igualdad', en: 'Freedom and equality' },
    summary: {
      es: 'Todos somos libres e iguales en dignidad y derechos. Nadie debe ser tratado con humillación ni desprecio, ni por civiles ni por autoridades.',
      en: 'Everyone is free and equal in dignity and rights. No one may be humiliated or treated with contempt, by civilians or authorities.',
    },
    quote: 'En Guatemala todos los seres humanos son libres e iguales en dignidad y derechos.',
  },
  {
    id: 'cprg-5', law: 'CPRG', art: '5', verified: 'leido',
    title: { es: 'Libertad de acción', en: 'Freedom of action' },
    summary: {
      es: 'Toda persona puede hacer lo que la ley no prohíbe. Nadie está obligado a acatar órdenes que no estén basadas en ley.',
      en: 'Everyone may do what the law does not forbid. No one must obey orders that are not based on law.',
    },
    quote: 'Toda persona tiene derecho a hacer lo que la ley no prohíbe;',
  },
  {
    id: 'cprg-6', law: 'CPRG', art: '6', verified: 'leido',
    title: { es: 'Detención legal', en: 'Lawful detention' },
    summary: {
      es: 'Solo se puede detener a alguien por delito o falta y con orden de juez, salvo flagrancia. El detenido debe ser puesto ante un juez en máximo 6 horas. El agente que incumpla será sancionado.',
      en: 'A person can only be detained for a crime or misdemeanor with a judge’s order, except when caught in the act. The detainee must be brought before a judge within 6 hours. Officers who violate this are sanctioned.',
    },
    quote: 'Ninguna persona puede ser detenida o presa, sino por causa de delito o falta y en virtud de orden librada con apego a la ley por autoridad judicial competente. Se exceptúan los casos de flagrante delito o falta.',
  },
  {
    id: 'cprg-7', law: 'CPRG', art: '7', verified: 'leido',
    title: { es: 'Notificación de la causa de detención', en: 'Notice of the cause of detention' },
    summary: {
      es: 'El detenido debe ser informado de inmediato, de forma verbal y escrita, de la causa, de quién ordenó la detención y dónde estará. También debe avisarse a la persona que él designe.',
      en: 'The detainee must be told immediately, orally and in writing, why, by whose order and where they will be held. The person they name must also be notified.',
    },
    quote: 'Toda persona detenida deberá ser notificada inmediatamente, en forma verbal y por escrito, de la causa que motivó su detención, autoridad que la ordenó y lugar en el que permanecerá.',
  },
  {
    id: 'cprg-8', law: 'CPRG', art: '8', verified: 'leido',
    title: { es: 'Derechos del detenido', en: 'Rights of the detainee' },
    summary: {
      es: 'Debe ser informado de sus derechos de forma comprensible, en especial el de tener un defensor presente en todas las diligencias. No puede ser obligado a declarar sino ante autoridad judicial.',
      en: 'Must be informed of their rights in an understandable way, especially the right to a lawyer present at all proceedings. Cannot be forced to testify except before a judge.',
    },
    quote: 'El detenido no podrá ser obligado a declarar sino ante autoridad judicial competente.',
  },
  {
    id: 'cprg-9', law: 'CPRG', art: '9', verified: 'leido',
    title: { es: 'Interrogatorio', en: 'Interrogation' },
    summary: {
      es: 'Solo los jueces pueden interrogar a detenidos (dentro de 24 horas). Un interrogatorio fuera del juzgado no tiene valor como prueba.',
      en: 'Only judges may interrogate detainees (within 24 hours). Out-of-court questioning has no evidentiary value.',
    },
    quote: 'Las autoridades judiciales son las únicas competentes para interrogar a los detenidos o presos.',
  },
  {
    id: 'cprg-10', law: 'CPRG', art: '10', verified: 'leido',
    title: { es: 'Centro de detención legal', en: 'Lawful place of detention' },
    summary: {
      es: 'Los aprehendidos solo pueden llevarse a centros de detención legales y públicos, no a lugares clandestinos o improvisados.',
      en: 'Arrested persons may only be taken to legal, public detention centers, never to clandestine or improvised places.',
    },
  },
  {
    id: 'cprg-11', law: 'CPRG', art: '11', verified: 'leido',
    title: { es: 'Faltas o infracciones: no se detiene', en: 'Infractions: no detention' },
    summary: {
      es: 'Por faltas o infracciones a reglamentos no debe permanecer detenida la persona cuya identidad pueda establecerse con documentos, un testigo de arraigo o la propia autoridad. La autoridad solo da parte al juez y cita al infractor en 48 horas hábiles.',
      en: 'For misdemeanors or regulation infractions, a person whose identity can be established must not be held. The authority just reports to the judge and summons the person within 48 business hours.',
    },
    quote: 'Por faltas o por infracciones a los reglamentos no deben permanecer detenidas las personas cuya identidad pueda establecerse mediante documentación, por el testimonio de persona de arraigo, o por la propia autoridad.',
  },
  {
    id: 'cprg-12', law: 'CPRG', art: '12', verified: 'leido',
    title: { es: 'Derecho de defensa', en: 'Right of defense' },
    summary: {
      es: 'La defensa de la persona y sus derechos es inviolable. Nadie puede ser condenado sin ser citado, oído y vencido en juicio.',
      en: 'The defense of the person and their rights is inviolable. No one may be condemned without being summoned, heard and tried.',
    },
    quote: 'La defensa de la persona y sus derechos son inviolables.',
  },
  {
    id: 'cprg-14', law: 'CPRG', art: '14', verified: 'leido',
    title: { es: 'Presunción de inocencia', en: 'Presumption of innocence' },
    summary: {
      es: 'Toda persona es inocente mientras no se le declare responsable judicialmente en sentencia firme.',
      en: 'Everyone is innocent until declared responsible by a final judicial ruling.',
    },
    quote: 'Toda persona es inocente, mientras no se le haya declarado responsable judicialmente, en sentencia debidamente ejecutoriada.',
  },
  {
    id: 'cprg-24', law: 'CPRG', art: '24', verified: 'leido',
    title: { es: 'Inviolabilidad de documentos y comunicaciones', en: 'Inviolability of documents and communications' },
    summary: {
      es: 'Los documentos y la correspondencia son inviolables y solo pueden revisarse con resolución firme de juez competente. Se garantiza el secreto de las comunicaciones telefónicas. Esto sustenta negarse a desbloquear o entregar el celular sin orden judicial (interpretación; confirmar con abogado).',
      en: 'Documents and correspondence are inviolable and can only be reviewed with a final order from a competent judge. Phone communications are secret. This supports refusing to unlock or hand over a phone without a court order (interpretation; confirm with a lawyer).',
    },
    quote: 'La correspondencia de toda persona, sus documentos y libros son inviolables. Sólo podrán revisarse o incautarse, en virtud de resolución firme dictada por juez competente y con las formalidades legales.',
  },
  {
    id: 'cprg-25', law: 'CPRG', art: '25', verified: 'leido',
    title: { es: 'Registro de personas y vehículos', en: 'Search of persons and vehicles' },
    summary: {
      es: 'El registro de personas y vehículos solo puede hacerse por fuerzas de seguridad cuando exista causa justificada. Los agentes deben estar uniformados y ser del mismo sexo que la persona registrada, respetando su dignidad, intimidad y decoro.',
      en: 'Searches of persons and vehicles may only be done by security forces when there is justified cause. Officers must be in uniform and of the same sex as the person searched, respecting dignity and privacy.',
    },
    quote: 'El registro de las personas y de los vehículos, sólo podrá efectuarse por elementos de las fuerzas de seguridad cuando se establezca causa justificada para ello. Para ese efecto, los elementos de las fuerzas de seguridad deberán presentarse debidamente uniformados y pertenecer al mismo sexo de los requisados, debiendo guardarse el respeto a la dignidad, intimidad y decoro de las personas.',
  },
  {
    id: 'cprg-35', law: 'CPRG', art: '35', verified: 'leido',
    title: { es: 'Libre emisión del pensamiento', en: 'Freedom of expression' },
    summary: {
      es: 'Es libre la emisión del pensamiento por cualquier medio, sin censura ni licencia previa. Respalda documentar la actuación de un funcionario público en la vía pública (interpretación; la ley no prohíbe expresamente grabar). Hacerlo de forma respetuosa y sin obstruir.',
      en: 'Expression by any means is free, without censorship or prior license. Supports documenting a public official acting in public (interpretation; the law does not expressly forbid recording). Do it respectfully without obstructing.',
    },
    quote: 'Es libre la emisión del pensamiento por cualesquiera medios de difusión, sin censura ni licencia previa.',
  },

  // ---------- Ley de Tránsito ----------
  {
    id: 'lt-4', law: 'LT', art: '4', verified: 'leido',
    title: { es: 'Quién ejerce la autoridad de tránsito', en: 'Who holds traffic authority' },
    summary: {
      es: 'La autoridad de tránsito en la vía pública la ejerce el Ministerio de Gobernación por medio del Departamento de Tránsito de la PNC, salvo los municipios a los que se haya trasladado la competencia.',
      en: 'Traffic authority on public roads is held by the Interior Ministry through the PNC Traffic Department, except municipalities to which it was transferred.',
    },
  },
  {
    id: 'lt-6', law: 'LT', art: '6', verified: 'leido',
    title: { es: 'Policía de Tránsito', en: 'Traffic Police' },
    summary: {
      es: 'La Policía de Tránsito es parte de la PNC con funciones especializadas: sus integrantes están facultados para dirigir el tránsito y aplicar las sanciones de la ley.',
      en: 'Traffic Police is part of the PNC with specialized duties: its members may direct traffic and apply the law’s sanctions.',
    },
  },
  {
    id: 'lt-8', law: 'LT', art: '8', verified: 'leido',
    title: { es: 'Tránsito municipal (PMT / EMETRA)', en: 'Municipal traffic (PMT / EMETRA)' },
    summary: {
      es: 'El Ejecutivo puede trasladar la administración del tránsito a municipalidades, que crean su Policía Municipal de Tránsito. Los municipios solo pueden emitir reglas para su jurisdicción, no sobre licencias, placas ni seguros.',
      en: 'The Executive may transfer traffic administration to municipalities, which create a Municipal Traffic Police. Municipalities may only issue rules for their area, not on licenses, plates or insurance.',
    },
  },
  {
    id: 'lt-14', law: 'LT', art: '14', verified: 'leido',
    title: { es: 'Licencia de conducir', en: 'Driver’s license' },
    summary: {
      es: 'El conductor está obligado a portar la licencia y exhibirla a la autoridad cuando se la pida.',
      en: 'The driver must carry the license and show it to the authority when asked.',
    },
    quote: 'habilita e identifica a su titular como conductor, quien está obligado a portar la licencia de conducir siempre que conduzca un vehículo y exhibirla a la autoridad cuando le sea requerida.',
  },
  {
    id: 'lt-19', law: 'LT', art: '19', verified: 'leido',
    title: { es: 'Tarjeta y placas de circulación', en: 'Registration card and plates' },
    summary: {
      es: 'Todo vehículo que transite se identifica con tarjeta y placa de circulación.',
      en: 'Every vehicle on the road is identified by registration card and plates.',
    },
  },
  {
    id: 'lt-31', law: 'LT', art: '31', verified: 'leido',
    title: { es: 'Sanciones y papeleta de aviso', en: 'Sanctions and notice ticket' },
    summary: {
      es: 'Las sanciones administrativas son: amonestación, multa, retención de documentos, cepo, incautación y suspensión/cancelación de licencia. Por una infracción la autoridad debe entregar la papeleta de aviso que especifique la infracción, el artículo transgredido y la sanción impuesta.',
      en: 'Administrative sanctions: warning, fine, document retention, wheel clamp, impoundment, license suspension/cancellation. For an infraction the authority must hand over a notice ticket stating the infraction, the article violated and the sanction.',
    },
    quote: 'la autoridad le entregará la papeleta de aviso debidamente habilitada por el Departamento de Tránsito o la municipalidad, según el caso, en la cual especificará la infracción cometida, el artículo transgredido y la sanción impuesta.',
  },
  {
    id: 'lt-33', law: 'LT', art: '33', verified: 'leido',
    title: { es: 'Retención de licencia (casos)', en: 'License retention (cases)' },
    summary: {
      es: 'Se retiene la licencia solo si ya hay suspensión/cancelación, o si se acumulan tres multas sin pagar. Se devuelve al pagar la multa.',
      en: 'The license is held only if already suspended/cancelled, or after three unpaid fines. Returned once the fine is paid.',
    },
  },
  {
    id: 'lt-43', law: 'LT', art: '43', verified: 'leido',
    title: { es: 'Retención por faltas y delitos', en: 'Retention for offenses' },
    summary: {
      es: 'La autoridad retiene la licencia si el conductor está ebrio o drogado, si no porta documentos del vehículo o no tiene placa, o si hubo lesiones o daños. En esos casos se lleva todo a la oficina de la PNC más cercana.',
      en: 'The license is held if the driver is drunk or drugged, lacks vehicle documents or plates, or injuries/damage occurred. All is taken to the nearest PNC office.',
    },
  },
  {
    id: 'lt-47', law: 'LT', art: '47', verified: 'leido',
    title: { es: 'Impugnar una sanción', en: 'Challenging a sanction' },
    summary: {
      es: 'Quien se considere afectado puede interponer recurso de revocatoria ante el Jefe del Departamento de Tránsito o el Juez de Asuntos Municipales, que resuelve en 30 días.',
      en: 'Anyone affected may file an appeal (revocatoria) with the Traffic Department Chief or Municipal Affairs Judge, who rules in 30 days.',
    },
  },

  // ---------- Reglamento de Tránsito ----------
  {
    id: 'rt-10', law: 'RT', art: '10', verified: 'leido',
    title: { es: 'Documentos del vehículo', en: 'Vehicle documents' },
    summary: {
      es: 'El conductor porta la tarjeta de circulación (o fotocopia autenticada). Las placas y calcomanías deben ir vigentes y visibles al frente y atrás.',
      en: 'The driver carries the registration card (or certified copy). Plates and stickers must be valid and visible front and rear.',
    },
  },
  {
    id: 'rt-175', law: 'RT', art: '175', verified: 'leido',
    title: { es: 'Retención de la licencia', en: 'License retention' },
    summary: {
      es: 'La licencia se retiene durante pruebas de alcohol/drogas (si dan negativo se devuelve todo), si está vencida/falsa/alterada, si hubo heridos, daños (salvo acuerdo notarial), sin tarjeta de circulación, sin placas, suspendida/cancelada, o por faltarle el respeto a policías de tránsito.',
      en: 'The license is held during alcohol/drug tests (returned if negative), if expired/fake/altered, injuries, damages (unless notarized agreement), no registration card, no plates, suspended/cancelled, or disrespect to traffic police.',
    },
  },
  {
    id: 'rt-176', law: 'RT', art: '176', verified: 'leido',
    title: { es: 'Retención del vehículo', en: 'Vehicle retention' },
    summary: {
      es: 'El vehículo y la tarjeta se retienen en pruebas de alcohol/drogas, estacionamiento prohibido fuera de la calzada (hasta pagar), accidentes con heridos o daños, sin placas o sin tarjeta/con datos distintos.',
      en: 'Vehicle and card are held during alcohol/drug tests, prohibited parking off the roadway (until paid), accidents with injuries/damage, no plates, or no card/mismatched data.',
    },
  },
  {
    id: 'rt-177', law: 'RT', art: '177', verified: 'leido',
    title: { es: 'Detención del conductor', en: 'Driver detention' },
    summary: {
      es: 'El conductor solo se detiene y consigna mientras se hacen pruebas de alcohol/drogas, o si estuvo en un hecho de tránsito con lesionados o fallecidos. Si la prueba es negativa, se devuelve todo y puede circular libremente.',
      en: 'The driver is only detained during alcohol/drug tests, or after a crash with injured/deceased. If the test is negative, everything is returned and they may leave.',
    },
  },
  {
    id: 'rt-180', law: 'RT', art: '180–185', verified: 'leido',
    title: { es: 'Escala de multas', en: 'Fine scale' },
    summary: {
      es: 'Q100: auriculares/celular al conducir. Q200: sin tarjeta de circulación o sin licencia, alto, semáforo. Q300: licencia vencida, exceso de velocidad. Q400: conducir sin licencia. Q500: sin placas, sin tarjeta, estacionar donde está prohibido, exceso de pasajeros. Q1,000: faltar el respeto a la autoridad de tránsito. Valores del Reglamento reformado; el municipio puede tener normas propias.',
      en: 'Q100: headphones/phone while driving. Q200: no registration card or no license on you, stop signs, red light. Q300: expired license, speeding. Q400: driving without a license. Q500: no plates, no card, prohibited parking, excess passengers. Q1,000: disrespecting traffic authority. Amounts from the amended Regulation; municipalities may have their own rules.',
    },
  },
  {
    id: 'rt-186', law: 'RT', art: '186', verified: 'leido',
    title: { es: 'Procedimiento de la boleta', en: 'Ticket procedure' },
    summary: {
      es: 'El agente entrega una boleta de aviso, requerimiento de pago y citación con la infracción, el monto y el lugar de pago. Puedes manifestar tu desacuerdo por escrito con prueba en máximo 5 días. Lo que dice la boleta admite prueba en contrario.',
      en: 'The officer hands a notice, payment request and summons with the infraction, amount and payment place. You may state disagreement in writing with evidence within 5 days. The ticket’s content can be rebutted.',
    },
  },
  {
    id: 'rt-188', law: 'RT', art: '188', verified: 'leido',
    title: { es: 'Pago de multas', en: 'Paying fines' },
    summary: {
      es: 'El pago se hace adjuntando a la boleta el formulario DRI-1 y los fondos van a la cuenta oficial. La ley no prevé pagar en efectivo al agente en la calle: pedir o aceptar dinero ahí puede ser soborno.',
      en: 'Payment is made by attaching form DRI-1 to the ticket, with funds going to the official account. The law does not provide for paying cash to the officer on the street: asking or accepting money there may be bribery.',
    },
  },

  // ---------- Código Procesal Penal ----------
  {
    id: 'cpp-85', law: 'CPP', art: '85', verified: 'leido',
    title: { es: 'Métodos prohibidos', en: 'Prohibited methods' },
    summary: {
      es: 'No se puede usar coacción, amenaza o promesa para hacer declarar a una persona contra su voluntad.',
      en: 'No coercion, threats or promises may be used to make a person testify against their will.',
    },
    quote: 'No será sometido a ninguna clase de coacción, amenaza o promesa',
  },
  {
    id: 'cpp-87', law: 'CPP', art: '87', verified: 'leido',
    title: { es: 'Declaración ante juez', en: 'Statement before a judge' },
    summary: {
      es: 'Si el sindicado fue aprehendido, se avisa de inmediato al juez para que declare ante él en 24 horas, con un defensor presente.',
      en: 'If the suspect was arrested, the judge is notified immediately so they testify before them within 24 hours, with a lawyer present.',
    },
  },
  {
    id: 'cpp-88', law: 'CPP', art: '88', verified: 'leido',
    title: { es: 'Facultades policiales de pregunta', en: 'Police questioning powers' },
    summary: {
      es: 'La policía solo puede preguntarle al imputado para constatar su identidad, e instruirlo de que puede informar al Ministerio Público o declarar ante el juez.',
      en: 'Police may only ask the suspect questions to establish identity, and must instruct them that they may inform the Public Ministry or testify before the judge.',
    },
    quote: 'La policía sólo podrá dirigir al imputado preguntas para constatar su identidad',
  },
  {
    id: 'cpp-187', law: 'CPP', art: '187', verified: 'leido',
    title: { es: 'Inspección y registro', en: 'Inspection and search' },
    summary: {
      es: 'Para inspeccionar lugares, cosas o personas cuando hay motivos suficientes para sospechar que hay rastros de un delito, se necesita autorización judicial y se levanta acta.',
      en: 'To inspect places, things or persons when there are sufficient grounds to suspect traces of a crime, judicial authorization is required and a record is made.',
    },
  },
  {
    id: 'cpp-257', law: 'CPP', art: '257', verified: 'leido',
    title: { es: 'Aprehensión en flagrancia', en: 'Arrest in flagrante' },
    summary: {
      es: 'La policía debe aprehender a quien sorprenda cometiendo un delito, o descubierto instantes después con huellas, instrumentos o efectos del delito. Debe haber continuidad entre el hecho y la persecución.',
      en: 'Police must arrest anyone caught committing a crime, or found moments later with traces, tools or effects of the crime. There must be continuity between the act and pursuit.',
    },
    quote: 'Se entiende que hay flagrancia cuando la persona es sorprendida en el momento mismo de cometer el delito.',
  },

  // ---------- Ley PNC ----------
  {
    id: 'pnc-13', law: 'PNC', art: '13', verified: 'leido',
    title: { es: 'Obligaciones del agente de la PNC', en: 'PNC officer duties' },
    summary: {
      es: 'El agente debe respetar la dignidad y derechos de las personas, indicar al detenido los motivos y derechos que le asisten, velar por su vida e integridad, y identificarse con las insignias reglamentarias.',
      en: 'Officers must respect people’s dignity and rights, tell detainees the reasons and their rights, protect their life and integrity, and identify themselves with regulation insignia.',
    },
    quote: 'Al momento de efectuar una detención o aprehensión, indicar al detenido o aprehendido los motivos de su detención y derechos que le asisten',
  },
  {
    id: 'pnc-14', law: 'PNC', art: '14', verified: 'leido',
    title: { es: 'Principios de actuación y uso de la fuerza', en: 'Operating principles and use of force' },
    summary: {
      es: 'Actuar sin discriminación, tratar bien a la población e informar las causas y finalidad de su intervención. El uso de la fuerza debe seguir legalidad, necesidad, responsabilidad, congruencia, oportunidad y proporcionalidad. Nunca se puede justificar acatar una orden manifiestamente ilegal.',
      en: 'Act without discrimination, treat people well and explain the reasons and purpose of the intervention. Use of force must follow legality, necessity, responsibility, congruence, opportunity and proportionality. Following a manifestly illegal order is never justified.',
    },
  },
  {
    id: 'pnc-38', law: 'PNC', art: '38', verified: 'leido',
    title: { es: 'Uso del uniforme', en: 'Wearing the uniform' },
    summary: {
      es: 'El personal viste uniforme reglamentario en servicio activo (con excepciones autorizadas por el Director General). Nota: el portal de origen indica que algunos artículos de esta ley están suspendidos; verificar vigencia.',
      en: 'Personnel wear the regulation uniform on active duty (with exceptions authorized by the Director General). Note: the source portal indicates some articles of this law are suspended; verify validity.',
    },
  },

  // ---------- Referencia ----------
  {
    id: 'ag-67-98', law: 'EMETRA', art: '67-98', verified: 'referencia',
    title: { es: 'Traslado del tránsito a la Municipalidad de Guatemala', en: 'Transfer of traffic to the Municipality of Guatemala' },
    summary: {
      es: 'Según fuentes de búsqueda, este acuerdo delegó la administración del tránsito en la capital a la Municipalidad de Guatemala (PMT/EMETRA). El texto no se leyó: pendiente de verificación con abogado.',
      en: 'According to search sources, this agreement delegated traffic administration in the capital to the Municipality of Guatemala (PMT/EMETRA). Text not read: pending lawyer verification.',
    },
  },
]
