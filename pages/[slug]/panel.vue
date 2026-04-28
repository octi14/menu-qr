<template>
  <div class="min-h-screen overflow-x-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
    <div class="mx-auto w-full min-w-0 max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl font-bold mb-2 break-words sm:text-3xl">{{ business?.name || 'Cargando...' }}</h1>
          <p class="text-slate-600 dark:text-slate-400">Panel de administración</p>
        </div>
        <div class="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end sm:gap-3">
          <NuxtLink
            :to="`/${slug}/analytics`"
            class="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </NuxtLink>
          <NuxtLink
            :to="`/${slug}/menu`"
            target="_blank"
            class="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {{ userPlan && userPlan.isDemo ? 'Ver menú (demo)' : 'Ver menú público' }}
          </NuxtLink>
          <button
            @click="handleSave"
            :disabled="isSaving || !hasChanges"
            class="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed sm:px-6"
          >
            <svg
              v-if="isSaving"
              class="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg
              v-else
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ isSaving ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>
      </div>

      <!-- Mensajes -->
      <div v-if="error" class="mb-6 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4">
        <div class="flex items-start gap-3">
          <svg class="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-red-600 dark:text-red-400 flex-1">{{ error }}</p>
        </div>
      </div>
      <div v-if="success" class="mb-6 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 p-4">
        <div class="flex items-start gap-3">
          <svg class="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-emerald-600 dark:text-emerald-400 flex-1">{{ success }}</p>
        </div>
      </div>

      <div v-if="!business" class="py-8">
        <AppLoadingScreen title="Cargando comercio…" subtitle="Obteniendo la configuración y el menú" />
      </div>

      <div v-else class="min-w-0 space-y-6">
        <div class="flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            class="px-4 py-2.5 text-sm font-medium transition-colors -mb-px"
            :class="
              panelTab === 'design'
                ? 'border-b-2 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            "
            @click="setPanelTab('design')"
          >
            Diseñar menú
          </button>
          <button
            type="button"
            class="px-4 py-2.5 text-sm font-medium transition-colors -mb-px"
            :class="
              panelTab === 'commerce'
                ? 'border-b-2 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            "
            @click="setPanelTab('commerce')"
          >
            Comercio y ubicación
          </button>
        </div>

        <div
          v-show="panelTab === 'design'"
          class="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:gap-6 xl:gap-8"
        >
          <!-- Sidebar: controles (poco ancho, scroll propio) -->
          <aside
            class="order-2 w-full min-w-0 max-w-full space-y-4 sm:space-y-5 lg:order-1 lg:max-h-[calc(100dvh-7.5rem)] lg:max-w-[19.5rem] lg:shrink-0 lg:space-y-4 lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1 xl:max-w-[21rem] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600"
          >
          <div class="min-w-0 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/50 p-4 sm:p-5">
            <div class="mb-3 flex items-center justify-between gap-2">
              <h2 class="text-base font-semibold tracking-tight">Apariencia</h2>
              <span class="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">en vivo</span>
            </div>
            <div class="space-y-3.5">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Color de fondo
                </label>
                <div class="flex min-w-0 flex-wrap items-center gap-4">
                  <input
                    v-model="localBusiness.backgroundColor"
                    type="color"
                    class="h-10 w-10 shrink-0 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <input
                    v-model="localBusiness.backgroundColor"
                    type="text"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    class="min-w-0 flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tipografía
                </label>
                <div class="relative">
                  <button
                    type="button"
                    class="inline-flex w-full items-center justify-between rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-left text-sm text-slate-900 dark:text-slate-50 outline-none transition-colors hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    @click="showFontPicker = !showFontPicker"
                  >
                    <span
                      class="truncate"
                      :style="{ fontFamily: AVAILABLE_FONTS.find(f => f.id === localBusiness.fontFamily)?.family || 'inherit' }"
                    >
                      {{ AVAILABLE_FONTS.find(f => f.id === localBusiness.fontFamily)?.name || 'Tipografía' }}
                    </span>
                    <svg class="h-4 w-4 opacity-70 transition-transform" :class="{ 'rotate-180': showFontPicker }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    v-if="showFontPicker"
                    class="absolute z-20 mt-2 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-xl"
                  >
                    <div class="grid grid-cols-2 gap-1.5">
                      <button
                        v-for="font in AVAILABLE_FONTS"
                        :key="font.id"
                        type="button"
                        class="rounded-md px-2 py-1.5 text-left text-xs transition-colors"
                        :class="localBusiness.fontFamily === font.id ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'"
                        :style="{ fontFamily: font.family }"
                        @click="localBusiness.fontFamily = font.id; showFontPicker = false"
                      >
                        {{ font.name }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Imagen de header (solo para planes Pro y Enterprise) -->
              <div v-if="userPlan && (userPlan.id === 'professional' || userPlan.id === 'enterprise' || userRole === 'admin')">
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Imagen de header
                </label>
                <input
                  v-model="localBusiness.headerImageUrl"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors text-sm"
                />
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Banner superior (planes Pro/Enterprise).
                </p>
                <div v-if="localBusiness.headerImageUrl" class="mt-3 space-y-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="localBusiness.headerImageOverlay"
                      type="checkbox"
                      class="rounded border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span class="text-sm text-slate-700 dark:text-slate-300">
                      Mostrar nombre del comercio sobre la imagen
                    </span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="localBusiness.hideName"
                      type="checkbox"
                      class="rounded border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span class="text-sm text-slate-700 dark:text-slate-300">
                      Ocultar nombre del comercio (mostrar solo imagen como banner)
                    </span>
                  </label>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-6">
                    El nombre y descripción aparecerán como overlay sobre la imagen
                  </p>
                </div>
              </div>
              <div>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="localBusiness.showPrices"
                    type="checkbox"
                    class="rounded border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span class="text-sm text-slate-700 dark:text-slate-300">
                    Mostrar precios en el menú
                  </span>
                </label>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-6">
                  Oculta precios en el menú público.
                </p>
              </div>
            </div>
          </div>

          <!-- Templates predefinidos (solo para planes Pro y Enterprise) -->
          <div v-if="userPlan && (userPlan.id === 'professional' || userPlan.id === 'enterprise' || userRole === 'admin')" class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/50 p-4 sm:p-5">
            <TemplateSelector v-model="localBusiness" />
          </div>

          <!-- Selector de Layout de Menú -->
          <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/50 p-4 sm:p-5">
            <h2 class="text-base font-semibold tracking-tight mb-3">Disposición de menú</h2>
            <div v-if="userPlan && userPlan.id === 'basic' && userRole !== 'admin'" class="space-y-4">
              <!-- Solo layout vertical para plan básico -->
              <div class="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20">
                <div class="flex items-start gap-4">
                  <div class="flex-1 flex items-center justify-center h-24">
                    <!-- Preview de layout vertical -->
                    <div class="w-full max-w-xs space-y-2">
                      <div class="h-3 bg-slate-300 dark:bg-slate-600 rounded w-3/4"></div>
                      <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                      <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                      <div class="h-3 bg-slate-300 dark:bg-slate-600 rounded w-3/4 mt-3"></div>
                      <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                      <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-sm mb-1">Vertical/Clásico</div>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                      Layouts avanzados: plan Pro/Enterprise.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <!--
              En sidebar estrecho (lg), 2 columnas deja tarjetas ridículas; en lg fila compacta
              (miniatura + texto). Ancho completo: 2 columnas en sm no lg.
            -->
            <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1 lg:gap-2.5">
              <!-- Vertical/Clásico -->
              <label
                class="group relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all hover:shadow-md sm:p-5 lg:flex-row lg:items-center lg:gap-3.5 lg:py-3 lg:pl-3.5 lg:pr-4"
                @click="localBusiness.menuLayout = 'vertical'"
                :class="
                  (localBusiness.menuLayout || 'vertical') === 'vertical'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-900'
                "
              >
                <input
                  v-model="localBusiness.menuLayout"
                  type="radio"
                  value="vertical"
                  class="sr-only"
                />
                <div
                  class="mb-3 flex h-28 flex-shrink-0 items-center justify-center sm:mb-4 sm:h-32 lg:mb-0 lg:h-20 lg:w-24 overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50/90 dark:border-slate-600 dark:bg-slate-800/50"
                >
                  <div
                    class="w-full max-w-xs origin-center scale-90 space-y-2 px-2 sm:px-0 lg:scale-[0.62] lg:px-1"
                  >
                    <div class="h-2.5 rounded bg-slate-300 dark:bg-slate-600 w-3/4 sm:h-3"></div>
                    <div class="h-2 rounded bg-slate-200 dark:bg-slate-700 w-full sm:h-2"></div>
                    <div class="h-2 rounded bg-slate-200 dark:bg-slate-700 w-5/6 sm:h-2"></div>
                    <div class="h-2.5 rounded bg-slate-300 dark:bg-slate-600 w-3/4 mt-2.5 sm:h-3 sm:mt-3"></div>
                    <div class="h-2 rounded bg-slate-200 dark:bg-slate-700 w-full sm:h-2"></div>
                    <div class="h-2 rounded bg-slate-200 dark:bg-slate-700 w-5/6 sm:h-2"></div>
                  </div>
                </div>
                <div class="min-w-0 text-center sm:text-center lg:flex-1 lg:pr-0 lg:text-left">
                  <div class="text-sm font-bold leading-tight sm:text-base">Vertical/Clásico</div>
                  <p class="mt-1.5 text-xs leading-snug text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-sm">
                    Clásico y limpio
                  </p>
                </div>
              </label>

              <!-- Tabs/Lista -->
              <label
                class="group relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all hover:shadow-md sm:p-5 lg:flex-row lg:items-center lg:gap-3.5 lg:py-3 lg:pl-3.5 lg:pr-4"
                @click="localBusiness.menuLayout = 'tabs'"
                :class="
                  localBusiness.menuLayout === 'tabs'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-900'
                "
              >
                <input
                  v-model="localBusiness.menuLayout"
                  type="radio"
                  value="tabs"
                  class="sr-only"
                />
                <div
                  class="mb-3 flex h-28 flex-shrink-0 items-center justify-center sm:mb-4 sm:h-32 lg:mb-0 lg:h-20 lg:w-24 overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50/90 dark:border-slate-600 dark:bg-slate-800/50"
                >
                  <div
                    class="w-full max-w-xs origin-center scale-90 space-y-2.5 sm:px-0 lg:scale-[0.58] lg:px-0.5"
                  >
                    <div class="flex gap-1.5 sm:gap-2">
                      <div class="h-5 w-12 rounded bg-emerald-500 sm:h-6 sm:w-16"></div>
                      <div class="h-5 w-12 rounded bg-slate-200 dark:bg-slate-700 sm:h-6 sm:w-16"></div>
                      <div class="h-5 w-12 rounded bg-slate-200 dark:bg-slate-700 sm:h-6 sm:w-16"></div>
                    </div>
                    <div class="flex items-center gap-2 sm:gap-3">
                      <div class="h-8 w-8 flex-shrink-0 rounded bg-slate-300 dark:bg-slate-600 sm:h-12 sm:w-12"></div>
                      <div class="min-w-0 flex-1 space-y-1">
                        <div class="h-1.5 w-3/4 rounded bg-slate-300 dark:bg-slate-600 sm:h-2"></div>
                        <div class="h-1.5 w-full rounded bg-slate-200 dark:bg-slate-700 sm:h-2"></div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 sm:gap-3">
                      <div class="h-8 w-8 flex-shrink-0 rounded bg-slate-300 dark:bg-slate-600 sm:h-12 sm:w-12"></div>
                      <div class="min-w-0 flex-1 space-y-1">
                        <div class="h-1.5 w-3/4 rounded bg-slate-300 dark:bg-slate-600 sm:h-2"></div>
                        <div class="h-1.5 w-full rounded bg-slate-200 dark:bg-slate-700 sm:h-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="min-w-0 text-center sm:text-center lg:flex-1 lg:pr-0 lg:text-left">
                  <div class="text-sm font-bold leading-tight sm:text-base">Tabs/Lista</div>
                  <p class="mt-1.5 text-xs leading-snug text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-sm">
                    Navegación por pestañas
                  </p>
                </div>
              </label>

              <!-- Grid/Visual -->
              <label
                class="group relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all hover:shadow-md sm:p-5 lg:flex-row lg:items-center lg:gap-3.5 lg:py-3 lg:pl-3.5 lg:pr-4"
                @click="localBusiness.menuLayout = 'grid'"
                :class="
                  localBusiness.menuLayout === 'grid'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-900'
                "
              >
                <input
                  v-model="localBusiness.menuLayout"
                  type="radio"
                  value="grid"
                  class="sr-only"
                />
                <div
                  class="mb-3 flex h-28 flex-shrink-0 items-center justify-center sm:mb-4 sm:h-32 lg:mb-0 lg:h-20 lg:w-24 overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50/90 p-1.5 dark:border-slate-600 dark:bg-slate-800/50"
                >
                  <div
                    class="w-full max-w-xs origin-center scale-95 sm:px-0 lg:scale-90"
                  >
                    <div class="grid grid-cols-3 gap-1.5 sm:gap-2">
                      <div class="aspect-square rounded bg-slate-300 dark:bg-slate-600"></div>
                      <div class="aspect-square rounded bg-slate-300 dark:bg-slate-600"></div>
                      <div class="aspect-square rounded bg-slate-300 dark:bg-slate-600"></div>
                      <div class="aspect-square rounded bg-slate-300 dark:bg-slate-600"></div>
                      <div class="aspect-square rounded bg-slate-300 dark:bg-slate-600"></div>
                      <div class="aspect-square rounded bg-slate-300 dark:bg-slate-600"></div>
                    </div>
                  </div>
                </div>
                <div class="min-w-0 text-center sm:text-center lg:flex-1 lg:pr-0 lg:text-left">
                  <div class="text-sm font-bold leading-tight sm:text-base">Grid/Visual</div>
                  <p class="mt-1.5 text-xs leading-snug text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-sm">
                    Enfoque visual
                  </p>
                </div>
              </label>

              <!-- Categorías/Cards -->
              <label
                class="group relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all hover:shadow-md sm:p-5 lg:flex-row lg:items-center lg:gap-3.5 lg:py-3 lg:pl-3.5 lg:pr-4"
                @click="localBusiness.menuLayout = 'categories'"
                :class="
                  localBusiness.menuLayout === 'categories'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-900'
                "
              >
                <input
                  v-model="localBusiness.menuLayout"
                  type="radio"
                  value="categories"
                  class="sr-only"
                />
                <div
                  class="mb-3 flex h-28 flex-shrink-0 items-center justify-center sm:mb-4 sm:h-32 lg:mb-0 lg:h-20 lg:w-24 overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50/90 dark:border-slate-600 dark:bg-slate-800/50"
                >
                  <div
                    class="w-full max-w-xs origin-top scale-90 space-y-1.5 sm:px-0 lg:origin-center lg:scale-75"
                  >
                    <div
                      class="rounded border border-slate-300 p-1 dark:border-slate-600"
                    >
                      <div class="h-5 rounded bg-slate-300 dark:bg-slate-600 sm:h-8"></div>
                      <div class="mt-1.5 h-1.5 w-2/3 rounded bg-slate-400 dark:bg-slate-500 sm:h-2.5 sm:mt-2"></div>
                    </div>
                    <div
                      class="rounded border border-slate-300 p-1 dark:border-slate-600"
                    >
                      <div class="h-5 rounded bg-slate-300 dark:bg-slate-600 sm:h-8"></div>
                      <div class="mt-1.5 h-1.5 w-2/3 rounded bg-slate-400 dark:bg-slate-500 sm:h-2.5 sm:mt-2"></div>
                    </div>
                  </div>
                </div>
                <div class="min-w-0 text-center sm:text-center lg:flex-1 lg:pr-0 lg:text-left">
                  <div class="text-sm font-bold leading-tight sm:text-base">Categorías/Cards</div>
                  <p class="mt-1.5 text-xs leading-snug text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-sm">
                    Cards por categoría
                  </p>
                </div>
              </label>

              <!-- Dos columnas -->
              <label
                class="group relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all hover:shadow-md sm:p-5 lg:flex-row lg:items-center lg:gap-3.5 lg:py-3 lg:pl-3.5 lg:pr-4"
                @click="localBusiness.menuLayout = 'two-columns'"
                :class="
                  localBusiness.menuLayout === 'two-columns'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-900'
                "
              >
                <input
                  v-model="localBusiness.menuLayout"
                  type="radio"
                  value="two-columns"
                  class="sr-only"
                />
                <div
                  class="mb-3 flex h-28 flex-shrink-0 items-center justify-center sm:mb-4 sm:h-32 lg:mb-0 lg:h-20 lg:w-24 overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50/90 dark:border-slate-600 dark:bg-slate-800/50"
                >
                  <div class="grid w-full max-w-xs grid-cols-2 gap-1.5 px-2 lg:scale-90">
                    <div class="space-y-1 rounded border border-slate-300 p-1 dark:border-slate-600">
                      <div class="h-1.5 w-3/4 rounded bg-slate-400 dark:bg-slate-500"></div>
                      <div class="h-1.5 w-full rounded bg-slate-300 dark:bg-slate-600"></div>
                      <div class="h-1.5 w-5/6 rounded bg-slate-300 dark:bg-slate-600"></div>
                    </div>
                    <div class="space-y-1 rounded border border-slate-300 p-1 dark:border-slate-600">
                      <div class="h-1.5 w-3/4 rounded bg-slate-400 dark:bg-slate-500"></div>
                      <div class="h-1.5 w-full rounded bg-slate-300 dark:bg-slate-600"></div>
                      <div class="h-1.5 w-5/6 rounded bg-slate-300 dark:bg-slate-600"></div>
                    </div>
                  </div>
                </div>
                <div class="min-w-0 text-center sm:text-center lg:flex-1 lg:pr-0 lg:text-left">
                  <div class="text-sm font-bold leading-tight sm:text-base">Dos columnas</div>
                  <p class="mt-1.5 text-xs leading-snug text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-sm">
                    Secciones visibles de a dos
                  </p>
                </div>
              </label>
            </div>
          </div>
          </aside>

          <div
            class="order-1 flex min-w-0 w-full flex-1 flex-col gap-3 lg:order-2 lg:min-h-0"
          >
            <div class="flex flex-col gap-1.5 sm:gap-2">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Vista previa en vivo</p>
              </div>
            </div>
            <div
              class="flex min-h-0 w-full flex-1 items-start justify-center rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 sm:p-4 dark:border-slate-800/80 dark:bg-slate-900/25"
            >
            <ClientOnly>
              <MenuLivePreview
                v-if="localBusiness"
                variant="panel"
                :business="localBusiness"
                :is-busy="isSaving"
                busy-label="Guardando cambios…"
                :editable="true"
              />
              <template #fallback>
                <div
                  class="flex min-h-[12rem] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30"
                >
                  <p class="text-sm text-slate-500">Cargando vista previa…</p>
                </div>
              </template>
            </ClientOnly>
            </div>
          </div>
        </div>

        <div v-show="panelTab === 'commerce'" class="grid min-w-0 gap-8 lg:grid-cols-3">
        <div class="min-w-0 space-y-6 lg:col-span-2">
          <div class="min-w-0 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4 sm:p-6">
            <h2 class="text-xl font-semibold mb-4">Datos del comercio</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nombre</label>
                <input
                  v-model="localBusiness.name"
                  type="text"
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Descripción</label>
                <textarea
                  v-model="localBusiness.description"
                  rows="2"
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors resize-none"
                />
              </div>
              <div v-if="userPlan && (userPlan.id === 'professional' || userPlan.id === 'enterprise' || userRole === 'admin')">
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Logo para el mapa</label>
                <div class="space-y-3">
                  <input
                    v-model="localBusiness.logoUrl"
                    type="url"
                    placeholder="https://ejemplo.com/logo.png"
                    class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                  />
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    URL de la imagen del logo que aparecerá como miniatura en el mapa (ej: la M de McDonald's). Disponible para planes Pro y Enterprise.
                  </p>
                  <div v-if="localBusiness.logoUrl" class="flex justify-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <img
                      :src="localBusiness.logoUrl"
                      :alt="localBusiness.name"
                      class="h-20 object-contain"
                      @error="localBusiness.logoUrl = ''"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rubro</label>
                <select
                  v-model="localBusiness.category"
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                >
                  <option
                    v-for="category in BUSINESS_CATEGORIES"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.icon }} {{ category.name }}
                  </option>
                </select>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">El ícono del mapa se mostrará según el rubro seleccionado</p>
              </div>
            </div>
          </div>
          <!-- Horarios de atención -->
          <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
            <h2 class="text-xl font-semibold mb-4">Horarios de atención</h2>
            <div class="space-y-3">
              <div v-for="day in ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']" :key="day" class="flex items-center gap-3">
                <label class="w-24 text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
                  {{ day }}
                </label>
                <div class="flex-1 flex items-center gap-2">
                  <input
                    v-model="localBusiness.openingHours[day].open"
                    type="time"
                    class="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                  />
                  <span class="text-xs text-slate-500 dark:text-slate-400">-</span>
                  <input
                    v-model="localBusiness.openingHours[day].close"
                    type="time"
                    class="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                  />
                  <label class="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                    <input
                      v-model="localBusiness.openingHours[day].closed"
                      type="checkbox"
                      class="rounded border-slate-300 dark:border-slate-700"
                    />
                    Cerrado
                  </label>
                </div>
              </div>
            </div>
          </div>
                    <!-- Ubicación -->
                    <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
            <h2 class="text-xl font-semibold mb-4">Ubicación</h2>
            <div class="space-y-4">
              <div class="relative">
                <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Dirección
                </label>
                <div class="flex gap-2">
                  <div class="flex-1 relative">
                    <input
                      v-model="localBusiness.address"
                      type="text"
                      placeholder="Ej: Av. Mitre 1234, Berazategui, Buenos Aires"
                      class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
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
                        class="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                      >
                        <div class="text-xs font-medium text-slate-900 dark:text-slate-50">
                          {{ suggestion.displayName }}
                        </div>
                      </button>
                    </div>
                  </div>
                  <button
                    @click="geocodeAddress"
                    type="button"
                    :disabled="!localBusiness.address || !localBusiness.address.trim() || isLoadingGeocode"
                    class="px-3 py-2 rounded-lg border border-emerald-500 bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Buscar coordenadas de la dirección"
                  >
                    <span v-if="isLoadingGeocode" class="flex items-center gap-1">
                      <svg class="animate-spin h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Buscando...
                    </span>
                    <span v-else>Buscar</span>
                  </button>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Escribí la dirección completa (calle, número, ciudad, provincia)
                </p>
                <p v-if="geocodeSuccess" class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  ✓ Coordenadas encontradas automáticamente
                </p>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  URL de Google Maps (opcional)
                </label>
                <input
                  v-model="localBusiness.googleMapsUrl"
                  type="url"
                  placeholder="https://maps.google.com/..."
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                />
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Opcional: Pegá el link de compartir de Google Maps
                </p>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Seleccionar ubicación en el mapa
                </label>
                <LocationPicker
                  v-model:latitude="localBusiness.latitude"
                  v-model:longitude="localBusiness.longitude"
                  :initial-center="localBusiness.latitude && localBusiness.longitude ? [localBusiness.latitude, localBusiness.longitude] : [-34.6037, -58.3816]"
                  :initial-zoom="localBusiness.latitude && localBusiness.longitude ? 15 : 13"
                  @address-found="handleAddressFromMap"
                />
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Hacé clic en el mapa para seleccionar la ubicación. También podés arrastrar el marcador.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="min-w-0 space-y-6">
          <!-- Eliminar comercio -->
          <div class="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4 text-red-900 dark:text-red-200">Zona de peligro</h2>
            <p class="text-sm text-red-800 dark:text-red-300 mb-4">
              Si ya no necesitás este comercio, podés eliminarlo permanentemente. Esta acción no se puede deshacer.
            </p>
            <button
              @click="showDeleteConfirm = true"
              :disabled="isDeleting"
              class="w-full px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isDeleting">Eliminando...</span>
              <span v-else>Eliminar comercio</span>
            </button>
          </div>
          
          <!-- Modal de confirmación de eliminación -->
          <div
            v-if="showDeleteConfirm"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            @click.self="showDeleteConfirm = false"
          >
            <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full">
              <h3 class="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">Confirmar eliminación</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                ¿Estás seguro de que querés eliminar el comercio <strong>{{ business?.name }}</strong>? Esta acción es permanente y no se puede deshacer. Se eliminarán todos los datos asociados, incluyendo el menú, configuraciones y estadísticas.
              </p>
              <div class="flex gap-3">
                <button
                  @click="showDeleteConfirm = false"
                  class="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  @click="confirmDeleteBusiness"
                  :disabled="isDeleting"
                  class="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isDeleting">Eliminando...</span>
                  <span v-else>Eliminar permanentemente</span>
                </button>
              </div>
            </div>
          </div>

          <!-- QR Code o Mensaje según plan -->
          <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
            <h2 class="text-xl font-semibold mb-4">Código QR</h2>
            <div v-if="userPlan && userPlan.hasQR !== false">
              <QRCode
                :value="menuUrl"
                :size="200"
                :business-id="business?.id"
              />
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
                Escaneá este código para acceder al menú
              </p>
            </div>
            <div v-else class="text-center space-y-4 py-8">
              <div class="mx-auto w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <svg class="w-16 h-16 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div class="space-y-2">
                <p class="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  QR Code no disponible
                </p>
                <p class="text-xs text-slate-600 dark:text-slate-400 px-4">
                  Necesitás un plan de pago para generar códigos QR y hacer tu menú público.
                </p>
                <NuxtLink
                  to="/billing"
                  class="inline-flex items-center gap-2 mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
                >
                  Ver planes
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Redes sociales y ubicación -->
          <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
            <h2 class="text-xl font-semibold mb-4">Redes sociales</h2>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Instagram
                </label>
                <input
                  v-model="localBusiness.socialMedia.instagram"
                  type="url"
                  placeholder="https://instagram.com/..."
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Facebook
                </label>
                <input
                  v-model="localBusiness.socialMedia.facebook"
                  type="url"
                  placeholder="https://facebook.com/..."
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp (redes sociales)
                </label>
                <input
                  v-model="localBusiness.socialMedia.whatsapp"
                  type="url"
                  placeholder="https://wa.me/..."
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
              <!-- Plataformas de pedidos -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">Plataformas de pedidos</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  Configurá los links a tus perfiles en plataformas de delivery. Aparecerán como botones en tu menú público.
                </p>
                
                <!-- PedidosYa -->
                <div>
                  <label class="flex items-center gap-2 mb-2">
                    <input
                      v-model="localBusiness.deliveryPlatforms.pedidosYa.enabled"
                      type="checkbox"
                      class="rounded border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">PedidosYa</span>
                  </label>
                  <input
                    v-if="localBusiness.deliveryPlatforms.pedidosYa.enabled"
                    v-model="localBusiness.deliveryPlatforms.pedidosYa.url"
                    type="url"
                    placeholder="https://www.pedidosya.com.ar/restaurantes/..."
                    class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors mt-2"
                  />
                </div>
                
                <!-- Rappi -->
                <div>
                  <label class="flex items-center gap-2 mb-2">
                    <input
                      v-model="localBusiness.deliveryPlatforms.rappi.enabled"
                      type="checkbox"
                      class="rounded border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Rappi</span>
                  </label>
                  <input
                    v-if="localBusiness.deliveryPlatforms.rappi.enabled"
                    v-model="localBusiness.deliveryPlatforms.rappi.url"
                    type="url"
                    placeholder="https://www.rappi.com.ar/restaurantes/..."
                    class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors mt-2"
                  />
                </div>
                
                <!-- AgilPedido -->
                <div>
                  <label class="flex items-center gap-2 mb-2">
                    <input
                      v-model="localBusiness.deliveryPlatforms.agilpedido.enabled"
                      type="checkbox"
                      class="rounded border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">AgilPedido</span>
                  </label>
                  <input
                    v-if="localBusiness.deliveryPlatforms.agilpedido.enabled"
                    v-model="localBusiness.deliveryPlatforms.agilpedido.url"
                    type="url"
                    placeholder="https://www.agilpedido.com/..."
                    class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors mt-2"
                  />
                </div>
                
                <!-- PedidoDirecto -->
                <div>
                  <label class="flex items-center gap-2 mb-2">
                    <input
                      v-model="localBusiness.deliveryPlatforms.pedidodirecto.enabled"
                      type="checkbox"
                      class="rounded border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">PedidoDirecto</span>
                  </label>
                  <input
                    v-if="localBusiness.deliveryPlatforms.pedidodirecto.enabled"
                    v-model="localBusiness.deliveryPlatforms.pedidodirecto.url"
                    type="url"
                    placeholder="https://www.pedidodirecto.com/..."
                    class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors mt-2"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  TikTok
                </label>
                <input
                  v-model="localBusiness.socialMedia.tiktok"
                  type="url"
                  placeholder="https://tiktok.com/@..."
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { normalizeBusiness } from '~/composables/useMenuNormalizer'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const router = useRouter()
const { fetchBusinessBySlug, updateBusinessToAPI } = useBusinesses()
const { AVAILABLE_FONTS } = useFonts()
const { getPlanById, getDefaultPlan } = usePlans()
const { extractCoordinatesFromGoogleMapsUrl, resolveShortUrlAndExtractCoordinates } = useGoogleMaps()
const { BUSINESS_CATEGORIES } = useBusinessCategories()

