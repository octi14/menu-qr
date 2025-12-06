import { getDatabase } from '~/server/utils/mongodb'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.email) {
    throw createError({
      statusCode: 400,
      message: 'Email es requerido',
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
      email: body.email.toLowerCase().trim(),
    })

    // Por seguridad, siempre retornamos éxito aunque el usuario no exista
    if (user) {
      // Generar token de recuperación
      const resetToken = crypto.randomBytes(32).toString('hex')
      const resetTokenExpiry = new Date()
      resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1) // Válido por 1 hora

      // Guardar token en la base de datos
      await db.collection('users').updateOne(
        { _id: user._id },
        {
          $set: {
            resetPasswordToken: resetToken,
            resetPasswordExpiry: resetTokenExpiry,
          },
        }
      )

      // En producción, aquí enviarías un email con el link:
      // const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`
      // await sendEmail(user.email, 'Recuperar contraseña', resetUrl)
      
      console.log(`Reset password token for ${user.email}: ${resetToken}`)
      console.log(`Reset URL: /reset-password?token=${resetToken}`)
    }

    return {
      success: true,
      message: 'Si el email existe, recibirás un link para restablecer tu contraseña',
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error in forgot password:', error)
    // Por seguridad, siempre retornamos éxito
    return {
      success: true,
      message: 'Si el email existe, recibirás un link para restablecer tu contraseña',
    }
  }
})


