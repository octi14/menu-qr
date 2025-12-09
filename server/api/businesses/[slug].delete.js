import { deleteBusiness } from '~/server/utils/db/businesses'
import { getBusinessBySlug } from '~/server/utils/db/businesses'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required',
    })
  }

  // Verificar autenticación
  const user = await requireAuth(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  // Obtener el comercio para verificar que el usuario sea el dueño
  const business = await getBusinessBySlug(slug)
  if (!business) {
    throw createError({
      statusCode: 404,
      message: 'Business not found',
    })
  }

  // Verificar que el usuario sea el dueño del comercio (o admin)
  if (business.userId !== user.id && user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden: You can only delete your own businesses',
    })
  }

  // Eliminar el comercio
  const success = await deleteBusiness(slug)

  if (!success) {
    throw createError({
      statusCode: 500,
      message: 'Failed to delete business',
    })
  }

  // También eliminar datos relacionados (analytics, favoritos, etc.)
  // TODO: Implementar limpieza de datos relacionados si es necesario

  return { success: true, message: 'Business deleted successfully' }
})



