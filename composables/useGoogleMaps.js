/**
 * Extrae coordenadas (latitud, longitud) de una URL de Google Maps
 * Soporta múltiples formatos de URLs de Google Maps
 */
export function extractCoordinatesFromGoogleMapsUrl(url) {
  if (!url || typeof url !== 'string') {
    return null
  }

  try {
    // Formato 1: https://www.google.com/maps/@lat,lng,zoom
    const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    if (atMatch) {
      return {
        latitude: parseFloat(atMatch[1]),
        longitude: parseFloat(atMatch[2]),
      }
    }

    // Formato 2: https://maps.google.com/?q=lat,lng
    const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    if (qMatch) {
      return {
        latitude: parseFloat(qMatch[1]),
        longitude: parseFloat(qMatch[2]),
      }
    }

    // Formato 3: https://www.google.com/maps/place/.../@lat,lng,zoom
    const placeMatch = url.match(/place\/[^@]+@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    if (placeMatch) {
      return {
        latitude: parseFloat(placeMatch[1]),
        longitude: parseFloat(placeMatch[2]),
      }
    }

    // Formato 4: https://www.google.com/maps/search/?api=1&query=lat,lng
    const searchMatch = url.match(/query=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    if (searchMatch) {
      return {
        latitude: parseFloat(searchMatch[1]),
        longitude: parseFloat(searchMatch[2]),
      }
    }

    // Formato 5: https://maps.app.goo.gl/... (link corto)
    // Para estos links, necesitaríamos hacer una petición HTTP para obtener la URL real
    // Por ahora, retornamos null y el usuario puede ingresar las coordenadas manualmente
    if (url.includes('goo.gl') || url.includes('maps.app.goo.gl')) {
      return null // Link corto, no podemos extraer sin resolver primero
    }

    return null
  } catch (error) {
    console.error('Error extracting coordinates from URL:', error)
    return null
  }
}

/**
 * Intenta resolver un link corto de Google Maps y extraer coordenadas
 * Usa el endpoint del servidor para evitar problemas de CORS
 */
export async function resolveShortUrlAndExtractCoordinates(shortUrl) {
  try {
    // Usar el endpoint del servidor para resolver la URL
    const response = await $fetch('/api/google-maps/resolve', {
      method: 'POST',
      body: { url: shortUrl },
    })

    if (response && response.finalUrl) {
      // Intentar extraer coordenadas de la URL final
      return extractCoordinatesFromGoogleMapsUrl(response.finalUrl)
    }

    return null
  } catch (error) {
    console.error('Error resolving short URL:', error)
    return null
  }
}

export const useGoogleMaps = () => {
  return {
    extractCoordinatesFromGoogleMapsUrl,
    resolveShortUrlAndExtractCoordinates,
  }
}


