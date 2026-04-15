<template>
  <div class="relative w-full">
    <div
      ref="mapContainer"
      id="location-picker-map"
      class="w-full h-64 rounded-xl border border-slate-200/90 dark:border-slate-700/90 overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-900/50"
      style="min-height: 256px; height: 256px;"
    ></div>
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-slate-100/90 dark:bg-slate-900/80 rounded-xl z-10 backdrop-blur-[2px]">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500/30 border-t-emerald-500 mx-auto"></div>
      </div>
    </div>
    <div v-if="error" class="mt-2 text-xs text-red-600 dark:text-red-400">
      <p>{{ error }}</p>
    </div>
    <div
      v-if="selectedLocation"
      class="mt-2 flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums"
      title="Coordenadas del pin"
    >
      <span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
      <span>{{ selectedLocation.latitude.toFixed(5) }}, {{ selectedLocation.longitude.toFixed(5) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  initialCenter: {
    type: Array,
    default: () => [-34.6037, -58.3816], // Buenos Aires por defecto
  },
  initialZoom: {
    type: Number,
    default: 13,
  },
})

const emit = defineEmits(['update:latitude', 'update:longitude', 'location-selected', 'address-found'])

const mapContainer = ref(null)
let map = null
let marker = null
const isLoading = ref(true)
const selectedLocation = ref(null)
const error = ref(null)

const initMap = async () => {
  if (!process.client || !mapContainer.value) {
    isLoading.value = false
    return
  }

  try {
    // Cargar Leaflet dinámicamente - mismo enfoque que BusinessMap
    const L = await import('leaflet')
    
    // Importar estilos CSS de Leaflet
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      link.crossOrigin = ''
      document.head.appendChild(link)
    }

    // Hacer L disponible globalmente
    window.L = L.default

    // Esperar a que el contenedor tenga dimensiones
    await nextTick()
    
    // Verificar dimensiones antes de inicializar
    const rect = mapContainer.value.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      setTimeout(initMap, 200)
      return
    }

    // Crear mapa
    map = L.default.map(mapContainer.value, {
      center: props.latitude && props.longitude
        ? [props.latitude, props.longitude]
        : props.initialCenter,
      zoom: props.initialZoom,
      zoomControl: true,
    })

    // Agregar capa de OpenStreetMap
    L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    // Invalidar el tamaño del mapa - crítico para que los tiles se muestren
    setTimeout(() => {
      if (map) {
        map.invalidateSize()
      }
    }, 200)

    // Agregar listener de click en el mapa
    map.on('click', handleMapClick)

    // Si hay coordenadas iniciales, agregar marcador
    if (props.latitude && props.longitude) {
      addMarker([props.latitude, props.longitude])
      selectedLocation.value = {
        latitude: props.latitude,
        longitude: props.longitude,
      }
    }

    isLoading.value = false
    error.value = null
  } catch (err) {
    console.error('Error initializing map:', err)
    error.value = `Error al inicializar el mapa: ${err.message}`
    isLoading.value = false
  }
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})

// Manejar click en el mapa
const handleMapClick = async (e) => {
  const { lat, lng } = e.latlng
  
  // Actualizar marcador
  addMarker([lat, lng])
  
  // Actualizar coordenadas
  selectedLocation.value = { latitude: lat, longitude: lng }
  emit('update:latitude', lat)
  emit('update:longitude', lng)
  emit('location-selected', { latitude: lat, longitude: lng })

  // Geocodificación inversa para obtener la dirección
  try {
    const response = await $fetch('/api/geocode/reverse', {
      method: 'POST',
      body: { latitude: lat, longitude: lng },
    })

    if (response.success && response.address) {
      emit('address-found', response.address)
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error)
  }
}

// Agregar o actualizar marcador
const addMarker = (coords) => {
  if (!window.L || !map) return

  // Remover marcador anterior si existe
  if (marker) {
    map.removeLayer(marker)
  }

  // Crear nuevo marcador
  marker = window.L.marker(coords, {
    draggable: true,
  }).addTo(map)

  // Cuando se arrastra el marcador, actualizar coordenadas
  marker.on('dragend', (e) => {
    const { lat, lng } = e.target.getLatLng()
    selectedLocation.value = { latitude: lat, longitude: lng }
    emit('update:latitude', lat)
    emit('update:longitude', lng)
    emit('location-selected', { latitude: lat, longitude: lng })

    // Geocodificación inversa
    $fetch('/api/geocode/reverse', {
      method: 'POST',
      body: { latitude: lat, longitude: lng },
    })
      .then((response) => {
        if (response.success && response.address) {
          emit('address-found', response.address)
        }
      })
      .catch((error) => {
        console.error('Error reverse geocoding:', error)
      })
  })
}

// Watch para actualizar el mapa cuando cambian las coordenadas desde fuera
watch(
  () => [props.latitude, props.longitude],
  ([newLat, newLng]) => {
    if (newLat && newLng && map) {
      const newCoords = [newLat, newLng]
      addMarker(newCoords)
      map.setView(newCoords, map.getZoom())
      selectedLocation.value = {
        latitude: newLat,
        longitude: newLng,
      }
    }
  }
)
</script>

<style>
/* Estilos para Leaflet */
@import 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
</style>
