<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold mb-2">Descubrir comercios</h1>
        <p class="text-slate-600 dark:text-slate-400">
          Explorá menús de restaurantes, bares y comercios cerca de vos
        </p>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="mb-8 space-y-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por nombre, descripción..."
              class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            />
          </div>
          <button
            @click="showOpenNow = !showOpenNow"
            :class="[
              'px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2',
              showOpenNow
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            ]"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="hidden sm:inline">Abierto ahora</span>
            <span class="sm:hidden">Abierto</span>
          </button>
        </div>

        <!-- Filtros avanzados -->
        <div class="flex flex-wrap gap-3 items-center">
          <!-- Filtro por categoría -->
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">Categoría:</label>
            <select
              v-model="selectedCategory"
              class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            >
              <option value="">Todas</option>
              <option
                v-for="category in BUSINESS_CATEGORIES"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Filtro por distancia (solo si hay ubicación) -->
          <div v-if="useLocationFilter && userLocation" class="flex items-center gap-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">Distancia:</label>
            <select
              v-model="maxDistance"
              class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            >
              <option :value="1">1 km</option>
              <option :value="3">3 km</option>
              <option :value="5">5 km</option>
              <option :value="10">10 km</option>
            </select>
          </div>

          <!-- Ordenamiento -->
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">Ordenar por:</label>
            <select
              v-model="sortBy"
              class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            >
              <option value="featured">Destacados primero</option>
              <option value="distance" :disabled="!useLocationFilter || !userLocation">Más cercano</option>
              <option value="name">Alfabético</option>
            </select>
          </div>

          <!-- Contador de resultados -->
          <div class="ml-auto text-sm text-slate-600 dark:text-slate-400">
            <span class="font-medium">{{ filteredBusinesses.length }}</span>
            <span> comercio{{ filteredBusinesses.length !== 1 ? 's' : '' }}</span>
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
                  @click="requestLocation"
                  class="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors"
                >
                  Reintentar
                </button>
                <button
                  @click="useLocationFilter = false; locationError = null"
                  class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  Cancelar filtro
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>

      <!-- Mapa (mostrar siempre si hay comercios, o si hay ubicación del usuario) -->
      <div v-else-if="!isLoading && (businesses.length > 0 || (useLocationFilter && userLocation))" class="mb-8" style="position: relative; z-index: 1;">
        <!-- Controles del mapa (arriba del mapa) -->
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <!-- Botón para activar filtro de ubicación -->
          <button
            @click="toggleLocationFilter"
            :disabled="isRequestingLocation"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg flex items-center gap-2',
              useLocationFilter
                ? 'bg-emerald-500 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
              isRequestingLocation ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <svg v-if="!isRequestingLocation" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else class="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ isRequestingLocation ? 'Obteniendo...' : (useLocationFilter ? 'Cerca de mí' : 'Mi ubicación') }}</span>
          </button>
          
          <!-- Selector de direcciones guardadas (si está autenticado o hay direcciones guardadas) -->
          <div v-if="isAuthenticated || savedAddresses.length > 0" class="relative">
            <button
              @click="showAddressMenu = !showAddressMenu"
              class="px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-2"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Direcciones</span>
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Menú desplegable de direcciones -->
            <div
              v-if="showAddressMenu"
              class="absolute top-full right-0 mt-2 w-72 sm:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
            >
              <div v-if="savedAddresses.length > 0" class="p-2">
                <div class="text-xs font-medium text-slate-500 dark:text-slate-400 px-2 py-1 mb-1">Direcciones guardadas</div>
                <button
                  v-for="address in savedAddresses"
                  :key="address.id"
                  @click="selectSavedAddress(address)"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mb-1',
                    userLocation && userLocation.latitude === address.latitude && userLocation.longitude === address.longitude
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                      : ''
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="font-medium text-sm text-slate-900 dark:text-slate-50">{{ address.name }}</div>
                      <div class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ address.address }}</div>
                    </div>
                    <svg
                      v-if="userLocation && userLocation.latitude === address.latitude && userLocation.longitude === address.longitude"
                      class="h-4 w-4 text-emerald-500 flex-shrink-0 ml-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>
              <div v-else class="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                No tenés direcciones guardadas
              </div>
              <div v-if="isAuthenticated" class="border-t border-slate-200 dark:border-slate-700 p-2">
                <NuxtLink
                  to="/saved-addresses"
                  @click="showAddressMenu = false"
                  class="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm text-emerald-600 dark:text-emerald-400 font-medium"
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
        
        <!-- Mapa grande y prominente -->
        <div class="mb-8 relative">
          <BusinessMap
            :businesses="allBusinessesForMap"
            :user-location="userLocation"
            :center="mapCenter"
            :zoom="mapZoom"
            :show-no-businesses-message="useLocationFilter && userLocation && filteredBusinesses.length === 0"
            :show-user-location-popup="showUserLocationPopup"
            class="w-full"
          />
        </div>

        <!-- Mensaje cuando no hay comercios cerca (si hay filtro de ubicación activo) -->
        <div v-if="useLocationFilter && userLocation && filteredBusinesses.length === 0" class="mb-6 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-6 text-center">
          <div class="flex flex-col items-center gap-3">
            <svg class="h-12 w-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <h3 class="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-1">No hay comercios cerca</h3>
              <p class="text-sm text-amber-700 dark:text-amber-300">
                No se encontraron comercios dentro de {{ maxDistance }}km de tu ubicación. Intentá aumentar la distancia o desactivá el filtro de ubicación.
              </p>
            </div>
            <button
              @click="useLocationFilter = false; userLocation = null"
              class="mt-2 px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              Desactivar filtro de ubicación
            </button>
          </div>
        </div>

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
      </div>

      <!-- Sin resultados (solo si no hay ubicación del usuario activa) -->
      <div v-else-if="!isLoading && !(useLocationFilter && userLocation)" class="text-center py-20">
        <div class="max-w-md mx-auto">
          <svg
            class="mx-auto h-16 w-16 text-slate-400 dark:text-slate-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="text-xl font-semibold mb-2">No se encontraron comercios</h3>
          <p class="text-slate-600 dark:text-slate-400">
            {{ searchQuery ? 'Intentá con otros términos de búsqueda' : 'Aún no hay comercios públicos disponibles' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'

definePageMeta({
  layout: 'dashboard',
})

// No necesitamos useBusinesses aquí, usamos el endpoint público directamente

const businesses = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const useLocationFilter = ref(false)
const userLocation = ref(null)
const locationError = ref(null)
const isRequestingLocation = ref(false)
const isLocalIP = ref(false)
const savedAddresses = ref([])
const selectedSavedAddress = ref('')
const isAuthenticated = ref(false)
const showOpenNow = ref(false)
const showUserLocationPopup = ref(false) // Controla si se muestra el popup de "Tu ubicación"
const showAddressMenu = ref(false)
// Nuevos filtros avanzados
const selectedCategory = ref('')
const maxDistance = ref(3) // Distancia máxima en km (3km por defecto)
const sortBy = ref('featured') // 'distance', 'name', 'featured'

// Centro y zoom del mapa
const mapCenter = computed(() => {
  if (userLocation.value) {
    return [userLocation.value.latitude, userLocation.value.longitude]
  }
  // Si hay comercios, usar el centro de ellos
  if (filteredBusinesses.value.length > 0) {
    const businessesWithCoords = filteredBusinesses.value.filter(b => b.latitude && b.longitude)
    if (businessesWithCoords.length > 0) {
      const avgLat = businessesWithCoords.reduce((sum, b) => sum + b.latitude, 0) / businessesWithCoords.length
      const avgLon = businessesWithCoords.reduce((sum, b) => sum + b.longitude, 0) / businessesWithCoords.length
      return [avgLat, avgLon]
    }
  }
  // Por defecto: Buenos Aires
  return [-34.6037, -58.3816]
})

const mapZoom = computed(() => {
  if (userLocation.value && filteredBusinesses.value.length > 0) {
    return 13
  }
  if (filteredBusinesses.value.length > 0) {
    return 12
  }
  return 10
})

// Comercios con coordenadas para el mapa
const businessesWithCoordinates = computed(() => {
  return filteredBusinesses.value.filter(business => 
    business.latitude != null && 
    business.longitude != null &&
    !isNaN(business.latitude) &&
    !isNaN(business.longitude)
  )
})

// Todos los comercios para el mapa (solo FoodLand)
const allBusinessesForMap = computed(() => {
  return businessesWithCoordinates.value
})


// Obtener todos los comercios públicos
const loadBusinesses = async () => {
  isLoading.value = true
  try {
    // Obtener comercios públicos desde el endpoint dedicado
    console.log('discover.vue: Loading public businesses...')
    businesses.value = await $fetch('/api/businesses/public')
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
  } finally {
    isLoading.value = false
  }
}

// Calcular total de ítems
const getTotalItems = (business) => {
  if (!business.menu?.sections) return 0
  return business.menu.sections.reduce((total, section) => {
    return total + (section.items?.length || 0)
  }, 0)
}

// Obtener nombre de categoría
const { getCategoryById, BUSINESS_CATEGORIES } = useBusinessCategories()
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

  // Filtro de búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(business => {
      return (
        business.name?.toLowerCase().includes(query) ||
        business.description?.toLowerCase().includes(query) ||
        business.slug?.toLowerCase().includes(query)
      )
    })
  }

  // Filtro por categoría
  if (selectedCategory.value) {
    filtered = filtered.filter(business => business.category === selectedCategory.value)
  }

  // Filtro por "abierto ahora"
  if (showOpenNow.value) {
    filtered = filtered.filter(business => isBusinessOpenNow(business))
  }

  // Filtro por ubicación
  if (useLocationFilter.value && userLocation.value) {
    // Filtrar solo comercios que tengan coordenadas
    filtered = filtered.filter(business => {
      return business.latitude != null && business.longitude != null
    })

    // Calcular distancia
    filtered = filtered.map(business => {
      const distance = calculateDistance(
        userLocation.value.latitude,
        userLocation.value.longitude,
        business.latitude,
        business.longitude
      )
      return { ...business, distance }
    })
    // Filtrar por distancia máxima configurada
    filtered = filtered.filter(business => business.distance <= maxDistance.value)
  }

  // Ordenamiento
  if (sortBy.value === 'featured') {
    // Destacados primero, luego por distancia si está disponible
    filtered = filtered.sort((a, b) => {
      if (a.isEnterprise && !b.isEnterprise) return -1
      if (!a.isEnterprise && b.isEnterprise) return 1
      if (a.distance != null && b.distance != null) {
        return a.distance - b.distance
      }
      return 0
    })
  } else if (sortBy.value === 'distance' && useLocationFilter.value && userLocation.value) {
    // Ordenar por distancia
    filtered = filtered.sort((a, b) => {
      const distA = a.distance != null ? a.distance : Infinity
      const distB = b.distance != null ? b.distance : Infinity
      return distA - distB
    })
  } else if (sortBy.value === 'name') {
    // Ordenar alfabéticamente
    filtered = filtered.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase()
      const nameB = (b.name || '').toLowerCase()
      return nameA.localeCompare(nameB, 'es')
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

// Solicitar ubicación del usuario
const requestLocation = () => {
  locationError.value = null
  isRequestingLocation.value = true
  
  // Limpiar dirección de entrega guardada cuando se usa ubicación del GPS
  if (process.client) {
    localStorage.removeItem('foodland-delivery-address')
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

  const options = {
    enableHighAccuracy: true,
    timeout: 15000, // 15 segundos para dar más tiempo
    maximumAge: 0, // No usar caché
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
      locationError.value = null
      isRequestingLocation.value = false
      showUserLocationPopup.value = true // Mostrar popup cuando el usuario hace clic en "Mi ubicación"
      // El filtro ya está activado desde toggleLocationFilter
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

const toggleLocationFilter = () => {
  if (!useLocationFilter.value) {
    // Activar el filtro primero para mostrar el estado de carga
    useLocationFilter.value = true
    locationError.value = null
    
    // Si ya tenemos la ubicación, no necesitamos solicitarla de nuevo
    if (!userLocation.value) {
      // Solicitar ubicación automáticamente
      requestLocation()
    }
  } else {
    useLocationFilter.value = false
    locationError.value = null
  }
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

// Usar dirección guardada
const useSavedAddress = () => {
  if (!selectedSavedAddress.value) {
    useLocationFilter.value = false
    userLocation.value = null
    return
  }

  const address = savedAddresses.value.find(a => a.id === selectedSavedAddress.value)
  if (address) {
    userLocation.value = {
      latitude: address.latitude,
      longitude: address.longitude,
    }
    useLocationFilter.value = true
    locationError.value = null
  }
}

// Seleccionar dirección guardada desde el menú
const selectSavedAddress = (address) => {
  userLocation.value = {
    latitude: address.latitude,
    longitude: address.longitude,
  }
  useLocationFilter.value = true
  locationError.value = null
  showAddressMenu.value = false
  showUserLocationPopup.value = true // Mostrar popup cuando el usuario selecciona una dirección
  
  // Guardar la dirección seleccionada en localStorage para usar en el pedido
  if (process.client) {
    localStorage.setItem('foodland-delivery-address', JSON.stringify({
      id: address.id,
      name: address.name,
      address: address.address,
      latitude: address.latitude,
      longitude: address.longitude,
    }))
  }
}

// Verificar si hay parámetros de URL (lat/lng) para usar una dirección guardada
const checkUrlParams = () => {
  if (!process.client) return
  
  const route = useRoute()
  const lat = route.query.lat
  const lng = route.query.lng
  
  if (lat && lng) {
    userLocation.value = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
    }
    useLocationFilter.value = true
  }
}


onMounted(async () => {
  checkIfLocalIP()
  checkUrlParams()
  loadBusinesses()
  
  // Cargar direcciones guardadas primero
  await loadSavedAddresses()
  
  // Si hay direcciones guardadas y no hay ubicación del usuario, usar la primera dirección guardada
  if (savedAddresses.value && savedAddresses.value.length > 0 && !userLocation.value) {
    const defaultAddress = savedAddresses.value[0]
    userLocation.value = {
      latitude: defaultAddress.latitude,
      longitude: defaultAddress.longitude,
    }
    useLocationFilter.value = true
    showUserLocationPopup.value = false // No mostrar popup cuando se carga por defecto
    // Guardar en localStorage como dirección de entrega
    if (process.client) {
      localStorage.setItem('foodland-delivery-address', JSON.stringify(defaultAddress))
    }
  }
  
  // Cerrar menú de direcciones al hacer click fuera
  if (process.client) {
    document.addEventListener('click', (e) => {
      if (showAddressMenu.value && !e.target.closest('.relative')) {
        showAddressMenu.value = false
      }
    })
  }
})

useHead({
  title: 'Descubrir comercios · FoodLand',
  meta: [
    {
      name: 'description',
      content: 'Descubrí menús de restaurantes, bares y comercios cerca de vos. Explora comercios locales con menús digitales accesibles por QR.'
    },
    {
      property: 'og:title',
      content: 'Descubrir comercios · FoodLand'
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
      content: 'Descubrir comercios · FoodLand'
    },
    {
      name: 'twitter:description',
      content: 'Descubrí menús de restaurantes, bares y comercios cerca de vos.'
    }
  ]
})
</script>

