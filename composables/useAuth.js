export const useAuth = () => {
  /**
   * Obtiene los datos de autenticación del localStorage
   * @returns {object|null} Datos de autenticación o null
   */
  const getAuth = () => {
    if (!process.client) return null
    
    try {
      const auth = localStorage.getItem('qrmenu-auth')
      if (!auth) return null
      
      const parsed = JSON.parse(auth)
      if (parsed.loggedIn === true && parsed.token) {
        return parsed
      }
      return null
    } catch (error) {
      console.error('Error parsing auth:', error)
      return null
    }
  }

  /**
   * Obtiene el token JWT del localStorage
   * @returns {string|null} Token JWT o null
   */
  const getToken = () => {
    const auth = getAuth()
    return auth?.token || null
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return getAuth() !== null
  }

  /**
   * Realiza una petición autenticada a la API
   * @param {string} url - URL de la API
   * @param {object} options - Opciones para $fetch
   * @returns {Promise} Respuesta de la API
   */
  const authenticatedFetch = async (url, options = {}) => {
    const token = getToken()
    
    if (!token) {
      // Si no hay token, redirigir al login
      if (process.client) {
        await navigateTo('/login')
      }
      throw new Error('No estás autenticado')
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    }

    try {
      return await $fetch(url, {
        ...options,
        headers,
      })
    } catch (error) {
      // Si el error es de autenticación (401), limpiar localStorage y redirigir
      if (error.statusCode === 401 || error.status === 401) {
        if (process.client) {
          localStorage.removeItem('qrmenu-auth')
          await navigateTo('/login')
        }
        // Usar el mensaje del servidor si está disponible, o uno genérico
        const message = error.data?.message || error.message || 'Tu sesión ha expirado. Por favor, iniciá sesión nuevamente.'
        throw new Error(message)
      }
      // Re-lanzar otros errores
      throw error
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  const logout = async () => {
    if (process.client) {
      localStorage.removeItem('qrmenu-auth')
      await navigateTo('/login')
    }
  }

  return {
    getAuth,
    getToken,
    isAuthenticated,
    authenticatedFetch,
    logout,
  }
}

