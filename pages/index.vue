<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors pb-20 md:pb-0">
    <!-- Vista para usuarios autenticados -->
    <template v-if="isAuthenticated">
      <div
        class="relative flex min-h-[calc(100dvh-7.5rem)] flex-col justify-center overflow-hidden font-sans antialiased md:min-h-[70vh] md:justify-start"
      >
        <!-- Fondo ambiente -->
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,rgba(16,185,129,0.12),transparent_55%)] dark:bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,rgba(16,185,129,0.14),transparent_50%)]"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-400/10"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-sky-500/5 blur-3xl dark:bg-sky-400/8"
          aria-hidden="true"
        />

        <div class="relative mx-auto w-full max-w-5xl px-4 py-2 sm:px-6 md:py-10 lg:px-8 md:px-4">
          <h1 class="sr-only">Panel MapaMorfi</h1>

          <div class="grid grid-cols-3 gap-3 sm:gap-3.5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            <!-- Mis comercios (destacado): solo si ya tiene al menos un comercio -->
            <NuxtLink
              v-if="showMisComerciosTile"
              to="/select-business"
              class="dashboard-tile-featured group relative flex aspect-square min-h-0 max-md:min-h-[6.75rem] flex-col overflow-hidden rounded-xl border border-emerald-400/40 bg-gradient-to-b from-emerald-50/95 to-white px-3 py-4 text-center shadow-md transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white max-md:!border-emerald-500/50 max-md:!bg-gradient-to-br max-md:!from-emerald-600/30 max-md:!to-slate-950 max-md:shadow-lg max-md:shadow-emerald-950/35 max-md:ring-1 max-md:ring-emerald-400/30 max-md:hover:brightness-105 max-md:active:scale-[0.98] dark:border-emerald-500/35 dark:from-emerald-950/55 dark:to-slate-950 dark:focus-visible:ring-offset-slate-950 md:aspect-auto md:rounded-2xl md:px-5 md:pb-6 md:pt-7 md:!bg-gradient-to-b md:from-emerald-50/95 md:to-white md:dark:!from-emerald-950/55 md:dark:!to-slate-950 md:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75),0_6px_0_0_#047857,0_16px_40px_-14px_rgba(16,185,129,0.42)] md:hover:-translate-y-1.5 md:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_9px_0_0_#059669,0_22px_48px_-12px_rgba(16,185,129,0.48)] md:active:translate-y-0.5 md:active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_4px_0_0_#047857,0_10px_28px_-12px_rgba(16,185,129,0.35)] md:dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_5px_0_0_#065f46,0_18px_44px_-16px_rgba(0,0,0,0.55)] md:dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_0_0_#047857,0_24px_52px_-14px_rgba(16,185,129,0.25)]"
            >
              <div
                class="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/45 via-transparent to-emerald-600/[0.06] dark:from-white/[0.06] dark:to-emerald-500/[0.04]"
                aria-hidden="true"
              />
              <div
                class="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-90 dark:via-white/25"
                aria-hidden="true"
              />
              <div class="relative flex min-h-0 flex-1 flex-col items-center justify-center">
                <div
                  class="mb-2 flex h-14 shrink-0 items-center justify-center text-emerald-500 dark:text-emerald-300 max-md:text-emerald-300 md:mb-4 md:h-16"
                >
                  <svg
                    class="h-10 w-10 drop-shadow-[0_2px_10px_rgba(16,185,129,0.5)] md:h-11 md:w-11"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.35"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c-.896 0-1.7-.393-2.25-1.016a2.993 2.993 0 00-2.25 1.016c-.356.257-.96.606-1.86.952M3 9.75V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v3"
                    />
                  </svg>
                </div>
                <h2
                  class="line-clamp-2 min-h-[2.5rem] px-0.5 text-xs font-semibold leading-tight tracking-tight text-slate-900 max-md:text-emerald-50 dark:text-white sm:text-[0.8125rem] md:min-h-0 md:text-[1.05rem] md:leading-normal md:text-lg md:text-slate-900 md:dark:text-white"
                >
                  Mis comercios
                </h2>
                <p class="mt-2 hidden max-w-[16rem] flex-1 text-[0.8125rem] leading-snug text-slate-600 dark:text-slate-400 sm:text-sm sm:leading-relaxed md:block">
                  Administrá tus menús digitales existentes
                </p>
                <div
                  class="mt-5 hidden items-center gap-1 text-sm font-medium tabular-nums text-emerald-700 dark:text-emerald-300 md:inline-flex"
                >
                  <span>Abrir</span>
                  <svg
                    class="h-4 w-4 opacity-80 transition-transform duration-200 group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </NuxtLink>

            <NuxtLink
              v-for="card in visibleDashboardCards"
              :key="card.to"
              :to="card.to"
              class="dashboard-tile group relative flex aspect-square min-h-0 max-md:min-h-[6.75rem] flex-col overflow-hidden rounded-xl border border-slate-200/95 bg-gradient-to-b from-white to-slate-50/90 px-3 py-4 text-center shadow-md transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white max-md:active:scale-[0.98] dark:border-slate-600/70 dark:from-slate-800/95 dark:to-slate-900/98 md:aspect-auto md:rounded-2xl md:px-5 md:pb-6 md:pt-7 md:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_4px_0_0_#cbd5e1,0_12px_32px_-14px_rgba(15,23,42,0.14)] md:hover:-translate-y-1.5 md:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_7px_0_0_#94a3b8,0_18px_40px_-12px_rgba(15,23,42,0.18)] md:active:translate-y-0.5 md:active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),0_3px_0_0_#cbd5e1,0_8px_24px_-12px_rgba(15,23,42,0.12)] md:dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_4px_0_0_#1e293b,0_16px_40px_-14px_rgba(0,0,0,0.5)] md:dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.09),0_7px_0_0_#334155,0_20px_44px_-12px_rgba(0,0,0,0.55)] dark:focus-visible:ring-offset-slate-950"
              :class="dashboardAccentMobile[card.accent]"
            >
              <div
                class="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 via-transparent to-slate-900/[0.03] opacity-80 dark:from-white/[0.04] dark:to-transparent"
                aria-hidden="true"
              />
              <div
                class="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
                aria-hidden="true"
              />
              <div class="relative flex min-h-0 flex-1 flex-col items-center justify-center">
                <div
                  class="dash-icon mb-2 flex h-14 shrink-0 items-center justify-center text-slate-500 transition-colors duration-200 [&_svg]:h-9 [&_svg]:w-9 [&_svg]:drop-shadow-[0_2px_8px_rgba(15,23,42,0.15)] group-hover:text-emerald-500 dark:text-slate-400 dark:group-hover:text-emerald-400 md:mb-4 md:h-16 md:!text-slate-500 md:[&_svg]:h-11 md:[&_svg]:w-11 md:dark:!text-slate-400 dark:[&_svg]:drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] max-md:[&_svg]:drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
                  v-html="card.iconSvg"
                />
                <h2
                  class="line-clamp-2 min-h-[2.5rem] px-0.5 text-xs font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-[0.8125rem] md:min-h-0 md:!text-slate-900 md:text-[1.05rem] md:leading-normal md:text-lg md:dark:!text-white max-md:font-semibold"
                >
                  {{ card.title }}
                </h2>
                <p class="mt-2 hidden max-w-[16rem] flex-1 text-[0.8125rem] leading-snug text-slate-600 dark:text-slate-400 sm:text-sm sm:leading-relaxed md:block">
                  {{ card.description }}
                </p>
                <div
                  class="mt-5 hidden items-center gap-1 text-sm font-medium tabular-nums text-slate-500 transition-colors group-hover:text-emerald-600 dark:text-slate-500 dark:group-hover:text-emerald-400 md:inline-flex"
                >
                  <span>Ir</span>
                  <svg
                    class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>

    <!-- Vista completa para usuarios no autenticados -->
    <template v-else>
    <!-- Hero Section -->
    <section class="py-20 sm:py-28">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-10">
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

          <div class="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div
              class="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(ellipse_at_50%_30%,rgba(16,185,129,0.2),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_50%_30%,rgba(16,185,129,0.12),transparent_50%)]"
              aria-hidden="true"
            />
            <img
              src="/brand-hero-qrmenu.png"
              alt="Ilustración de un menú digital con código QR en un teléfono"
              width="1200"
              height="675"
              class="relative w-full rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 dark:border-slate-700/90 dark:shadow-black/40"
              loading="eager"
              decoding="async"
            />
          </div>
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
          <div class="group relative overflow-hidden bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 hover:shadow-lg transition-all">
            <img
              src="/brand-placeholder-analytics.png"
              alt=""
              class="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.08] dark:opacity-[0.14]"
              loading="lazy"
              decoding="async"
            />
            <div class="relative flex items-start gap-4">
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

