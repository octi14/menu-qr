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

      <div v-if="!business" class="text-center py-12">
        <p class="text-slate-600 dark:text-slate-400">Cargando comercio...</p>
      </div>

      <div v-else class="grid min-w-0 gap-8 lg:grid-cols-3">
        <!-- Columna principal - Menú -->
        <div class="min-w-0 space-y-6 lg:col-span-2">
          <!-- Información del comercio -->
          <div class="min-w-0 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-4 sm:p-6">
            <h2 class="text-xl font-semibold mb-4">Información del comercio</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nombre
                </label>
                <input
                  v-model="localBusiness.name"
                  type="text"
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Descripción
                </label>
                <textarea
                  v-model="localBusiness.description"
                  rows="2"
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors resize-none"
                />
              </div>
              <!-- Logo del comercio para el mapa (solo para planes Pro y Enterprise) -->
              <div v-if="userPlan && (userPlan.id === 'professional' || userPlan.id === 'enterprise' || userRole === 'admin')">
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Logo para el mapa
                </label>
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
                <select
                  v-model="localBusiness.fontFamily"
                  class="w-full max-w-full min-w-0 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                >
                  <option
                    v-for="font in AVAILABLE_FONTS"
                    :key="font.id"
                    :value="font.id"
                    :style="{ fontFamily: font.family }"
                  >
                    {{ font.name }} - {{ font.description }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Rubro
                </label>
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
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  El ícono del mapa se mostrará según el rubro seleccionado
                </p>
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
                  URL de la imagen que aparecerá en la parte superior del menú. Disponible para planes Pro y Enterprise.
                </p>
                <div v-if="localBusiness.headerImageUrl" class="mt-3 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 relative">
                  <img
                    :src="localBusiness.headerImageUrl"
                    alt="Vista previa del header"
                    class="w-full h-32 object-cover"
                    @error="localBusiness.headerImageUrl = ''"
                  />
                  <!-- Overlay de preview si está activado -->
                  <div
                    v-if="localBusiness.headerImageOverlay"
                    class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
                  >
                    <span class="text-white font-bold text-lg drop-shadow-lg">{{ localBusiness.name || 'Nombre del comercio' }}</span>
                  </div>
                </div>
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
                    Si está desactivado, los precios se ocultarán en el menú público. <strong>Nota:</strong> Los precios siempre se mostrarán cuando el menú se acceda desde un código QR.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Templates predefinidos (solo para planes Pro y Enterprise) -->
          <div v-if="userPlan && (userPlan.id === 'professional' || userPlan.id === 'enterprise' || userRole === 'admin')" class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
            <TemplateSelector v-model="localBusiness" />
          </div>

          <!-- Selector de Layout de Menú -->
          <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
            <h2 class="text-xl font-semibold mb-4">Diseño del Menú</h2>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Elegí cómo querés que se vea tu menú público
            </p>
            <div v-if="userPlan && userPlan.id === 'basic' && userRole !== 'admin'" class="space-y-4">
              <!-- Solo layout vertical para plan básico -->
              <div class="p-6 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20">
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
                    <div class="font-bold text-base mb-1">Vertical/Clásico</div>
                    <div class="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Secciones colapsables, diseño minimalista
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                      Los layouts avanzados están disponibles en planes Pro y Enterprise.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Vertical/Clásico -->
              <label
                class="relative flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg"
                :class="
                  (localBusiness.menuLayout || 'vertical') === 'vertical'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-900'
                "
              >
                <input
                  v-model="localBusiness.menuLayout"
                  type="radio"
                  value="vertical"
                  class="sr-only"
                />
                <div class="flex-1 flex items-center justify-center mb-4 h-32">
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
                <div class="font-bold text-base mb-2 text-center">Vertical/Clásico</div>
                <div class="text-sm text-slate-600 dark:text-slate-400 text-center">
                  Secciones colapsables, diseño minimalista
                </div>
              </label>
              
              <!-- Tabs/Lista -->
              <label
                class="relative flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg"
                :class="
                  localBusiness.menuLayout === 'tabs'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-900'
                "
              >
                <input
                  v-model="localBusiness.menuLayout"
                  type="radio"
                  value="tabs"
                  class="sr-only"
                />
                <div class="flex-1 flex items-center justify-center mb-4 h-32">
                  <!-- Preview de layout tabs -->
                  <div class="w-full max-w-xs space-y-3">
                    <div class="flex gap-2">
                      <div class="h-6 bg-emerald-500 rounded w-16"></div>
                      <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                      <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                    </div>
                    <div class="flex gap-3 items-center">
                      <div class="w-12 h-12 bg-slate-300 dark:bg-slate-600 rounded"></div>
                      <div class="flex-1 space-y-1">
                        <div class="h-2 bg-slate-300 dark:bg-slate-600 rounded w-3/4"></div>
                        <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                      </div>
                    </div>
                    <div class="flex gap-3 items-center">
                      <div class="w-12 h-12 bg-slate-300 dark:bg-slate-600 rounded"></div>
                      <div class="flex-1 space-y-1">
                        <div class="h-2 bg-slate-300 dark:bg-slate-600 rounded w-3/4"></div>
                        <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="font-bold text-base mb-2 text-center">Tabs/Lista</div>
                <div class="text-sm text-slate-600 dark:text-slate-400 text-center">
                  Tabs por categoría, lista con imágenes
                </div>
              </label>
              
              <!-- Grid/Visual -->
              <label
                class="relative flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg"
                :class="
                  localBusiness.menuLayout === 'grid'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-900'
                "
              >
                <input
                  v-model="localBusiness.menuLayout"
                  type="radio"
                  value="grid"
                  class="sr-only"
                />
                <div class="flex-1 flex items-center justify-center mb-4 h-32">
                  <!-- Preview de layout grid -->
                  <div class="w-full max-w-xs">
                    <div class="grid grid-cols-3 gap-2">
                      <div class="aspect-square bg-slate-300 dark:bg-slate-600 rounded"></div>
                      <div class="aspect-square bg-slate-300 dark:bg-slate-600 rounded"></div>
                      <div class="aspect-square bg-slate-300 dark:bg-slate-600 rounded"></div>
                      <div class="aspect-square bg-slate-300 dark:bg-slate-600 rounded"></div>
                      <div class="aspect-square bg-slate-300 dark:bg-slate-600 rounded"></div>
                      <div class="aspect-square bg-slate-300 dark:bg-slate-600 rounded"></div>
                    </div>
                  </div>
                </div>
                <div class="font-bold text-base mb-2 text-center">Grid/Visual</div>
                <div class="text-sm text-slate-600 dark:text-slate-400 text-center">
                  Grid de ítems con imágenes grandes
                </div>
              </label>
              
              <!-- Categorías/Cards -->
              <label
                class="relative flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg"
                :class="
                  localBusiness.menuLayout === 'categories'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-900'
                "
              >
                <input
                  v-model="localBusiness.menuLayout"
                  type="radio"
                  value="categories"
                  class="sr-only"
                />
                <div class="flex-1 flex items-center justify-center mb-4 h-32">
                  <!-- Preview de layout categorías -->
                  <div class="w-full max-w-xs space-y-2">
                    <div class="border-2 border-slate-300 dark:border-slate-600 rounded-lg p-2">
                      <div class="h-16 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
                      <div class="h-3 bg-slate-400 dark:bg-slate-500 rounded w-2/3 mb-1"></div>
                      <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                    </div>
                    <div class="border-2 border-slate-300 dark:border-slate-600 rounded-lg p-2">
                      <div class="h-16 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
                      <div class="h-3 bg-slate-400 dark:bg-slate-500 rounded w-2/3 mb-1"></div>
                      <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                    </div>
                  </div>
                </div>
                <div class="font-bold text-base mb-2 text-center">Categorías/Cards</div>
                <div class="text-sm text-slate-600 dark:text-slate-400 text-center">
                  Categorías en cards con "Ver menú"
                </div>
              </label>
            </div>
          </div>

          <!-- Secciones del menú -->
          <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold">Secciones del menú</h2>
              <button
                @click="addSection"
                class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nueva sección
              </button>
            </div>

            <div class="space-y-6">
              <div
                v-for="(section, sectionIndex) in localBusiness.sections"
                :key="section.id"
                :draggable="true"
                @dragstart="handleDragStart(sectionIndex, $event)"
                @dragover.prevent="handleDragOver(sectionIndex, $event)"
                @drop="handleDrop(sectionIndex, $event)"
                @dragenter="handleDragEnter(sectionIndex, $event)"
                @dragleave="handleDragLeave(sectionIndex, $event)"
                @dragend="handleDragEnd($event)"
                :class="[
                  'rounded-lg border p-4 space-y-4 transition-all cursor-move',
                  draggedSectionIndex === sectionIndex
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-lg scale-105'
                    : dragOverIndex === sectionIndex
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-800'
                ]"
              >
                <!-- Header de sección con icono de arrastre -->
                <div class="flex items-start justify-between gap-4">
                  <div class="flex items-center gap-2 flex-1">
                    <div 
                      class="text-slate-400 dark:text-slate-500 cursor-grab active:cursor-grabbing flex-shrink-0"
                      @mousedown.stop
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                      </svg>
                    </div>
                    <button
                      @click="toggleSectionCollapse(section.id)"
                      class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex-shrink-0 p-1"
                      @mousedown.stop
                      title="Colapsar/Expandir sección"
                    >
                      <svg 
                        class="h-5 w-5 transition-transform duration-200"
                        :class="{ 'rotate-180': !isSectionCollapsed(section.id) }"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div class="flex-1 space-y-3">
                      <input
                        v-model="section.name"
                        type="text"
                        placeholder="Nombre de la sección"
                        class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors font-semibold"
                        @mousedown.stop
                      />
                      <textarea
                        v-model="section.description"
                        rows="2"
                        placeholder="Descripción (opcional)"
                        class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors resize-none text-sm"
                        @mousedown.stop
                      />
                    </div>
                  </div>
                  <button
                    @click="deleteSection(sectionIndex)"
                    class="rounded-lg border border-red-300 dark:border-red-700 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    @mousedown.stop
                  >
                    Eliminar
                  </button>
                </div>

                <!-- Items de la sección -->
                <div v-show="!isSectionCollapsed(section.id)" class="space-y-3" @mousedown.stop>
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium text-slate-700 dark:text-slate-300">Ítems</h3>
                    <button
                      @click="addItem(sectionIndex)"
                      class="inline-flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                    >
                      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Agregar ítem
                    </button>
                  </div>

                  <div
                    v-for="(item, itemIndex) in section.items"
                    :key="item.id"
                    class="rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-3"
                  >
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex-1 space-y-3">
                        <input
                          v-model="item.name"
                          type="text"
                          placeholder="Nombre del ítem"
                          class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                        />
                        <textarea
                          v-model="item.description"
                          rows="2"
                          placeholder="Descripción (opcional)"
                          class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors resize-none text-sm"
                        />
                        <div class="grid grid-cols-2 gap-3">
                          <div>
                            <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                              Precio
                            </label>
                            <input
                              v-model.number="item.price"
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                            />
                          </div>
                          <div>
                            <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                              URL de imagen
                            </label>
                            <input
                              v-model="item.imageUrl"
                              type="url"
                              placeholder="https://..."
                              class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Tags (separados por comas)
                          </label>
                          <input
                            v-model="item.tagsString"
                            type="text"
                            placeholder="Vegano, Sin gluten, Popular"
                            class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors text-sm"
                            @blur="updateItemTags(sectionIndex, itemIndex)"
                          />
                        </div>
                        <div class="flex items-center gap-2">
                          <input
                            :id="`available-${sectionIndex}-${itemIndex}`"
                            v-model="item.isAvailable"
                            type="checkbox"
                            class="rounded border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500"
                          />
                          <label
                            :for="`available-${sectionIndex}-${itemIndex}`"
                            class="text-sm text-slate-700 dark:text-slate-300"
                          >
                            Disponible
                          </label>
                        </div>
                      </div>
                      <button
                        @click="deleteItem(sectionIndex, itemIndex)"
                        class="rounded-lg border border-red-300 dark:border-red-700 px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div v-if="section.items.length === 0" class="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
                    No hay ítems en esta sección
                  </div>
                </div>
              </div>

              <div v-if="localBusiness.sections.length === 0" class="text-center py-8 text-slate-500 dark:text-slate-400">
                <p class="mb-4">No hay secciones en el menú</p>
                <button
                  @click="addSection"
                  class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
                >
                  Crear primera sección
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
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

