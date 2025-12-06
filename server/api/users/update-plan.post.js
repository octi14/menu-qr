import { getDatabase } from '~/server/utils/mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.email || !body.plan) {
    throw createError({
      statusCode: 400,
      message: 'Email y plan son requeridos',
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

    const result = await db.collection('users').updateOne(
      { email: body.email.toLowerCase().trim() },
      { 
        $set: { 
          plan: body.plan,
          updatedAt: new Date(),
        } 
      }
    )

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        message: 'Usuario no encontrado',
      })
    }

    return {
      success: true,
      message: `Plan actualizado a ${body.plan}`,
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error updating user plan:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al actualizar el plan',
    })
  }
})


