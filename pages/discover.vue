<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 transition-colors antialiased">
    <div class="mx-auto max-w-5xl max-md:px-0 md:px-4 md:py-6 lg:px-8 lg:py-7 max-md:pt-2">
      <h1 class="sr-only">Descubrir comercios</h1>

      <!-- Controles: en mobile flotantes tipo cortina (peek / expandido) -->
      <div
        ref="discoverPanelShellRef"
        :class="discoverPanelShellClassList"
        :style="discoverPanelShellStyle"
      >
        <div v-if="showDiscoverMap && !isMdUp" class="md:hidden">
          <button
            type="button"
            class="flex w-full flex-col items-center gap-0.5 rounded-t-2xl pb-1.5 pt-1 text-slate-500 touch-manipulation dark:text-slate-400"
            aria-label="Deslizá para mostrar u ocultar filtros"
            @click="sheetExpanded = !sheetExpanded"
            @touchstart.passive="onSheetTouchStart"
            @touchmove.prevent="onSheetTouchMove"
            @touchend="onSheetTouchEnd"
          >
            <span class="h-1 w-10 rounded-full bg-slate-400/55 dark:bg-slate-500/50" />
            <span class="text-[9px] font-medium uppercase tracking-wide text-slate-500/80 dark:text-slate-500">{{ sheetExpanded ? 'Deslizá hacia arriba para cerrar' : 'Deslizá hacia abajo para filtros' }}</span>
          </button>
        </div>

        <!-- Filtros (primera fila, tipografía más chica) -->
        <div
          v-if="showDiscoverMap && !isMdUp && !sheetExpanded"
          class="flex items-center gap-1.5 px-2 pb-2 md:hidden"
        >
          <div class="inline-flex shrink-0 rounded-lg border border-slate-200/90 bg-slate-100/95 p-0.5 dark:border-slate-600/55 dark:bg-slate-800/95">
            <!-- Mapa -->
            <button
              type="button"
              class="rounded-md p-1.5 transition-colors"
              :class="discoverView === 'map' ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'"
              aria-label="Mapa"
              @click="focusMapView"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <!-- Lista -->
            <button
              type="button"
              class="rounded-md p-1.5 transition-colors"
              :class="discoverView === 'list' ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'"
              aria-label="Lista"
              @click="discoverView = 'list'"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
          <label for="discover-search-peek" class="sr-only">Buscar comercios</label>
          <input
            id="discover-search-peek"
            v-model="searchQuery"
            type="search"
            autocomplete="off"
            placeholder="Nombre o categoría…"
            class="min-w-0 flex-1 rounded-xl border border-slate-300/85 bg-white/95 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-50"
          />
          <button
            type="button"
            title="Abierto ahora"
            @click="showOpenNow = !showOpenNow"
            :class="[
              'inline-flex shrink-0 items-center gap-1 rounded-lg border px-1.5 py-1.5 text-[10px] font-semibold leading-none transition-colors',
              showOpenNow
                ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                : 'border-slate-300 bg-white/90 text-slate-700 backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900/90 dark:text-slate-200',
            ]"
          >
            <svg class="h-3 w-3 flex-shrink-0 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="max-[380px]:hidden">Ahora</span>
          </button>
        </div>

        <div v-if="!showDiscoverMap || isMdUp || sheetExpanded" class="space-y-2 md:space-y-3 max-md:px-1.5 max-md:pb-2 md:px-0 md:pb-0">
        <div class="flex flex-row items-stretch gap-2 sm:gap-3">
          <div
            class="hidden h-14 w-14 shrink-0 sm:flex sm:items-center sm:justify-center sm:rounded-xl sm:border sm:border-slate-200/90 sm:bg-gradient-to-br sm:from-emerald-500/15 sm:via-slate-50 sm:to-white sm:shadow-sm dark:sm:border-slate-700/80 dark:sm:from-emerald-500/10 dark:sm:via-slate-900 dark:sm:to-slate-950"
            aria-hidden="true"
          >
            <svg class="h-9 w-9 text-emerald-500 dark:text-emerald-400" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="discoverMapGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#34d399" stop-opacity="0.9" />
                  <stop offset="1" stop-color="#059669" stop-opacity="0.85" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="20" r="7" stroke="url(#discoverMapGrad)" stroke-width="2" />
              <path d="M24 27v9" stroke="url(#discoverMapGrad)" stroke-width="2" stroke-linecap="round" />
              <path d="M17 38h14" stroke="url(#discoverMapGrad)" stroke-width="2" stroke-linecap="round" opacity="0.55" />
              <path d="M32 14c2 1.2 3 3.2 3 5.5a8 8 0 11-16 0c0-2.3 1-4.3 3-5.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" opacity="0.35" />
            </svg>
          </div>
          <div class="flex min-w-0 flex-1 flex-row items-center gap-2">
            <label for="discover-search" class="sr-only">Buscar comercios</label>
            <input
              id="discover-search"
              v-model="searchQuery"
              type="search"
              autocomplete="off"
              placeholder="Nombre, descripción o categoría…"
              class="min-w-0 flex-1 rounded-xl border border-slate-300/85 bg-white/95 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-emerald-500/0 backdrop-blur-sm transition-[box-shadow,border-color] placeholder:text-slate-400 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-50 dark:placeholder:text-slate-500 max-md:py-1.5"
            />
            <button
              type="button"
              @click="showOpenNow = !showOpenNow"
              :class="[
                'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border px-2 py-1.5 text-[11px] font-medium leading-none transition-colors sm:px-2.5 sm:py-2 sm:text-xs md:text-[13px]',
                showOpenNow
                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                  : 'border-slate-300 bg-white/90 text-slate-700 backdrop-blur-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800',
              ]"
            >
              <svg class="h-3.5 w-3.5 flex-shrink-0 opacity-90 sm:h-3.5 sm:w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Abierto ahora</span>
            </button>
          </div>
        </div>

        <!-- Filtros (segunda fila, tipografía más chica) -->
        <div class="flex flex-wrap gap-x-3 gap-y-2 items-center text-xs sm:text-sm">

          <!-- Filtro por distancia (solo si hay ubicación) -->
          <div class="flex items-center gap-1.5 sm:gap-2">
            <label class="font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">Dist.</label>
            <select
              v-model="maxDistance"
              class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            >
              <option :value="1">1 km</option>
              <option :value="3">3 km</option>
              <option :value="5">5 km</option>
              <option :value="10">10 km</option>
            </select>
          </div>

          <!-- Ordenamiento: botonera (sin orden alfabético) -->
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span class="font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">Orden</span>
            <div
              class="inline-flex rounded-lg border border-slate-200/90 bg-slate-100/90 p-0.5 dark:border-slate-600/55 dark:bg-slate-800/90"
              role="group"
              aria-label="Ordenar resultados"
            >
              <button
                type="button"
                class="rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm"
                :class="
                  sortBy === 'featured'
                    ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                "
                @click="sortBy = 'featured'"
              >
                Destacados
              </button>
              <button
                type="button"
                class="rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm disabled:cursor-not-allowed disabled:opacity-45"
                :class="
                  sortBy === 'distance'
                    ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                "
                :disabled="false"
                title="Requiere ubicación activa"
                @click="sortBy = 'distance'"
              >
                Más cercanos
              </button>
            </div>
          </div>

          <!-- Contador de resultados -->
          <div class="ml-auto text-xs text-slate-500 dark:text-slate-500 sm:text-sm">
            <span class="font-medium text-slate-700 dark:text-slate-300">{{ filteredBusinesses.length }}</span>
            <span> comercio{{ filteredBusinesses.length !== 1 ? 's' : '' }}</span>
          </div>
        </div>

        <!-- Punto de referencia para distancias y resultados -->
        <div
          v-if="!isLoading"
          class="flex items-start gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-3 py-2.5 text-xs sm:text-sm dark:border-emerald-800/60 dark:bg-emerald-950/35"
          role="status"
        >
          <svg
            class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div class="min-w-0 flex-1 space-y-0.5">
            <p class="font-medium text-emerald-900 dark:text-emerald-100">{{ referenceBanner.title }}</p>
            <p class="text-[11px] leading-snug text-emerald-800/95 dark:text-emerald-200/90 sm:text-xs">
              {{ referenceBanner.detail }}
            </p>
          </div>
        </div>

        <!-- Mensaje de error de ubicación -->
        <div v-if="locationError" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg class="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <p class="font-medium mb-1">{{ locationError.title }}</p>
              <p class="text-xs opacity-90 mb-3">{{ locationError.message }}</p>
              <div class="flex gap-2 flex-wrap">
                <button
                  type="button"
                  @click="requestLocation"
                  class="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors"
                >
                  Reintentar
                </button>
                <button
                  type="button"
                  @click="revertReferenceFromError"
                  class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  Sin ubicación
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones del mapa (ubicación en mobile: FAB sobre el mapa; desktop: aquí) -->
        <div
          v-if="showDiscoverMap"
          class="flex flex-wrap items-center gap-2 border-t border-slate-200/75 pt-2 dark:border-slate-600/45 md:mb-3 md:border-0 md:pt-0"
        >
          <button
            type="button"
            @click="handlePrimaryLocationAction"
            :disabled="isRequestingLocation"
            :title="primaryLocationButtonTitle"
            :class="[
              'hidden px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm md:flex items-center gap-1.5 border border-transparent sm:px-3 sm:py-2 sm:text-sm',
              referenceMode === 'gps'
                ? 'bg-emerald-500 text-white'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 backdrop-blur-sm',
              isRequestingLocation ? 'opacity-50 cursor-not-allowed' : '',
            ]"
          >
            <svg v-if="!isRequestingLocation" class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else class="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ isRequestingLocation ? '…' : primaryLocationButtonLabel }}</span>
          </button>

          <div v-if="isAuthenticated || savedAddresses.length > 0" class="relative">
            <button
              type="button"
              @click="showAddressMenu = !showAddressMenu"
              title="Direcciones guardadas"
              class="min-h-[2.25rem] min-w-0 shrink px-2 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-sm flex items-center justify-center gap-1 sm:px-3 sm:py-2 sm:text-sm sm:gap-2 max-md:gap-1.5"
            >
              <svg class="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="min-w-0 max-w-[6rem] truncate text-left sm:max-w-none">Guardadas</span>
              <svg class="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Evita que taps fuera cierren al abrir en mobile -->
            <div
              v-if="showAddressMenu && !isMdUp"
              class="fixed inset-0 z-[649] bg-slate-950/35 md:hidden"
              aria-hidden="true"
              @click="showAddressMenu = false"
            />

            <div
              v-if="showAddressMenu"
              class="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 overflow-y-auto"
              :class="
                isMdUp
                  ? 'absolute top-full right-0 z-[650] mt-2 max-h-80 w-72 max-w-[calc(100vw-2rem)] shadow-lg sm:w-64'
                  : 'fixed left-3 right-3 top-32 z-[650] max-h-[min(70vh,22rem)] shadow-2xl'
              "
            >
              <div v-if="savedAddresses.length > 0" class="p-2">
                <div class="mb-1 px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400">Direcciones guardadas</div>
                <button
                  v-for="address in savedAddresses"
                  :key="address.id"
                  type="button"
                  @click="selectSavedAddress(address)"
                  :class="[
                    'mb-1 w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800',
                    activeSavedAddress && activeSavedAddress.id === address.id
                      ? 'border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
                      : '',
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="text-sm font-medium text-slate-900 dark:text-slate-50">{{ address.name }}</div>
                      <div class="truncate text-xs text-slate-500 dark:text-slate-400">{{ address.address }}</div>
                    </div>
                    <svg
                      v-if="activeSavedAddress && activeSavedAddress.id === address.id"
                      class="ml-2 h-4 w-4 flex-shrink-0 text-emerald-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>
              <div v-else class="p-4 text-center text-sm text-slate-500 dark:text-slate-400">No tenés direcciones guardadas</div>
              <div v-if="isAuthenticated" class="border-t border-slate-200 p-2 dark:border-slate-700">
                <NuxtLink
                  to="/saved-addresses"
                  @click="showAddressMenu = false"
                  class="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-emerald-600 transition-colors hover:bg-slate-100 dark:text-emerald-400 dark:hover:bg-slate-800"
                >
                  <div class="flex items-center gap-2">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Gestionar direcciones
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Mapa / Lista -->
        <div
          v-if="showDiscoverMap"
          class="mt-2 flex gap-1 rounded-xl border border-slate-200/90 bg-slate-100/95 p-1 dark:border-slate-600/55 dark:bg-slate-800/95 md:mt-3 md:max-w-md md:mx-auto"
          role="tablist"
          aria-label="Vista de resultados"
        >
          <button
            type="button"
            role="tab"
            :aria-selected="discoverView === 'map'"
            class="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-colors md:py-2.5 md:text-sm"
            :class="
              discoverView === 'map'
                ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            "
            @click="focusMapView"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Mapa
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="discoverView === 'list'"
            class="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-colors md:py-2.5 md:text-sm"
            :class="
              discoverView === 'list'
                ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            "
            @click="discoverView = 'list'"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Lista
          </button>
        </div>
        </div>
      </div>

      <!-- Loading -->
      <AppLoadingScreen
        v-if="isLoading"
        title="Cargando comercios…"
        subtitle="Buscando menús en el mapa"
      />

      <!-- Mapa + lista (conmutador Mapa / Lista en todos los tamaños) -->
      <div v-else-if="showDiscoverMap" class="relative z-[1] md:mb-8">
        <div
          class="relative"
          :class="discoverView === 'list' ? 'hidden' : ''"
        >
          <BusinessMap
            immersive
            :businesses="allBusinessesForMap"
            :user-location="referenceLocationForMap"
            :user-location-label="referenceLocationMapLabel"
            :center="mapCenter"
            :zoom="mapZoom"
            :show-no-businesses-message="filteredBusinesses.length === 0"
            :show-user-location-popup="showUserLocationPopup"
            class="w-full"
          />
          <!-- Ubicación actual: solo mobile, sobre el mapa (no en el panel flotante) -->
          <button
            type="button"
            class="pointer-events-auto absolute bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] right-3 z-[1100] flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/90 bg-white text-emerald-600 shadow-lg backdrop-blur-sm transition-[transform,box-shadow] hover:scale-[1.03] active:scale-[0.98] dark:border-slate-600/80 dark:bg-slate-900/95 dark:text-emerald-400 md:hidden touch-manipulation"
            :class="referenceMode === 'gps' ? 'ring-2 ring-emerald-500/55 ring-offset-2 ring-offset-transparent dark:ring-offset-slate-950' : ''"
            :disabled="isRequestingLocation"
            :title="primaryLocationButtonTitle"
            :aria-pressed="referenceMode === 'gps'"
            aria-label="Ubicación en vivo o volver al punto de referencia"
            @click="handlePrimaryLocationAction"
          >
            <svg v-if="!isRequestingLocation" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else class="h-6 w-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div
          class="space-y-6 max-md:mt-3 max-md:space-y-5 max-md:px-4 md:mt-8 md:px-0"
          :class="discoverView === 'map' ? 'hidden' : ''"
          :style="listViewPaddingStyle"
        >
        <!-- Lista de comercios con más información -->
        <div v-if="filteredBusinesses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="business in filteredBusinesses"
            :key="business.id || business.slug"
            class="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-xl transition-all duration-200"
          >
            <NuxtLink :to="`/${business.slug}/menu`" class="block">
              <!-- Imagen de header o placeholder -->
              <div
                v-if="business.headerImageUrl"
                class="h-56 bg-slate-200 dark:bg-slate-800 relative overflow-hidden"
              >
                <img
                  :src="business.headerImageUrl"
                  :alt="business.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <!-- Badges superiores -->
                <div class="absolute top-3 right-3 flex flex-col gap-2 items-end">
                  <!-- Badge de "Destacado" para comercios enterprise -->
                  <div
                    v-if="business.isEnterprise"
                    class="px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold flex items-center gap-1 shadow-lg"
                    title="Comercio destacado"
                  >
                    <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Destacado
                  </div>
                  <!-- Badge de "Abierto ahora" -->
                  <div
                    v-if="isBusinessOpenNow(business)"
                    class="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-lg"
                  >
                    <div class="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                    Abierto
                  </div>
                </div>
              </div>
              <div
                v-else
                class="h-56 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center relative"
              >
                <!-- Badges superiores (sin imagen) -->
                <div class="absolute top-3 right-3 flex flex-col gap-2 items-end">
                  <div
                    v-if="business.isEnterprise"
                    class="px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-semibold flex items-center gap-1 shadow-lg"
                  >
                    <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Destacado
                  </div>
                  <div
                    v-if="isBusinessOpenNow(business)"
                    class="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-lg"
                  >
                    <div class="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                    Abierto
                  </div>
                </div>
                <div class="text-5xl font-bold text-emerald-600 dark:text-emerald-300">
                  {{ business.name?.charAt(0)?.toUpperCase() || '?' }}
                </div>
              </div>

              <!-- Contenido con más información -->
              <div class="p-6">
                <!-- Nombre y categoría -->
                <div class="mb-3">
                  <h3 class="text-xl font-bold mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {{ business.name }}
                  </h3>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span
                      v-if="getCategoryName(business.category)"
                      class="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                    >
                      {{ getCategoryName(business.category) }}
                    </span>
                    <span
                      v-if="business.isEnterprise"
                      class="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-1"
                    >
                      <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Destacado
                    </span>
                  </div>
                </div>

                <!-- Descripción -->
                <p v-if="business.description" class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                  {{ business.description }}
                </p>

                <!-- Horarios -->
                <div v-if="business.openingHours" class="mb-4">
                  <div class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-medium">{{ isBusinessOpenNow(business) ? 'Abierto ahora' : 'Cerrado ahora' }}</span>
                  </div>
                  <div class="text-xs text-slate-500 dark:text-slate-500 pl-6">
                    {{ getTodayHours(business.openingHours) }}
                  </div>
                </div>

                <!-- Teléfono y dirección (si están disponibles) -->
                <div v-if="business.socialMedia?.whatsapp || business.address" class="mb-4 space-y-2">
                  <div v-if="business.socialMedia?.whatsapp" class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a :href="`https://wa.me/${business.socialMedia.whatsapp.replace(/[^0-9]/g, '')}`" target="_blank" @click.stop class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1">
                      {{ business.socialMedia.whatsapp }}
                      <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </a>
                  </div>
                  <div v-if="business.address" class="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <svg class="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="line-clamp-2">{{ business.address }}</span>
                  </div>
                </div>

                <!-- Distancia y acciones -->
                <div class="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div v-if="business.distance != null" class="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ business.distance < 1 ? `${Math.round(business.distance * 1000)}m` : `${business.distance.toFixed(1)}km` }} de distancia
                  </div>
                  <NuxtLink
                    :to="`/${business.slug}/menu`"
                    class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors text-sm font-semibold"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Ver menú
                  </NuxtLink>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Sin resultados por radio (solo búsqueda/categoría/abierto no activos) -->
        <div
          v-else-if="filteredBusinesses.length === 0 && businesses.length > 0 && !searchQuery.trim() && !showOpenNow"
          class="mb-6 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-6 text-center"
        >
          <div class="flex flex-col items-center gap-3">
            <svg class="h-12 w-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <h3 class="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-1">Sin resultados en {{ maxDistance }} km</h3>
              <p class="text-sm text-amber-700 dark:text-amber-300">
                Probá aumentar el radio o cambiar el punto de referencia (Obelisco, dirección guardada o GPS).
              </p>
            </div>
            <button
              type="button"
              @click="maxDistance = 10"
              class="mt-2 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              Ampliar a 10 km
            </button>
          </div>
        </div>

        <div
          v-else-if="filteredBusinesses.length === 0 && businesses.length > 0"
          class="rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-10 text-center dark:border-slate-700 dark:bg-slate-900/30"
        >
          <p class="text-sm text-slate-600 dark:text-slate-400">
            No hay comercios que coincidan con tu búsqueda o filtros. Probá ajustar términos o desactivar «Abierto ahora».
          </p>
        </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { watch, computed, nextTick, onMounted, onUnmounted, watchEffect } from 'vue'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()