// Drag and drop para secciones
const draggedSectionIndex = ref(null)
const dragOverIndex = ref(null)
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
const collapsedSections = ref(new Set())

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
  hasChanges.value = true
  success.value = ''
}, { deep: true })

const addSection = () => {
  if (!localBusiness.value) return
  
  const newSection = {
    id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: '',
    description: '',
    items: [],
  }
  
  localBusiness.value.sections.push(newSection)
}

const deleteSection = (index) => {
  if (!localBusiness.value) return
  if (confirm('¿Estás seguro de que querés eliminar esta sección y todos sus ítems?')) {
    const section = localBusiness.value.sections[index]
    // Remover de las secciones colapsadas si estaba colapsada
    if (section?.id) {
      collapsedSections.value.delete(section.id)
    }
    localBusiness.value.sections.splice(index, 1)
  }
}

const toggleSectionCollapse = (sectionId) => {
  if (collapsedSections.value.has(sectionId)) {
    collapsedSections.value.delete(sectionId)
  } else {
    collapsedSections.value.add(sectionId)
  }
}

const isSectionCollapsed = (sectionId) => {
  return collapsedSections.value.has(sectionId)
}


const addItem = (sectionIndex) => {
  if (!localBusiness.value) return
  if (!localBusiness.value.sections || !localBusiness.value.sections[sectionIndex]) return
  
  // Asegurar que la sección tenga un array de items
  if (!Array.isArray(localBusiness.value.sections[sectionIndex].items)) {
    localBusiness.value.sections[sectionIndex].items = []
  }
  
  const newItem = {
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: '',
    description: '',
    price: null,
    imageUrl: '',
    tags: [],
    tagsString: '',
    isAvailable: true,
  }
  
  localBusiness.value.sections[sectionIndex].items.push(newItem)
}

