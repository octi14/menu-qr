import { getQuery } from 'h3'
import { getAllBusinesses } from '~/server/utils/db/businesses'
import { getDatabase } from '~/server/utils/mongodb'
import { ObjectId } from 'mongodb'
import { haversineKm } from '~/server/utils/geo'

const MIN_RADIUS_KM = 0.5
const MAX_RADIUS_KM = 50

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const lat = parseFloat(query.lat)
    const lng = parseFloat(query.lng)
    let radiusKm = parseFloat(query.radiusKm ?? query.radius ?? '')

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Se requieren lat y lng (números válidos) para listar comercios cercanos.',
      })
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw createError({
        statusCode: 400,
        statusMessage: 'lat o lng fuera de rango.',
      })
    }

    if (!Number.isFinite(radiusKm) || radiusKm <= 0) {
      radiusKm = 10
    }
    radiusKm = Math.min(Math.max(radiusKm, MIN_RADIUS_KM), MAX_RADIUS_KM)

    const db = await getDatabase()
    if (!db) {
      console.warn('public.get.js: No database connection available')
      return []
    }

    const allBusinesses = await getAllBusinesses(null)
    console.log(`public.get.js: Found ${allBusinesses.length} total businesses (before geo filter)`)

    const publicBusinesses = []

    for (const business of allBusinesses) {
      if (business.isActive === false) {
        continue
      }

      if (!business.userId) {
        publicBusinesses.push({
          ...business,
          isMenuPublic: true,
          menuAccessReason: 'no-user',
        })
        continue
      }

      try {
        const user = await db.collection('users').findOne({
          _id: new ObjectId(business.userId),
        })

        if (!user) {
          publicBusinesses.push({
            ...business,
            isMenuPublic: true,
            menuAccessReason: 'user-not-found',
          })
          continue
        }

        const userPlan = user.plan || 'free'
        const businessWithPlan = {
          ...business,
          ownerPlan: userPlan,
          isEnterprise: userPlan === 'enterprise',
          // En free el menu existe, pero queda en modo demo (no publico)
          isMenuPublic: userPlan !== 'free',
          menuAccessReason: userPlan === 'free' ? 'free-plan' : 'paid-plan',
        }
        publicBusinesses.push(businessWithPlan)
      } catch (error) {
        console.error(`Error checking access for business ${business.slug}:`, error)
        publicBusinesses.push({
          ...business,
          isMenuPublic: true,
          menuAccessReason: 'fallback-on-error',
        })
      }
    }

    const nearby = publicBusinesses.filter((b) => {
      if (b.latitude == null || b.longitude == null) return false
      const la = Number(b.latitude)
      const lo = Number(b.longitude)
      if (!Number.isFinite(la) || !Number.isFinite(lo)) return false
      const d = haversineKm(lat, lng, la, lo)
      return d <= radiusKm
    })

    nearby.sort((a, b) => {
      const da = haversineKm(lat, lng, Number(a.latitude), Number(a.longitude))
      const db = haversineKm(lat, lng, Number(b.latitude), Number(b.longitude))
      return da - db
    })

    console.log(
      `public.get.js: Returning ${nearby.length} public businesses within ${radiusKm} km of (${lat}, ${lng})`,
    )
    return nearby
  } catch (error) {
    if (error?.statusCode) {
      throw error
    }
    console.error('Error fetching public businesses:', error)
    console.error('Error stack:', error.stack)
    return []
  }
})
