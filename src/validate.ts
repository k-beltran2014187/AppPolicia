/** Validaciones de formularios (Guatemala). Se usan en el registro y en las pruebas. */
export const onlyDigits = (s: string) => s.replace(/\D/g, '')

/** Celular guatemalteco: 8 dígitos (acepta el prefijo +502). */
export function normPhone(s: string) {
  let d = onlyDigits(s)
  if (d.length === 11 && d.startsWith('502')) d = d.slice(3)
  return d
}
export const isPhone = (s: string) => /^\d{8}$/.test(normPhone(s))

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim())

/** DPI (CUI): 13 dígitos; los dos siguientes al octavo + verificador son departamento (01-22) y municipio (01+). */
export function isDpi(s: string) {
  const d = onlyDigits(s)
  if (d.length !== 13) return false
  const dep = Number(d.slice(9, 11))
  const mun = Number(d.slice(11, 13))
  return dep >= 1 && dep <= 22 && mun >= 1
}

/** '' si la contraseña es aceptable; 'short' o 'weak' si no. */
export function passwordIssue(p: string): '' | 'short' | 'weak' {
  if (p.length < 8) return 'short'
  if (!/[A-Za-z]/.test(p) || !/\d/.test(p)) return 'weak'
  return ''
}

/** Texto para mostrar el DPI sin exponerlo: ••••••••• 0101 */
export const maskDpi = (s: string) => (s.length >= 4 ? `••••••••• ${s.slice(-4)}` : '•••')

/** ¿Lo escrito parece un correo (en vez de un celular)? */
export const looksLikeEmail = (s: string) => s.includes('@')