import { getDatabase } from '~/server/utils/mongodb'
import { ObjectId } from 'mongodb'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const businessId = getRouterParam(event, 'businessId')

  if (!businessId) {
    throw createError({
      statusCode: 400,
      message: 'businessId es requerido',
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

    // Verificar que el usuario sea dueño del comercio o admin
    const business = await db.collection('businesses').findOne({ 
      _id: new ObjectId(businessId) 
    })

    if (!business) {
      throw createError({
        statusCode: 404,
        message: 'Comercio no encontrado',
      })
    }

    if (business.userId !== user._id.toString() && user.role !== 'admin' && user.email !== 'gonzalezoctavio5@gmail.com') {
      throw createError({
        statusCode: 403,
        message: 'No tenés permisos para ver estos analytics',
      })
    }

    // Obtener eventos de analytics
    const events = await db.collection('analytics')
      .find({ businessId: new ObjectId(businessId) })
      .sort({ timestamp: -1 })
      .toArray()

    // Calcular estadísticas
    const stats = {
      totalQRScans: events.filter(e => e.eventType === 'qr_scan').length,
      totalMenuViews: events.filter(e => e.eventType === 'menu_view').length,
      totalItemViews: events.filter(e => e.eventType === 'item_view').length,
      itemViews: {},
      sectionViews: {},
      dailyStats: {},
      recentEvents: events.slice(0, 50).map(e => ({
        ...e,
        id: e._id.toString(),
        businessId: e.businessId.toString(),
      })),
    }

    // Contar vistas por ítem
    events.filter(e => e.eventType === 'item_view' && e.itemId).forEach(e => {
      stats.itemViews[e.itemId] = (stats.itemViews[e.itemId] || 0) + 1
    })

    // Contar vistas por sección
    events.filter(e => e.eventType === 'section_view' && e.sectionId).forEach(e => {
      stats.sectionViews[e.sectionId] = (stats.sectionViews[e.sectionId] || 0) + 1
    })

    // Estadísticas diarias (últimos 30 días)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    events.filter(e => new Date(e.timestamp) >= thirtyDaysAgo).forEach(e => {
      const date = new Date(e.timestamp).toISOString().split('T')[0]
      if (!stats.dailyStats[date]) {
        stats.dailyStats[date] = { qrScans: 0, menuViews: 0, itemViews: 0 }
      }
      if (e.eventType === 'qr_scan') stats.dailyStats[date].qrScans++
      if (e.eventType === 'menu_view') stats.dailyStats[date].menuViews++
      if (e.eventType === 'item_view') stats.dailyStats[date].itemViews++
    })

    return stats
  } catch (error) {
    console.error('Error fetching analytics:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Error al obtener analytics',
    })
  }
})

