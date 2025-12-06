import { getBusinessBySlug } from '~/server/utils/db/businesses'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required',
    })
  }

  const business = await getBusinessBySlug(slug)

  if (!business) {
    throw createError({
      statusCode: 404,
      message: 'Business not found',
    })
  }

  return business
})

