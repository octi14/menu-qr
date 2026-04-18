import { describe, it, expect } from 'vitest'
import { GOOGLE_FONTS_STYLESHEET_HREF } from '../config/google-fonts.mjs'

describe('config google-fonts', () => {
  it('incluye familias usadas en menús y display swap', () => {
    expect(GOOGLE_FONTS_STYLESHEET_HREF).toContain('Inter')
    expect(GOOGLE_FONTS_STYLESHEET_HREF).toContain('display=swap')
  })
})
