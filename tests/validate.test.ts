import { describe, expect, it } from 'vitest'
import { isDpi, isEmail, isPhone, looksLikeEmail, maskDpi, normPhone, passwordIssue } from '../src/validate'

describe('validate', () => {
  it('normaliza y valida celulares de 8 dígitos (con o sin +502)', () => {
    expect(normPhone('5555-1234')).toBe('55551234')
    expect(normPhone('+502 5555 1234')).toBe('55551234')
    expect(isPhone('5555 1234')).toBe(true)
    expect(isPhone('1234567')).toBe(false)
    expect(isPhone('')).toBe(false)
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