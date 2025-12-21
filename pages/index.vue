<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors pb-20 md:pb-0">
    <!-- Vista para usuarios autenticados -->
    <template v-if="isAuthenticated">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Bienvenido a MapaMorfi
          </h1>
          <p class="text-xl text-slate-600 dark:text-slate-400">
            Gestioná tus menús digitales desde aquí
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <NuxtLink
            to="/select-business"
            class="group relative rounded-2xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 p-8 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all duration-200 hover:scale-105"
          >
            <div class="text-4xl mb-4">🏪</div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Mis comercios</h2>
            <p class="text-slate-600 dark:text-slate-400">
              Administrá tus menús digitales existentes
            </p>
            <svg class="absolute top-4 right-4 h-6 w-6 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/create-business"
            class="group relative rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 hover:scale-105"
          >
            <div class="text-4xl mb-4">➕</div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Crear comercio</h2>
            <p class="text-slate-600 dark:text-slate-400">
              Agregá un nuevo menú digital
            </p>
            <svg class="absolute top-4 right-4 h-6 w-6 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/discover"
            class="group relative rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 hover:scale-105"
          >
            <div class="text-4xl mb-4">🗺️</div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Descubrir</h2>
            <p class="text-slate-600 dark:text-slate-400">
              Explorá comercios cerca de vos
            </p>
            <svg class="absolute top-4 right-4 h-6 w-6 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/profile"
            class="group relative rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 hover:scale-105"
          >
            <div class="text-4xl mb-4">👤</div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Mi perfil</h2>
            <p class="text-slate-600 dark:text-slate-400">
              Configurá tu información personal
            </p>
            <svg class="absolute top-4 right-4 h-6 w-6 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/saved-addresses"
            class="group relative rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 hover:scale-105"
          >
            <div class="text-4xl mb-4">📍</div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Mis direcciones</h2>
            <p class="text-slate-600 dark:text-slate-400">
              Gestioná tus direcciones guardadas
            </p>
            <svg class="absolute top-4 right-4 h-6 w-6 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/favorites"
            class="group relative rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 hover:scale-105"
          >
            <div class="text-4xl mb-4">❤️</div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Favoritos</h2>
            <p class="text-slate-600 dark:text-slate-400">
              Tus comercios favoritos guardados
            </p>
            <svg class="absolute top-4 right-4 h-6 w-6 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/contact"
            class="group relative rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 hover:scale-105"
          >
            <div class="text-4xl mb-4">📧</div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Contacto</h2>
            <p class="text-slate-600 dark:text-slate-400">
              Contactanos por consultas o soporte
            </p>
            <svg class="absolute top-4 right-4 h-6 w-6 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/billing"
            class="group relative rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 hover:scale-105"
          >
            <div class="text-4xl mb-4">💳</div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Facturación</h2>
            <p class="text-slate-600 dark:text-slate-400">
              Gestioná tu plan y facturación
            </p>
            <svg class="absolute top-4 right-4 h-6 w-6 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/crm"
            class="group relative rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 hover:scale-105"
          >
            <div class="text-4xl mb-4">📊</div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">CRM</h2>
            <p class="text-slate-600 dark:text-slate-400">
              Gestioná tus clientes y tickets
            </p>
            <svg class="absolute top-4 right-4 h-6 w-6 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </template>

    <!-- Vista completa para usuarios no autenticados -->
    <template v-else>
    <!-- Hero Section -->
    <section class="py-20 sm:py-28">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl">
          <p class="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4 uppercase tracking-wide">
            MapaMorfi
          </p>
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-slate-50 mb-6 leading-tight">
            Menús digitales<br />con códigos QR
          </h1>
          
          <p class="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Convertí tu menú en papel en uno digital. Tus clientes escanean el código QR y listo.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-3 mb-8">
            <NuxtLink
              to="/register"
              class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              Crear cuenta gratis
            </NuxtLink>
            <NuxtLink
              to="/login"
              class="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              Ya tengo cuenta
            </NuxtLink>
          </div>
          
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Sin tarjeta de crédito · Configuración en minutos
          </p>
        </div>
      </div>
    </section>

    <!-- Demo Section (solo para no autenticados) -->
    <section v-if="!isAuthenticated && demoBusiness" class="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900/50">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-12 items-start">
          <div class="lg:w-1/3 lg:sticky lg:top-8">
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Mirá cómo<br />se ve
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-400 mb-6">
              Este es un ejemplo real de un menú creado con MapaMorfi. Explorá todas las funcionalidades.
            </p>
            <NuxtLink
              :to="`/${demoBusiness.slug}/menu`"
              target="_blank"
              class="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium hover:gap-3 transition-all"
            >
              Ver menú completo
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </NuxtLink>
          </div>
          
          <div class="lg:w-2/3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-lg">
            <div class="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">{{ demoBusiness.name }}</h3>
              <p class="text-slate-600 dark:text-slate-400">{{ demoBusiness.description }}</p>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  v-for="section in demoBusiness.sections.slice(0, 4)"
                  :key="section.id"
                  class="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
                >
                  <h4 class="font-semibold text-slate-900 dark:text-slate-50 mb-3">{{ section.name }}</h4>
                  <div class="space-y-2">
                    <div
                      v-for="item in section.items.slice(0, 2)"
                      :key="item.id"
                      class="text-sm flex justify-between"
                    >
                      <span class="text-slate-700 dark:text-slate-300">{{ item.name }}</span>
                      <span class="font-semibold text-emerald-600 dark:text-emerald-400 ml-2">${{ item.price?.toLocaleString('es-AR') }}</span>
                    </div>
                    <p v-if="section.items.length > 2" class="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      +{{ section.items.length - 2 }} ítems más
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="mb-12 max-w-2xl">
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Todo lo que necesitás para digitalizar tu menú
          </h2>
          <p class="text-lg text-slate-600 dark:text-slate-400">
            Funcionalidades pensadas para hacer crecer tu negocio. Simple, rápido y efectivo.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Códigos QR -->
          <div class="group border-l-4 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-r-lg p-6 hover:shadow-lg transition-all">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-500 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">Códigos QR</h3>
                <p class="text-slate-600 dark:text-slate-400 mb-3">
                  Generá y descargá tu código QR en segundos. Disponible en diferentes formatos para imprimir.
                </p>
                <ul class="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                  <li>• Formatos PNG, SVG y PDF</li>
                  <li>• Tamaños personalizables</li>
                  <li>• Sin límites de descarga</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Personalizable -->
          <div class="group border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <svg class="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">Totalmente personalizable</h3>
                <p class="text-slate-600 dark:text-slate-400 mb-3">
                  Elegí colores, fuentes e imágenes que reflejen la identidad de tu marca.
                </p>
                <ul class="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                  <li>• Múltiples plantillas</li>
                  <li>• Paleta de colores personalizada</li>
                  <li>• Fuentes profesionales</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Estadísticas -->
          <div class="group bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 hover:shadow-lg transition-all">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-500 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">Estadísticas en tiempo real</h3>
                <p class="text-slate-600 dark:text-slate-400 mb-3">
                  Conocé cuántas personas visitan tu menú y qué productos son los más populares.
                </p>
                <ul class="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                  <li>• Visitas por día y hora</li>
                  <li>• Productos más vistos</li>
                  <li>• Gráficos y reportes</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Sin apps -->
          <div class="group border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <svg class="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">Sin apps necesarias</h3>
                <p class="text-slate-600 dark:text-slate-400 mb-3">
                  Tus clientes acceden directamente desde su navegador. Sin descargas ni instalaciones.
                </p>
                <ul class="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                  <li>• Funciona en cualquier dispositivo</li>
                  <li>• Carga rápida</li>
                  <li>• Experiencia optimizada</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Exportación PDF -->
          <div class="group border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <svg class="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">Exportación a PDF</h3>
                <p class="text-slate-600 dark:text-slate-400 mb-3">
                  Descargá tu menú en PDF para compartirlo por email o redes sociales.
                </p>
                <ul class="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                  <li>• Alta calidad</li>
                  <li>• Listo para imprimir</li>
                  <li>• Fácil de compartir</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Mapa de descubrimiento -->
          <div class="group md:col-span-2 lg:col-span-1 border-2 border-slate-300 dark:border-slate-600 rounded-lg p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-xl transition-all">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-500 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">Mapa de descubrimiento</h3>
                <p class="text-slate-600 dark:text-slate-400 mb-3">
                  Aparecé en nuestro mapa interactivo para que nuevos clientes te encuentren fácilmente.
                </p>
                <ul class="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                  <li>• Búsqueda por ubicación</li>
                  <li>• Mayor visibilidad</li>
                  <li>• Más clientes potenciales</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900/50">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-3 uppercase tracking-wide">
            Planes
          </p>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Elegí el plan que mejor se adapte
          </h2>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Desde emprendimientos hasta grandes franquicias. Todos los planes incluyen lo esencial.
          </p>
        </div>
        
        <div class="text-center">
          <NuxtLink
            to="/billing"
            class="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            Ver planes y precios
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 sm:py-20">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-2xl p-8 sm:p-12 overflow-hidden">
          <!-- Decorative elements -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl"></div>
          
          <div class="relative text-center">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="text-sm font-medium text-emerald-400">100% Gratis para empezar</span>
            </div>
            
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              ¿Listo para empezar?
            </h2>
            <p class="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Creá tu cuenta gratis y empezá a digitalizar tu menú ahora mismo. Sin tarjeta de crédito, sin compromiso.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <NuxtLink
                to="/register"
                class="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all hover:scale-105 shadow-lg shadow-emerald-500/30"
              >
                Crear cuenta gratis
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </NuxtLink>
              <NuxtLink
                to="/login"
                class="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg border-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 transition-colors"
              >
                Ya tengo cuenta
              </NuxtLink>
            </div>
            
            <div class="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Sin tarjeta de crédito</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Configuración en minutos</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>Soporte incluido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </template>
  </div>
</template>

<script setup>
import { normalizeBusiness } from '~/composables/useMenuNormalizer'

definePageMeta({
  layout: 'default',
})

const isAuthenticated = ref(false)
const demoBusiness = ref(null)
const isLoadingDemo = ref(false)

const loadDemo = async () => {
  if (isLoadingDemo.value || demoBusiness.value) return
  isLoadingDemo.value = true
  try {
    const demo = await $fetch('/api/businesses/demo')
    if (demo) {
      // Normalizar el business de demo
      demoBusiness.value = normalizeBusiness(demo)
    }
  } catch (error) {
    console.error('Error loading demo:', error)
  } finally {
    isLoadingDemo.value = false
  }
}

onMounted(async () => {
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
    
    // Solo cargar demo si no está autenticado
    if (!isAuthenticated.value) {
      await loadDemo()
    }
  }
})

useHead({
  title: 'MapaMorfi - Menús digitales con códigos QR',
  meta: [
    { name: 'description', content: 'Crea menús digitales profesionales con códigos QR. Sin apps, sin complicaciones. Digitaliza tu negocio en minutos.' }
  ]
})
</script>
