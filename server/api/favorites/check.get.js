import { getDatabase } from '~/server/utils/mongodb'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  const businessId = query.businessId

  if (!businessId) {
    throw createError({
      statusCode: 400,
      message: 'businessId es requerido',
    })
  }

  try {
    const db = await getDatabase()
    if (!db) {
      throw createError({
        statusCode: 500,
        message: 'Error de conexión con la base de datos',
      })
    }

    const userId = user._id.toString()

    const favorite = await db.collection('favorites').findOne({
      userId,
      businessId,
    })

    return { isFavorite: !!favorite }
  } catch (error) {
    console.error('Error checking favorite:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Error al verificar favorito',
    })
  }
})

