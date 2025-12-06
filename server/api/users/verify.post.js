import { getDatabase } from '~/server/utils/mongodb'
import { verifyPassword, generateToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      message: 'Email y contraseña son requeridos',
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

    // Buscar usuario por email
    const user = await db.collection('users').findOne({
      email: body.email.toLowerCase().trim(),
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Credenciales incorrectas',
      })
    }

    // Verificar contraseña (solo si tiene provider email)
    if (user.provider === 'email' || !user.provider) {
      // Si el usuario tiene contraseña sin hashear (migración), actualizarla
      if (user.password && !user.password.startsWith('$2')) {
        // Contraseña antigua sin hashear, rechazar login y pedir reset
        throw createError({
          statusCode: 401,
          message: 'Credenciales incorrectas. Por favor, restablecé tu contraseña.',
        })
      }

      if (!user.password) {
        throw createError({
          statusCode: 401,
          message: 'Credenciales incorrectas',
        })
      }

      const isPasswordValid = await verifyPassword(body.password, user.password)

      if (!isPasswordValid) {
        throw createError({
          statusCode: 401,
          message: 'Credenciales incorrectas',
        })
      }
    } else {
      // Usuario con OAuth, no puede hacer login con contraseña
      throw createError({
        statusCode: 401,
        message: 'Este usuario se registró con un método de autenticación diferente',
      })
    }

    // Generar token JWT
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role || 'user',
    })

    const { password, resetPasswordToken, resetPasswordExpiry, ...userWithoutSensitive } = user

    return {
      user: {
        ...userWithoutSensitive,
        id: user._id.toString(),
      },
      token,
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error verifying user:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al verificar usuario',
    })
  }
})

