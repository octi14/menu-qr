<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors antialiased">
    <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">Direcciones guardadas</h1>
        <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Acceso rápido a comercios cercanos
        </p>
      </div>

      <!-- Formulario para agregar nueva dirección -->
      <div class="mb-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 backdrop-blur-sm p-6 shadow-sm">
        <h2 class="text-lg font-semibold mb-4 tracking-tight">Nueva dirección</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Nombre de la dirección
            </label>
            <input
              v-model="newAddress.name"
              type="text"
              placeholder="Ej: Casa, Trabajo, Universidad..."
              class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Dirección
            </label>
            <div class="flex gap-2">
              <div class="flex-1 relative">
                <input
                  v-model="newAddress.address"
                  type="text"
                  placeholder="Ej: Av. Mitre 1234, Berazategui, Buenos Aires"
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                  @input="searchAddresses"
                  @focus="showSuggestions = true"
                  @blur="handleAddressBlur"
                  autocomplete="off"
                />
                <!-- Sugerencias de direcciones -->
                <div
                  v-if="showSuggestions && addressSuggestions.length > 0"
                  class="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  <button
                    v-for="(suggestion, index) in addressSuggestions"
                    :key="index"
                    type="button"
                    @click="selectAddress(suggestion)"
                    class="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                  >
                    <div class="text-sm font-medium text-slate-900 dark:text-slate-50">
                      {{ suggestion.displayName }}
                    </div>
                  </button>
                </div>
              </div>
              <button
                @click="geocodeAddress"
                type="button"
                :disabled="!newAddress.address || !newAddress.address.trim() || isLoadingGeocode"
                class="px-4 py-2.5 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isLoadingGeocode">Buscando...</span>
                <span v-else>Buscar</span>
              </button>
            </div>
          </div>

          <!-- Mapa para seleccionar ubicación -->
          <div v-if="newAddress.latitude && newAddress.longitude">
            <p class="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Ajustá el pin
            </p>
            <LocationPicker
              v-model:latitude="newAddress.latitude"
              v-model:longitude="newAddress.longitude"
              :initial-center="[newAddress.latitude, newAddress.longitude]"
              :initial-zoom="15"
              @address-found="handleAddressFromMap"
            />
          </div>

          <!-- Botón para guardar -->
          <button
            @click="saveAddress"
            :disabled="!canSaveAddress || isSaving"
            class="w-full px-4 py-2.5 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSaving">Guardando...</span>
            <span v-else>Guardar dirección</span>
          </button>
        </div>
      </div>

      <!-- Lista de direcciones guardadas -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>

      <div v-else-if="error" class="mb-6 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4 text-red-800 dark:text-red-300">
        <p>⚠️ {{ error }}</p>
      </div>

      <div v-else-if="addresses.length > 0" class="space-y-4">
        <div
          v-for="address in addresses"
          :key="address.id"
          class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4 hover:shadow-lg transition-all"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold mb-1">{{ address.name }}</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">{{ address.address }}</p>
              <NuxtLink
                :to="`/discover?lat=${address.latitude}&lng=${address.longitude}`"
                class="inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ver comercios cerca
              </NuxtLink>
            </div>
            <button
              @click="deleteAddress(address.id)"
              :disabled="isDeleting === address.id"
              class="ml-4 p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
              title="Eliminar dirección"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Sin direcciones -->
      <div v-else class="text-center py-20">
        <svg
          class="mx-auto h-16 w-16 text-slate-400 dark:text-slate-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 class="text-xl font-semibold mb-2">No tenés direcciones guardadas</h3>
        <p class="text-slate-600 dark:text-slate-400">
          Guardá direcciones para acceder rápidamente a comercios cercanos
        </p>
      </div>
    </div>

    <ConfirmDialog
      v-model="showDeleteConfirm"
      title="Eliminar dirección"
      message="¿Estás seguro de que querés eliminar esta dirección? Esta acción no se puede deshacer."
      confirm-label="Eliminar"
      cancel-label="Cancelar"
      variant="danger"
      @confirm="executeDeleteAddress"
      @cancel="pendingDeleteId = null"
    />

    <Toast v-model:message="toastMessage" type="error" :duration="4000" />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const showDeleteConfirm = ref(false)
const pendingDeleteId = ref(null)
const toastMessage = ref('')

const addresses = ref([])
const isLoading = ref(true)
const error = ref(null)
const isSaving = ref(false)
const isDeleting = ref(null)

const newAddress = ref({
  name: '',
  address: '',
  latitude: null,
  longitude: null,
})

const addressSuggestions = ref([])
const showSuggestions = ref(false)
const isLoadingGeocode = ref(false)
let searchTimeout = null

const canSaveAddress = computed(() => {
  return newAddress.value.name.trim() &&
         newAddress.value.address.trim() &&
         newAddress.value.latitude &&
         newAddress.value.longitude
})

