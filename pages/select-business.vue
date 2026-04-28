<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Mis comercios</h1>
      </div>

      <AppLoadingScreen
        v-if="isLoading"
        title="Cargando tus comercios…"
        subtitle="Sincronizando menús"
      />

      <div v-else>
        <div class="mb-6 flex items-center justify-between">
          <p class="text-sm text-slate-600 dark:text-slate-400">
            {{ businesses.length }} {{ businesses.length === 1 ? 'comercio' : 'comercios' }}
          </p>
          <button
            @click="handleCreateBusiness"
            class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nuevo comercio
          </button>
        </div>

        <div v-if="businesses.length === 0" class="text-center py-12 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
          <p class="text-slate-600 dark:text-slate-400 mb-4">
            Todavía no tenés comercios creados
          </p>
          <button
            @click="handleCreateBusiness"
            class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
          >
            Crear tu primer comercio
          </button>
        </div>

        <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="business in businesses"
            :key="business.id || business.slug || business._id"
            class="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 hover:shadow-lg transition-all cursor-pointer"
            @click="handleSelectBusiness(business.slug)"
          >
            <div class="flex items-start justify-between gap-4 mb-4">
              <div class="flex-1">
                <h2 class="text-lg font-semibold mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {{ business.name }}
                </h2>
                <p v-if="business.description" class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {{ business.description }}
                </p>
              </div>
              <div
                class="h-12 w-12 rounded-lg flex-shrink-0"
                :style="{
                  backgroundColor: business.primaryColor || business.themeColor || '#0f766e',
                }"
              />
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <div class="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {{ getSectionsCount(business) }}
                  {{ getSectionsCount(business) === 1 ? 'sección' : 'secciones' }}
                </span>
                <span>
                  {{ totalItems(business) }} ítems
                </span>
              </div>
              <svg
                class="h-5 w-5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const router = useRouter()
const { fetchAllBusinesses } = useBusinesses()

const businesses = ref([])
const isLoading = ref(true)

const getSectionsCount = (business) => {
  // Verificar múltiples formatos posibles del menú
  if (!business) return 0
  
  // Formato 1: business.menu.sections
  if (business.menu?.sections && Array.isArray(business.menu.sections)) {
    return business.menu.sections.filter(section => section && (section.items?.length > 0 || section.name)).length
  }
  
  // Formato 2: business.sections (directo)
  if (business.sections && Array.isArray(business.sections)) {
    return business.sections.filter(section => section && (section.items?.length > 0 || section.name)).length
  }
  
  return 0
}

const totalItems = (business) => {
  // Verificar múltiples formatos posibles del menú
  if (!business) return 0
  
  // Formato 1: business.menu.sections
  if (business.menu?.sections && Array.isArray(business.menu.sections)) {
    return business.menu.sections.reduce((acc, sec) => {
      if (!sec || !sec.items) return acc
      return acc + (Array.isArray(sec.items) ? sec.items.length : 0)
    }, 0)
  }
  
  // Formato 2: business.sections (directo)
  if (business.sections && Array.isArray(business.sections)) {
    return business.sections.reduce((acc, sec) => {
      if (!sec || !sec.items) return acc
      return acc + (Array.isArray(sec.items) ? sec.items.length : 0)
    }, 0)
  }
  
  return 0
}

const handleSelectBusiness = (slug) => {
  router.push(`/${slug}/panel`)
}

const handleCreateBusiness = () => {
  router.push('/create-business')
}

onMounted(async () => {
  try {
    console.log('select-business.vue: Loading businesses...')
    const result = await fetchAllBusinesses()
    console.log('select-business.vue: Received businesses:', result)
    console.log('select-business.vue: Number of businesses:', result?.length || 0)
    
    // Validar y limpiar los datos
    if (Array.isArray(result)) {
      businesses.value = result.map(business => {
        // Asegurar que tenga las propiedades necesarias
        return {
          ...business,
          id: business.id || business._id?.toString() || business.slug,
          menu: business.menu || { sections: [] },
        }
      })
      console.log('select-business.vue: Processed businesses:', businesses.value)
    } else {
      console.warn('select-business.vue: Result is not an array:', result)
      businesses.value = []
    }
  } catch (error) {
    console.error('select-business.vue: Error loading businesses:', error)
    console.error('select-business.vue: Error stack:', error.stack)
    businesses.value = []
  } finally {
    isLoading.value = false
    console.log('select-business.vue: isLoading set to false, businesses.length:', businesses.value.length)
  }
})

// Watcher para debug
watch(businesses, (newVal) => {
  console.log('select-business.vue: businesses changed, new length:', newVal?.length || 0)
}, { immediate: true, deep: true })

watch(isLoading, (newVal) => {
  console.log('select-business.vue: isLoading changed to:', newVal)
})

useHead({
  title: 'Mis comercios · MapaMorfi',
})
</script>