// No necesitamos useBusinesses aquí, usamos el endpoint público directamente

const businesses = ref([])
/** Tras el primer fetch con referencia resuelta; evita que el watch dispare antes del primer load */
const discoverListReady = ref(false)
const isLoading = ref(true)
const searchQuery = ref('')
/** Coordenadas GPS cuando referenceMode === 'gps' */
const userLocation = ref(null)
/** Punto de referencia para distancias: obelisco | gps | dirección guardada | url */
const referenceMode = ref('obelisco')
const activeSavedAddress = ref(null)
const urlReferenceCoords = ref(null)
const locationError = ref(null)
const isRequestingLocation = ref(false)
const isLocalIP = ref(false)
const savedAddresses = ref([])
const selectedSavedAddress = ref('')
const isAuthenticated = ref(false)
const showOpenNow = ref(false)
const showUserLocationPopup = ref(false) // Controla si se muestra el popup de "Tu ubicación"
const showAddressMenu = ref(false)
const maxDistance = ref(3) // Distancia máxima en km (3km por defecto)
const sortBy = ref('featured') // 'featured' | 'distance'

/** 'map' | 'list' — vista principal en mobile y desktop */
const discoverView = ref('map')
/** Panel tipo cortina en mobile (mapa): compacto vs expandido */
const sheetExpanded = ref(false)

