/** Mike, el asesor virtual con IA de PoliGT. Ilustración plana; no es una persona real ni un abogado. */
export default function Mike({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" role="img" aria-label="Mike" className="mike">
      <circle cx="40" cy="40" r="40" fill="#9fe870" />
      <path d="M14 80c2-15 12-22 26-22s24 7 26 22z" fill="#163300" />
      <path d="M32 58l8 12 8-12z" fill="#fff" />
      <path d="M34 58l6 8 6-8-6-2z" fill="#e2f6d5" />
      <rect x="35" y="46" width="10" height="13" rx="4" fill="#e0a77c" />
      <ellipse cx="40" cy="34" rx="15" ry="17" fill="#f0b98d" />
      <path d="M25 31c-1-12 7-18 16-17 8 0 15 5 14 17-3-5-8-8-15-8-7 0-12 3-15 8z" fill="#2b1d12" />
      <circle cx="34" cy="35" r="2" fill="#2b1d12" />
      <circle cx="46" cy="35" r="2" fill="#2b1d12" />
      <path d="M34 43c3 3 9 3 12 0" fill="none" stroke="#2b1d12" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="40" cy="62" r="1.4" fill="#9fe870" />
    </svg>
  )
}
