<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">Analytics</h1>
            <p class="text-slate-600 dark:text-slate-400">{{ business?.name || 'Cargando...' }}</p>
          </div>
          <NuxtLink
            :to="`/${slug}/panel`"
            class="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            Volver al panel
          </NuxtLink>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>

      <!-- Stats -->
      <div v-else-if="analytics" class="space-y-6">
        <!-- Resumen -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
            <div class="flex items-center gap-3">
              <div class="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-3">
                <svg class="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-slate-600 dark:text-slate-400">Escaneos QR</p>
                <p class="text-2xl font-bold">{{ analytics.totalQRScans }}</p>
              </div>
            </div>
          </div>
          <div class="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
            <div class="flex items-center gap-3">
              <div class="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-slate-600 dark:text-slate-400">Visualizaciones</p>
                <p class="text-2xl font-bold">{{ analytics.totalMenuViews }}</p>
              </div>
            </div>
          </div>
          <div class="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
            <div class="flex items-center gap-3">
              <div class="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
                <svg class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm text-slate-600 dark:text-slate-400">Vistas de ítems</p>
                <p class="text-2xl font-bold">{{ analytics.totalItemViews }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Ítems más vistos -->
        <div v-if="Object.keys(analytics.itemViews).length > 0" class="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
          <h2 class="text-xl font-semibold mb-4">Ítems más vistos</h2>
          <div class="space-y-2">
            <div
              v-for="(views, itemId) in sortedItemViews"
              :key="itemId"
              class="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50"
            >
              <span class="text-sm font-medium">{{ getItemName(itemId) }}</span>
              <span class="text-sm text-slate-600 dark:text-slate-400">{{ views }} vistas</span>
            </div>
          </div>
        </div>

        <!-- Eventos recientes -->
        <div v-if="analytics.recentEvents.length > 0" class="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
          <h2 class="text-xl font-semibold mb-4">Eventos recientes</h2>
          <div class="space-y-2">
            <div
              v-for="event in analytics.recentEvents"
              :key="event.id"
              class="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-sm"
            >
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 rounded text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                  {{ getEventTypeLabel(event.eventType) }}
                </span>
                <span class="text-slate-600 dark:text-slate-400">
                  {{ formatDate(event.timestamp) }}
                </span>
              </div>
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

const route = useRoute()
const slug = route.params.slug
const business = ref(null)
const analytics = ref(null)
const isLoading = ref(true)

const loadBusiness = async () => {
  try {
    business.value = await $fetch(`/api/businesses/${slug}`)
  } catch (error) {
    console.error('Error loading business:', error)
  }
}

const loadAnalytics = async () => {
  if (!business.value?.id) return
  
  try {
    analytics.value = await $fetch(`/api/analytics/${business.value.id}`)
  } catch (error) {
    console.error('Error loading analytics:', error)
  } finally {
    isLoading.value = false
  }
}

const sortedItemViews = computed(() => {
  if (!analytics.value?.itemViews) return []
  return Object.entries(analytics.value.itemViews)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {})
})

const getItemName = (itemId) => {
  if (!business.value?.menu?.sections) return itemId
  for (const section of business.value.menu.sections) {
    const item = section.items.find(i => i.id === itemId)
    if (item) return item.name
  }
  return itemId
}

const getEventTypeLabel = (type) => {
  const labels = {
    qr_scan: 'QR Escaneado',
    menu_view: 'Menú Visto',
    item_view: 'Ítem Visto',
    section_view: 'Sección Vista',
  }
  return labels[type] || type
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  await loadBusiness()
  await loadAnalytics()
})

useHead({
  title: `Analytics · ${business.value?.name || 'Cargando...'}`,
})
</script>