/** Mapa visible tras cargar comercios (aunque la lista filtrada quede vacía) */
const showDiscoverMap = computed(() => !isLoading.value)

watch(showDiscoverMap, (visible) => {
  if (visible) {
    discoverView.value = 'map'
    sheetExpanded.value = false
  }
})

const focusMapView = () => {
  discoverView.value = 'map'
  if (process.client) {
    nextTick(() => {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'))
        setTimeout(() => window.dispatchEvent(new Event('resize')), 250)
      })
    })
  }
}

const discoverPanelShellRef = ref(null)
const floatingPanelHeightPx = ref(0)
const isMdUp = ref(
  typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true,
)

let sheetTouchStartY = 0
let sheetTouchDragging = false

const measureDiscoverPanel = () => {
  nextTick(() => {
    const el = discoverPanelShellRef.value
    if (process.client && el) {
      floatingPanelHeightPx.value = el.getBoundingClientRect().height
    }
  })
}

const discoverPanelShellStyle = computed(() => {
  if (!showDiscoverMap.value || isMdUp.value) return {}
  return {
    maxHeight: sheetExpanded.value ? 'min(52vh, 440px)' : '138px',
    transition: 'max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
  }
})

const discoverPanelShellClassList = computed(() => {
  if (!showDiscoverMap.value) {
    return 'space-y-2 md:mb-5 md:space-y-3 mb-4 md:mb-0'
  }
  return [
    'space-y-2 md:mb-5 md:space-y-3',
    'max-md:fixed max-md:left-2 max-md:right-2 max-md:top-2 max-md:z-[600]',
    'max-md:rounded-2xl max-md:border max-md:border-white/30 max-md:bg-white/88',
    'max-md:shadow-xl max-md:backdrop-blur-xl max-md:dark:border-slate-600/45 max-md:dark:bg-slate-950/82',
    !isMdUp.value && sheetExpanded.value ? 'max-md:overflow-y-auto max-md:overflow-x-hidden' : '',
    !isMdUp.value && !sheetExpanded.value ? 'max-md:overflow-hidden' : '',
  ]
    .filter(Boolean)
    .join(' ')
})

