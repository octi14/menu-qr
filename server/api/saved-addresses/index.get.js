import { getDatabase } from '~/server/utils/mongodb'
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

    const userId = user._id.toString()
    
    const addresses = await db.collection('savedAddresses').find({
      userId,
    }).sort({ createdAt: -1 }).toArray()

    return addresses.map(addr => ({
      id: addr._id.toString(),
      name: addr.name,
      address: addr.address,
      latitude: addr.latitude,
      longitude: addr.longitude,
      createdAt: addr.createdAt,
    }))
  } catch (error) {
    console.error('Error fetching saved addresses:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Error al obtener direcciones guardadas',
    })
  }
})

