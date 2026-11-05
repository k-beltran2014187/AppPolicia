/** Validaciones de formularios (Guatemala). Se usan en el registro y en las pruebas. */
export const onlyDigits = (s: string) => s.replace(/\D/g, '')

/** Celular: 8 dígitos en Guatemala (acepta el prefijo +502); un número extranjero lleva su código de país (7 a 15 dígitos). */
export function normPhone(s: string) {
  let d = onlyDigits(s)
  if (d.length === 11 && d.startsWith('502')) d = d.slice(3)
  return d
}
export const isPhone = (s: string) => /^\d{7,15}$/.test(normPhone(s))

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

export type IdType = 'dpi' | 'passport'

/** Pasaporte: letras y números (5 a 20); se aceptan espacios y guiones al escribirlo. */
export const normPassport = (s: string) => s.replace(/[\s-]/g, '').toUpperCase()
export const isPassport = (s: string) => /^[A-Z0-9]{5,20}$/.test(normPassport(s))

/** Número de documento tal como se guarda (DPI solo dígitos; pasaporte en mayúsculas sin espacios). */
export const normId = (type: IdType, s: string) => (type === 'dpi' ? onlyDigits(s) : normPassport(s))
export const isIdNumber = (type: IdType, s: string) => (type === 'dpi' ? isDpi(s) : isPassport(s))

/** Texto para mostrar el documento sin exponerlo: ••••••••• 0101 */
export const maskId = (s: string) => (s.length >= 4 ? `••••••••• ${s.slice(-4)}` : '•••')
export const maskDpi = maskId

/** Códigos de país ISO 3166-1 (alfa-2) para elegir la nacionalidad. */
export const COUNTRY_CODES = 'AF AL DE AD AO AG SA DZ AR AM AU AT AZ BS BD BB BH BE BZ BJ BY MM BO BA BW BR BN BG BF BI BT CV KH CM CA QA TD CL CN CY CO KM CG CD KP KR CI CR HR CU DK DJ DM EC EG SV AE ER SK SI ES US EE SZ ET RU FJ PH FI FR GA GM GE GH GD GR GT GN GQ GW GY HT HN HU IN ID IQ IR IE IS IL IT JM JP JO KZ KE KG KI KW LA LS LV LB LR LY LI LT LU MK MG MY MW MV ML MT MA MH MU MR MX FM MD MC MN ME MZ NA NR NP NI NE NG NO NZ OM NL PK PW PS PA PG PY PE PL PT GB CF CZ DO RW RO WS SM KN LC VC ST SN RS SC SL SG SY SO LK ZA SD SS SE CH SR TH TZ TJ TL TG TO TT TN TR TM TV UA UG UY UZ VU VA VE VN YE ZM ZW TW'.split(' ')

/** Lista de países ordenada en el idioma de la persona. */
export function countryOptions(lang: string): { code: string; name: string }[] {
  let dn: Intl.DisplayNames | null = null
  try { dn = new Intl.DisplayNames([lang], { type: 'region' }) } catch { /* navegador antiguo */ }
  return COUNTRY_CODES.map((code) => ({ code, name: dn?.of(code) ?? code })).sort((a, b) => a.name.localeCompare(b.name, lang))
}

export const isCountryCode = (c: string) => COUNTRY_CODES.includes(c)
/** ¿Es extranjera la persona? (falta de dato = se trata como guatemalteca). */
export const isForeignNationality = (c?: string | null) => !!c && c !== 'GT'

/** ¿Lo escrito parece un correo (en vez de un celular)? */
export const looksLikeEmail = (s: string) => s.includes('@')