const listViewPaddingStyle = computed(() => {
  if (!process.client || !showDiscoverMap.value || discoverView.value !== 'list' || isMdUp.value) {
    return {}
  }
  const h = floatingPanelHeightPx.value
  if (h <= 0) return {}
  return { paddingTop: `${Math.round(h) + 8}px` }
})

watchEffect((onCleanup) => {
  if (!process.client) return
  const el = discoverPanelShellRef.value
  if (!el || typeof ResizeObserver === 'undefined') return
  const ro = new ResizeObserver(() => {
    floatingPanelHeightPx.value = el.getBoundingClientRect().height
  })
  ro.observe(el)
  onCleanup(() => ro.disconnect())
})

let mediaQuery = null
const onMediaQueryChange = () => {
  if (mediaQuery) isMdUp.value = mediaQuery.matches
  measureDiscoverPanel()
}

onMounted(() => {
  if (!process.client) return
  mediaQuery = window.matchMedia('(min-width: 768px)')
  isMdUp.value = mediaQuery.matches
  mediaQuery.addEventListener('change', onMediaQueryChange)
  window.addEventListener('resize', measureDiscoverPanel)
  nextTick(measureDiscoverPanel)
})

onUnmounted(() => {
  if (process.client && mediaQuery) {
    mediaQuery.removeEventListener('change', onMediaQueryChange)
  }
  if (process.client) {
    window.removeEventListener('resize', measureDiscoverPanel)
  }
})