const slug = route.params.slug
const business = ref(null)
const localBusiness = ref(null)
const error = ref('')
const success = ref('')
const isSaving = ref(false)
const hasChanges = ref(false)
/** Evita que el watch profundo de localBusiness borre el mensaje de éxito al sincronizar desde el servidor. */
const suppressLocalBusinessSync = ref(false)
const successClearTimer = ref(null)

const userPlan = ref(null)
const userRole = ref(null)
const coordinatesExtracted = ref(false)
const isLoadingGeocode = ref(false)
const geocodeSuccess = ref(false)
const addressSuggestions = ref([])
const showSuggestions = ref(false)
const searchTimeout = ref(null)
const showDeleteConfirm = ref(false)
const isDeleting = ref(false)
const showFontPicker = ref(false)

const panelTab = ref('design')
const setPanelTab = (tab) => {
  if (tab !== 'design' && tab !== 'commerce') return
  panelTab.value = tab
  router.replace({ query: { ...route.query, tab } })
}
watch(
  () => route.query.tab,
  (t) => {
    if (t === 'design' || t === 'commerce') {
      panelTab.value = t
    }
  },
  { immediate: true },
)

const menuUrl = computed(() => {
  if (process.client) {
    return `${window.location.origin}/${slug}/menu`
  }
  return ''
})

