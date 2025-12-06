import { getDatabase } from '~/server/utils/mongodb'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  
  // Solo admins pueden ver todos los tickets
  if (user.role !== 'admin' && user.email !== 'gonzalezoctavio5@gmail.com') {
    throw createError({
      statusCode: 403,
      message: 'No tenés permisos para ver los tickets',
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

    const query = getQuery(event)
    const status = query.status // 'pending', 'in_progress', 'resolved', 'closed'
    const type = query.type // 'delete_business', 'support', etc.

    const filter = {}
    if (status) {
      filter.status = status
    }
    if (type) {
      filter.type = type
    }

    const tickets = await db.collection('tickets')
      .find(filter)
      .sort({ createdAt: -1 }) // Más recientes primero
      .toArray()

    return tickets.map(ticket => {
      const { _id, ...rest } = ticket
      return {
        ...rest,
        id: _id.toString(),
      }
    })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al obtener los tickets',
    })
  }
})

