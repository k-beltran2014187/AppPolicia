/**
 * Entrada con Face ID / huella usando WebAuthn (autenticador de la plataforma).
 * El teléfono verifica el rostro o la huella; la app nunca recibe ni guarda datos biométricos.
 * Es un desbloqueo del dispositivo: la sesión de la cuenta sigue guardada en el teléfono.
 */
import { safe } from './privacy'

const KEY = 'poligt:bio'

const rand = (n: number) => crypto.getRandomValues(new Uint8Array(n))
const toB64 = (b: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const fromB64 = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))

export const hasBio = () => safe.get(KEY) !== ''

export async function bioAvailable(): Promise<boolean> {
  try {
    return !!window.PublicKeyCredential && (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())
  } catch {
    return false
  }
}

/** Registra el rostro/huella del teléfono como llave de desbloqueo. true si quedó activado. */
export async function enableBio(label: string): Promise<boolean> {
  try {
    const cred = (await navigator.credentials.create({
      publicKey: {
        challenge: rand(32),
        rp: { name: 'SOSgt' },
        user: { id: rand(16), name: label || 'usuario', displayName: 'SOSgt' },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
        authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'discouraged' },
        attestation: 'none',
        timeout: 60_000,
      },
    })) as PublicKeyCredential | null
    if (!cred) return false
    safe.set(KEY, toB64(cred.rawId))
    return true
  } catch {
    return false
  }
}

/** Pide rostro/huella. true si la persona se verificó. */
export async function unlockBio(): Promise<boolean> {
  const id = safe.get(KEY)
  if (!id) return false
  try {
    const got = await navigator.credentials.get({
      publicKey: {
        challenge: rand(32),
        allowCredentials: [{ type: 'public-key', id: fromB64(id), transports: ['internal'] }],
        userVerification: 'required',
        timeout: 60_000,
      },
    })
    return !!got
  } catch {
    return false
  }
}

export const disableBio = () => safe.del(KEY)