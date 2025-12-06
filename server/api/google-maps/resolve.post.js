export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.url || typeof body.url !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'URL es requerida',
    })
  }

  try {
    // Hacer una petición para seguir los redirects y obtener la URL final
    const response = await fetch(body.url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    // Obtener la URL final después de todos los redirects
    const finalUrl = response.url

    return {
      success: true,
      finalUrl,
    }
  } catch (error) {
    console.error('Error resolving Google Maps URL:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al resolver la URL de Google Maps',
    })
  }
})