const onSheetTouchStart = (e) => {
  sheetTouchStartY = e.touches[0].clientY
  sheetTouchDragging = true
}

const onSheetTouchMove = (e) => {
  if (!sheetTouchDragging) return
  const y = e.touches[0].clientY
  const dy = y - sheetTouchStartY
  if (dy > 44) {
    sheetExpanded.value = true
    sheetTouchDragging = false
  } else if (dy < -44) {
    sheetExpanded.value = false
    sheetTouchDragging = false
  }
}

const onSheetTouchEnd = () => {
  sheetTouchDragging = false
}

const OBELISCO_COORDS = [-34.6037, -58.3816]

const referenceCoords = computed(() => {
  if (referenceMode.value === 'gps' && userLocation.value) {
    return {
      latitude: userLocation.value.latitude,
      longitude: userLocation.value.longitude,
    }
  }
  if (referenceMode.value === 'url' && urlReferenceCoords.value) {
    return urlReferenceCoords.value
  }
  if (referenceMode.value === 'saved' && activeSavedAddress.value) {
    return {
      latitude: activeSavedAddress.value.latitude,
      longitude: activeSavedAddress.value.longitude,
    }
  }
  return {
    latitude: OBELISCO_COORDS[0],
    longitude: OBELISCO_COORDS[1],
  }
})

