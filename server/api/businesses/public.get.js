import { getAllBusinesses } from '~/server/utils/db/businesses'
import { getDatabase } from '~/server/utils/mongodb'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  try {
    const db = await getDatabase()
    if (!db) {
      console.warn('public.get.js: No database connection available')
      return []
    }

    // Obtener todos los comercios
    const allBusinesses = await getAllBusinesses(null)
    console.log(`public.get.js: Found ${allBusinesses.length} total businesses`)

    // Filtrar solo los que son públicos
    const publicBusinesses = []

    for (const business of allBusinesses) {
      // Solo incluir si está activo (o si isActive no está definido, asumir que está activo)
      if (business.isActive === false) {
        continue
      }

      // Si no tiene userId, incluir (compatibilidad con datos antiguos)
      if (!business.userId) {
        publicBusinesses.push(business)
        continue
      }

      // Verificar el plan del usuario propietario
      try {
        const user = await db.collection('users').findOne({
          _id: new ObjectId(business.userId),
        })

        if (!user) {
          // Si el usuario no existe, incluir (compatibilidad)
          publicBusinesses.push(business)
          continue
        }

        const userPlan = user.plan || 'free'

        // Incluir todos los comercios activos, independientemente del plan
        // Agregar información del plan para destacar comercios enterprise
        const businessWithPlan = {
          ...business,
          ownerPlan: userPlan,
          isEnterprise: userPlan === 'enterprise',
        }
        publicBusinesses.push(businessWithPlan)
      } catch (error) {
        console.error(`Error checking access for business ${business.slug}:`, error)
        // En caso de error, incluir el comercio de todas formas (mejor mostrar que ocultar)
        publicBusinesses.push(business)
      }
    }

    console.log(`public.get.js: Returning ${publicBusinesses.length} public businesses`)
    return publicBusinesses
  } catch (error) {
    console.error('Error fetching public businesses:', error)
    console.error('Error stack:', error.stack)
    return []
  }
})


