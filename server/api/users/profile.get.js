import { getDatabase } from '~/server/utils/mongodb'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId

  if (!userId) {
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

    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId),
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'Usuario no encontrado',
      })
    }

    const { password, resetPasswordToken, resetPasswordExpiry, ...userWithoutSensitive } = user

    // Si es el admin, forzar plan enterprise
    let userPlan = user.plan || 'free'
    if (user.email === 'gonzalezoctavio5@gmail.com') {
      userPlan = 'enterprise'
    }

    return {
      user: {
        ...userWithoutSensitive,
        id: user._id.toString(),
        plan: userPlan,
      },
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error fetching user profile:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al obtener el perfil',
    })
  }
})


