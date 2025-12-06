import { saveBusiness } from '~/server/utils/db/businesses'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const body = await readBody(event)

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required',
    })
  }

  if (body.slug !== slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug mismatch',
    })
  }

  const success = await saveBusiness(body)

  if (!success) {
    throw createError({
      statusCode: 500,
      message: 'Failed to update business',
    })
  }

  return { success: true, business: body }
})

