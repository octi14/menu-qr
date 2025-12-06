import { getDatabase } from '~/server/utils/mongodb'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.userId) {
    throw createError({
      statusCode: 400,
      message: 'UserId es requerido',
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

    const updateData = {
      updatedAt: new Date(),
    }

    if (body.name !== undefined) {
      updateData.name = body.name
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(body.userId) },
      { $set: updateData }
    )

    return {
      success: true,
      message: 'Perfil actualizado exitosamente',
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error updating user profile:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al actualizar el perfil',
    })
  }
})


