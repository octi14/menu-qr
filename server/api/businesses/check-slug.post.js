import { getDatabase } from '~/server/utils/mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.slug || typeof body.slug !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Slug inválido',
    })
  }

  // Validar formato del slug
  const slugRegex = /^[a-z0-9-]+$/
  if (!slugRegex.test(body.slug)) {
    throw createError({
      statusCode: 400,
      message: 'El slug solo puede contener letras minúsculas, números y guiones',
    })
  }

  try {
    const db = await getDatabase()
    const existing = await db.collection('businesses').findOne({ slug: body.slug })

    return {
      available: !existing,
      slug: body.slug,
    }
  } catch (error) {
    console.error('Error checking slug availability:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al verificar disponibilidad',
    })
  }
})