// Clonar el business para edición local
const cloneBusiness = (biz) => {
  if (!biz) return null
  
  // Normalizar el business primero para asegurar estructura consistente
  const normalized = normalizeBusiness(biz)
  const cloned = JSON.parse(JSON.stringify(normalized))
  
  // Asegurar que sections existe
  if (!cloned.sections) {
    cloned.sections = []
  }
  
  // Agregar tagsString a cada item para edición
  cloned.sections.forEach(section => {
    if (section.items && Array.isArray(section.items)) {
      section.items.forEach(item => {
        item.tagsString = item.tags ? item.tags.join(', ') : ''
      })
    }
  })
  
  // Asegurar que socialMedia existe
  if (!cloned.socialMedia) {
    cloned.socialMedia = {
      instagram: '',
      facebook: '',
      whatsapp: '',
      tiktok: '',
    }
  }
  
  // Inicializar deliveryPlatforms si no existe
  if (!cloned.deliveryPlatforms) {
    cloned.deliveryPlatforms = {
      pedidosYa: { url: '', enabled: false },
      rappi: { url: '', enabled: false },
      agilpedido: { url: '', enabled: false },
      pedidodirecto: { url: '', enabled: false }
    }
  }
  
  // Migrar pedidosYaUrl antiguo a deliveryPlatforms si existe
  if (cloned.pedidosYaUrl && !cloned.deliveryPlatforms.pedidosYa.url) {
    cloned.deliveryPlatforms.pedidosYa.url = cloned.pedidosYaUrl
    cloned.deliveryPlatforms.pedidosYa.enabled = true
  }
  
  // Asegurar estructura completa de deliveryPlatforms
  if (!cloned.deliveryPlatforms.pedidosYa) {
    cloned.deliveryPlatforms.pedidosYa = { url: '', enabled: false }
  }
  if (!cloned.deliveryPlatforms.rappi) {
    cloned.deliveryPlatforms.rappi = { url: '', enabled: false }
  }
  if (!cloned.deliveryPlatforms.agilpedido) {
    cloned.deliveryPlatforms.agilpedido = { url: '', enabled: false }
  }
  if (!cloned.deliveryPlatforms.pedidodirecto) {
    cloned.deliveryPlatforms.pedidodirecto = { url: '', enabled: false }
  }
  
  // Asegurar que googleMapsUrl existe
  if (!cloned.googleMapsUrl) {
    cloned.googleMapsUrl = ''
  }

  // Asegurar que address existe
  if (!cloned.address) {
    cloned.address = ''
  }

  // Asegurar que latitude y longitude existen
  if (cloned.latitude === undefined) {
    cloned.latitude = null
  }
  if (cloned.longitude === undefined) {
    cloned.longitude = null
  }
  
  // Asegurar que backgroundColor existe (migrar de primaryColor si es necesario)
  if (!cloned.backgroundColor && cloned.primaryColor) {
    cloned.backgroundColor = cloned.primaryColor
  } else if (!cloned.backgroundColor) {
    cloned.backgroundColor = '#ffffff'
  }
  
  // Asegurar que fontFamily existe
  if (!cloned.fontFamily) {
    cloned.fontFamily = 'inter'
  }
  
  // Inicializar menuLayout si no existe
  if (!cloned.menuLayout) {
    cloned.menuLayout = 'vertical'
  }
  
  // Asegurar que category existe
  if (!cloned.category) {
    cloned.category = 'otro'
  }
  
  // Asegurar que headerImageUrl existe
  if (!cloned.headerImageUrl) {
    cloned.headerImageUrl = ''
  }
  
  // Asegurar que menuLayout existe (por defecto 'vertical')
  if (!cloned.menuLayout) {
    cloned.menuLayout = 'vertical'
  }
  
  // Asegurar que headerImageOverlay existe
  if (cloned.headerImageOverlay === undefined) {
    cloned.headerImageOverlay = false
  }

  // Asegurar que logoUrl existe
  if (!cloned.logoUrl) {
    cloned.logoUrl = ''
  }

  // Asegurar que hideName existe
  if (cloned.hideName === undefined) {
    cloned.hideName = false
  }
  
  // Asegurar que showPrices existe (por defecto true)
  if (cloned.showPrices === undefined) {
    cloned.showPrices = true
  }

  // Asegurar que openingHours existe
  if (!cloned.openingHours) {
    cloned.openingHours = {
      lunes: { open: '09:00', close: '18:00', closed: false },
      martes: { open: '09:00', close: '18:00', closed: false },
      miercoles: { open: '09:00', close: '18:00', closed: false },
      jueves: { open: '09:00', close: '18:00', closed: false },
      viernes: { open: '09:00', close: '18:00', closed: false },
      sabado: { open: '09:00', close: '18:00', closed: false },
      domingo: { open: '09:00', close: '18:00', closed: true },
    }
  }

  return cloned
}

