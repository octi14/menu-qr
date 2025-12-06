import { getAllBusinesses, getBusinessBySlug } from '~/server/utils/db/businesses'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const slug = query.slug
    const userId = query.userId

    if (slug) {
      const business = await getBusinessBySlug(slug)
      if (!business) {
        throw createError({
          statusCode: 404,
          message: 'Business not found',
        })
      }
      return business
    }

    // Si hay userId válido, filtrar por usuario
    const validUserId = userId && userId.trim() !== '' ? userId : null
    console.log(`index.get.js: Fetching businesses for userId: ${validUserId || 'all'}`)
    const businesses = await getAllBusinesses(validUserId)
    console.log(`index.get.js: Returning ${businesses.length} businesses`)
    return businesses
  } catch (error) {
    // Si ya es un error de h3, re-lanzarlo
    if (error.statusCode) {
      throw error
    }
    // Si es otro tipo de error, convertirlo
    console.error('Error in businesses API:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al obtener comercios',
    })
  }
})

