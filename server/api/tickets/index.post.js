import { getDatabase } from '~/server/utils/mongodb'
import { ObjectId } from 'mongodb'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.type || !body.subject || !body.message) {
    throw createError({
      statusCode: 400,
      message: 'Tipo, asunto y mensaje son requeridos',
    })
  }

  // Validar email si no hay autenticación
  if (!body.email && !event.context.user) {
    throw createError({
      statusCode: 400,
      message: 'Email es requerido para usuarios no autenticados',
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

    // Intentar obtener usuario autenticado (opcional)
    let user = null
    let userId = null
    let userEmail = null

    try {
      user = await requireAuth(event)
      userId = user._id ? user._id.toString() : user.id
      userEmail = user.email
    } catch {
      // Si no está autenticado, usar email del body
      userEmail = body.email
      userId = null
    }

    // Validar email
    if (!userEmail || !userEmail.includes('@')) {
      throw createError({
        statusCode: 400,
        message: 'Email válido es requerido',
      })
    }

    const ticket = {
      userId: userId,
      userEmail: userEmail,
      userName: body.name || null, // Nombre del usuario (para contactos no autenticados)
      type: body.type, // 'delete_business', 'support', 'feature_request', etc.
      subject: body.subject,
      message: body.message,
      businessId: body.businessId || null,
      businessSlug: body.businessSlug || null,
      status: 'pending', // 'pending', 'in_progress', 'resolved', 'closed'
      priority: body.priority || 'medium', // 'low', 'medium', 'high', 'urgent'
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('tickets').insertOne(ticket)

    return {
      success: true,
      ticket: {
        ...ticket,
        id: result.insertedId.toString(),
      },
    }
  } catch (error) {
    console.error('Error creating ticket:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al crear el ticket',
    })
  }
})

