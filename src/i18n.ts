import { createContext, useContext } from 'react'

export type Lang = 'es' | 'en'
export type L = { es: string; en: string }

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'es',
  setLang: () => {},
})

export const useLang = () => useContext(LangContext)

/** Pick the string for the active language. */
export const tr = (l: L, lang: Lang) => l[lang]

export const UI = {
  appName: { es: 'PoliGT', en: 'PoliGT' },
  tagline: {
    es: 'Conoce tus derechos y deberes en una parada de la PNC o EMETRA',
    en: 'Know your rights and duties in a PNC or EMETRA stop',
  },
  iAm: { es: '¿Quién eres?', en: 'Who are you?' },
  civil: { es: 'Soy conductor / civil', en: 'I am a driver / civilian' },
  officer: { es: 'Soy agente / oficial', en: 'I am an officer' },
  stoppedBtn: { es: 'Me pararon', en: 'I was stopped' },
  stoppedSub: { es: 'Guía paso a paso ahora mismo', en: 'Step-by-step guide right now' },
  officerBtn: { es: 'Fundamento legal de mi actuación', en: 'Legal basis for my action' },
  situations: { es: 'Situaciones', en: 'Situations' },
  tools: { es: 'Herramientas', en: 'Tools' },
  back: { es: 'Atrás', en: 'Back' },
  home: { es: 'Inicio', en: 'Home' },
  laws: { es: 'Leyes', en: 'Laws' },
  record: { es: 'Grabar', en: 'Record' },
  help: { es: 'Ayuda', en: 'Help' },
  report: { es: 'Informe', en: 'Report' },
  checklist: { es: 'Revisa que sea legal', en: 'Check it is lawful' },
  doNow: { es: 'Qué hacer', en: 'What to do' },
  dontDo: { es: 'Evita', en: 'Avoid' },
  say: { es: 'Qué decir', en: 'What to say' },
  basis: { es: 'Base legal', en: 'Legal basis' },
  officerView: { es: 'Para el oficial', en: 'For the officer' },
  civilView: { es: 'Para el civil', en: 'For the civilian' },
  searchLaws: { es: 'Buscar artículo o tema…', en: 'Search article or topic…' },
  pending: { es: 'Pendiente de validación legal', en: 'Pending legal validation' },
  textRead: { es: 'Texto leído en fuente oficial', en: 'Text read in official source' },
  notRead: { es: 'Texto no leído, solo referencia', en: 'Text not read, reference only' },
  source: { es: 'Ver fuente oficial', en: 'View official source' },
  disclaimerTitle: { es: 'Aviso importante', en: 'Important notice' },
  disclaimer: {
    es: 'PoliGT es informativa y no sustituye a un abogado. Los artículos fueron tomados de textos oficiales pero están pendientes de revisión por un profesional del derecho. Sé siempre respetuoso, no huyas ni uses violencia.',
    en: 'PoliGT is informational and does not replace a lawyer. Articles were taken from official texts but are pending review by a legal professional. Always be respectful; never flee or use violence.',
  },
  accept: { es: 'Entendido', en: 'Got it' },
  recStart: { es: 'Iniciar grabación', en: 'Start recording' },
  recStop: { es: 'Detener', en: 'Stop' },
  recVideo: { es: 'Video', en: 'Video' },
  recAudio: { es: 'Solo audio', en: 'Audio only' },
  recSaved: { es: 'Grabaciones guardadas en este teléfono', en: 'Recordings saved on this phone' },
  recEmpty: { es: 'Aún no hay grabaciones', en: 'No recordings yet' },
  recNote: {
    es: 'Se guardan solo en tu dispositivo. Avisa que estás grabando y no obstruyas el trabajo del agente.',
    en: 'Saved only on your device. Say you are recording and do not obstruct the officer.',
  },
  recDenied: { es: 'No se pudo acceder a cámara/micrófono', en: 'Could not access camera/microphone' },
  download: { es: 'Descargar', en: 'Download' },
  delete: { es: 'Borrar', en: 'Delete' },
  contacts: { es: 'Contactos de ayuda', en: 'Help contacts' },
  call: { es: 'Llamar', en: 'Call' },
  shareLoc: { es: 'Compartir mi ubicación', en: 'Share my location' },
  shareLocSub: { es: 'Envía tu ubicación a alguien de confianza por WhatsApp', en: 'Send your location to a trusted person via WhatsApp' },
  trusted: { es: 'Número de contacto de confianza', en: 'Trusted contact number' },
  trustedHint: { es: 'Ej. 50212345678 (con código de país)', en: 'e.g. 50212345678 (with country code)' },
  verifyNumber: { es: 'Verifica el número antes de depender de él', en: 'Verify the number before relying on it' },
  reportTitle: { es: 'Informe del incidente', en: 'Incident report' },
  reportHint: { es: 'Anota los datos mientras ocurre o justo después. Se guarda en tu teléfono.', en: 'Write the details while it happens or right after. Saved on your phone.' },
  makePdf: { es: 'Generar PDF', en: 'Generate PDF' },
  clear: { es: 'Limpiar', en: 'Clear' },
  language: { es: 'Idioma', en: 'Language' },
  installTip: {
    es: 'Tip: en el menú del navegador elige “Agregar a pantalla de inicio” para usarla sin internet.',
    en: 'Tip: use “Add to Home Screen” in your browser menu to use it offline.',
  },
} satisfies Record<string, L>