/**
 * Estilos solo en mobile: gradiente + borde por categoría (desktop sigue neutro).
 * currentColor en SVG toma el tono del contenedor .dash-icon.
 */
const dashboardAccentMobile = {
  violet:
    'max-md:!border-violet-500/50 max-md:!bg-gradient-to-br max-md:!from-violet-600/30 max-md:!to-slate-950 max-md:shadow-lg max-md:shadow-black/25 max-md:ring-1 max-md:ring-violet-400/25 max-md:[&_.dash-icon]:text-violet-300 max-md:[&_h2]:text-violet-50 max-md:hover:brightness-105',
  sky:
    'max-md:!border-sky-500/50 max-md:!bg-gradient-to-br max-md:!from-sky-600/28 max-md:!to-slate-950 max-md:shadow-lg max-md:shadow-black/25 max-md:ring-1 max-md:ring-sky-400/25 max-md:[&_.dash-icon]:text-sky-300 max-md:[&_h2]:text-sky-50 max-md:hover:brightness-105',
  indigo:
    'max-md:!border-indigo-500/50 max-md:!bg-gradient-to-br max-md:!from-indigo-600/28 max-md:!to-slate-950 max-md:shadow-lg max-md:shadow-black/25 max-md:ring-1 max-md:ring-indigo-400/20 max-md:[&_.dash-icon]:text-indigo-300 max-md:[&_h2]:text-indigo-50 max-md:hover:brightness-105',
  amber:
    'max-md:!border-amber-500/50 max-md:!bg-gradient-to-br max-md:!from-amber-600/26 max-md:!to-slate-950 max-md:shadow-lg max-md:shadow-black/25 max-md:ring-1 max-md:ring-amber-400/25 max-md:[&_.dash-icon]:text-amber-300 max-md:[&_h2]:text-amber-50 max-md:hover:brightness-105',
  rose:
    'max-md:!border-rose-500/50 max-md:!bg-gradient-to-br max-md:!from-rose-600/28 max-md:!to-slate-950 max-md:shadow-lg max-md:shadow-black/25 max-md:ring-1 max-md:ring-rose-400/25 max-md:[&_.dash-icon]:text-rose-300 max-md:[&_h2]:text-rose-50 max-md:hover:brightness-105',
  teal:
    'max-md:!border-teal-500/50 max-md:!bg-gradient-to-br max-md:!from-teal-600/28 max-md:!to-slate-950 max-md:shadow-lg max-md:shadow-black/25 max-md:ring-1 max-md:ring-teal-400/25 max-md:[&_.dash-icon]:text-teal-300 max-md:[&_h2]:text-teal-50 max-md:hover:brightness-105',
  lime:
    'max-md:!border-lime-500/45 max-md:!bg-gradient-to-br max-md:!from-lime-600/24 max-md:!to-slate-950 max-md:shadow-lg max-md:shadow-black/25 max-md:ring-1 max-md:ring-lime-400/25 max-md:[&_.dash-icon]:text-lime-300 max-md:[&_h2]:text-lime-50 max-md:hover:brightness-105',
  fuchsia:
    'max-md:!border-fuchsia-500/50 max-md:!bg-gradient-to-br max-md:!from-fuchsia-600/27 max-md:!to-slate-950 max-md:shadow-lg max-md:shadow-black/25 max-md:ring-1 max-md:ring-fuchsia-400/25 max-md:[&_.dash-icon]:text-fuchsia-300 max-md:[&_h2]:text-fuchsia-50 max-md:hover:brightness-105',
}

