import { deleteDatabase } from './db'

const PREFIX = 'poligt:'
/** Settings kept after a wipe so the app does not ask again what the user already chose. */
const KEEP = new Set(['poligt:lang', 'poligt:ack'])

/** Same-tab storage helpers that never throw (private mode, blocked storage). */
export const safe = {
  get: (k: string, d = '') => { try { return localStorage.getItem(k) ?? d } catch { return d } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* ignore */ } },
  del: (k: string) => { try { localStorage.removeItem(k) } catch { /* ignore */ } },
}

/** Delete everything the app saved on this device: report, contact, chat, recordings, PIN. */
export async function wipeAll(keepPrefs = true) {
  try {
    for (const k of Object.keys(localStorage)) if (k.startsWith(PREFIX) && !(keepPrefs && KEEP.has(k))) localStorage.removeItem(k)
  } catch { /* ignore */ }
  try {
    for (const k of Object.keys(sessionStorage)) if (k.startsWith(PREFIX)) sessionStorage.removeItem(k)
  } catch { /* ignore */ }
  await deleteDatabase()
}

/** Leave the app and do not let the Back button return to it. */
export function quickExit() {
  window.location.replace('https://www.google.com/search?q=clima+guatemala')
}

// ---- Optional PIN lock (protects against someone glancing through the phone; not strong encryption) ----

const enc = new TextEncoder()
const toHex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')

async function hash(pin: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveBits'])
  return toHex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: 100_000 }, key, 256))
}

export const hasPin = () => safe.get('poligt:pin') !== ''

export async function setPin(pin: string) {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(12)).buffer)
  safe.set('poligt:pin', `${salt}:${await hash(pin, salt)}`)
}

export async function checkPin(pin: string) {
  const [salt, h] = safe.get('poligt:pin').split(':')
  return !!salt && (await hash(pin, salt)) === h
}

export const clearPin = () => safe.del('poligt:pin')