const deleteItem = (sectionIndex, itemIndex) => {
  if (!localBusiness.value) return
  if (confirm('¿Estás seguro de que querés eliminar este ítem?')) {
    localBusiness.value.sections[sectionIndex].items.splice(itemIndex, 1)
  }
}

const updateItemTags = (sectionIndex, itemIndex) => {
  if (!localBusiness.value) return
  
  const item = localBusiness.value.sections[sectionIndex].items[itemIndex]
  if (item.tagsString) {
    item.tags = item.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
  } else {
    item.tags = []
  }
}

// Funciones de drag and drop para secciones
const handleDragStart = (index, event) => {
  draggedSectionIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/html', event.target)
  // Agregar clase al elemento que se está arrastrando
  if (event.target) {
    event.target.style.opacity = '0.5'
  }
}

const handleDragOver = (index, event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  
  if (draggedSectionIndex.value !== null && draggedSectionIndex.value !== index) {
    dragOverIndex.value = index
  }
}

const handleDragEnter = (index, event) => {
  if (draggedSectionIndex.value !== null && draggedSectionIndex.value !== index) {
    dragOverIndex.value = index
  }
}

const handleDragLeave = (index, event) => {
  // Solo limpiar si realmente salimos del elemento (no de un hijo)
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY
  
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    if (dragOverIndex.value === index) {
      dragOverIndex.value = null
    }
  }
}