/** Iconos en SVG estático (sin entrada de usuario) para el panel autenticado */
const dashboardCards = [
  {
    to: '/create-business',
    title: 'Crear comercio',
    description: 'Agregá un nuevo menú digital',
    accent: 'violet',
    iconSvg:
      '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>',
  },
  {
    to: '/discover',
    title: 'Descubrir',
    description: 'Explorá comercios cerca de vos',
    accent: 'sky',
    iconSvg:
      '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" /></svg>',
  },
  {
    to: '/profile',
    title: 'Mi perfil',
    description: 'Configurá tu información personal',
    accent: 'indigo',
    iconSvg:
      '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>',
  },
  {
    to: '/saved-addresses',
    title: 'Mis direcciones',
    description: 'Gestioná tus direcciones guardadas',
    accent: 'amber',
    iconSvg:
      '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>',
  },
  {
    to: '/favorites',
    title: 'Favoritos',
    description: 'Tus comercios favoritos guardados',
    accent: 'rose',
    iconSvg:
      '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>',
  },
  {
    to: '/contact',
    title: 'Contacto',
    description: 'Consultas y soporte',
    accent: 'teal',
    iconSvg:
      '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>',
  },
  {
    to: '/billing',
    title: 'Facturación',
    description: 'Plan y pagos',
    accent: 'lime',
    iconSvg:
      '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" /></svg>',
  },
  {
    to: '/crm',
    title: 'CRM',
    description: 'Clientes y tickets',
    accent: 'fuchsia',
    iconSvg:
      '<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v7.125c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.25v-7.125zm6.75-4.5c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zm6.75-4.5c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>',
  },
]

const userRole = ref(null)
const userEmail = ref(null)
const hasBusinesses = ref(false)
const businessesLoaded = ref(false)
const { fetchAllBusinesses } = useBusinesses()

/** CRM: mismo criterio que Navbar */
const canAccessCrm = computed(
  () => userRole.value === 'admin' || userEmail.value === 'gonzalezoctavio5@gmail.com',
)

const visibleDashboardCards = computed(() =>
  dashboardCards.filter((card) => (card.to === '/crm' ? canAccessCrm.value : true)),
)

const showMisComerciosTile = computed(
  () => businessesLoaded.value && hasBusinesses.value,
)

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
    const { getAuthData } = useAuth()
    const auth = getAuthData()
    if (auth) {
      isAuthenticated.value = true
      userRole.value = auth.role ?? null
      userEmail.value = auth.email ?? null
      try {
        const list = await fetchAllBusinesses()
        hasBusinesses.value = Array.isArray(list) && list.length > 0
      } catch {
        hasBusinesses.value = false
      } finally {
        businessesLoaded.value = true
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
