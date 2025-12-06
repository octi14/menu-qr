import { getDatabase } from '~/server/utils/mongodb'
import { ObjectId } from 'mongodb'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  if (!body.businessId) {
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
    const businessId = body.businessId

    // Eliminar de favoritos
    const result = await db.collection('favorites').deleteOne({
      userId,
      businessId,
    })

    return { success: true, message: 'Eliminado de favoritos', isFavorite: false }
  } catch (error) {
    console.error('Error removing favorite:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Error al eliminar de favoritos',
    })
  }
})