const handleDrop = (index, event) => {
  event.preventDefault()
  event.stopPropagation()
  
  if (draggedSectionIndex.value === null || draggedSectionIndex.value === index) {
    draggedSectionIndex.value = null
    dragOverIndex.value = null
    // Restaurar opacidad
    if (event.target) {
      event.target.style.opacity = '1'
    }
    return
  }
  
  if (!localBusiness.value) {
    draggedSectionIndex.value = null
    dragOverIndex.value = null
    return
  }
  
  // Reordenar secciones
  const sections = localBusiness.value.sections
  const draggedSection = sections[draggedSectionIndex.value]
  
  // Remover la sección de su posición original
  sections.splice(draggedSectionIndex.value, 1)
  
  // Insertar en la nueva posición
  const newIndex = draggedSectionIndex.value < index ? index - 1 : index
  sections.splice(newIndex, 0, draggedSection)
  
  // Limpiar estados
  draggedSectionIndex.value = null
  dragOverIndex.value = null
  
  // Restaurar opacidad
  if (event.target) {
    event.target.style.opacity = '1'
  }
  
  // Marcar como cambiado
  hasChanges.value = true
}

// Limpiar estados de drag al finalizar
const handleDragEnd = (event) => {
  draggedSectionIndex.value = null
  dragOverIndex.value = null
  if (event.target) {
    event.target.style.opacity = '1'
  }
}

const handleSave = async () => {
  if (!localBusiness.value) return
  
  error.value = ''
  success.value = ''
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
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        success.value = ''
      }, 3000)
      
      // Recargar el business actualizado
      const updatedBusiness = await fetchBusinessBySlug(slug)
      if (updatedBusiness) {
        // Normalizar el business recuperado
        const normalizedUpdated = normalizeBusiness(updatedBusiness)
        business.value = normalizedUpdated
        localBusiness.value = cloneBusiness(normalizedUpdated)
        
        // Forzar actualización reactiva
        localBusiness.value = { ...localBusiness.value }
        
        console.log('handleSave: Business reloaded, sections count:', localBusiness.value.sections?.length || 0)
      }
      
      // Aplicar restricciones del plan después de cargar
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
    const fetchedBusiness = await fetchBusinessBySlug(slug)
    if (!fetchedBusiness) {
      router.push('/select-business')
      return
    }
    business.value = fetchedBusiness
    localBusiness.value = cloneBusiness(fetchedBusiness)
    
    // Forzar inicialización reactiva de sections si no existen
    if (!localBusiness.value.sections || !Array.isArray(localBusiness.value.sections)) {
      localBusiness.value.sections = []
    }
    
    await loadUserPlan()
    
    // Aplicar restricciones del plan después de cargar
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
  } catch (err) {
    console.error('Error loading business:', err)
    error.value = 'Error al cargar el comercio'
  }
})

useHead({
  title: business.value ? `${business.value.name} · Panel` : 'Panel · MapaMorfi',
})
</script>

