/** Marca SOSgt: escudo con "SOS" y la palabra. Mismo dibujo que public/favicon.svg. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo-svg">
      <rect width="64" height="64" rx="16" fill="#12356b" />
      <path d="M32 8 11 16v15c0 12 9 20 21 24 12-4 21-12 21-23V16z" fill="#fff" />
      <g fill="none" stroke="#0b2545" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 26.3C21.8 23.8 16.5 24.6 16.5 28.2c0 3.6 7.5 3 7.5 7.4 0 3.9-5.6 4.4-7.9 1.9" />
        <ellipse cx="32" cy="32" rx="3.9" ry="6.9" />
        <path d="M47 26.3C44.8 23.8 39.5 24.6 39.5 28.2c0 3.6 7.5 3 7.5 7.4 0 3.9-5.6 4.4-7.9 1.9" />
      </g>
      <path d="M25 45.5h14" stroke="#b7791f" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  )
}

export function Wordmark() {
  return <span className="wordmark">SOS<span className="wordmark-gt">gt</span></span>
}