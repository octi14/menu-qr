/**
 * Composable para caché de menús en localStorage
 */
export const useMenuCache = () => {
  const CACHE_PREFIX = 'foodland-menu-cache-'
  const CACHE_VERSION = '1.0'
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 horas en milisegundos

  /**
   * Obtener menú del caché
   * @param {string} slug - Slug del comercio
   * @returns {Object|null} - Menú en caché o null si no existe o expiró
   */
  const getCachedMenu = (slug) => {
    if (!process.client || !slug) return null

    try {
      const cacheKey = `${CACHE_PREFIX}${slug}`
      const cached = localStorage.getItem(cacheKey)
      
      if (!cached) return null

      const { data, timestamp, version } = JSON.parse(cached)
      
      // Verificar versión del caché
      if (version !== CACHE_VERSION) {
        localStorage.removeItem(cacheKey)
        return null
      }

      // Verificar si expiró
      const now = Date.now()
      if (now - timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(cacheKey)
        return null
      }

      return data
    } catch (error) {
      console.error('Error reading menu cache:', error)
      return null
    }
  }

  /**
   * Guardar menú en caché
   * @param {string} slug - Slug del comercio
   * @param {Object} menuData - Datos del menú a guardar
   */
  const setCachedMenu = (slug, menuData) => {
    if (!process.client || !slug || !menuData) return

    try {
      const cacheKey = `${CACHE_PREFIX}${slug}`
      const cacheData = {
        data: menuData,
        timestamp: Date.now(),
        version: CACHE_VERSION
      }
      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error saving menu cache:', error)
      // Si hay error (puede ser por quota excedida), intentar limpiar cachés viejos
      clearExpiredCaches()
    }
  }

  /**
   * Invalidar caché de un menú específico
   * @param {string} slug - Slug del comercio
   */
  const invalidateCache = (slug) => {
    if (!process.client || !slug) return

    try {
      const cacheKey = `${CACHE_PREFIX}${slug}`
      localStorage.removeItem(cacheKey)
    } catch (error) {
      console.error('Error invalidating menu cache:', error)
    }
  }

  /**
   * Limpiar todos los cachés expirados
   */
  const clearExpiredCaches = () => {
    if (!process.client) return

    try {
      const now = Date.now()
      const keysToRemove = []

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(CACHE_PREFIX)) {
          try {
            const cached = JSON.parse(localStorage.getItem(key))
            if (cached.version !== CACHE_VERSION || (now - cached.timestamp > CACHE_EXPIRY)) {
              keysToRemove.push(key)
            }
          } catch {
            // Si hay error parseando, eliminar la key
            keysToRemove.push(key)
          }
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Error clearing expired caches:', error)
    }
  }

  /**
   * Limpiar todos los cachés (útil para debugging)
   */
  const clearAllCaches = () => {
    if (!process.client) return

    try {
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(CACHE_PREFIX)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Error clearing all caches:', error)
    }
  }

  return {
    getCachedMenu,
    setCachedMenu,
    invalidateCache,
    clearExpiredCaches,
    clearAllCaches
  }
}



