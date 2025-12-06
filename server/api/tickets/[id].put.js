import { getDatabase } from '~/server/utils/mongodb'
import { ObjectId } from 'mongodb'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  
  // Solo admins pueden actualizar tickets
  if (user.role !== 'admin' && user.email !== 'gonzalezoctavio5@gmail.com') {
    throw createError({
      statusCode: 403,
      message: 'No tenés permisos para actualizar tickets',
    })
  }

  const ticketId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!ticketId) {
    throw createError({
      statusCode: 400,
      message: 'ID del ticket es requerido',
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

    if (body.status) {
      updateData.status = body.status
    }
    if (body.priority) {
      updateData.priority = body.priority
    }
    if (body.response) {
      updateData.response = body.response
      updateData.respondedBy = user.email
      updateData.respondedAt = new Date()
    }

    const result = await db.collection('tickets').updateOne(
      { _id: new ObjectId(ticketId) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        message: 'Ticket no encontrado',
      })
    }

    // Si el ticket es de eliminación y se marca como resuelto, eliminar el comercio
    if (body.status === 'resolved' && body.deleteBusiness) {
      const ticket = await db.collection('tickets').findOne({ _id: new ObjectId(ticketId) })
      if (ticket && ticket.businessId) {
        // Eliminar el comercio completamente
        await db.collection('businesses').deleteOne({ _id: new ObjectId(ticket.businessId) })
        // Actualizar el ticket con mensaje de confirmación
        await db.collection('tickets').updateOne(
          { _id: new ObjectId(ticketId) },
          { 
            $set: { 
              response: ticket.response ? ticket.response + '\n\nComercio eliminado exitosamente.' : 'Comercio eliminado exitosamente.',
              respondedBy: user.email,
              respondedAt: new Date()
            } 
          }
        )
      }
    }

    return {
      success: true,
      message: 'Ticket actualizado correctamente',
    }
  } catch (error) {
    console.error('Error updating ticket:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Error al actualizar el ticket',
    })
  }
})

