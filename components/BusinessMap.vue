<template>
  <div
    class="relative overflow-hidden bg-white dark:bg-slate-900/40"
    :class="
      immersive
        ? 'h-[calc(100dvh-5rem)] w-full rounded-none border-0 shadow-none md:h-[600px] md:rounded-2xl md:border md:border-slate-200 md:dark:border-slate-800 md:shadow-lg'
        : 'rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg'
    "
    :style="immersive ? { zIndex: 1 } : { height: isMobile ? '500px' : '600px', zIndex: 1 }"
  >
    <div ref="mapContainer" class="w-full h-full" style="z-index: 1;"></div>
    <div v-if="!isMapReady" class="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
        <p class="text-sm text-slate-600 dark:text-slate-400">Cargando mapa...</p>
      </div>
    </div>
    <!-- Mensaje cuando no hay comercios cercanos -->
    <div v-if="showNoBusinessesMessage && isMapReady" class="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 px-4 py-3">
      <div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <svg class="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-medium">No hay comercios cerca tuyo</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { getCategoryIcon, getCategoryColor } from '~/composables/useBusinessCategories'

const props = defineProps({
  businesses: {
    type: Array,
    default: () => [],
  },
  userLocation: {
    type: Object,
    default: null,
  },
  /** Texto del popup del marcador de referencia / usuario */
  userLocationLabel: {
    type: String,
    default: 'Tu ubicación',
  },
  center: {
    type: Array,
    default: () => [-34.6037, -58.3816], // Buenos Aires por defecto
  },
  zoom: {
    type: Number,
    default: 13,
  },
  showNoBusinessesMessage: {
    type: Boolean,
    default: false,
  },
  showUserLocationPopup: {
    type: Boolean,
    default: false,
  },
  /** Mapa alto en mobile (pantalla casi completa); en md+ se mantiene 600px */
  immersive: {
    type: Boolean,
    default: false,
  },
})

const mapContainer = ref(null)
let map = null
let markers = []
let userMarker = null
const isMapReady = ref(false)

// Detectar si es mobile
const isMobile = computed(() => {
  if (!process.client) return false
  return window.innerWidth < 768
})

