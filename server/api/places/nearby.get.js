// Función para buscar en Overpass API (OpenStreetMap)
async function searchOverpassAPI(lat, lon, radius) {
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["amenity"~"^(restaurant|bar|cafe|fast_food|food_court|ice_cream|pub)$"](around:${radius},${lat},${lon});
      node["shop"~"^(bakery|butcher|confectionery|convenience|supermarket)$"](around:${radius},${lat},${lon});
      way["amenity"~"^(restaurant|bar|cafe|fast_food|food_court|ice_cream|pub)$"](around:${radius},${lat},${lon});
      way["shop"~"^(bakery|butcher|confectionery|convenience|supermarket)$"](around:${radius},${lat},${lon});
    );
    out center meta;
  `

  const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`
  
  try {
    const response = await fetch(overpassUrl, {
      headers: {
        'User-Agent': 'FoodLand/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en Overpass API:', error)
    return null
  }
}

// Función para buscar en Nominatim (OpenStreetMap - búsqueda por nombre)
async function searchNominatim(lat, lon, radius) {
  // Convertir radio de metros a grados aproximados (1 grado ≈ 111km)
  const radiusDegrees = radius / 111000
  
  // Búsquedas por categorías comunes (reducido para evitar rate limiting)
  const searchTerms = [
    'restaurant',
    'bar',
    'cafe',
    'pizzeria',
  ]

  const allResults = []

  for (const term of searchTerms) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(term)}&bounded=1&viewbox=${lon - radiusDegrees},${lat - radiusDegrees},${lon + radiusDegrees},${lat + radiusDegrees}&limit=10&addressdetails=1`
      
      // Crear un AbortController para timeout manual
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'FoodLand/1.0',
        },
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          allResults.push(...data)
        }
      } else {
        // Si la respuesta no es OK, registrar pero continuar
        console.warn(`Nominatim returned ${response.status} for "${term}"`)
      }
      
      // Rate limiting: esperar más tiempo entre requests para evitar bloqueos
      // Nominatim recomienda máximo 1 request por segundo
      await new Promise(resolve => setTimeout(resolve, 1200))
    } catch (error) {
      // Solo registrar errores críticos, no bloquear otras búsquedas
      if (error.name !== 'AbortError' && error.name !== 'TimeoutError') {
        console.warn(`Error buscando "${term}" en Nominatim:`, error.message || error)
      }
      // Continuar con el siguiente término incluso si hay error
      continue
    }
  }

  return allResults
}

// Función para procesar resultados de Overpass
function processOverpassResults(data, lat, lon) {
  const places = []
  const processedIds = new Set()

  if (!data?.elements) return places

  data.elements.forEach((element) => {
    if (processedIds.has(element.id)) return
    processedIds.add(element.id)

    let placeLat, placeLon
    if (element.type === 'node') {
      placeLat = element.lat
      placeLon = element.lon
    } else if (element.type === 'way' && element.center) {
      placeLat = element.center.lat
      placeLon = element.center.lon
    } else {
      return
    }

    // Calcular distancia
    const R = 6371000
    const dLat = (placeLat - lat) * Math.PI / 180
    const dLon = (placeLon - lon) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * Math.PI / 180) * Math.cos(placeLat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    const name = element.tags?.name || element.tags?.['name:es'] || element.tags?.['name:en'] || 'Sin nombre'
    const amenity = element.tags?.amenity || ''
    const shop = element.tags?.shop || ''
    const category = amenity || shop || 'restaurant'

    const categoryMap = {
      restaurant: 'restaurante',
      bar: 'bar',
      cafe: 'cafe',
      fast_food: 'pancheria-hamburgueseria',
      pub: 'cerveceria',
      ice_cream: 'heladeria',
      bakery: 'panaderia',
      butcher: 'parrilla',
      confectionery: 'heladeria',
      convenience: 'otro',
      supermarket: 'otro',
    }

    places.push({
      id: `overpass-${element.id}`,
      name,
      latitude: placeLat,
      longitude: placeLon,
      distance: distance / 1000,
      category: categoryMap[category] || 'otro',
      address: element.tags?.['addr:street'] 
        ? `${element.tags['addr:street']}${element.tags['addr:housenumber'] ? ' ' + element.tags['addr:housenumber'] : ''}, ${element.tags['addr:city'] || element.tags['addr:suburb'] || ''}`
        : null,
      phone: element.tags?.['phone'] || element.tags?.['contact:phone'] || null,
      website: element.tags?.['website'] || element.tags?.['contact:website'] || null,
      isExternal: true,
      source: 'OpenStreetMap (Overpass)',
    })
  })

  return places
}

// Función para procesar resultados de Nominatim
function processNominatimResults(data, lat, lon) {
  const places = []
  const processedCoords = new Set()

  if (!Array.isArray(data)) return places

  data.forEach((place) => {
    if (!place.lat || !place.lon) return

    const placeLat = parseFloat(place.lat)
    const placeLon = parseFloat(place.lon)

    // Evitar duplicados por coordenadas similares
    const coordKey = `${placeLat.toFixed(4)},${placeLon.toFixed(4)}`
    if (processedCoords.has(coordKey)) return
    processedCoords.add(coordKey)

    // Calcular distancia
    const R = 6371000
    const dLat = (placeLat - lat) * Math.PI / 180
    const dLon = (placeLon - lon) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * Math.PI / 180) * Math.cos(placeLat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    const name = place.display_name?.split(',')[0] || place.name || 'Sin nombre'
    const type = place.type || place.class || ''
    
    // Mapear tipos de Nominatim a categorías
    const categoryMap = {
      restaurant: 'restaurante',
      cafe: 'cafe',
      bar: 'bar',
      fast_food: 'pancheria-hamburgueseria',
      pub: 'cerveceria',
      ice_cream: 'heladeria',
      bakery: 'panaderia',
      butcher: 'parrilla',
      confectionery: 'heladeria',
    }

    places.push({
      id: `nominatim-${place.place_id || place.osm_id || Date.now()}-${places.length}`,
      name,
      latitude: placeLat,
      longitude: placeLon,
      distance: distance / 1000,
      category: categoryMap[type] || 'otro',
      address: place.display_name || null,
      phone: place.extratags?.['phone'] || null,
      website: place.extratags?.['website'] || null,
      isExternal: true,
      source: 'OpenStreetMap (Nominatim)',
    })
  })

  return places
}

// Función para eliminar duplicados (mismo nombre y coordenadas similares)
function removeDuplicates(places) {
  const seen = new Map()
  const unique = []

  places.forEach(place => {
    const key = `${place.name.toLowerCase().trim()}-${place.latitude.toFixed(3)}-${place.longitude.toFixed(3)}`
    if (!seen.has(key)) {
      seen.set(key, true)
      unique.push(place)
    }
  })

  return unique
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { latitude, longitude, radius = 3000, type = 'restaurant' } = query

  if (!latitude || !longitude) {
    throw createError({
      statusCode: 400,
      message: 'Latitud y longitud son requeridas',
    })
  }

  try {
    const lat = parseFloat(latitude)
    const lon = parseFloat(longitude)
    const rad = parseInt(radius)

    // Buscar en múltiples fuentes en paralelo
    const [overpassData, nominatimData] = await Promise.all([
      searchOverpassAPI(lat, lon, rad),
      searchNominatim(lat, lon, rad),
    ])

    // Procesar resultados de cada fuente
    const allPlaces = []
    
    if (overpassData) {
      allPlaces.push(...processOverpassResults(overpassData, lat, lon))
    }
    
    if (nominatimData && nominatimData.length > 0) {
      allPlaces.push(...processNominatimResults(nominatimData, lat, lon))
    }

    // Eliminar duplicados
    const uniquePlaces = removeDuplicates(allPlaces)

    // Ordenar por distancia
    uniquePlaces.sort((a, b) => a.distance - b.distance)

    // Limitar a 50 resultados
    return uniquePlaces.slice(0, 50)
  } catch (error) {
    console.error('Error buscando lugares cercanos:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al buscar lugares cercanos',
    })
  }
})

