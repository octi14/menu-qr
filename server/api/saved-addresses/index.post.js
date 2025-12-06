import { getDatabase } from '~/server/utils/mongodb'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  if (!body.name || !body.address || typeof body.latitude !== 'number' || typeof body.longitude !== 'number') {
    throw createError({
      statusCode: 400,
      message: 'Nombre, dirección, latitud y longitud son requeridos',
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

    const savedAddress = {
      userId,
      name: body.name.trim(),
      address: body.address.trim(),
      latitude: body.latitude,
      longitude: body.longitude,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('savedAddresses').insertOne(savedAddress)

    return {
      success: true,
      address: {
        id: result.insertedId.toString(),
        ...savedAddress,
      },
    }
  } catch (error) {
    console.error('Error saving address:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Error al guardar la dirección',
    })
  }
})

