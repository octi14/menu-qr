<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors pb-20 md:pb-0">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <!-- Background gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900"></div>
      
      <!-- Decorative elements -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-300/20 dark:bg-emerald-800/10 rounded-full blur-3xl"></div>
      
      <div class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div class="text-center">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 mb-8">
            <svg class="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="text-sm font-medium text-emerald-700 dark:text-emerald-300">100% Gratis para empezar</span>
          </div>
          
          <!-- Main heading -->
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span class="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              Menús digitales
            </span>
            <br />
            <span class="text-slate-900 dark:text-slate-50">que venden más</span>
          </h1>
          
          <!-- Subheading -->
          <p class="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Creá menús digitales profesionales con códigos QR. Sin apps, sin complicaciones. 
            <span class="font-semibold text-slate-900 dark:text-slate-50">Tu negocio, digitalizado en minutos.</span>
          </p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <NuxtLink
              v-if="!isAuthenticated"
              to="/register"
              class="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105"
            >
              Empezar gratis
              <svg class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </NuxtLink>
            <NuxtLink
              v-if="!isAuthenticated"
              to="/login"
              class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-200"
            >
              Iniciar sesión
            </NuxtLink>
            <NuxtLink
              v-if="isAuthenticated"
              to="/select-business"
              class="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105"
            >
              Mis comercios
              <svg class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </NuxtLink>
            <NuxtLink
              v-if="isAuthenticated"
              to="/discover"
              class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-200"
            >
              Descubrir comercios
            </NuxtLink>
          </div>
          
          <!-- Trust indicators -->
          <div class="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600 dark:text-slate-400">
            <div class="flex items-center gap-2">
              <svg class="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>Sin tarjeta de crédito</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>Configuración en minutos</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>Soporte incluido</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 sm:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Todo lo que necesitás para digitalizar tu menú
          </h2>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Herramientas profesionales diseñadas para hacer crecer tu negocio
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative">
              <div class="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">Códigos QR instantáneos</h3>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                Generá códigos QR únicos en segundos. Descargalos, imprimilos y compartilos con tus clientes. Sin límites.
              </p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative">
              <div class="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">Personalización total</h3>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                Elegí colores, fuentes e imágenes que reflejen tu marca. Tu menú, tu estilo, tu identidad.
              </p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative">
              <div class="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">Estadísticas en tiempo real</h3>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                Conocé cuántas personas visitan tu menú, qué productos son los más vistos y optimizá tu oferta.
              </p>
            </div>
          </div>

          <!-- Feature 4 -->
          <div class="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative">
              <div class="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">Sin apps necesarias</h3>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                Tus clientes acceden directamente desde su navegador. Sin descargas, sin barreras, sin complicaciones.
              </p>
            </div>
          </div>

          <!-- Feature 5 -->
          <div class="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative">
              <div class="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">Exportación a PDF</h3>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                Descargá tu menú en PDF para imprimirlo, compartirlo por email o usarlo en tus redes sociales.
              </p>
            </div>
          </div>

          <!-- Feature 6 -->
          <div class="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative">
              <div class="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">Mapa de descubrimiento</h3>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                Aparecé en nuestro mapa para que nuevos clientes te encuentren fácilmente cerca de ellos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing CTA Section -->
    <section class="py-20 sm:py-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
          Planes que se adaptan a tu negocio
        </h2>
        <p class="text-xl text-slate-600 dark:text-slate-400 mb-8">
          Desde emprendimientos hasta grandes franquicias. Elegí el plan perfecto para vos.
        </p>
        <NuxtLink
          to="/billing"
          class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105"
        >
          Ver planes y precios
          <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 sm:py-24 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          ¿Listo para digitalizar tu menú?
        </h2>
        <p class="text-xl text-slate-600 dark:text-slate-400 mb-10">
          Empezá gratis hoy mismo. Sin tarjeta de crédito, sin compromiso.
        </p>
        <NuxtLink
          v-if="!isAuthenticated"
          to="/register"
          class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105"
        >
          Crear cuenta gratis
          <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
        <NuxtLink
          v-if="isAuthenticated"
          to="/select-business"
          class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105"
        >
          Ir a mis comercios
          <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})

const isAuthenticated = ref(false)

onMounted(() => {
  if (process.client) {
    const auth = localStorage.getItem('qrmenu-auth')
    if (auth) {
      try {
        const parsed = JSON.parse(auth)
        if (parsed.loggedIn === true) {
          isAuthenticated.value = true
        }
      } catch {
        // Error parsing
      }
    }
  }
})

useHead({
  title: 'FoodLand - Menús digitales con códigos QR',
  meta: [
    { name: 'description', content: 'Crea menús digitales profesionales con códigos QR. Sin apps, sin complicaciones. Digitaliza tu negocio en minutos.' }
  ]
})
</script>