const referenceBanner = computed(() => {
  const r = maxDistance.value
  const suffix = `Comercios hasta ${r} km desde este punto.`
  if (referenceMode.value === 'url') {
    return {
      title: 'Referencia: ubicación del enlace',
      detail: `Coordenadas recibidas por la URL. ${suffix}`,
    }
  }
  if (referenceMode.value === 'gps') {
    return {
      title: 'Referencia: tu ubicación (GPS)',
      detail: `Distancias desde donde estás ahora. ${suffix}`,
    }
  }
  if (referenceMode.value === 'saved' && activeSavedAddress.value) {
    return {
      title: `Referencia: ${activeSavedAddress.value.name}`,
      detail: `${activeSavedAddress.value.address}. ${suffix}`,
    }
  }
  return {
    title: 'Referencia: Obelisco (CABA)',
    detail: `Por defecto usamos el centro de la ciudad hasta que actives el GPS. ${suffix}`,
  }
})

/** Punto de referencia en el mapa (Obelisco, GPS, dirección guardada o URL) — no solo GPS en vivo */
const referenceLocationForMap = computed(() => {
  const c = referenceCoords.value
  if (c.latitude == null || c.longitude == null || Number.isNaN(c.latitude) || Number.isNaN(c.longitude)) {
    return null
  }
  return { latitude: c.latitude, longitude: c.longitude }
})

const referenceLocationMapLabel = computed(() => {
  if (referenceMode.value === 'gps') {
    return 'Tu ubicación (GPS en vivo)'
  }
  if (referenceMode.value === 'saved' && activeSavedAddress.value) {
    return `Tu referencia: ${activeSavedAddress.value.name}`
  }
  if (referenceMode.value === 'url') {
    return 'Punto de referencia (enlace)'
  }
  return 'Referencia: Obelisco (centro CABA)'
})

const primaryLocationButtonLabel = computed(() =>
  referenceMode.value === 'gps' ? 'Volver' : 'GPS',
)

const primaryLocationButtonTitle = computed(() => {
  if (referenceMode.value === 'gps') {
    return isAuthenticated.value && savedAddresses.value.length > 0
      ? 'Volver a tu dirección guardada'
      : 'Volver al Obelisco'
  }
  return 'Activar ubicación en vivo'
})

const mapCenter = computed(() => {
  const c = referenceCoords.value
  return [c.latitude, c.longitude]
})

/** Zoom inicial más cercano (~manzanas); si hay varios marcadores, el mapa ajusta el encuadre */
const mapZoom = computed(() => 15)

// Comercios con coordenadas para el mapa
const businessesWithCoordinates = computed(() => {
  return filteredBusinesses.value.filter(business => 
    business.latitude != null && 
    business.longitude != null &&
    !isNaN(business.latitude) &&
    !isNaN(business.longitude)
  )
})

// Todos los comercios para el mapa (solo MapaMorfi)
const allBusinessesForMap = computed(() => {
  return businessesWithCoordinates.value
})


// Comercios públicos cercanos al punto de referencia (servidor filtra por radio; reduce payload)
const loadBusinesses = async () => {
  try {
    const c = referenceCoords.value
    const radiusKm = maxDistance.value
    console.log('discover.vue: Loading public businesses near', c.latitude, c.longitude, `r=${radiusKm}km`)
    businesses.value = await $fetch('/api/businesses/public', {
      query: {
        lat: c.latitude,
        lng: c.longitude,
        radiusKm,
      },
    })
    console.log('discover.vue: Loaded', businesses.value?.length || 0, 'businesses')
  } catch (error) {
    console.error('Error loading businesses:', error)
    console.error('Error details:', {
      statusCode: error.statusCode,
      status: error.status,
      message: error.message,
      data: error.data
    })
    businesses.value = []
  }
}

watch(
  () => [
    referenceCoords.value.latitude,
    referenceCoords.value.longitude,
    maxDistance.value,
  ],
  async () => {
    if (!process.client || !discoverListReady.value) return
    await loadBusinesses()
  },
)

// Calcular total de ítems
const getTotalItems = (business) => {
  const sections = business.menu?.sections || business.sections
  if (!sections?.length) return 0
  return sections.reduce((total, section) => {
    return total + (section.items?.length || 0)
  }, 0)
}

// Obtener nombre de categoría
const { getCategoryById } = useBusinessCategories()
const getCategoryName = (categoryId) => {
  if (!categoryId) return null
  const category = getCategoryById(categoryId)
  return category ? category.name : null
}

// Obtener horarios de hoy
const getTodayHours = (openingHours) => {
  if (!openingHours) return null
  
  const now = new Date()
  const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
  const today = dayNames[now.getDay()]
  const todayHours = openingHours[today]
  
  if (!todayHours || todayHours.closed) {
    return 'Cerrado hoy'
  }
  
  return `${todayHours.open} - ${todayHours.close}`
}

// Función para verificar si un comercio está abierto ahora
const isBusinessOpenNow = (business) => {
  if (!business.openingHours) return true // Si no tiene horarios, asumir que está abierto
  
  const now = new Date()
  const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
  const today = dayNames[now.getDay()]
  const todayHours = business.openingHours[today]
  
  if (!todayHours || todayHours.closed) return false
  
  const [openHour, openMin] = todayHours.open.split(':').map(Number)
  const [closeHour, closeMin] = todayHours.close.split(':').map(Number)
  const currentHour = now.getHours()
  const currentMin = now.getMinutes()
  
  const openTime = openHour * 60 + openMin
  const closeTime = closeHour * 60 + closeMin
  const currentTime = currentHour * 60 + currentMin
  
  return currentTime >= openTime && currentTime <= closeTime
}