// Detectar cambios
watch(localBusiness, () => {
  if (suppressLocalBusinessSync.value) return
  hasChanges.value = true
  success.value = ''
}, { deep: true })

const handleSave = async () => {
  if (!localBusiness.value) return
  
  error.value = ''
  success.value = ''
  if (successClearTimer.value) {
    clearTimeout(successClearTimer.value)
    successClearTimer.value = null
  }
  isSaving.value = true
  
  try {
    // Limpiar datos antes de guardar
    const businessToSave = JSON.parse(JSON.stringify(localBusiness.value))
    
    // Migrar estructura antigua si existe
    if (businessToSave.menu && businessToSave.menu.sections) {
      businessToSave.sections = businessToSave.menu.sections
      delete businessToSave.menu
    }
    if (!businessToSave.sections) {
      businessToSave.sections = []
    }
    
    // Eliminar promociones si existen (funcionalidad removida)
    if (businessToSave.promotions) {
      delete businessToSave.promotions
    }
    if (businessToSave.promotion) {
      delete businessToSave.promotion
    }
    
    // Normalizar sections e items antes de guardar
    if (!businessToSave.sections) {
      businessToSave.sections = []
    }
    
    // Convertir tagsString a tags y eliminar tagsString, normalizar items
    businessToSave.sections.forEach(section => {
      if (!section.items || !Array.isArray(section.items)) {
        section.items = []
      }
      
      section.items = section.items
        .filter(item => item && item.name && item.name.trim() !== '') // Solo items válidos
        .map(item => {
          const normalizedItem = {
            id: item.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: item.name || '',
            description: item.description || '',
            price: item.price != null ? Number(item.price) : null,
            imageUrl: item.imageUrl || '',
            tags: [],
            isAvailable: item.isAvailable !== false,
          }
          
          // Convertir tagsString a tags
          if (item.tagsString && typeof item.tagsString === 'string') {
            normalizedItem.tags = item.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
          } else if (Array.isArray(item.tags)) {
            normalizedItem.tags = item.tags.filter(tag => tag && typeof tag === 'string')
          }
          
          return normalizedItem
        })
    })
    
    // Filtrar secciones vacías (sin items válidos)
    businessToSave.sections = businessToSave.sections.filter(section => {
      if (!section.items || section.items.length === 0) return false
      return section.name && section.name.trim() !== ''
    })
    
    // Limpiar socialMedia si está vacío
    if (businessToSave.socialMedia) {
      const hasSocialMedia = Object.values(businessToSave.socialMedia).some(val => val && val.trim().length > 0)
      if (!hasSocialMedia) {
        businessToSave.socialMedia = undefined
      }
    }
    
    // Limpiar googleMapsUrl si está vacío
    if (!businessToSave.googleMapsUrl || businessToSave.googleMapsUrl.trim() === '') {
      businessToSave.googleMapsUrl = undefined
    }
    
    // Limpiar deliveryPlatforms: eliminar plataformas deshabilitadas o sin URL
    if (businessToSave.deliveryPlatforms) {
      Object.keys(businessToSave.deliveryPlatforms).forEach(key => {
        const platform = businessToSave.deliveryPlatforms[key]
        if (!platform.enabled || !platform.url || platform.url.trim() === '') {
          delete businessToSave.deliveryPlatforms[key]
        }
      })
      // Si no hay plataformas activas, eliminar el objeto completo
      if (Object.keys(businessToSave.deliveryPlatforms).length === 0) {
        businessToSave.deliveryPlatforms = undefined
      }
    }
    
    // Limpiar headerImageUrl si está vacío
    if (!businessToSave.headerImageUrl || businessToSave.headerImageUrl.trim() === '') {
      businessToSave.headerImageUrl = undefined
      businessToSave.headerImageOverlay = undefined
    }
    
    // Si no hay imagen, no puede haber overlay
    if (!businessToSave.headerImageUrl) {
      businessToSave.headerImageOverlay = undefined
    }
    
    // Aplicar restricciones según el plan
    if (userPlan.value && userPlan.value.id === 'basic' && userRole.value !== 'admin') {
      // Plan básico: solo layout vertical
      businessToSave.menuLayout = 'vertical'
      
      // Plan básico: no puede tener header image, overlay ni logo
      businessToSave.headerImageUrl = undefined
      businessToSave.headerImageOverlay = undefined
      businessToSave.logoUrl = undefined
    }
    
    // Normalizar el business antes de guardar usando el normalizador
    const normalizedBusiness = normalizeBusiness(businessToSave)
    
    if (!normalizedBusiness) {
      error.value = 'Error al normalizar los datos del comercio'
      isSaving.value = false
      return
    }
    
    console.log('handleSave: Normalized business sections:', normalizedBusiness.sections?.length || 0)
    console.log('handleSave: Sections with items:', normalizedBusiness.sections?.filter(s => s.items && s.items.length > 0).length || 0)
    console.log('handleSave: Total items:', normalizedBusiness.sections?.reduce((sum, s) => sum + (s.items?.length || 0), 0) || 0)
    
    try {
      const successResult = await updateBusinessToAPI(slug, normalizedBusiness)
      
      if (!successResult) {
        error.value = 'Error al guardar los cambios. Por favor, intentá nuevamente.'
        isSaving.value = false
        return
      }
    } catch (saveError) {
      console.error('handleSave: Error calling updateBusinessToAPI:', saveError)
      error.value = saveError.data?.message || saveError.message || 'Error al guardar los cambios. Por favor, intentá nuevamente.'
      isSaving.value = false
      return
    }
    
    // Si llegamos aquí, el guardado fue exitoso
    success.value = '¡Cambios guardados correctamente!'
    hasChanges.value = false

    successClearTimer.value = setTimeout(() => {
      success.value = ''
      successClearTimer.value = null
    }, 6000)

    // Recargar el business actualizado
    let updatedBusiness = null
    try {
      updatedBusiness = await fetchBusinessBySlug(slug)
    } catch (e) {
      console.error('Error reloading business after save:', e)
      error.value = 'No se pudo recargar el comercio. Revisá tu conexión.'
    }

    suppressLocalBusinessSync.value = true
    try {
      if (updatedBusiness) {
        const normalizedUpdated = normalizeBusiness(updatedBusiness)
        business.value = normalizedUpdated
        localBusiness.value = cloneBusiness(normalizedUpdated)
        localBusiness.value = { ...localBusiness.value }

        console.log('handleSave: Business reloaded, sections count:', localBusiness.value.sections?.length || 0)
      }

      if (userPlan.value && userPlan.value.id === 'basic' && userRole.value !== 'admin') {
        if (localBusiness.value.menuLayout && localBusiness.value.menuLayout !== 'vertical') {
          localBusiness.value.menuLayout = 'vertical'
        }
        if (localBusiness.value.headerImageUrl) {
          localBusiness.value.headerImageUrl = ''
        }
        if (localBusiness.value.headerImageOverlay) {
          localBusiness.value.headerImageOverlay = false
        }
        if (localBusiness.value.logoUrl) {
          localBusiness.value.logoUrl = ''
        }
      }
    } finally {
      await nextTick()
      suppressLocalBusinessSync.value = false
    }
  } catch (err) {
    console.error('Error saving business:', err)
    error.value = err.data?.message || err.message || 'Error al guardar los cambios. Por favor, intentá nuevamente.'
  } finally {
    isSaving.value = false
  }
}

