import { getDatabase } from '~/server/utils/mongodb'
import { ObjectId } from 'mongodb'
import { requireAuth } from '~/server/utils/auth'

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

    // Obtener favoritos del usuario
    const favorites = await db.collection('favorites').find({
      userId: user._id.toString(),
    }).toArray()

    // Obtener los comercios favoritos
    const businessIds = favorites.map(fav => new ObjectId(fav.businessId))
    const businesses = await db.collection('businesses').find({
      _id: { $in: businessIds },
    }).toArray()

    return businesses.map(business => {
      const { _id, ...rest } = business
      return {
        ...rest,
        id: _id.toString(),
      }
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Error al obtener favoritos',
    })
  }
})

