export const useBusinesses = () => {
  const fetchBusinessBySlug = async (slug) => {
    try {
      const business = await $fetch(`/api/businesses?slug=${slug}`)
      return business
    } catch (error) {
      console.error('Error fetching business from API:', error)
      // Si es un 404, retornar null
      if (error.statusCode === 404 || error.status === 404) {
        return null
      }
      // Para otros errores, intentar con el endpoint alternativo
      try {
        const business = await $fetch(`/api/businesses/${slug}`)
        return business
      } catch (secondError) {
        console.error('Error fetching business from alternative endpoint:', secondError)
        return null
      }
    }
  }

  const fetchAllBusinesses = async () => {
    try {
      // Obtener userId del localStorage
      let userId = null
      if (process.client) {
        const auth = localStorage.getItem('qrmenu-auth')
        if (auth) {
          try {
            const parsed = JSON.parse(auth)
            userId = parsed.userId
          } catch {
            // Si no hay userId, continuar sin él
          }
        }
      }
      
      const url = userId ? `/api/businesses?userId=${userId}` : '/api/businesses'
      console.log('fetchAllBusinesses: Fetching from:', url)
      const businesses = await $fetch(url)
      console.log('fetchAllBusinesses: Received', businesses?.length || 0, 'businesses')
      return businesses || []
    } catch (error) {
      console.error('Error fetching businesses from API:', error)
      console.error('Error details:', {
        statusCode: error.statusCode,
        status: error.status,
        message: error.message,
        data: error.data
      })
      return []
    }
  }

  const saveBusinessToAPI = async (business) => {
    try {
      const response = await $fetch('/api/businesses', {
        method: 'POST',
        body: business,
      })
      // Verificar que la respuesta tenga success: true
      return response?.success === true
    } catch (error) {
      console.error('Error saving business to API:', error)
      throw error // Lanzar el error para que pueda ser manejado en el componente
    }
  }

  const updateBusinessToAPI = async (slug, business) => {
    try {
      console.log(`updateBusinessToAPI: Updating business ${slug}, sections count: ${business.sections?.length || 0}`)
      const response = await $fetch(`/api/businesses/${slug}`, {
        method: 'PUT',
        body: business,
      })
      console.log('updateBusinessToAPI: Update successful', response)
      return true
    } catch (error) {
      console.error('Error updating business to API:', error)
      console.error('Error details:', {
        statusCode: error.statusCode,
        status: error.status,
        message: error.message,
        data: error.data
      })
      throw error // Re-lanzar el error para que pueda ser manejado en el componente
    }
  }

  return {
    fetchBusinessBySlug,
    fetchAllBusinesses,
    saveBusinessToAPI,
    updateBusinessToAPI,
  }
}

