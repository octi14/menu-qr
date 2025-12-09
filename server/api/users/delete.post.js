import { getDatabase } from '~/server/utils/mongodb'
import { requireAuth } from '~/server/utils/auth'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  try {
    const db = await getDatabase()
    if (!db) {
      throw createError({
        statusCode: 500,
        message: 'Error de conexión con la base de datos',
      })
    }

    const userId = user._id
    const userIdString = userId.toString()

    // Obtener todos los comercios del usuario para eliminar datos relacionados
    const userBusinesses = await db.collection('businesses').find({
      userId: userIdString,
    }).toArray()

    const businessIds = userBusinesses.map(b => b._id)

    // Eliminar analytics de los comercios del usuario
    if (businessIds.length > 0) {
      await db.collection('analytics').deleteMany({
        businessId: { $in: businessIds },
      })
    }

    // Eliminar tickets relacionados con los comercios del usuario
    if (businessIds.length > 0) {
      await db.collection('tickets').deleteMany({
        businessId: { $in: businessIds },
      })
    }

    // Eliminar todos los comercios del usuario
    await db.collection('businesses').deleteMany({
      userId: userIdString,
    })

    // Eliminar direcciones guardadas del usuario
    await db.collection('savedAddresses').deleteMany({
      userId: userIdString,
    })

    // Eliminar favoritos del usuario
    await db.collection('favorites').deleteMany({
      userId: userIdString,
    })

    // Eliminar el usuario
    await db.collection('users').deleteOne({
      _id: userId,
    })

    return {
      success: true,
      message: 'Cuenta eliminada exitosamente',
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error deleting user account:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al eliminar la cuenta',
    })
  }
})