// Iconos personalizados para los marcadores según el rubro o logo
const createBusinessIcon = (categoryId, logoUrl, businessName = '') => {
  if (typeof window === 'undefined' || !window.L) return null
  
  // Si tiene logo, usar el logo como icono
  if (logoUrl) {
    return window.L.divIcon({
      className: 'custom-business-marker-logo',
      html: `
        <div style="
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          overflow: hidden;
          background-color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <img 
            src="${logoUrl}" 
            alt="Logo" 
            style="
              width: 100%;
              height: 100%;
              object-fit: contain;
              padding: 4px;
            "
            onerror="this.parentElement.innerHTML='<div style=\\'width: 100%; height: 100%; border-radius: 50%; background: linear-gradient(135deg, #10b981, #059669); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px;\\'>${(businessName || '?').charAt(0).toUpperCase()}</div>'"
          />
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48],
    })
  }
  
  // Si no tiene logo, usar el icono del rubro o primera letra
  const icon = getCategoryIcon(categoryId)
  const color = getCategoryColor(categoryId)
  const borderColor = 'white'
  const borderWidth = '3px'
  
  // Si no tiene icono de categoría, usar primera letra
  const displayIcon = icon || (businessName || '?').charAt(0).toUpperCase()
  
  return window.L.divIcon({
    className: 'custom-business-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: ${borderWidth} solid ${borderColor};
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      ">
        <div style="
          transform: rotate(45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: white;
          font-weight: bold;
          font-size: 18px;
        ">${displayIcon}</div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  })
}

const createUserIcon = () => {
  if (typeof window === 'undefined' || !window.L) return null
  
  return window.L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="
        background-color: #3b82f6;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

const initMap = async () => {
  if (!process.client) {
    console.error('initMap: No está en el cliente')
    return
  }

  if (!mapContainer.value) {
    console.error('initMap: mapContainer.value es null')
    return
  }

  // Esperar a que el contenedor tenga dimensiones (con timeout máximo)
  let attempts = 0
  const maxAttempts = 50 // 5 segundos máximo
  
  await new Promise((resolve, reject) => {
    const checkSize = () => {
      attempts++
      if (attempts > maxAttempts) {
        console.error('initMap: Timeout esperando dimensiones del contenedor')
        reject(new Error('Timeout'))
        return
      }
      
      if (mapContainer.value) {
        const rect = mapContainer.value.getBoundingClientRect()
        if (rect.width > 0 && rect.height > 0) {
          console.log('initMap: Contenedor tiene dimensiones:', rect.width, 'x', rect.height)
          resolve()
        } else {
          setTimeout(checkSize, 100)
        }
      } else {
        setTimeout(checkSize, 100)
      }
    }
    checkSize()
  }).catch(() => {
    // Continuar de todas formas
    console.warn('initMap: Continuando a pesar del timeout')
  })

  try {
    console.log('initMap: Cargando Leaflet...')
    // Cargar Leaflet dinámicamente
    const L = await import('leaflet')
    
    // Importar estilos CSS de Leaflet
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
      link.crossOrigin = ''
      document.head.appendChild(link)
    }

    // Hacer L disponible globalmente para los iconos
    window.L = L.default

    console.log('initMap: Creando mapa en contenedor:', mapContainer.value)
    // Crear mapa
    map = L.default.map(mapContainer.value, {
      center: props.center,
      zoom: props.zoom,
      zoomControl: true,
    })

    console.log('initMap: Mapa creado, agregando tiles...')
    // Agregar capa de tiles (OpenStreetMap)
    L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    // Invalidar tamaño después de crear el mapa (múltiples veces para asegurar)
    const invalidateSize = () => {
      if (map) {
        map.invalidateSize()
      }
    }
    invalidateSize()
    setTimeout(invalidateSize, 100)
    setTimeout(invalidateSize, 300)
    setTimeout(invalidateSize, 600)

    console.log('initMap: Mapa inicializado correctamente')
    isMapReady.value = true
    updateMarkers()
  } catch (error) {
    console.error('Error inicializando mapa:', error)
    isMapReady.value = true // Marcar como listo para ocultar el spinner
  }
}

const updateMarkers = () => {
  if (!map || !window.L) return

  // Limpiar marcadores existentes
  markers.forEach(marker => map.removeLayer(marker))
  markers = []

  // Agregar marcadores de comercios
  props.businesses.forEach(business => {
    if (business.latitude && business.longitude) {
      const marker = window.L.marker([business.latitude, business.longitude], {
        icon: createBusinessIcon(business.category || 'otro', business.logoUrl, business.name),
      }).addTo(map)

      // Función para verificar si está abierto
      const isOpenNow = (business) => {
        if (!business.openingHours) return null // No hay información
        
        const now = new Date()
        const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
        const today = dayNames[now.getDay()]
        const todayHours = business.openingHours[today]
        
        if (!todayHours || todayHours.closed) return false
        
        const [openHour, openMin] = todayHours.open.split(':').map(Number)
        const [closeHour, closeMin] = todayHours.close.split(':').map(Number)
        const currentHour = now.getHours()
        const currentMin = now.getMinutes()
        
        const openTime = openHour * 60 + openMin
        const closeTime = closeHour * 60 + closeMin
        const currentTime = currentHour * 60 + currentMin
        
        return currentTime >= openTime && currentTime <= closeTime
      }
      
      // Función para obtener miniatura (logo o primera letra)
      const getThumbnail = (business) => {
        if (business.logoUrl) {
          return `<img src="${business.logoUrl}" alt="${business.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />`
        }
        const firstLetter = (business.name || '?').charAt(0).toUpperCase()
        return `<div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #059669); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${firstLetter}</div>`
      }
      
      const openStatus = isOpenNow(business)
      const hasSlug = Boolean(business.slug)
      const hasPublicMenu = hasSlug && business.isMenuPublic !== false
      const menuBlockedReason = 'Para tener menu publico, el comercio necesita una cuenta con plan basico o mayor.'
      const statusText = openStatus === null ? '' : (openStatus ? '🟢 Abierto ahora' : '🔴 Cerrado ahora')
      
      // Popup con información del comercio mejorado
      let popupContent = `
        <div style="min-width: 240px; max-width: 300px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="display: flex; align-items: start; gap: 12px; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb;">
            <div style="flex-shrink: 0;">
              ${getThumbnail(business)}
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; flex-wrap: wrap;">
                <h3 style="font-weight: bold; font-size: 16px; margin: 0; flex: 1; min-width: 0; line-height: 1.3;">${business.name || 'Sin nombre'}</h3>
                ${business.isEnterprise ? `<span style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; white-space: nowrap; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">⭐ Destacado</span>` : ''}
              </div>
              ${statusText ? `<div style="margin: 6px 0; padding: 4px 8px; background-color: ${openStatus ? '#d1fae5' : '#fee2e2'}; border-radius: 6px; display: inline-block;"><p style="margin: 0; color: ${openStatus ? '#065f46' : '#991b1b'}; font-size: 12px; font-weight: 600;">${statusText}</p></div>` : ''}
              ${hasPublicMenu ? `<div style="margin: 6px 0; padding: 4px 8px; background-color: #d1fae5; border-radius: 6px; display: inline-block;"><p style="margin: 0; color: #065f46; font-size: 12px; font-weight: 500;">✓ Menú disponible</p></div>` : ''}
              ${hasSlug && !hasPublicMenu ? `<div title="${menuBlockedReason}" style="margin: 6px 0; padding: 4px 8px; background-color: #fef3c7; border-radius: 6px; display: inline-block;"><p style="margin: 0; color: #92400e; font-size: 12px; font-weight: 600;">⚠ Menú no disponible</p></div>` : ''}
            </div>
          </div>
          ${business.description ? `<p style="margin-bottom: 10px; color: #4b5563; font-size: 13px; line-height: 1.5;">${business.description}</p>` : ''}
          <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px;">
            ${business.address ? `<div style="display: flex; align-items: start; gap: 6px;"><span style="color: #6b7280; font-size: 14px;">📍</span><p style="margin: 0; color: #4b5563; font-size: 12px; line-height: 1.4;">${business.address}</p></div>` : ''}
            ${business.distance != null ? `<div style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; background-color: #ecfdf5; border-radius: 6px;"><span style="color: #10b981; font-size: 14px;">📍</span><p style="margin: 0; color: #065f46; font-size: 13px; font-weight: 600;">${business.distance < 1 ? `${Math.round(business.distance * 1000)}m` : `${business.distance.toFixed(1)}km`} de distancia</p></div>` : ''}
          </div>
      `
      
      if (hasPublicMenu) {
        popupContent += `
          <a href="/${business.slug}/menu" style="display: inline-block; width: 100%; text-align: center; margin-top: 8px; padding: 10px 16px; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3); transition: all 0.2s;">Ver menú</a>
        </div>
        `
      } else if (hasSlug) {
        popupContent += `
          <span title="${menuBlockedReason}" style="display: inline-block; width: 100%; text-align: center; margin-top: 8px; padding: 10px 16px; background: #e5e7eb; color: #6b7280; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; cursor: not-allowed;">No tiene menú</span>
        </div>
        `
      } else {
        popupContent += `</div>`
      }
      
      marker.bindPopup(popupContent)
      markers.push(marker)
    }
  })

  // Agregar marcador de usuario
  if (props.userLocation && props.userLocation.latitude && props.userLocation.longitude) {
    if (userMarker) {
      map.removeLayer(userMarker)
    }
    userMarker = window.L.marker([props.userLocation.latitude, props.userLocation.longitude], {
      icon: createUserIcon(),
    }).addTo(map)
    const refLabel = (props.userLocationLabel || 'Tu ubicación').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    userMarker.bindPopup(`<div style="font-weight: 600;">${refLabel}</div>`)
    // Solo abrir el popup si showUserLocationPopup es true
    if (props.showUserLocationPopup) {
      userMarker.openPopup()
    }
    // Siempre centrar en el punto de referencia (GPS / guardada / URL / Obelisco), no en el cluster de comercios:
    // un fitBounds mezclando usuario + negocios desplazaba el mapa hacia el Obelisco si el seed está ahí.
    map.setView([props.userLocation.latitude, props.userLocation.longitude], props.zoom)
  } else {
    // Si no hay ubicación del usuario, NO ajustar vista a los comercios
    // Respetar siempre el centro del mapa que viene del prop (obelisco por defecto)
    if (map && props.center) {
      // Forzar el centro del mapa al valor del prop
      map.setView(props.center, props.zoom)
    }
  }
}

// Observar cambios en los props
watch(() => props.businesses, () => {
  if (isMapReady.value) {
    updateMarkers()
  }
}, { deep: true })

watch(() => [props.userLocation, props.userLocationLabel], () => {
  if (isMapReady.value) {
    updateMarkers()
  }
}, { deep: true })

watch(() => [props.center, props.zoom], () => {
  if (map && isMapReady.value) {
    // Si no hay ubicación del usuario, forzar el centro del mapa
    // Esto asegura que el obelisco se mantenga cuando no hay filtro activo
    if (!props.userLocation) {
      map.setView(props.center, props.zoom, { reset: true })
    } else {
      map.setView(props.center, props.zoom)
    }
  }
}, { immediate: false })

let resizeHandler = null

onMounted(async () => {
  await nextTick()
  initMap()
  
  // Watch para invalidar tamaño cuando cambia el tamaño de pantalla
  if (process.client) {
    resizeHandler = () => {
      if (map) {
        setTimeout(() => {
          map.invalidateSize()
        }, 100)
      }
    }
    window.addEventListener('resize', resizeHandler)
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
  if (process.client && resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})
</script>

<style>
/* Estilos para los marcadores personalizados */
.custom-business-marker,
.custom-user-marker {
  background: transparent !important;
  border: none !important;
}

/* Ajustes para el mapa en modo oscuro */
.dark .leaflet-container {
  background-color: #1e293b;
}

.dark .leaflet-tile {
  filter: brightness(0.8) contrast(1.2);
}
</style>


