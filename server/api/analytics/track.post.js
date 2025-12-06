import { getDatabase } from '~/server/utils/mongodb'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { businessId, eventType, itemId, sectionId } = body

  if (!businessId || !eventType) {
    throw createError({
      statusCode: 400,
      message: 'businessId y eventType son requeridos',
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

    // Obtener IP del cliente
    const headers = event.node.req.headers
    const clientIP = headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                     headers['x-real-ip'] || 
                     event.node.req.socket?.remoteAddress || 
                     null

    const analyticsEvent = {
      businessId: new ObjectId(businessId),
      eventType, // 'qr_scan', 'menu_view', 'item_view', 'section_view'
      itemId: itemId || null,
      sectionId: sectionId || null,
      timestamp: new Date(),
      userAgent: getRequestHeader(event, 'user-agent') || null,
      ip: clientIP,
    }

    await db.collection('analytics').insertOne(analyticsEvent)

    return { success: true }
  } catch (error) {
    console.error('Error tracking analytics:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al registrar el evento',
    })
  }
})

