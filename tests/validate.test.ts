import { describe, expect, it } from 'vitest'
import { COUNTRY_CODES, countryOptions, isCountryCode, isDpi, isEmail, isForeignNationality, isIdNumber, isPassport, isPhone, looksLikeEmail, maskDpi, normId, normPassport, normPhone, passwordIssue } from '../src/validate'

describe('validate', () => {
  it('normaliza y valida celulares de 8 dígitos (con o sin +502)', () => {
    expect(normPhone('5555-1234')).toBe('55551234')
    expect(normPhone('+502 5555 1234')).toBe('55551234')
    expect(isPhone('5555 1234')).toBe(true)
    expect(isPhone('123456')).toBe(false)
    expect(isPhone('')).toBe(false)
  })
  it('acepta celulares extranjeros con código de país (7 a 15 dígitos)', () => {
    expect(isPhone('+1 415 555 0132')).toBe(true)
    expect(isPhone('1234567890123456')).toBe(false)
  })
  it('valida pasaportes y elige la validación según el tipo de documento', () => {
    expect(isPassport('ab-123 456')).toBe(true)
    expect(normPassport('ab-123 456')).toBe('AB123456')
    expect(isPassport('A1')).toBe(false)
    expect(isPassport('ABC#12345')).toBe(false)
    expect(isIdNumber('dpi', '2234567890101')).toBe(true)
    expect(isIdNumber('dpi', 'AB123456')).toBe(false)
    expect(isIdNumber('passport', 'AB123456')).toBe(true)
    expect(normId('dpi', '2234 56789 0101')).toBe('2234567890101')
  })
  it('lista de países: sin repetidos, con Guatemala y ordenada', () => {
    expect(new Set(COUNTRY_CODES).size).toBe(COUNTRY_CODES.length)
    expect(COUNTRY_CODES.every((c) => /^[A-Z]{2}$/.test(c))).toBe(true)
    expect(isCountryCode('GT')).toBe(true)
    expect(isCountryCode('XX')).toBe(false)
    const names = countryOptions('es').map((c) => c.name)
    expect(names).toContain('Guatemala')
  })
  it('detecta a las personas extranjeras por nacionalidad', () => {
    expect(isForeignNationality('GT')).toBe(false)
    expect(isForeignNationality('MX')).toBe(true)
    expect(isForeignNationality(undefined)).toBe(false)
    expect(isForeignNationality('')).toBe(false)
  })
  it('valida correos', () => {
    expect(isEmail('persona@correo.com')).toBe(true)
    expect(isEmail('persona@correo')).toBe(false)
    expect(isEmail('no es correo')).toBe(false)
    expect(looksLikeEmail('a@b.co')).toBe(true)
    expect(looksLikeEmail('55551234')).toBe(false)
  })
  it('valida el DPI: 13 dígitos con departamento 01-22 y municipio 01+', () => {
    expect(isDpi('2234 56789 0101')).toBe(true)
    expect(isDpi('2234567890101')).toBe(true)
    expect(isDpi('223456789010')).toBe(false)
    expect(isDpi('2234567890001')).toBe(false)
    expect(isDpi('2234567892301')).toBe(false)
    expect(isDpi('2234567890100')).toBe(false)
  })
  it('exige contraseñas de 8+ caracteres con letras y números', () => {
    expect(passwordIssue('abc123')).toBe('short')
    expect(passwordIssue('abcdefgh')).toBe('weak')
    expect(passwordIssue('12345678')).toBe('weak')
    expect(passwordIssue('abcd1234')).toBe('')
  })
  it('oculta el DPI', () => {
    expect(maskDpi('2234567890101')).toBe('••••••••• 0101')
    expect(maskDpi('12')).toBe('•••')
  })
})