// Buscar sugerencias de direcciones mientras el usuario escribe
const searchAddresses = async () => {
  // Limpiar timeout anterior
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  // Si la dirección tiene menos de 3 caracteres, no buscar
  if (!localBusiness.value?.address || localBusiness.value.address.trim().length < 3) {
    addressSuggestions.value = []
    showSuggestions.value = false
    return
  }

  // Esperar 300ms después de que el usuario deje de escribir
  searchTimeout.value = setTimeout(async () => {
    try {
      const suggestions = await $fetch('/api/geocode/search', {
        method: 'GET',
        params: { q: localBusiness.value.address },
      })
      addressSuggestions.value = suggestions || []
      showSuggestions.value = true
    } catch (error) {
      console.error('Error searching addresses:', error)
      addressSuggestions.value = []
    }
  }, 300)
}

// Seleccionar una dirección de las sugerencias
const selectAddress = (suggestion) => {
  localBusiness.value.address = suggestion.displayName
  localBusiness.value.latitude = suggestion.latitude
  localBusiness.value.longitude = suggestion.longitude
  addressSuggestions.value = []
  showSuggestions.value = false
  geocodeSuccess.value = true
  hasChanges.value = true
  
  // Limpiar el mensaje después de 5 segundos
  setTimeout(() => {
    geocodeSuccess.value = false
  }, 5000)
}

