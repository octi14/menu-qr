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

    // Verificar si ya existe
    const existing = await db.collection('favorites').findOne({
      userId,
      businessId,
    })

    if (existing) {
      return { success: true, message: 'Ya está en favoritos', isFavorite: true }
    }

    // Agregar a favoritos
    await db.collection('favorites').insertOne({
      userId,
      businessId,
      createdAt: new Date(),
    })

    return { success: true, message: 'Agregado a favoritos', isFavorite: true }
  } catch (error) {
    console.error('Error adding favorite:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Error al agregar a favoritos',
    })
  }
})

