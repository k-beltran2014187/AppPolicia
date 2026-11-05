/** Marca SOSgt: pin de ubicación con escudo y check. Mismo dibujo que public/favicon.svg. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo-svg">
      <path className="logo-pin" d="M32 59C20 45 12 36.5 12 24a20 20 0 0 1 40 0c0 12.5-8 21-20 35z" />
      <circle cx="32" cy="24" r="11.5" fill="#fff" />
      <path className="logo-pin" d="M32 16.5l7 2.6v5c0 4.3-3 6.9-7 8.6-4-1.7-7-4.3-7-8.6v-5z" />
      <path d="M28.5 24.5l2.6 2.6 4.5-5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Wordmark() {
  return <span className="wordmark">SOS<span className="wordmark-gt">gt</span></span>
}