// Manejar el blur del campo de dirección
const handleAddressBlur = () => {
  // Esperar un poco antes de ocultar las sugerencias para permitir el click
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// Manejar dirección encontrada desde el mapa
const handleAddressFromMap = (address) => {
  localBusiness.value.address = address
  geocodeSuccess.value = true
  hasChanges.value = true
  setTimeout(() => {
    geocodeSuccess.value = false
  }, 5000)
}

// Geocodificar dirección (convertir dirección a coordenadas)
const geocodeAddress = async () => {
  if (!localBusiness.value?.address || !localBusiness.value.address.trim()) {
    geocodeSuccess.value = false
    error.value = 'Por favor, ingresá una dirección'
    setTimeout(() => {
      error.value = ''
    }, 3000)
    return
  }

  geocodeSuccess.value = false
  isLoadingGeocode.value = true
  
  try {
    const response = await $fetch('/api/geocode', {
      method: 'POST',
      body: { address: localBusiness.value.address },
    })

    if (response.success && response.latitude && response.longitude) {
      localBusiness.value.latitude = response.latitude
      localBusiness.value.longitude = response.longitude
      geocodeSuccess.value = true
      hasChanges.value = true
      
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => {
        geocodeSuccess.value = false
      }, 5000)
    } else {
      error.value = response.message || 'No se pudo encontrar la dirección. Intentá ser más específico (incluí ciudad y provincia).'
      setTimeout(() => {
        error.value = ''
      }, 5000)
    }
  } catch (err) {
    console.error('Error geocoding address:', err)
    error.value = 'Error al buscar la dirección. Intentá nuevamente o ingresá las coordenadas manualmente.'
    setTimeout(() => {
      error.value = ''
    }, 5000)
  } finally {
    isLoadingGeocode.value = false
  }
}

