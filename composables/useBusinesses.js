export const useBusinesses = () => {
  const fetchBusinessBySlug = async (slug) => {
    const encoded = encodeURIComponent(slug)
    try {
      const business = await $fetch(`/api/businesses?slug=${encoded}`)
      return business
    } catch (error) {
      console.error('Error fetching business from API:', error)
      if (error.statusCode === 404 || error.status === 404) {
        return null
      }
      try {
        const business = await $fetch(`/api/businesses/${encoded}`)
        return business
      } catch (secondError) {
        console.error('Error fetching business from alternative endpoint:', secondError)
        if (secondError.statusCode === 404 || secondError.status === 404) {
          return null
        }
        throw secondError
      }
    }
  }

  const fetchAllBusinesses = async () => {
    try {
      const { getAuthData } = useAuth()
      const auth = getAuthData()
      const userId = auth?.userId
      
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

