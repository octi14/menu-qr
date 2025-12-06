import { saveBusiness } from '~/server/utils/db/businesses'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.slug || !body.name) {
      throw createError({
        statusCode: 400,
        message: 'Slug and name are required',
      })
    }

    if (!body.userId || body.userId.trim() === '') {
      throw createError({
        statusCode: 400,
        message: 'UserId is required',
      })
    }

    const success = await saveBusiness(body)

    if (!success) {
      throw createError({
        statusCode: 500,
        message: 'Failed to save business',
      })
    }

    return { success: true, business: body }
  } catch (error) {
    // Si ya es un error de h3, re-lanzarlo
    if (error.statusCode) {
      throw error
    }
    // Si es otro tipo de error, convertirlo
    console.error('Error in businesses POST API:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al guardar comercio',
    })
  }
})

