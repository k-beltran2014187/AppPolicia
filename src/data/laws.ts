import type { L } from '../i18n'
import { CPRG_EXTRA } from './laws-const.ts'
import { EXTRA } from './laws-extra.ts'
import { FOREIGN } from './laws-foreign.ts'

export type Law = 'CPRG' | 'CADH' | 'CPP' | 'CP' | 'PNC' | 'LT' | 'RT' | 'EMETRA' | 'CM' | 'CVRC'

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

/** Las leyes de Guatemala son públicas. El orden de las claves es el orden en la app. */
export const LAW_NAMES: Record<Law, { name: L; short: string; source: string }> = {
  CPRG: {
    name: { es: 'Constitución Política de la República de Guatemala', en: 'Political Constitution of Guatemala' },
    short: 'Constitución',
    source: 'https://www.oas.org/dil/esp/Constitucion_Guatemala.pdf',
  },
  CADH: {
    name: { es: 'Convención Americana sobre Derechos Humanos (Pacto de San José)', en: 'American Convention on Human Rights (Pact of San José)' },
    short: 'Convención Americana',
    source: 'https://www.oas.org/dil/esp/tratados_B-32_Convencion_Americana_sobre_Derechos_Humanos.htm',
  },
  CPP: {
    name: { es: 'Código Procesal Penal (Decreto 51-92)', en: 'Criminal Procedure Code (Decree 51-92)' },
    short: 'Código Procesal Penal',
    source: 'https://portal.pnc.edu.gt/wp-content/uploads/2025/03/3.-CODIGO-PROCESAL-PENAL.pdf',
  },
  CP: {
    name: { es: 'Código Penal (Decreto 17-73)', en: 'Criminal Code (Decree 17-73)' },
    short: 'Código Penal',
    source: 'https://tse.org.gt/images/UECFFPP/leyes/Codigo_Penal.pdf',
  },
  PNC: {
    name: { es: 'Ley de la Policía Nacional Civil (Decreto 35-2024)', en: 'National Civil Police Law (Decree 35-2024)' },
    short: 'Ley PNC',
    source: 'https://www.policinglaw.info/assets/downloads/LEY-PNC-DECRETO-No.-35-2024.pdf',
  },
  LT: {
    name: { es: 'Ley de Tránsito (Decreto 132-96)', en: 'Traffic Law (Decree 132-96)' },
    short: 'Ley de Tránsito',
    source: 'https://transito.gob.gt/wp-content/uploads/2015/06/Ley-y-Reglamento-Transito.pdf',
  },
  RT: {
    name: { es: 'Reglamento de Tránsito (Acuerdo Gubernativo 273-98 y reformas)', en: 'Traffic Regulation (Gov. Agreement 273-98 and reforms)' },
    short: 'Reglamento de Tránsito',
    source: 'https://transito.gob.gt/wp-content/uploads/2015/06/Ley-y-Reglamento-Transito.pdf',
  },
  EMETRA: {
    name: { es: 'Acuerdo Gubernativo 67-98 (tránsito de la capital)', en: 'Gov. Agreement 67-98 (capital traffic)' },
    short: 'AG 67-98',
    source: 'https://www.google.com/search?q=Acuerdo+Gubernativo+67-98+tr%C3%A1nsito+Municipalidad+de+Guatemala',
  },
  CM: {
    name: { es: 'Código de Migración (Decreto 44-2016)', en: 'Migration Code (Decree 44-2016)' },
    short: 'Código de Migración',
    source: 'https://faolex.fao.org/docs/pdf/gua205827.pdf',
  },
  CVRC: {
    name: { es: 'Convención de Viena sobre Relaciones Consulares (1963)', en: 'Vienna Convention on Consular Relations (1963)' },
    short: 'Convención de Viena (consular)',
    source: 'https://legal.un.org/ilc/texts/instruments/spanish/conventions/9_2_1963.pdf',
  },
}
const BASE: Article[] = [
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
    quote: "Las personas aprehendidas por la autoridad no podrán ser conducidas a lugares de detención, arresto o prisión diferentes a los que están legal y públicamente destinados al efecto. Los centros de detención, arresto o prisión provisional, serán distintos a aquellos en que han de cumplirse las condenas. La autoridad y sus agentes, que violen lo dispuesto en el presente artículo, serán personalmente responsables.",
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
    quote: "Compete al Ministerio de Gobernación, por intermedio del Departamento de Tránsito de la Dirección General de la Policía Nacional el ejercicio de la autoridad de tránsito en la vía pública, de conformidad con esta ley, salvo lo dispuesto en los artículos 8 y 9.",
    title: { es: 'Quién ejerce la autoridad de tránsito', en: 'Who holds traffic authority' },
    summary: {
      es: 'La autoridad de tránsito en la vía pública la ejerce el Ministerio de Gobernación por medio del Departamento de Tránsito de la PNC, salvo los municipios a los que se haya trasladado la competencia.',
      en: 'Traffic authority on public roads is held by the Interior Ministry through the PNC Traffic Department, except municipalities to which it was transferred.',
    },
  },
  {
    id: 'lt-6', law: 'LT', art: '6', verified: 'leido',
    quote: "El Ministerio de Gobernación mediante acuerdo gubernativo organizará el Departamento de Tránsito, el que será dirigido por un Jefe y un Subjefe nombrados por el titular del ramo, a propuesta del Director General de la Policía Nacional, contará con las dependencias y delegaciones que sean necesarias para el debido cumplimiento de la ley. También mediante acuerdo ministerial se creará y organizará la Policía de Tránsito, como parte integrante de la Policía Nacional, y con funciones especializadas de tránsito, a la cual le corresponderá aplicar la presente ley y por lo tanto sus integrantes están facultados para dirigir el tránsito y aplicar las sanciones instituidas en esta ley.",
    title: { es: 'Policía de Tránsito', en: 'Traffic Police' },
    summary: {
      es: 'La Policía de Tránsito es parte de la PNC con funciones especializadas: sus integrantes están facultados para dirigir el tránsito y aplicar las sanciones de la ley.',
      en: 'Traffic Police is part of the PNC with specialized duties: its members may direct traffic and apply the law’s sanctions.',
    },
  },
  {
    id: 'lt-8', law: 'LT', art: '8', verified: 'leido',
    quote: "El Organismo Ejecutivo, mediante acuerdo gubernativo, podrá trasladar la competencia de la administración de tránsito a las municipalidades de la República que se encuentren en condiciones de realizar dicha función eficientemente dentro de su jurisdicción y acrediten, como mínimo, los extremos señalados en este artículo. Para tal efecto, además del acuerdo gubernativo referido, el Consejo Municipal correspondiente deberá convalidar dicho traslado mediante acuerdo municipal. Este traslado no comprenderá en ningún caso las facultades para reglamentar los temas relativos a licencias de conducir, placas de circulación, seguros, registros de conductores y de vehículos y los otros asuntos de observancia general. En consecuencia, las municipalidades a las que se les delegue esta función únicamente podrán emitir regulaciones que afecten con exclusividad su jurisdicción. Para que el Organismo Ejecutivo pueda delegar la competencia de tránsito a una municipalidad, es necesario que ésta así lo solicite y manifieste formalmente contar con los recursos necesarios para desempeñar dicha función. Asimismo, se responsabilizará por su ejercicio y mantenimiento, dictará los reglamentos y/u ordenanzas necesarias para el efecto y creará un departamento específico de Policía Municipal de Tránsito, si careciere del mismo.",
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
    quote: "Todo vehículo que transite por la vía pública se identificará con la tarjeta y placa de circulación emitidas por el Ministerio de Finanzas Públicas, pero el Ministerio de Gobernación está facultado para disponer los diseños, definir los sistemas de emisión y vigilar el uso de las mismas, en resguardo del interés general y la seguridad nacional, para tal efecto, el Ministerio de Finanzas Públicas acatará tales disposiciones.",
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
    quote: "Se consideran infracciones administrativas y corresponderá al Departamento de Tránsito o a la municipalidad respectiva, a través del Juzgado de Asuntos Municipales, en su caso, retener la licencia de conducir e imponer una multa conforme al Artículo 32 de esta ley, en los casos siguientes: a. Cuando al conductor se le haya resuelto la suspensión o cancelación de la licencia; y b. Al conductor que hubiere acumulado tres multas sin haber hecho efectivo su pago. La licencia de conducir será devuelta al infractor una vez haya cancelado la multa impuesta.",
    title: { es: 'Retención de licencia (casos)', en: 'License retention (cases)' },
    summary: {
      es: 'Se retiene la licencia solo si ya hay suspensión/cancelación, o si se acumulan tres multas sin pagar. Se devuelve al pagar la multa.',
      en: 'The license is held only if already suspended/cancelled, or after three unpaid fines. Returned once the fine is paid.',
    },
  },
  {
    id: 'lt-43', law: 'LT', art: '43', verified: 'leido',
    quote: "La autoridad de tránsito retendrá la licencia de conducir en los casos siguientes: a. Cuando el conductor se encuentre ebrio o bajo los efectos de drogas, estupefacientes o similares que limiten sus capacidades volitivas, físicas o mentales; b. Cuando se conduzca un vehículo cuyos documentos de identificación no porte el conductor o bien carezca de placa de circulación el vehículo; y c. Cuando se hayan producido lesiones a personas o daños a vehículos, con ocasión del tránsito. La autoridad de tránsito conducirá a la oficina de policía nacional más cercana al conductor, al vehículo y a la licencia para que ésta lo traslade a conocimiento del organismo jurisdiccional correspondiente.",
    title: { es: 'Retención por faltas y delitos', en: 'Retention for offenses' },
    summary: {
      es: 'La autoridad retiene la licencia si el conductor está ebrio o drogado, si no porta documentos del vehículo o no tiene placa, o si hubo lesiones o daños. En esos casos se lleva todo a la oficina de la PNC más cercana.',
      en: 'The license is held if the driver is drunk or drugged, lacks vehicle documents or plates, or injuries/damage occurred. All is taken to the nearest PNC office.',
    },
  },
  {
    id: 'lt-47', law: 'LT', art: '47', verified: 'leido',
    quote: "En materia de tránsito, toda persona que se considere afectada por una disposición administrativa, podrá interponer recurso de revocatoria ante el Jefe del Departamento de Tránsito o ante el Juez de Asuntos Municipales, según el caso, el que será resuelto en el término de treinta días. En caso de silencio administrativo, se tendrá por resuelto desfavorablemente. En contra de la resolución que emitan estas autoridades, cabrán los recursos que establece la ley de lo Contencioso Administrativo.",
    title: { es: 'Impugnar una sanción', en: 'Challenging a sanction' },
    summary: {
      es: 'Quien se considere afectado puede interponer recurso de revocatoria ante el Jefe del Departamento de Tránsito o el Juez de Asuntos Municipales, que resuelve en 30 días.',
      en: 'Anyone affected may file an appeal (revocatoria) with the Traffic Department Chief or Municipal Affairs Judge, who rules in 30 days.',
    },
  },

  // ---------- Reglamento de Tránsito ----------
  {
    id: 'rt-10', law: 'RT', art: '10', verified: 'leido',
    quote: "Todo vehículo para circular en las vías públicas del territorio nacional, debe poseer los siguientes documentos: a. Tarjeta de circulación o fotocopia autenticada de la misma; b. Placa, placas y calcomanías de circulación vigentes. La tarjeta de circulación o la fotocopia autenticada, será portada por el conductor de cada vehículo automotor, siempre que circule en las vías públicas del territorio nacional. La placa o placas de circulación irán sujetas en lugar visible en la parte frontal y posterior del vehículo. No necesitan portar ningún documento todo conductor de bicicleta, utilizada por niños de hasta 12 años de edad, la utilizada para hacer deporte o alguna otra actividad recreativa. El Departamento de Tránsito regulará lo relativo a la documentación de otros conductores de bicicletas.",
    title: { es: 'Documentos del vehículo', en: 'Vehicle documents' },
    summary: {
      es: 'El conductor porta la tarjeta de circulación (o fotocopia autenticada). Las placas y calcomanías deben ir vigentes y visibles al frente y atrás.',
      en: 'The driver carries the registration card (or certified copy). Plates and stickers must be valid and visible front and rear.',
    },
  },
  {
    id: 'rt-175', law: 'RT', art: '175', verified: 'leido',
    quote: "La autoridad deberá retener y consignar la licencia de conducir en los casos siguientes: a. Mientras se llevan a cabo las pruebas de alcoholemia y/o influencias de drogas, estupefacientes o sustancias psicotrópicas. Si estas pruebas resultaran negativas, sin más trámite, se devolverá los documentos, el vehículo y el conductor podrá circular libremente. En caso resulten positivas las pruebas, la autoridad de tránsito, pondrá a disposición de la Policía Nacional Civil al conductor, el vehículo y sus documentos. b. Cuando el conductor porte licencia vencida, falsificada o alterada. c. Al conductor implicado en un hecho de tránsito en el cual resulten lesionados o fallecidos. d. Al conductor implicado en un hecho de tránsito en el cual se ocasione daños a la propiedad ajena, salvo que mediante acuerdo ofrezca la reparación inmediata. En todo caso, este acuerdo deberá celebrarse ante Notario. e. Al conductor que circule un vehículo sin portar tarjeta de circulación o fotocopia autenticada de la misma. f. Al conductor del vehículo que circule sin placas de circulación. g. Al conductor de licencia suspendida o cancelada por la autoridad competente. h. “Al conductor que no respete u ofenda a los policías de tránsito, inspectores ad honorem o inspectores escolares en el ejercicio de sus funciones o a los particulares que en situaciones de emergencia o calamidad pública, asuman temporalmente y en forma excepcional la administración del tránsito. Asímismo serán retenida y consignada la licencia de los conductores que violen lo preceptuado en el artículo 127 de este reglamento, relacionado con el paso de vehículos de emergencia y comitivas. “10",
    title: { es: 'Retención de la licencia', en: 'License retention' },
    summary: {
      es: 'La licencia se retiene durante pruebas de alcohol/drogas (si dan negativo se devuelve todo), si está vencida/falsa/alterada, si hubo heridos, daños (salvo acuerdo notarial), sin tarjeta de circulación, sin placas, suspendida/cancelada, o por faltarle el respeto a policías de tránsito.',
      en: 'The license is held during alcohol/drug tests (returned if negative), if expired/fake/altered, injuries, damages (unless notarized agreement), no registration card, no plates, suspended/cancelled, or disrespect to traffic police.',
    },
  },
  {
    id: 'rt-176', law: 'RT', art: '176', verified: 'leido',
    quote: "La autoridad deberá retener y consignar el vehículo y la tarjeta de circulación en los casos siguientes: a. Mientras se llevan a cabo las pruebas de alcoholemia y/o influencias de drogas, estupefacientes o sustancias psicotrópias. Si estas pruebas resultaran negativas, sin más trámite, se devolverán los documentos, el vehículo y el conductor podrá circular libremente. En caso resulten positivas las pruebas, la autoridad de tránsito pondrá a disposición de la Policía Nacional Civil al conductor, el vehículo y sus documentos. b. Vehículos estacionados en lugares prohibidos fuera de la calzada, hasta que se haga el pago de la multa respectiva. c. Vehículos involucrados en un hecho de tránsito en el cual resulten lesionados o fallecidos. d. Vehículos involucrados en un hecho de tránsito, en el cual se causen daños a la propiedad ajena, salvo que mediante acuerdo, ofrezca la reparación inmediata. En todo caso, este acuerdo deberá celebrarse ante Notario. e. Vehículos que circulen sin portar las placas de circulación; y f. Vehículos que transiten sin tarjetas de circulación o con datos distintos a los consignados en la misma.",
    title: { es: 'Retención del vehículo', en: 'Vehicle retention' },
    summary: {
      es: 'El vehículo y la tarjeta se retienen en pruebas de alcohol/drogas, estacionamiento prohibido fuera de la calzada (hasta pagar), accidentes con heridos o daños, sin placas o sin tarjeta/con datos distintos.',
      en: 'Vehicle and card are held during alcohol/drug tests, prohibited parking off the roadway (until paid), accidents with injuries/damage, no plates, or no card/mismatched data.',
    },
  },
  {
    id: 'rt-177', law: 'RT', art: '177', verified: 'leido',
    quote: "La autoridad deberá detener y consignar al conductor de un vehículo, en los casos siguientes: a. Mientras se llevan a cabo las pruebas de alcoholemia y/o influencias de drogas, estupefacientes o sustancias psicotrópias. Si estas pruebas resultaran negativas, sin más trámite, se devolverán los documentos, el vehículo y el conductor podrá circular libremente. En caso resulten positivas las pruebas, la autoridad de tránsito pondrá a disposición de la Policía Nacional Civil al conductor, el vehículo y sus documentos. b. Al conductor implicado en un hecho de tránsito en el cual resulten lesionados o fallecidos.",
    title: { es: 'Detención del conductor', en: 'Driver detention' },
    summary: {
      es: 'El conductor solo se detiene y consigna mientras se hacen pruebas de alcohol/drogas, o si estuvo en un hecho de tránsito con lesionados o fallecidos. Si la prueba es negativa, se devuelve todo y puede circular libremente.',
      en: 'The driver is only detained during alcohol/drug tests, or after a crash with injured/deceased. If the test is negative, everything is returned and they may leave.',
    },
  },
  {
    id: 'rt-180', law: 'RT', art: '180–185', verified: 'leido',
    quote: "Art. 180. Se aplicará multa de cien quetzales, en los casos que siguen: 1. Por no tener las bicicletas y motobicicletas, el equipamiento básico en óptimas condiciones de funcionamiento, según el presente Reglamento. 2. Por no respetar las señales de tránsito siguientes: a. No vehículos; b. Silencio; c. Ceder el paso; d. No virar o girar a la derecha; e. Virar a la derecha o izquierda; f. Velocidad mínima; y g. Siga de frente. 3. Por circular en el arcén sin causa justificada. 4. Por no facilitar la incorporación al tránsito a otros vehículos. 5. Por no utilizar las señales de tránsito correspondientes al virar o girar, cambiar de sentido, cambiar de carril, desacelerar y retroceder. 6. Por no respetar el derecho preferente a rebasar. 7. Por utilizar en casos no previstos en el presente reglamento, advertencias auditivas o avisos luminosos. 8. Por conducir utilizando auriculares conectados y aparatos receptores o reproductores de sonido, o utilizando teléfonos, radios comunicadores u otros aparatos similares.11",
    title: { es: 'Escala de multas', en: 'Fine scale' },
    summary: {
      es: 'Q100: auriculares/celular al conducir. Q200: no portar la tarjeta de circulación o la licencia, no respetar alto ni semáforo. Q300: licencia vencida, exceso de velocidad. Q400: conducir sin licencia. Q500: sin placas, sin tarjeta, estacionar donde está prohibido, recoger o dejar pasajeros en lugar no autorizado. Q1,000: faltar el respeto a la autoridad de tránsito. Tabla en los arts. 180–185 del Reglamento reformado; el municipio puede tener normas propias.',
      en: 'Q100: headphones/phone while driving. Q200: not carrying the registration card or license, ignoring stop signs or red lights. Q300: expired license, speeding. Q400: driving without a license. Q500: no plates, no registration card, prohibited parking, picking up or dropping passengers in an unauthorized place. Q1,000: disrespecting traffic authority. Amounts from the amended Regulation; municipalities may have their own rules.',
    },
  },
  {
    id: 'rt-186', law: 'RT', art: '186', verified: 'leido',
    quote: "La autoridad de tránsito que compruebe o verifique la infracción, entregará al conductor una boleta de aviso, requerimiento de pago y citación, la cual indicará la infracción cometida, el monto de la multa y el lugar donde se hará efectivo el pago o la gestión administrativa pertenente, según el caso. El pago efectuado, dará por agotado el trámite administrativo. Como gestión o trámite administrativo se entiende el derecho del infractor, de manifestar por escrito su desacuerdo, ofreciendo prueba en un plazo no mayor de cinco días, contados a partir de la fecha en que se cometió la infracción. En tal caso, el interesado presentará el alegato _________________________ 13 Reformado por el Artículo 4 de Acuerdo Gubernativo 395-2013 14 Reformado por el Artículo 5 de Acuerdo Gubernativo 395-2013 correspondiente ante el Departamento de Tránsito o ante el Juzgado de Asuntos Municipales de Tránsito, en su caso. El Departamento de Tránsito o el Juzgado de Asuntos Municipales de Tránsito en su caso, resolverá en un plazo no mayor de treinta días. Lo afirmado en la boleta por el policía de tránsito constituye presunción que admite prueba en contrario de que los hechos imputados son ciertos. El medio probatorio de la infracción es la firm del infractor puesta en la boleta o la razón del agente de policía de tránsito en que se haga constar que el infractor se negó a firmar o no pudo hacerlo por cualquier motivo.",
    title: { es: 'Procedimiento de la boleta', en: 'Ticket procedure' },
    summary: {
      es: 'El agente entrega una boleta de aviso, requerimiento de pago y citación con la infracción, el monto y el lugar de pago. Puedes manifestar tu desacuerdo por escrito con prueba en máximo 5 días. Lo que dice la boleta admite prueba en contrario.',
      en: 'The officer hands a notice, payment request and summons with the infraction, amount and payment place. You may state disagreement in writing with evidence within 5 days. The ticket’s content can be rebutted.',
    },
  },
  {
    id: 'rt-188', law: 'RT', art: '188', verified: 'leido',
    quote: "Se faculta a la Dirección General de Rentas Internas para llevar a cabo la recaudación, contabilización y apertura de las cuentas contables que se utilizaran para el registro de los ingresos que se perciban por concepto de multas de tránsito, así cualquier otro ingreso establecido por la Ley de Tránsito y el presente Reglamento, en concepto de fondos privativos del Departamento de Tránsito de la Dirección General de la Policía Nacional Civil. Para efectuar el pago correspodiente, se adjuntará a la boleta de infracción el formulario DRI-1. La administración de las multas, en cuanto a su imposición, control, descuentos e intereses, corresponde al Departamento de Tránsito, o en su caso, al Juzgado de Asuntos Municipales de Tránsito. Los fondos provenientes de multas por infracciones de tránsito que se hayan percibido hasta la fecha de emisión del presente Acuerdo Gubernativo que se ingresaron al fondo común, se transferirán a una cuenta específica a favor del Departamento de Tránsito; y los que se perciban posteriormente, a fin de que el citado Departamento los destine para el diseño, mantenimiento y mejoramiento de las actividades de tránsito, incluyendo obras de infraestructura vial. Cuando el Ministro de Gobernación traslade la administración del tránsito a una o varias municipalidades, los ingresos provenientes de la aplicación de sanciones, multas, recargos y gastos de administración, serán recaudados por las municipalidades y en este caso, los ingresos recaudados tendrán el carácter de fondos privativos del municipio, el cual los destinará exclusivamente para el diseño, mantenimiento y mejoramiento de las actividades de tránsito, incluyendo obras de infraestructura vial. Cada municipalidad se regirá por sus propias normas y procedimientos.",
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
    quote: "Si el sindicado hubiere sido aprehendido, se dará aviso inmediatamente al juez de primera instancia o al juez de paz en su caso, para que declare en su presencia, dentro del plazo de veinticuatro horas a contar desde su aprehensión. El juez proveerá los medios necesarios para que en la diligencia pueda estar presente un defensor. Durante el procedimiento intermedio, si lo pidiere el imputado, la declaración será recibida por el juez de primera instancia. Durante el debate, la declaración se recibirá en la oportunidad y en la forma prevista por este Código. El imputado podrá declarar cuantas veces quiera, siempre que su declaración sea pertinente y no aparezca sólo como un procedimiento dilatorio o perturbador. Durante el procedimiento preparatorio el sindicado podrá informar espontáneamente al Ministerio Público acerca del hecho delictivo que se le atribuye, pero deberá ser asistido por abogado de su elección o por un defensor público.",
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
    quote: "Cuando fuere necesario inspeccionar lugares, cosas o personas, porque existen motivos suficientes para sospechar que se encontrarán vestigios del delito, o se presuma que en determinado lugar se oculta el imputado o alguna persona evadida, se procederá a su registro, con autorización judicial. Mediante la inspección se comprobará el estado de las personas, lugares y cosas, los rastros y otros efectos materiales que hubiere de utilidad para la averiguación del hecho o la individualización de los partícipes en él. Se levantará acta que describirá detalladamente lo acontecido y, cuando fuere posible, se recogerán o conservarán los elementos probatorios útiles. Si el hecho no dejó huellas, no produjo efectos materiales, desaparecieron o fueron alterados, se describirá el estado actual, procurando consignar el anterior, el modo, tiempo y causa de su desaparición y alteración, y los medios de prueba de los cuales se obtuvo ese conocimiento; análogamente se procederá cuando la persona buscada no se halle en el lugar. Se pedirá en el momento de la diligencia al propietario o a quien habite en el lugar donde se efectúa, presenciar la inspección o, cuando estuviere ausente, a su encargado y, a falta de éste, a cualquier persona mayor de edad, prefiriendo a familiares del primero. El acta será firmada por todos los concurrentes; si alguien no lo hiciere, se expondrá la razón.",
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
    quote: "La actuación del personal de la Policía Nacional Civil se realizará en observancia a la legislación vigente, el respeto a los derechos humanos y a su condición de servicio público esencial Son principios básicos de actuación los siguientes: a) Adecuación al ordenamiento jurídico y respeto a los derechos humanos: i) Respeto e irrestricta observancia a la Constitución Política de la República de Guatemala, tratados internacionales en materia de derechos humanos ratificados por Guatemala, ya la jurisprudencia constitucional. ii) Actuar con absoluta neutralidad e imparcialidad y sin discriminación alguna. iii) Actuar con obediencia, subordinación y disciplina. En ningún caso, esto podrá ser justificación para acatar órdenes manifiestamente ilegales. b) Relación con la comunidad: i) Observar en todo momento, un trato adecuado en sus relaciones con la población a la que auxiliará y protegerá, debiendo informar acerca de las causas y finalidades de su intervención. ii) Propiciar la corresponsabilidad comunitaria, para facilitar la convivencia pacífica, mediante la promoción de su organización. iii) Cuando en el fiel y estricto cumplimiento de sus funciones y en aras de la protección de un bien jurídico tutelado propio o de terceras personas haga uso de los niveles de la fuerza, deberá atender a los principios de legalidad, necesidad, responsabilidad, congruencia, oportunidad y proporcionalidad, de acuerdo con los protocolos de actuación. c) Dedicación Profesional: Llevar a cabo sus funciones con espíritu de servicio, actitud proactiva, metodológica y firme. d) Secreto Profesional: Guardar riguroso secreto de todo producto e información derivado de la función policial, investigativa y analítica.",
    title: { es: 'Principios de actuación y uso de la fuerza', en: 'Operating principles and use of force' },
    summary: {
      es: 'Actuar sin discriminación, tratar bien a la población e informar las causas y finalidad de su intervención. El uso de la fuerza debe seguir legalidad, necesidad, responsabilidad, congruencia, oportunidad y proporcionalidad. Nunca se puede justificar acatar una orden manifiestamente ilegal.',
      en: 'Act without discrimination, treat people well and explain the reasons and purpose of the intervention. Use of force must follow legality, necessity, responsibility, congruence, opportunity and proportionality. Following a manifestly illegal order is never justified.',
    },
  },
  {
    id: 'pnc-38', law: 'PNC', art: '38', verified: 'leido',
    quote: "El personal de la Policía Nacional Civil vestirá el uniforme reglamentario, siempre que se encuentre en servicio activo; excepcionalmente, el Director General podrá autorizar que en determinadas tareas pueda prescindirse del uso del uniforme o del arma de fuego. La institución dotará a sus integrantes de los uniformes y calzado reglamentario anualmente. Todo lo relacionado a la dotación, las prendas y accesorios que conforman los distintos uniformes de la institución se desarrollará de conformidad con el reglamento respectivo. Se prohíbe a personas individuales que no pertenezcan a la institución, el uso del uniforme reglamentario u otros similares que pueda llamar a confusión. Cualquier persona sin calidad, que vista el uniforme reglamentario, total o parcialmente será sancionada de acuerdo con lo establecido en las leyes.",
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

const ORDER = Object.keys(LAW_NAMES) as Law[]
const num = (a: Article) => Number.parseInt(a.art, 10) || 0

/** Todas las leyes agrupadas en el orden de la app, y por número de artículo dentro de cada ley. */
export const ARTICLES: Article[] = [...BASE, ...CPRG_EXTRA, ...EXTRA, ...FOREIGN]
  .map((a, i) => ({ a, i }))
  .sort((x, y) => ORDER.indexOf(x.a.law) - ORDER.indexOf(y.a.law) || num(x.a) - num(y.a) || x.i - y.i)
  .map(({ a }) => a)