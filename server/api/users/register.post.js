import { getDatabase } from '~/server/utils/mongodb'
import { hashPassword } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      message: 'Email y contraseña son requeridos',
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

    // Verificar si el email ya existe
    const existingUser = await db.collection('users').findOne({
      email: body.email.toLowerCase().trim(),
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'Este email ya está registrado',
      })
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword(body.password)

    // Crear nuevo usuario
    const newUser = {
      email: body.email.toLowerCase().trim(),
      password: hashedPassword,
      name: body.name || undefined,
      role: 'user',
      plan: 'free', // Plan por defecto (gratis)
      provider: 'email', // Provider de autenticación
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('users').insertOne(newUser)

    return {
      success: true,
      message: 'Usuario creado exitosamente',
      userId: result.insertedId.toString(),
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error registering user:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al crear el usuario',
    })
  }
})

