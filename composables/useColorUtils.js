// Utilidades para trabajar con colores

/**
 * Convierte un color hex a RGB
 */
function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return null
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Convierte RGB a hex
 */
function rgbToHex(r, g, b) {
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)))
  return '#' + [clamp(r), clamp(g), clamp(b)].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * Calcula la luminosidad relativa de un color (0-1)
 */
function getLuminance(hex) {
  if (!hex || typeof hex !== 'string') return 0.5
  
  const rgb = hexToRgb(hex)
  if (!rgb) return 0.5

  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Determina si un color es claro u oscuro
 */
function isLightColor(hex) {
  return getLuminance(hex) > 0.5
}

/**
 * Obtiene el matiz (hue) de un color RGB en grados (0-360)
 */
function getHue(rgb) {
  const { r, g, b } = rgb
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  if (delta === 0) return 0

  let hue = 0
  if (max === r) {
    hue = ((g - b) / delta) % 6
  } else if (max === g) {
    hue = (b - r) / delta + 2
  } else {
    hue = (r - g) / delta + 4
  }

  hue = hue * 60
  if (hue < 0) hue += 360
  return hue
}

/**
 * Detecta si un color es principalmente verde
 */
function isGreenish(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return false
  
  const hue = getHue(rgb)
  // Verde está entre 60 y 180 grados en el círculo cromático
  return hue >= 60 && hue <= 180
}

/**
 * Detecta si un color es principalmente gris (baja saturación)
 */
function isGrayish(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return false
  
  const { r, g, b } = rgb
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  
  // Si la diferencia entre el máximo y mínimo es pequeña, es gris
  // Saturación baja = color gris
  // Aumentado el umbral para detectar mejor los grises
  return delta < 50
}

/**
 * Calcula el contraste entre dos colores (ratio WCAG)
 */
function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Calcula el color del precio basado en el color de fondo y el tema
 * Asegura buen contraste incluso con fondos verdes
 */
export function calculatePriceColor(backgroundColor, isDarkTheme = false) {
  if (!backgroundColor) {
    // Color por defecto según el tema
    return isDarkTheme ? '#10b981' : '#059669' // emerald-500 o emerald-600
  }

  const bgIsLight = isLightColor(backgroundColor)
  const isGreen = isGreenish(backgroundColor)
  const isGray = isGrayish(backgroundColor)

  // Si el fondo es gris, usar colores con mejor contraste
  if (isGray) {
    if (bgIsLight) {
      // Fondo gris claro: usar un color oscuro con excelente contraste
      const candidates = [
        '#059669', // emerald-600 (verde oscuro)
        '#dc2626', // red-600 (rojo)
        '#2563eb', // blue-600 (azul)
        '#7c3aed', // violet-600 (morado)
        '#ea580c', // orange-600 (naranja)
      ]
      
      // Elegir el color con mejor contraste
      let bestColor = candidates[0]
      let bestContrast = 0
      
      candidates.forEach(color => {
        const contrast = getContrastRatio(backgroundColor, color)
        if (contrast > bestContrast) {
          bestContrast = contrast
          bestColor = color
        }
      })
      
      // Asegurar mínimo contraste de 4.5:1 (WCAG AA)
      if (bestContrast < 4.5) {
        // Si aún no hay suficiente contraste, usar un color más oscuro
        return '#065f46' // emerald-800 (más oscuro)
      }
      
      return bestColor
    } else {
      // Fondo gris oscuro: usar un color claro con excelente contraste
      const candidates = [
        '#10b981', // emerald-500 (verde claro)
        '#fbbf24', // amber-400 (amarillo/naranja)
        '#60a5fa', // blue-400 (azul claro)
        '#a78bfa', // violet-400 (morado claro)
        '#34d399', // emerald-400 (verde más claro)
      ]
      
      // Elegir el color con mejor contraste
      let bestColor = candidates[0]
      let bestContrast = 0
      
      candidates.forEach(color => {
        const contrast = getContrastRatio(backgroundColor, color)
        if (contrast > bestContrast) {
          bestContrast = contrast
          bestColor = color
        }
      })
      
      // Asegurar mínimo contraste de 4.5:1 (WCAG AA)
      if (bestContrast < 4.5) {
        // Si aún no hay suficiente contraste, usar un color más claro
        return '#6ee7b7' // emerald-300 (más claro)
      }
      
      return bestColor
    }
  }

  // Si el fondo es verde, usar un color complementario o con mejor contraste
  if (isGreen) {
    if (bgIsLight) {
      // Fondo verde claro: usar un color oscuro con buen contraste
      // Opciones: naranja/rojo oscuro, azul oscuro, o morado oscuro
      const candidates = [
        '#dc2626', // red-600 (rojo)
        '#ea580c', // orange-600 (naranja)
        '#2563eb', // blue-600 (azul)
        '#7c3aed', // violet-600 (morado)
        '#0891b2', // cyan-600 (cian)
        '#991b1b', // red-800 (rojo más oscuro)
        '#9a3412', // orange-800 (naranja más oscuro)
      ]
      
      // Elegir el color con mejor contraste
      let bestColor = candidates[0]
      let bestContrast = 0
      
      candidates.forEach(color => {
        const contrast = getContrastRatio(backgroundColor, color)
        if (contrast > bestContrast) {
          bestContrast = contrast
          bestColor = color
        }
      })
      
      // Asegurar mínimo contraste de 4.5:1
      if (bestContrast < 4.5) {
        return '#991b1b' // red-800 (muy oscuro, garantiza contraste)
      }
      
      return bestColor
    } else {
      // Fondo verde oscuro: usar un color claro con buen contraste
      const candidates = [
        '#fbbf24', // amber-400 (amarillo/naranja claro)
        '#60a5fa', // blue-400 (azul claro)
        '#a78bfa', // violet-400 (morado claro)
        '#34d399', // emerald-400 (verde claro pero más claro que el fondo)
        '#f472b6', // pink-400 (rosa)
        '#fde047', // yellow-300 (amarillo más claro)
        '#fbbf24', // amber-400 (duplicado pero útil)
      ]
      
      // Elegir el color con mejor contraste
      let bestColor = candidates[0]
      let bestContrast = 0
      
      candidates.forEach(color => {
        const contrast = getContrastRatio(backgroundColor, color)
        if (contrast > bestContrast) {
          bestContrast = contrast
          bestColor = color
        }
      })
      
      // Asegurar mínimo contraste de 4.5:1
      if (bestContrast < 4.5) {
        return '#fde047' // yellow-300 (muy claro, garantiza contraste)
      }
      
      return bestColor
    }
  }

  // Si no es verde ni gris, usar la lógica original pero con mejor contraste
  if (bgIsLight) {
    // Fondo claro: usar un color oscuro/rico
    // Verificar contraste con emerald y elegir mejor opción
    const emerald = '#059669'
    const contrast = getContrastRatio(backgroundColor, emerald)
    
    if (contrast < 4.5) {
      // Si el contraste es bajo, probar colores más oscuros
      const darkerOptions = ['#065f46', '#064e3b', '#022c22']
      for (const color of darkerOptions) {
        const testContrast = getContrastRatio(backgroundColor, color)
        if (testContrast >= 4.5) {
          return color
        }
      }
      // Si ninguno funciona, usar el más oscuro
      return '#022c22' // emerald-950
    }
    return emerald
  } else {
    // Fondo oscuro: usar un color claro/vibrante
    const emerald = '#10b981'
    const contrast = getContrastRatio(backgroundColor, emerald)
    
    if (contrast < 4.5) {
      // Si el contraste es bajo, probar colores más claros
      const lighterOptions = ['#34d399', '#6ee7b7', '#a7f3d0']
      for (const color of lighterOptions) {
        const testContrast = getContrastRatio(backgroundColor, color)
        if (testContrast >= 4.5) {
          return color
        }
      }
      // Si ninguno funciona, usar el más claro
      return '#d1fae5' // emerald-100
    }
    return emerald
  }
}


/**
 * Calcula un color de texto legible sobre un fondo dado
 * Asegura contraste mínimo de 4.5:1 (WCAG AA)
 */
export function getContrastTextColor(backgroundColor) {
  if (!backgroundColor) {
    return '#1f2937' // slate-800
  }

  const isLight = isLightColor(backgroundColor)
  const isGreen = isGreenish(backgroundColor)
  const isGray = isGrayish(backgroundColor)
  
  // Si es gris o verde, usar lógica más robusta
  if (isGray || isGreen) {
    if (isLight) {
      // Fondo claro: probar varios colores oscuros y elegir el mejor
      const candidates = [
        '#1f2937', // slate-800
        '#111827', // gray-900
        '#000000', // black
        '#065f46', // emerald-800
        '#7c2d12', // red-900
      ]
      
      let bestColor = candidates[0]
      let bestContrast = 0
      
      candidates.forEach(color => {
        const contrast = getContrastRatio(backgroundColor, color)
        if (contrast > bestContrast) {
          bestContrast = contrast
          bestColor = color
        }
      })
      
      // Asegurar mínimo contraste de 4.5:1
      if (bestContrast < 4.5) {
        return '#000000' // Forzar negro si no hay suficiente contraste
      }
      
      return bestColor
    } else {
      // Fondo oscuro: probar varios colores claros y elegir el mejor
      const candidates = [
        '#f9fafb', // slate-50
        '#ffffff', // white
        '#f3f4f6', // gray-100
        '#6ee7b7', // emerald-300
        '#fef3c7', // amber-100
      ]
      
      let bestColor = candidates[0]
      let bestContrast = 0
      
      candidates.forEach(color => {
        const contrast = getContrastRatio(backgroundColor, color)
        if (contrast > bestContrast) {
          bestContrast = contrast
          bestColor = color
        }
      })
      
      // Asegurar mínimo contraste de 4.5:1
      if (bestContrast < 4.5) {
        return '#ffffff' // Forzar blanco si no hay suficiente contraste
      }
      
      return bestColor
    }
  }
  
  // Para otros colores, usar lógica simple pero verificando contraste
  const defaultColor = isLight ? '#1f2937' : '#f9fafb'
  const contrast = getContrastRatio(backgroundColor, defaultColor)
  
  if (contrast < 4.5) {
    // Si no hay suficiente contraste, usar extremos
    return isLight ? '#000000' : '#ffffff'
  }
  
  return defaultColor
}

export const useColorUtils = () => {
  return {
    calculatePriceColor,
    getContrastTextColor,
    isLightColor,
    getLuminance,
  }
}

