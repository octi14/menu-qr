export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.latitude || !body.longitude) {
    throw createError({
      statusCode: 400,
      message: 'Latitud y longitud son requeridas',
    })
  }

  try {
    // Usar Nominatim para geocodificación inversa (coordenadas -> dirección)
    const lat = parseFloat(body.latitude)
    const lng = parseFloat(body.longitude)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    
    const response = await fetch(url, {
      headers: {
          'User-Agent': 'MapaMorfi/1.0', // Nominatim requiere User-Agent
      },
    })

    if (!response.ok) {
      throw new Error('Error en la geocodificación inversa')
    }

    const data = await response.json()

    if (data && data.display_name) {
      return {
        success: true,
        address: data.display_name,
        addressDetails: data.address,
      }
    }

    return {
      success: false,
      message: 'No se pudo obtener la dirección',
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al obtener la dirección',
    })
  }
})

