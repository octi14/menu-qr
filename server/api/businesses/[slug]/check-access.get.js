import { getBusinessBySlug } from '~/server/utils/db/businesses'
import { getDatabase } from '~/server/utils/mongodb'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug es requerido',
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

    // Obtener el comercio
    const business = await getBusinessBySlug(slug)
    if (!business) {
      throw createError({
        statusCode: 404,
        message: 'Comercio no encontrado',
      })
    }

    // Si no tiene userId, permitir acceso (compatibilidad con datos antiguos)
    if (!business.userId) {
      return {
        isPublic: true,
        reason: 'no-user',
        ownerPlan: null, // No hay plan si no hay usuario
      }
    }

    // Obtener el usuario propietario
    const user = await db.collection('users').findOne({
      _id: new ObjectId(business.userId),
    })

    if (!user) {
      // Si el usuario no existe, permitir acceso (compatibilidad)
      return {
        isPublic: true,
        reason: 'user-not-found',
        ownerPlan: null, // No hay plan si no hay usuario
      }
    }

    // Verificar el plan del usuario
    const userPlan = user.plan || 'free'

    // Si el plan es "free", el menú no es público (solo demo)
    if (userPlan === 'free') {
      return {
        isPublic: false,
        reason: 'free-plan',
        plan: userPlan,
        ownerPlan: userPlan, // Incluir el plan del propietario
      }
    }

    // Si el comercio está inactivo, no es público
    if (business.isActive === false) {
      return {
        isPublic: false,
        reason: 'inactive',
        ownerPlan: userPlan, // Incluir el plan del propietario
      }
    }

    // Para otros planes, el menú es público
    return {
      isPublic: true,
      reason: 'paid-plan',
      plan: userPlan,
      ownerPlan: userPlan, // Incluir el plan del propietario
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error checking business access:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al verificar acceso al comercio',
    })
  }
})


