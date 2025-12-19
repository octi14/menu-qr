<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors flex items-center justify-center px-4">
    <div class="max-w-2xl w-full text-center space-y-8">
      <!-- Ilustración del error -->
      <div class="flex justify-center">
        <div
          :class="[
            'rounded-full p-8',
            statusCode === 404
              ? 'bg-amber-100 dark:bg-amber-900/20'
              : 'bg-red-100 dark:bg-red-900/20'
          ]"
        >
          <svg
            v-if="statusCode === 404"
            class="h-24 w-24 text-amber-600 dark:text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else
            class="h-24 w-24 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <!-- Título y mensaje -->
      <div class="space-y-4">
        <h1 class="text-6xl font-bold">
          <span
            :class="[
              statusCode === 404
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-red-600 dark:text-red-400'
            ]"
          >
            {{ statusCode }}
          </span>
        </h1>
        <h2 class="text-3xl font-semibold">
          {{ statusCode === 404 ? 'Página no encontrada' : 'Error del servidor' }}
        </h2>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          {{ statusCode === 404 
            ? 'La página que estás buscando no existe o fue movida.' 
            : 'Algo salió mal en nuestro servidor. Estamos trabajando para solucionarlo.' 
          }}
        </p>
      </div>

      <!-- Acciones -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          @click="handleGoHome"
          class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Ir al inicio
        </button>
        <button
          @click="handleGoBack"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver atrás
        </button>
      </div>

      <!-- Información adicional para 500 -->
      <div
        v-if="statusCode === 500"
        class="mt-8 p-4 rounded-lg bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800"
      >
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Si el problema persiste, contactanos en{' '}
          <a
            href="mailto:soporte@mapamorfi.com"
            class="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
          >
            soporte@mapamorfi.com
          </a>
        </p>
      </div>

      <!-- Theme toggle -->
      <div class="pt-8">
        <ThemeToggle />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: null,
  },
})

const statusCode = computed(() => props.error?.statusCode || 500)
const router = useRouter()

const handleGoHome = () => {
  router.push('/')
}

const handleGoBack = () => {
  if (process.client) {
    window.history.length > 1 ? router.go(-1) : router.push('/')
  }
}

// Configurar el título de la página
useHead({
  title: `${statusCode.value} - ${statusCode.value === 404 ? 'Página no encontrada' : 'Error del servidor'} · MapaMorfi`,
})
</script>

