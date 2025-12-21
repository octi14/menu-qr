<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold mb-2">Mis favoritos</h1>
        <p class="text-slate-600 dark:text-slate-400">
          Comercios que guardaste para ver más tarde
        </p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="mb-6 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4 text-red-800 dark:text-red-300">
        <p>⚠️ {{ error }}</p>
      </div>

      <!-- Lista de favoritos -->
      <div v-else-if="favorites.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="business in favorites"
          :key="business.id || business.slug"
          class="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden hover:shadow-lg transition-all duration-200"
        >
          <NuxtLink :to="`/${business.slug}/menu`" class="block">
            <div v-if="business.headerImageUrl" class="h-48 overflow-hidden">
              <img
                :src="business.headerImageUrl"
                :alt="business.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div v-else class="h-48 flex items-center justify-center" :style="{ backgroundColor: business.backgroundColor || '#f3f4f6' }">
              <h3 class="text-2xl font-bold" :style="{ color: business.primaryColor || '#000' }">
                {{ business.name }}
              </h3>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-1">{{ business.name }}</h3>
              <p v-if="business.description" class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {{ business.description }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Sin favoritos -->
      <div v-else class="text-center py-20">
        <svg
          class="mx-auto h-16 w-16 text-slate-400 dark:text-slate-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h3 class="text-xl font-semibold mb-2">No tenés favoritos aún</h3>
        <p class="text-slate-600 dark:text-slate-400 mb-4">
          Guardá tus comercios favoritos para acceder rápidamente
        </p>
        <NuxtLink
          to="/discover"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
        >
          Descubrir comercios
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const { authenticatedFetch, isAuthenticated } = useAuth()
const favorites = ref([])
const isLoading = ref(true)
const error = ref(null)

const loadFavorites = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Verificar autenticación antes de hacer la petición
    if (!isAuthenticated()) {
      // Redirigir al login si no está autenticado
      if (process.client) {
        await navigateTo('/login')
      }
      return
    }

    const response = await authenticatedFetch('/api/favorites')

    favorites.value = response || []
  } catch (err) {
    console.error('Error loading favorites:', err)
    // Si el error es de autenticación, el composable ya redirige
    // Solo mostrar el error si no es un error de autenticación
    if (err.statusCode !== 401 && err.status !== 401) {
      error.value = err.data?.message || err.message || 'Error al cargar favoritos'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadFavorites()
})

useHead({
  title: 'Favoritos · MapaMorfi',
})
</script>

