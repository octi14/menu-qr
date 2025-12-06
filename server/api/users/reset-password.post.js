import { getDatabase } from '~/server/utils/mongodb'
import { hashPassword } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.token || !body.password) {
    throw createError({
      statusCode: 400,
      message: 'Token y contraseña son requeridos',
    })
  }

  if (body.password.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'La contraseña debe tener al menos 6 caracteres',
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

    // Buscar usuario con el token válido
    const user = await db.collection('users').findOne({
      resetPasswordToken: body.token,
      resetPasswordExpiry: { $gt: new Date() }, // Token no expirado
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        message: 'Token inválido o expirado. Por favor, solicitá un nuevo link de recuperación.',
      })
    }

    // Hashear nueva contraseña
    const hashedPassword = await hashPassword(body.password)

    // Actualizar contraseña y limpiar token
    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          provider: 'email', // Asegurar que el provider sea email
          updatedAt: new Date(),
        },
        $unset: {
          resetPasswordToken: '',
          resetPasswordExpiry: '',
        },
      }
    )

    return {
      success: true,
      message: 'Contraseña restablecida exitosamente',
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error resetting password:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al restablecer la contraseña',
    })
  }
})