// Filtrar comercios
const filteredBusinesses = computed(() => {
  let filtered = businesses.value

  // Filtro de búsqueda (incluye nombre de categoría para mobile sin selector)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(business => {
      const catName = getCategoryName(business.category)
      return (
        business.name?.toLowerCase().includes(query) ||
        business.description?.toLowerCase().includes(query) ||
        business.slug?.toLowerCase().includes(query) ||
        (catName && catName.toLowerCase().includes(query))
      )
    })
  }

  // Filtro por "abierto ahora"
  if (showOpenNow.value) {
    filtered = filtered.filter(business => isBusinessOpenNow(business))
  }

  // Proximidad desde el punto de referencia (Obelisco, GPS, dirección guardada o URL)
  filtered = filtered.filter(
    (business) =>
      business.latitude != null &&
      business.longitude != null &&
      !isNaN(business.latitude) &&
      !isNaN(business.longitude),
  )
  const refLat = referenceCoords.value.latitude
  const refLng = referenceCoords.value.longitude
  filtered = filtered.map((business) => {
    const distance = calculateDistance(refLat, refLng, business.latitude, business.longitude)
    return { ...business, distance }
  })
  // El API ya devuelve solo comercios dentro de radiusKm (= maxDistance); este filtro es redundante pero asegura coherencia
  filtered = filtered.filter((business) => business.distance <= maxDistance.value)

  const sortMode = sortBy.value === 'distance' ? 'distance' : 'featured'

  if (sortMode === 'featured') {
    filtered = filtered.sort((a, b) => {
      if (a.isEnterprise && !b.isEnterprise) return -1
      if (!a.isEnterprise && b.isEnterprise) return 1
      if (a.distance != null && b.distance != null) {
        return a.distance - b.distance
      }
      return 0
    })
  } else {
    filtered = filtered.sort((a, b) => {
      const distA = a.distance != null ? a.distance : Infinity
      const distB = b.distance != null ? b.distance : Infinity
      return distA - distB
    })
  }

  return filtered
})

// Calcular distancia en kilómetros usando fórmula de Haversine
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radio de la Tierra en kilómetros
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Verificar permisos de geolocalización
const checkGeolocationPermission = async () => {
  if (!process.client || !navigator.permissions) {
    return null // API de Permissions no disponible, retornar null
  }
  
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' })
    return result.state // 'granted', 'denied', o 'prompt'
  } catch (error) {
    console.warn('Error checking geolocation permission:', error)
    return null
  }
}

// Solicitar ubicación del usuario (GPS en vivo)
const requestLocation = async () => {
  locationError.value = null
  isRequestingLocation.value = true

  if (process.client) {
    localStorage.removeItem('mapamorfi-delivery-address')
  }

  if (!process.client) {
    locationError.value = {
      title: 'Error de geolocalización',
      message: 'La geolocalización solo está disponible en el navegador.',
    }
    isRequestingLocation.value = false
    return
  }

  if (!navigator.geolocation) {
    locationError.value = {
      title: 'Geolocalización no soportada',
      message: 'Tu navegador no soporta geolocalización. Probá con otro navegador o actualizá el tuyo.',
    }
    isRequestingLocation.value = false
    return
  }

  const permissionState = await checkGeolocationPermission()
  if (permissionState === 'denied') {
    locationError.value = {
      title: 'Permisos de ubicación denegados',
      message: 'Los permisos de ubicación están denegados. Por favor, permití el acceso a tu ubicación en la configuración del navegador y luego intentá nuevamente.',
    }
    isRequestingLocation.value = false
    return
  }

  const options =
    permissionState === 'granted'
      ? { enableHighAccuracy: true, timeout: 12000, maximumAge: 120000 }
      : { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
      referenceMode.value = 'gps'
      activeSavedAddress.value = null
      urlReferenceCoords.value = null
      locationError.value = null
      isRequestingLocation.value = false
      showUserLocationPopup.value = true
    },
    (error) => {
      console.error('Error getting location:', error)
      isRequestingLocation.value = false
      
      let errorMessage = {
        title: 'No se pudo obtener tu ubicación',
        message: '',
      }

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage.title = 'Permisos de ubicación denegados'
          errorMessage.message = 'Permití el acceso a tu ubicación en la configuración del navegador. Buscá el ícono de candado o configuración en la barra de direcciones y habilitá los permisos de ubicación. Luego podés hacer clic en "Reintentar".'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage.title = 'Ubicación no disponible'
          errorMessage.message = 'No se pudo determinar tu ubicación. Verificá que el GPS esté activado y que tengas señal.'
          break
        case error.TIMEOUT:
          errorMessage.title = 'Tiempo de espera agotado'
          errorMessage.message = 'La solicitud de ubicación tardó demasiado. Verificá tu conexión y tu señal GPS.'
          break
        default:
          errorMessage.message = 'Ocurrió un error inesperado al obtener tu ubicación. Verificá los permisos del navegador.'
          break
      }

      locationError.value = errorMessage
    },
    options
  )
}

function leaveGpsMode() {
  userLocation.value = null
  locationError.value = null
  if (isAuthenticated.value && savedAddresses.value.length > 0) {
    referenceMode.value = 'saved'
    activeSavedAddress.value = savedAddresses.value[0]
  } else {
    referenceMode.value = 'obelisco'
    activeSavedAddress.value = null
  }
}