// Extraer coordenadas del URL de Google Maps
const extractCoordinatesFromUrl = async () => {
  if (!localBusiness.value?.googleMapsUrl) {
    coordinatesExtracted.value = false
    return
  }

  coordinatesExtracted.value = false
  
  // Intentar extraer directamente del URL
  let coords = extractCoordinatesFromGoogleMapsUrl(localBusiness.value.googleMapsUrl)
  
  // Si es un link corto, intentar resolverlo
  if (!coords && (localBusiness.value.googleMapsUrl.includes('goo.gl') || localBusiness.value.googleMapsUrl.includes('maps.app.goo.gl'))) {
    try {
      coords = await resolveShortUrlAndExtractCoordinates(localBusiness.value.googleMapsUrl)
    } catch (error) {
      console.error('Error resolving short URL:', error)
    }
  }
  
  if (coords && coords.latitude && coords.longitude) {
    localBusiness.value.latitude = coords.latitude
    localBusiness.value.longitude = coords.longitude
    coordinatesExtracted.value = true
    
    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => {
      coordinatesExtracted.value = false
    }, 3000)
  }
}

// Eliminar comercio directamente
const confirmDeleteBusiness = async () => {
  if (isDeleting.value) return
  
  isDeleting.value = true
  error.value = ''
  success.value = ''
  
  try {
    // Obtener token del localStorage
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
      throw new Error('No se encontró el token de autenticación. Por favor, iniciá sesión nuevamente.')
    }

    await $fetch(`/api/businesses/${slug}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    // Redirigir a select-business después de eliminar
    await router.push('/select-business')
  } catch (err) {
    console.error('Error deleting business:', err)
    error.value = err.data?.message || err.message || 'Error al eliminar el comercio. Intentá nuevamente.'
    setTimeout(() => {
      error.value = ''
    }, 5000)
    showDeleteConfirm.value = false
  } finally {
    isDeleting.value = false
  }
}

const loadUserPlan = async () => {
  try {
    // Obtener userId del localStorage
    let userId = null
    if (process.client) {
      const auth = localStorage.getItem('qrmenu-auth')
      if (auth) {
        try {
          const parsed = JSON.parse(auth)
          userId = parsed.userId
        } catch {
          // Error parsing
        }
      }
    }

    if (userId) {
      const response = await $fetch(`/api/users/profile?userId=${userId}`)
      if (response && response.user) {
        if (response.user.plan) {
          userPlan.value = getPlanById(response.user.plan) || getDefaultPlan()
        } else {
          userPlan.value = getDefaultPlan()
        }
        userRole.value = response.user.role || null
      } else {
        userPlan.value = getDefaultPlan()
      }
    } else {
      userPlan.value = getDefaultPlan()
    }
  } catch (err) {
    console.error('Error loading user plan:', err)
    userPlan.value = getDefaultPlan()
  }
}

onMounted(async () => {
  try {
    let fetchedBusiness = null
    try {
      fetchedBusiness = await fetchBusinessBySlug(slug)
    } catch (e) {
      console.error('Error fetching business:', e)
      error.value = 'No se pudo cargar el comercio. Revisá tu conexión e intentá de nuevo.'
      return
    }
    if (!fetchedBusiness) {
      router.push('/select-business')
      return
    }
    suppressLocalBusinessSync.value = true
    try {
      business.value = fetchedBusiness
      localBusiness.value = cloneBusiness(fetchedBusiness)

      if (!localBusiness.value.sections || !Array.isArray(localBusiness.value.sections)) {
        localBusiness.value.sections = []
      }

      await loadUserPlan()

      if (userPlan.value && userPlan.value.id === 'basic' && userRole.value !== 'admin') {
        if (localBusiness.value.menuLayout && localBusiness.value.menuLayout !== 'vertical') {
          localBusiness.value.menuLayout = 'vertical'
        }
        if (localBusiness.value.headerImageUrl) {
          localBusiness.value.headerImageUrl = ''
        }
        if (localBusiness.value.headerImageOverlay) {
          localBusiness.value.headerImageOverlay = false
        }
        if (localBusiness.value.logoUrl) {
          localBusiness.value.logoUrl = ''
        }
      }
    } finally {
      await nextTick()
      suppressLocalBusinessSync.value = false
    }
  } catch (err) {
    console.error('Error loading business:', err)
    error.value = 'Error al cargar el comercio'
  }
})

useHead({
  title: business.value ? `${business.value.name} · Panel` : 'Panel · MapaMorfi',
})
</script>

