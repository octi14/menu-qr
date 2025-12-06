import { getDatabase } from '~/server/utils/mongodb'
import { ObjectId } from 'mongodb'
import { verifyPassword, hashPassword } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.userId || !body.currentPassword || !body.newPassword) {
    throw createError({
      statusCode: 400,
      message: 'UserId, contraseña actual y nueva contraseña son requeridos',
    })
  }

  if (body.newPassword.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'La nueva contraseña debe tener al menos 6 caracteres',
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

    // Buscar usuario
    const user = await db.collection('users').findOne({
      _id: new ObjectId(body.userId),
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'Usuario no encontrado',
      })
    }

    // Verificar que el usuario tenga provider email
    if (user.provider && user.provider !== 'email') {
      throw createError({
        statusCode: 400,
        message: 'Este usuario no puede cambiar la contraseña porque se registró con un método de autenticación diferente',
      })
    }

    // Verificar contraseña actual
    if (!user.password) {
      throw createError({
        statusCode: 401,
        message: 'Contraseña actual incorrecta',
      })
    }

    // Si la contraseña no está hasheada (migración), rechazar
    if (!user.password.startsWith('$2')) {
      throw createError({
        statusCode: 401,
        message: 'Por favor, restablecé tu contraseña primero',
      })
    }

    const isPasswordValid = await verifyPassword(body.currentPassword, user.password)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: 'Contraseña actual incorrecta',
      })
    }

    // Hashear nueva contraseña
    const hashedNewPassword = await hashPassword(body.newPassword)

    // Actualizar contraseña
    await db.collection('users').updateOne(
      { _id: new ObjectId(body.userId) },
      {
        $set: {
          password: hashedNewPassword,
          updatedAt: new Date(),
        },
      }
    )

    return {
      success: true,
      message: 'Contraseña actualizada exitosamente',
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error changing password:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al cambiar la contraseña',
    })
  }
})