function handlePrimaryLocationAction() {
  if (referenceMode.value === 'gps') {
    leaveGpsMode()
    return
  }
  locationError.value = null
  requestLocation()
}

function revertReferenceFromError() {
  locationError.value = null
  isRequestingLocation.value = false
  userLocation.value = null
  if (isAuthenticated.value && savedAddresses.value.length > 0) {
    referenceMode.value = 'saved'
    activeSavedAddress.value = savedAddresses.value[0]
  } else {
    referenceMode.value = 'obelisco'
    activeSavedAddress.value = null
  }
}

async function requestGuestGps() {
  if (!process.client || isAuthenticated.value) return
  const perm = await checkGeolocationPermission()
  if (perm === 'denied') return
  await requestLocation()
}

// Detectar si estamos en desarrollo local
const checkIfLocalIP = () => {
  if (process.client) {
    const hostname = window.location.hostname
    // Si no es localhost y no es un dominio, probablemente es una IP local
    isLocalIP.value = hostname !== 'localhost' && hostname !== '127.0.0.1' && /^\d+\.\d+\.\d+\.\d+$/.test(hostname)
  }
}

// Cargar direcciones guardadas
const loadSavedAddresses = async () => {
  if (!process.client) return
  
  const auth = localStorage.getItem('qrmenu-auth')
  if (auth) {
    try {
      const parsed = JSON.parse(auth)
      if (parsed.loggedIn === true && parsed.token) {
        isAuthenticated.value = true
        try {
          const response = await $fetch('/api/saved-addresses', {
            headers: {
              'Authorization': `Bearer ${parsed.token}`,
            },
          })
          savedAddresses.value = response || []
        } catch (err) {
          console.error('Error loading saved addresses:', err)
        }
      }
    } catch {
      // Error parsing
    }
  }
}

// Usar dirección guardada (selector legacy si existe en template)
const useSavedAddress = () => {
  if (!selectedSavedAddress.value) {
    referenceMode.value = 'obelisco'
    activeSavedAddress.value = null
    userLocation.value = null
    return
  }

  const address = savedAddresses.value.find((a) => a.id === selectedSavedAddress.value)
  if (address) {
    referenceMode.value = 'saved'
    activeSavedAddress.value = address
    userLocation.value = null
    locationError.value = null
  }
}

const selectSavedAddress = (address) => {
  referenceMode.value = 'saved'
  activeSavedAddress.value = address
  userLocation.value = null
  locationError.value = null
  showAddressMenu.value = false
  showUserLocationPopup.value = true

  if (process.client) {
    localStorage.setItem(
      'mapamorfi-delivery-address',
      JSON.stringify({
        id: address.id,
        name: address.name,
        address: address.address,
        latitude: address.latitude,
        longitude: address.longitude,
      }),
    )
  }
}

const checkUrlParams = () => {
  if (!process.client) return

  const lat = route.query.lat
  const lng = route.query.lng

  if (lat && lng) {
    urlReferenceCoords.value = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
    }
    referenceMode.value = 'url'
    activeSavedAddress.value = null
    userLocation.value = null
  }
}

function attachAddressMenuOutsideClick() {
  if (!process.client) return
  document.addEventListener('click', (e) => {
    if (showAddressMenu.value && !e.target.closest('.relative')) {
      showAddressMenu.value = false
    }
  })
}

onMounted(async () => {
  checkIfLocalIP()
  isLoading.value = true
  await loadSavedAddresses()
  checkUrlParams()

  if (referenceMode.value === 'url') {
    attachAddressMenuOutsideClick()
    await loadBusinesses()
    discoverListReady.value = true
    isLoading.value = false
    return
  }

  if (isAuthenticated.value && savedAddresses.value.length > 0) {
    referenceMode.value = 'saved'
    activeSavedAddress.value = savedAddresses.value[0]
    if (process.client && activeSavedAddress.value) {
      const a = activeSavedAddress.value
      localStorage.setItem(
        'mapamorfi-delivery-address',
        JSON.stringify({
          id: a.id,
          name: a.name,
          address: a.address,
          latitude: a.latitude,
          longitude: a.longitude,
        }),
      )
    }
    attachAddressMenuOutsideClick()
    await loadBusinesses()
    discoverListReady.value = true
    isLoading.value = false
    return
  }

  referenceMode.value = 'obelisco'
  activeSavedAddress.value = null
  await loadBusinesses()
  discoverListReady.value = true
  isLoading.value = false
  await requestGuestGps()
  attachAddressMenuOutsideClick()
})

useHead({
  title: 'Descubrir comercios · MapaMorfi',
  meta: [
    {
      name: 'description',
      content: 'Descubrí menús de restaurantes, bares y comercios cerca de vos. Explora comercios locales con menús digitales accesibles por QR.'
    },
    {
      property: 'og:title',
      content: 'Descubrir comercios · MapaMorfi'
    },
    {
      property: 'og:description',
      content: 'Descubrí menús de restaurantes, bares y comercios cerca de vos. Explora comercios locales con menús digitales accesibles por QR.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      name: 'twitter:card',
      content: 'summary'
    },
    {
      name: 'twitter:title',
      content: 'Descubrir comercios · MapaMorfi'
    },
    {
      name: 'twitter:description',
      content: 'Descubrí menús de restaurantes, bares y comercios cerca de vos.'
    }
  ]
})
</script>

