import { getDatabase } from '~/server/utils/mongodb'
import { ObjectId } from 'mongodb'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const addressId = getRouterParam(event, 'id')

  if (!addressId) {
    throw createError({
      statusCode: 400,
      message: 'ID de dirección es requerido',
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

    // Verificar que la dirección pertenece al usuario
    const address = await db.collection('savedAddresses').findOne({
      _id: new ObjectId(addressId),
      userId,
    })

    if (!address) {
      throw createError({
        statusCode: 404,
        message: 'Dirección no encontrada',
      })
    }

    await db.collection('savedAddresses').deleteOne({
      _id: new ObjectId(addressId),
      userId,
    })

    return { success: true, message: 'Dirección eliminada correctamente' }
  } catch (error) {
    console.error('Error deleting address:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Error al eliminar la dirección',
    })
  }
})