const loadAddresses = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    let token = null
    if (process.client) {
      const auth = localStorage.getItem('qrmenu-auth')
      if (auth) {
        try {
          const parsed = JSON.parse(auth)
          token = parsed.token
        } catch {
          // Error parsing
        }
      }
    }

    if (!token) {
      throw new Error('No estás autenticado')
    }

    const response = await $fetch('/api/saved-addresses', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    addresses.value = response || []
  } catch (err) {
    console.error('Error loading addresses:', err)
    error.value = err.data?.message || err.message || 'Error al cargar direcciones'
  } finally {
    isLoading.value = false
  }
}

const searchAddresses = async () => {
  // Limpiar timeout anterior
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (!newAddress.value.address || newAddress.value.address.length < 3) {
    addressSuggestions.value = []
    return
  }

  // Debounce: esperar 300ms después de que el usuario deje de escribir
  searchTimeout = setTimeout(async () => {
    try {
      const response = await $fetch(`/api/geocode/search?q=${encodeURIComponent(newAddress.value.address)}`)
      // El endpoint devuelve directamente un array de sugerencias
      if (Array.isArray(response) && response.length > 0) {
        addressSuggestions.value = response
      } else {
        addressSuggestions.value = []
      }
    } catch (err) {
      console.error('Error searching addresses:', err)
      addressSuggestions.value = []
    }
  }, 300)
}

const selectAddress = (suggestion) => {
  newAddress.value.address = suggestion.displayName
  newAddress.value.latitude = suggestion.latitude
  newAddress.value.longitude = suggestion.longitude
  showSuggestions.value = false
}

const handleAddressBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const geocodeAddress = async () => {
  if (!newAddress.value.address || !newAddress.value.address.trim()) return

  isLoadingGeocode.value = true
  try {
    const response = await $fetch(`/api/geocode/search?q=${encodeURIComponent(newAddress.value.address)}`)
    
    // El endpoint devuelve un array de resultados
    if (Array.isArray(response) && response.length > 0) {
      // Tomar el primer resultado (el más relevante)
      const firstResult = response[0]
      newAddress.value.latitude = firstResult.latitude
      newAddress.value.longitude = firstResult.longitude
      // Actualizar la dirección con el nombre completo del resultado
      if (firstResult.displayName) {
        newAddress.value.address = firstResult.displayName
      }
    } else {
      alert('No se pudo encontrar la ubicación. Intentá con una dirección más específica.')
    }
  } catch (err) {
    console.error('Error geocoding:', err)
    alert('Error al buscar la ubicación. Intentá nuevamente.')
  } finally {
    isLoadingGeocode.value = false
  }
}

const handleAddressFromMap = (address) => {
  if (address && !newAddress.value.address) {
    newAddress.value.address = address
  }
}

const saveAddress = async () => {
  if (!canSaveAddress.value) return

  isSaving.value = true
  try {
    let token = null
    if (process.client) {
      const auth = localStorage.getItem('qrmenu-auth')
      if (auth) {
        try {
          const parsed = JSON.parse(auth)
          token = parsed.token
        } catch {
          // Error parsing
        }
      }
    }

    if (!token) {
      throw new Error('No estás autenticado')
    }

    await $fetch('/api/saved-addresses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: {
        name: newAddress.value.name,
        address: newAddress.value.address,
        latitude: newAddress.value.latitude,
        longitude: newAddress.value.longitude,
      },
    })

    // Reset form
    newAddress.value = {
      name: '',
      address: '',
      latitude: null,
      longitude: null,
    }

    // Reload addresses
    await loadAddresses()
  } catch (err) {
    console.error('Error saving address:', err)
    alert(err.data?.message || err.message || 'Error al guardar la dirección')
  } finally {
    isSaving.value = false
  }
}

function deleteAddress(addressId) {
  pendingDeleteId.value = addressId
  showDeleteConfirm.value = true
}

async function executeDeleteAddress() {
  const addressId = pendingDeleteId.value
  pendingDeleteId.value = null
  if (!addressId) return

  isDeleting.value = addressId
  try {
    let token = null
    if (process.client) {
      const auth = localStorage.getItem('qrmenu-auth')
      if (auth) {
        try {
          const parsed = JSON.parse(auth)
          token = parsed.token
        } catch {
          // Error parsing
        }
      }
    }

    if (!token) {
      throw new Error('No estás autenticado')
    }

    await $fetch(`/api/saved-addresses/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    await loadAddresses()
  } catch (err) {
    console.error('Error deleting address:', err)
    toastMessage.value = `${err.data?.message || err.message || 'Error al eliminar la dirección'}-${Date.now()}`
  } finally {
    isDeleting.value = null
  }
}

onMounted(() => {
  loadAddresses()
})

useHead({
  title: 'Direcciones guardadas · MapaMorfi',
})
</script>

