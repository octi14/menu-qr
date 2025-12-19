export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchTerm = query.q

  if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length < 3) {
    return []
  }

  try {
    const trimmedSearch = searchTerm.trim()
    
    // Función para normalizar direcciones argentinas
    const normalizeAddress = (address) => {
      let normalized = address.trim()
      
      // Normalizar "Calle" a "Calle"
      normalized = normalized.replace(/^calle\s+/i, 'Calle ')
      
      // Normalizar números de calle (ej: "calle 13" -> "Calle 13")
      normalized = normalized.replace(/calle\s+(\d+)/gi, 'Calle $1')
      
      // Normalizar "Av." o "Avenida" a "Avenida"
      normalized = normalized.replace(/\b(av\.?|avenida)\s+/gi, 'Avenida ')
      
      // Normalizar "Berazategui" (puede estar escrito de diferentes formas)
      normalized = normalized.replace(/berazategui/gi, 'Berazategui')
      
      return normalized
    }
    
    // Función para generar variaciones de búsqueda
    const generateSearchVariations = (address) => {
      const variations = []
      const normalized = normalizeAddress(address)
      
      // 1. Búsqueda original
      variations.push(normalized)
      
      // 2. Detectar y separar número de casa
      const numberMatch = normalized.match(/^(.+?)\s+(\d+)\s*$/i)
      if (numberMatch) {
        const streetPart = numberMatch[1].trim()
        const houseNumber = numberMatch[2]
        
        // Sin número de casa
        variations.push(streetPart)
        
        // Con número pero sin ciudad (si tiene ciudad)
        if (normalized.includes(',')) {
          const parts = normalized.split(',')
          if (parts.length > 1) {
            variations.push(`${streetPart}, ${parts.slice(1).join(',').trim()}`)
          }
        }
      }
      
      // 3. Agregar "Berazategui" si no está
      if (!normalized.toLowerCase().includes('berazategui')) {
        variations.push(`${normalized}, Berazategui`)
        variations.push(`${normalized}, Berazategui, Buenos Aires`)
        variations.push(`${normalized}, Berazategui, Argentina`)
      }
      
      // 4. Agregar "Buenos Aires" si no está
      if (!normalized.toLowerCase().includes('buenos aires') && !normalized.toLowerCase().includes('bs as')) {
        if (normalized.toLowerCase().includes('berazategui')) {
          variations.push(`${normalized}, Buenos Aires`)
          variations.push(`${normalized}, Argentina`)
        }
      }
      
      return [...new Set(variations)] // Eliminar duplicados
    }
    
    // Función para buscar en Nominatim
    const searchNominatim = async (query, limit = 10) => {
      const encodedSearch = encodeURIComponent(query)
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedSearch}&limit=${limit}&addressdetails=1&countrycodes=ar,uy,cl,py,bo,pe,co,ec,ve&extratags=1`
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MapaMorfi/1.0',
        },
      })

      if (!response.ok) {
        return []
      }

      const data = await response.json()
      return data.map((result) => ({
        displayName: result.display_name,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        address: result.address,
        importance: result.importance || 0,
        type: result.type || '',
        class: result.class || '',
      }))
    }

    // Generar todas las variaciones de búsqueda
    const searchVariations = generateSearchVariations(trimmedSearch)
    
    // Buscar con todas las variaciones en paralelo
    const searchPromises = searchVariations.slice(0, 5).map(variation => 
      searchNominatim(variation, 10)
    )
    
    const allResults = await Promise.all(searchPromises)
    
    // Combinar todos los resultados
    let results = []
    for (const resultSet of allResults) {
      results = [...results, ...resultSet]
    }
    
    // Eliminar duplicados (misma lat/lng)
    const uniqueResults = results.filter((item, index, self) => 
      index === self.findIndex((t) => 
        Math.abs(t.latitude - item.latitude) < 0.0001 && 
        Math.abs(t.longitude - item.longitude) < 0.0001
      )
    )
    
    // Ordenar por importancia y relevancia
    // Priorizar resultados que contengan palabras clave de la búsqueda
    const searchWords = trimmedSearch.toLowerCase().split(/\s+/).filter(w => w.length > 2)
    uniqueResults.sort((a, b) => {
      const aName = a.displayName.toLowerCase()
      const bName = b.displayName.toLowerCase()
      
      // Contar coincidencias de palabras clave
      const aMatches = searchWords.filter(word => aName.includes(word)).length
      const bMatches = searchWords.filter(word => bName.includes(word)).length
      
      // Priorizar por coincidencias, luego por importancia
      if (aMatches !== bMatches) {
        return bMatches - aMatches
      }
      
      return (b.importance || 0) - (a.importance || 0)
    })
    
    results = uniqueResults

    // Limitar a 5 resultados y eliminar duplicados finales
    const finalResults = results
      .filter((item, index, self) => 
        index === self.findIndex((t) => 
          t.latitude === item.latitude && t.longitude === item.longitude
        )
      )
      .slice(0, 5)
      .map((result) => ({
        displayName: result.displayName,
        latitude: result.latitude,
        longitude: result.longitude,
        address: result.address,
      }))

    return finalResults
  } catch (error) {
    console.error('Error searching addresses:', error)
    return []
  }
})

