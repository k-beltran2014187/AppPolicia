import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

process.env.SUPABASE_URL = 'https://demo.supabase.co'
process.env.SUPABASE_ANON_KEY = 'anon'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service'

let login
let del
beforeAll(async () => {
  login = (await import('../api/login.js')).POST
  del = (await import('../api/delete-account.js')).POST
})
afterEach(() => vi.restoreAllMocks())

const post = (url, body, headers = {}) =>
  new Request(url, { method: 'POST', headers: { origin: 'https://app.test', host: 'app.test', 'x-real-ip': String(Math.random()), ...headers }, body: body === undefined ? undefined : JSON.stringify(body) })

describe('api/login (celular + contraseña)', () => {
  it('rechaza otros orígenes', async () => {
    const res = await login(post('https://app.test/api/login', { phone: '55551234', password: 'x' }, { origin: 'https://malo.test' }))
    expect(res.status).toBe(403)
  })
  it('rechaza celulares mal formados sin llamar a Supabase', async () => {
    const f = vi.spyOn(globalThis, 'fetch')
    const res = await login(post('https://app.test/api/login', { phone: '123', password: 'abc12345' }))
    expect(res.status).toBe(401)
    expect(f).not.toHaveBeenCalled()
  })
  it('responde igual si el celular no existe y no intenta la contraseña', async () => {
    const f = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('[]', { status: 200 }))
    const res = await login(post('https://app.test/api/login', { phone: '55551234', password: 'abc12345' }))
    expect(res.status).toBe(401)
    expect(f).toHaveBeenCalledTimes(1)
  })
  it('devuelve solo la sesión, nunca el correo', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify([{ email: 'secreto@correo.com' }]), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'a', refresh_token: 'r', user: { email: 'secreto@correo.com' } }), { status: 200 }))
    const res = await login(post('https://app.test/api/login', { phone: '5555-1234', password: 'abc12345' }))
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(JSON.parse(text)).toEqual({ access_token: 'a', refresh_token: 'r' })
    expect(text).not.toContain('secreto@correo.com')
  })
  it('limita los intentos por celular', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('[]', { status: 200 }))
    const codes = []
    for (let i = 0; i < 8; i++) codes.push((await login(post('https://app.test/api/login', { phone: '44441111', password: 'abc12345' }))).status)
    expect(codes).toContain(429)
  })
})

describe('api/delete-account', () => {
  it('exige sesión', async () => {
    const res = await del(post('https://app.test/api/delete-account', undefined))
    expect(res.status).toBe(401)
  })
  it('borra solo al usuario dueño del token, no a un id enviado por el cliente', async () => {
    const f = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'uid-del-token' }), { status: 200 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
    const res = await del(post('https://app.test/api/delete-account', { id: 'otro-usuario' }, { authorization: 'Bearer tok' }))
    expect(res.status).toBe(200)
    expect(String(f.mock.calls[1][0])).toContain('/admin/users/uid-del-token')
    expect(String(f.mock.calls[1][0])).not.toContain('otro-usuario')
  })
  it('no borra si el token no es válido', async () => {
    const f = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 401 }))
    const res = await del(post('https://app.test/api/delete-account', undefined, { authorization: 'Bearer malo' }))
    expect(res.status).toBe(401)
    expect(f).toHaveBeenCalledTimes(1)
  })
})