import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../server/utils/auth.js'

describe('auth password helpers', () => {
  it('hashea y verifica contraseña', async () => {
    const hash = await hashPassword('clave-segura-123')
    expect(await verifyPassword('clave-segura-123', hash)).toBe(true)
    expect(await verifyPassword('otra-clave', hash)).toBe(false)
  })
})
