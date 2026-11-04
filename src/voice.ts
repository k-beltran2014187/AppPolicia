/**
 * Voice in and out, using the browser's own speech services (no extra libraries).
 * Support varies: Chrome/Edge/Safari have dictation; almost every browser can read text aloud.
 */

interface RecResult { isFinal: boolean; 0: { transcript: string } }
interface RecEvent { resultIndex: number; results: ArrayLike<RecResult> }
interface Recognizer {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  onresult: ((e: RecEvent) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type RecognizerCtor = new () => Recognizer

const ctor = (): RecognizerCtor | undefined => {
  const w = window as unknown as { SpeechRecognition?: RecognizerCtor; webkitSpeechRecognition?: RecognizerCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export const canListen = () => typeof window !== 'undefined' && !!ctor()
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

export type ListenError = 'denied' | 'none' | 'fail'

/** Dictate once. onText gets the live text; onDone gets the final text (empty if nothing was heard). */
export function listen(
  lang: 'es' | 'en',
  h: { onText: (t: string) => void; onDone: (t: string, err?: ListenError) => void },
) {
  const C = ctor()
  if (!C) {
    h.onDone('', 'fail')
    return { stop() {} }
  }
  const rec = new C()
  rec.lang = lang === 'es' ? 'es-GT' : 'en-US'
  rec.interimResults = true
  rec.continuous = false
  rec.maxAlternatives = 1
  let text = ''
  let err: ListenError | undefined
  rec.onresult = (e) => {
    let t = ''
    for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript
    text = t.trim()
    h.onText(text)
  }
  rec.onerror = (e) => {
    err = e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'denied' : e.error === 'no-speech' || e.error === 'aborted' ? 'none' : 'fail'
  }
  rec.onend = () => h.onDone(text, text ? undefined : err ?? 'none')
  try { rec.start() } catch { h.onDone('', 'fail') }
  return { stop: () => { try { rec.stop() } catch { /* already stopped */ } } }
}

/** Plain text for the voice: no markdown, no ids, no bullets read as symbols. */
export function cleanForSpeech(text: string) {
  return text
    .replace(/\[\[[a-z0-9-]+\]\]/g, '')
    .replace(/\*\*/g, '')
    .replace(/^\s*[-*•]\s+/gm, '')
    .replace(/\barts?\.\s*/gi, 'artículo ')
    .replace(/\s*\n+\s*/g, '. ')
    .replace(/\.\s*\./g, '.')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

const pickVoice = (lang: 'es' | 'en') => {
  const voices = window.speechSynthesis.getVoices()
  const pref = lang === 'es' ? ['es-GT', 'es-MX', 'es-US', 'es-419', 'es'] : ['en-US', 'en-GB', 'en']
  for (const p of pref) {
    const v = voices.find((x) => x.lang.replace('_', '-').toLowerCase().startsWith(p.toLowerCase()))
    if (v) return v
  }
  return undefined
}

export function speak(text: string, lang: 'es' | 'en', onEnd?: () => void) {
  if (!canSpeak()) return onEnd?.()
  const s = window.speechSynthesis
  s.cancel()
  const clean = cleanForSpeech(text)
  if (!clean) return onEnd?.()
  const u = new SpeechSynthesisUtterance(clean)
  u.lang = lang === 'es' ? 'es-GT' : 'en-US'
  const v = pickVoice(lang)
  if (v) u.voice = v
  u.rate = 1
  u.onend = u.onerror = () => onEnd?.()
  s.speak(u)
}

export const stopSpeaking = () => {
  if (canSpeak()) window.speechSynthesis.cancel()
}
