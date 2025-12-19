<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
    <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Crear nuevo comercio</h1>
        <p class="text-slate-600 dark:text-slate-400">
          Completá los datos para crear tu menú digital
        </p>
      </div>

      <!-- Alerta de límite de plan -->
      <div
        v-if="!canCreate"
        class="mb-6 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4"
      >
        <div class="flex items-start gap-3">
          <svg
            class="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div class="flex-1">
            <h3 class="font-semibold text-amber-900 dark:text-amber-200 mb-1">
              Límite de comercios alcanzado
            </h3>
            <p class="text-sm text-amber-800 dark:text-amber-300 mb-3">
              Tu plan actual ({{ currentPlan.name }}) permite hasta
              {{ currentPlan.maxBusinesses === -1 ? 'comercios ilimitados' : currentPlan.maxBusinesses + ' comercios' }}.
              Actualmente tenés {{ currentBusinessCount }} comercios.
            </p>
            <NuxtLink
              to="/billing"
              class="inline-flex items-center gap-2 text-sm font-medium text-amber-900 dark:text-amber-200 hover:text-amber-700 dark:hover:text-amber-100"
            >
              Ver planes disponibles
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Mensajes de feedback -->
      <div v-if="error" class="mb-6 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4">
        <div class="flex items-start gap-3">
          <svg class="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm font-medium text-red-600 dark:text-red-400 flex-1">{{ error }}</p>
        </div>
      </div>
      <div v-if="success" class="mb-6 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 p-4">
        <div class="flex items-start gap-3">
          <svg class="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex-1">{{ success }}</p>
        </div>
      </div>

      <!-- Opción de copiar desde comercio -->
      <div v-if="canCreate && existingBusinesses.length > 0" class="mb-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-1">
              Copiar desde comercio existente
            </h3>
            <p class="text-xs text-slate-600 dark:text-slate-400">
              Duplicá la configuración y el menú de un comercio existente (útil para franquicias)
            </p>
          </div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="copyFromBusiness"
              type="checkbox"
              class="rounded border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500"
              @change="handleCopyToggle"
            />
            <span class="text-sm text-slate-700 dark:text-slate-300">Activar</span>
          </label>
        </div>
        
        <div v-if="copyFromBusiness" class="mt-4">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Seleccionar comercio a copiar
          </label>
          
          <!-- Grid de tarjetas de comercios -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
            <button
              v-for="business in existingBusinesses"
              :key="business.id"
              type="button"
              @click="selectSourceBusiness(business.slug)"
              :class="[
                'relative rounded-lg border-2 p-4 text-left transition-all hover:shadow-md',
                selectedSourceBusiness === business.slug
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'
              ]"
            >
              <!-- Indicador de selección -->
              <div
                v-if="selectedSourceBusiness === business.slug"
                class="absolute top-2 right-2"
              >
                <div class="rounded-full bg-emerald-500 p-1">
                  <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <!-- Nombre del comercio -->
              <h4 class="font-semibold text-slate-900 dark:text-slate-50 mb-1 pr-6">
                {{ business.name }}
              </h4>
              
              <!-- Descripción (si existe) -->
              <p v-if="business.description" class="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                {{ business.description }}
              </p>
              
              <!-- Información adicional -->
              <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <!-- Cantidad de secciones -->
                <span class="flex items-center gap-1">
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  {{ (business.menu?.sections || business.sections || []).length }} secciones
                </span>
                
                <!-- Cantidad de ítems -->
                <span class="flex items-center gap-1">
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {{ getTotalItems(business) }} ítems
                </span>
              </div>
              
              <!-- Color de fondo (preview) -->
              <div class="mt-2 flex items-center gap-2">
                <div
                  class="h-4 w-4 rounded border border-slate-300 dark:border-slate-600"
                  :style="{ backgroundColor: business.backgroundColor || business.primaryColor || business.themeColor || '#ffffff' }"
                />
                <span class="text-xs text-slate-500 dark:text-slate-400">
                  {{ getFontName(business.fontFamily) }}
                </span>
              </div>
            </button>
          </div>
          
          <p v-if="selectedSourceBusiness" class="text-xs text-emerald-600 dark:text-emerald-400 mt-3 flex items-center gap-1">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Se copiarán la configuración y el menú completo. El slug se generará desde el nuevo nombre.
          </p>
        </div>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="space-y-6">

        <!-- Nombre del comercio -->
        <div>
          <label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Nombre del comercio <span class="text-red-500">*</span>
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            @input="generateSlug"
            class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            placeholder="Ej: Cervecería Lúpulo"
          />
        </div>

        <!-- Slug (URL) -->
        <div>
          <label for="slug" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            URL del menú <span class="text-red-500">*</span>
          </label>
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-500 dark:text-slate-400">tudominio.com/</span>
            <input
              id="slug"
              v-model="form.slug"
              type="text"
              required
              @input="checkSlugAvailability"
              :class="[
                'flex-1 rounded-lg border px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none transition-colors',
                slugStatus === 'checking'
                  ? 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                  : slugStatus === 'available'
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 focus:ring-2 focus:ring-emerald-500/20'
                  : slugStatus === 'unavailable'
                  ? 'border-red-500 bg-red-50/50 dark:bg-red-900/20 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
              ]"
              placeholder="cerveceria-lupulo"
              pattern="[a-z0-9-]+"
            />
          </div>
          <div class="mt-2 flex items-center gap-2 text-xs">
            <span
              v-if="slugStatus === 'checking'"
              class="text-slate-500 dark:text-slate-400"
            >
              Verificando disponibilidad...
            </span>
            <span
              v-else-if="slugStatus === 'available'"
              class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              URL disponible
            </span>
            <span
              v-else-if="slugStatus === 'unavailable'"
              class="text-red-600 dark:text-red-400 flex items-center gap-1"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Esta URL ya está en uso
            </span>
            <span v-else class="text-slate-500 dark:text-slate-400">
              Solo letras minúsculas, números y guiones
            </span>
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <label for="description" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors resize-none"
            placeholder="Una breve descripción de tu comercio..."
          />
        </div>

        <!-- Templates predefinidos -->
        <div class="border-t border-slate-200 dark:border-slate-800 pt-6">
          <TemplateSelector v-model="form" />
        </div>

        <!-- Color de fondo y tipografía -->
        <div class="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Color de fondo
            </label>
            <div class="flex items-center gap-4">
              <input
                v-model="form.backgroundColor"
                type="color"
                class="h-12 w-12 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer"
              />
              <input
                v-model="form.backgroundColor"
                type="text"
                pattern="^#[0-9A-Fa-f]{6}$"
                class="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors font-mono text-sm"
                placeholder="#ffffff"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tipografía
            </label>
            <select
              v-model="form.fontFamily"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
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
              Imagen de header (opcional)
            </label>
            <input
              v-model="form.headerImageUrl"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors text-sm"
            />
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              URL de la imagen que aparecerá en la parte superior del menú
            </p>
            <div v-if="form.headerImageUrl" class="mt-3 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 relative">
              <img
                :src="form.headerImageUrl"
                alt="Vista previa del header"
                class="w-full h-32 object-cover"
                @error="form.headerImageUrl = ''"
              />
              <!-- Overlay de preview si está activado -->
              <div
                v-if="form.headerImageOverlay"
                class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
              >
                <span class="text-white font-bold text-lg drop-shadow-lg">{{ form.name || 'Nombre del comercio' }}</span>
              </div>
            </div>
            <div v-if="form.headerImageUrl" class="mt-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="form.headerImageOverlay"
                  type="checkbox"
                  class="rounded border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span class="text-sm text-slate-700 dark:text-slate-300">
                  Mostrar nombre del comercio sobre la imagen
                </span>
              </label>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-6">
                El nombre y descripción aparecerán como overlay sobre la imagen
              </p>
            </div>
          </div>
        </div>

        <!-- Redes sociales (opcional) -->
        <div class="border-t border-slate-200 dark:border-slate-800 pt-6">
          <h3 class="text-lg font-semibold mb-4">Redes sociales (opcional)</h3>
          <div class="space-y-4">
            <div>
              <label for="instagram" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Instagram
              </label>
              <input
                id="instagram"
                v-model="form.socialMedia.instagram"
                type="url"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                placeholder="https://instagram.com/tucomercio"
              />
            </div>
            <div>
              <label for="facebook" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Facebook
              </label>
              <input
                id="facebook"
                v-model="form.socialMedia.facebook"
                type="url"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                placeholder="https://facebook.com/tucomercio"
              />
            </div>
            <div>
              <label for="whatsapp" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                WhatsApp
              </label>
              <input
                id="whatsapp"
                v-model="form.socialMedia.whatsapp"
                type="url"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                placeholder="https://wa.me/5491123456789"
              />
            </div>
            <div>
              <label for="tiktok" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                TikTok
              </label>
              <input
                id="tiktok"
                v-model="form.socialMedia.tiktok"
                type="url"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                placeholder="https://tiktok.com/@tucomercio"
              />
            </div>
          </div>
        </div>

        <!-- Ubicación (opcional) -->
        <div class="border-t border-slate-200 dark:border-slate-800 pt-6">
          <h3 class="text-lg font-semibold mb-4">Ubicación (opcional)</h3>
          <div class="space-y-4">
            <div class="relative">
              <label for="address" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Dirección
                <span class="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">
                  (Podés escribir sin el número de casa si no aparece en las sugerencias)
                </span>
              </label>
              <div class="flex gap-2">
                <div class="flex-1 relative">
                  <input
                    id="address"
                    v-model="form.address"
                    type="text"
                    class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                    placeholder="Ej: Calle 13 4613, Berazategui o Calle 13, Berazategui"
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
                      class="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                    >
                      <div class="text-sm font-medium text-slate-900 dark:text-slate-50">
                        {{ suggestion.displayName }}
                      </div>
                    </button>
                  </div>
                  <!-- Mensaje si no hay sugerencias pero hay texto -->
                  <div
                    v-if="showSuggestions && addressSuggestions.length === 0 && form.address && form.address.trim().length >= 3"
                    class="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700 rounded-lg shadow-lg p-4"
                  >
                    <div class="flex items-start gap-2 mb-2">
                      <svg class="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div class="flex-1">
                        <p class="text-sm font-medium text-amber-900 dark:text-amber-200 mb-2">
                          No se encontraron sugerencias para esta dirección
                        </p>
                        <p class="text-xs text-amber-800 dark:text-amber-300 mb-3">
                          OpenStreetMap puede no tener todas las direcciones mapeadas. Podés:
                        </p>
                        <div class="space-y-2">
                          <button
                            v-if="form.address.match(/\s+(\d+)\s*$/)"
                            type="button"
                            @click="searchAddressWithoutNumber"
                            class="block w-full text-left text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                          >
                            🔍 Buscar sin el número de casa
                          </button>
                          <p class="text-xs text-amber-700 dark:text-amber-300">
                            📍 <strong>Recomendado:</strong> Usá el mapa de abajo para seleccionar la ubicación exacta haciendo clic en el mapa. Esto es más preciso que la búsqueda de texto.
                          </p>
                          <p class="text-xs text-amber-700 dark:text-amber-300">
                            O escribí la dirección completa (calle, ciudad, provincia) y usá el botón "Buscar" para intentar geocodificarla.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  @click="geocodeAddress"
                  type="button"
                  :disabled="!form.address || !form.address.trim() || isLoadingGeocode"
                  class="px-4 py-2.5 rounded-lg border border-emerald-500 bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Buscar coordenadas de la dirección"
                >
                  <span v-if="isLoadingGeocode" class="flex items-center gap-2">
                    <svg class="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <label for="googleMaps" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                URL de Google Maps (opcional)
              </label>
              <div class="flex gap-2">
                <input
                  id="googleMaps"
                  v-model="form.googleMapsUrl"
                  type="url"
                  class="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                  placeholder="https://maps.google.com/..."
                  @blur="extractCoordinatesFromUrl"
                />
                <button
                  @click="extractCoordinatesFromUrl"
                  type="button"
                  :disabled="!form.googleMapsUrl || !form.googleMapsUrl.trim() || isLoadingCoords"
                  class="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Extraer coordenadas del link"
                >
                  <span v-if="isLoadingCoords" class="flex items-center gap-2">
                    <svg class="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Extrayendo...
                  </span>
                  <span v-else>Extraer</span>
                </button>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Opcional: Pegá el link de compartir de Google Maps para extraer coordenadas
              </p>
              <p v-if="coordinatesExtracted" class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                ✓ Coordenadas extraídas automáticamente
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Seleccionar ubicación en el mapa
              </label>
              <LocationPicker
                v-model:latitude="form.latitude"
                v-model:longitude="form.longitude"
                :initial-center="form.latitude && form.longitude ? [form.latitude, form.longitude] : [-34.6037, -58.3816]"
                :initial-zoom="form.latitude && form.longitude ? 15 : 13"
                @address-found="handleAddressFromMap"
              />
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Hacé clic en el mapa para seleccionar la ubicación. También podés arrastrar el marcador.
              </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="latitude" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Latitud
                </label>
                <input
                  id="latitude"
                  v-model.number="form.latitude"
                  type="number"
                  step="any"
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                  placeholder="-34.6037"
                />
              </div>
              <div>
                <label for="longitude" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Longitud
                </label>
                <input
                  id="longitude"
                  v-model.number="form.longitude"
                  type="number"
                  step="any"
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                  placeholder="-58.3816"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <NuxtLink
            to="/select-business"
            class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
          >
            Cancelar
          </NuxtLink>
          <button
            type="submit"
            :disabled="isLoading || !canCreate || slugStatus === 'unavailable' || slugStatus === 'checking'"
            class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Creando...</span>
            <span v-else>Crear comercio</span>
            <svg
              v-if="!isLoading"
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </form>
    </div>

    <!-- Modal de éxito -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showSuccessModal"
          class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="closeSuccessModal"
        >
          <div
            class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 border border-slate-200 dark:border-slate-700"
          >
            <!-- Icono de éxito -->
            <div class="flex justify-center">
              <div class="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-4">
                <svg class="h-12 w-12 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <!-- Contenido -->
            <div class="text-center space-y-3">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">
                ¡Comercio creado exitosamente!
              </h2>
              <p class="text-slate-600 dark:text-slate-300">
                El comercio <strong class="text-slate-900 dark:text-slate-50">"{{ createdBusinessName }}"</strong> ha sido creado correctamente.
              </p>
            </div>

            <!-- Botones de acción -->
            <div class="space-y-3">
              <NuxtLink
                :to="`/${createdBusinessSlug}/panel`"
                class="block w-full text-center rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
              >
                Ir al panel del comercio
              </NuxtLink>
              <button
                @click="goToSelectBusiness"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Ver todos mis comercios
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const router = useRouter()
const { saveBusinessToAPI, fetchAllBusinesses, fetchBusinessBySlug } = useBusinesses()
const { getDefaultPlan, getPlanById, canCreateBusiness } = usePlans()
const { getFontById } = useFonts()
const { extractCoordinatesFromGoogleMapsUrl, resolveShortUrlAndExtractCoordinates } = useGoogleMaps()
const { BUSINESS_CATEGORIES } = useBusinessCategories()

const form = ref({
  name: '',
  slug: '',
  description: '',
  backgroundColor: '#ffffff',
  fontFamily: 'inter',
  headerImageUrl: '',
  headerImageOverlay: false,
  category: 'otro', // Rubro del comercio
  socialMedia: {
    instagram: '',
    facebook: '',
    whatsapp: '',
    tiktok: '',
  },
  googleMapsUrl: '',
  address: '',
})

const slugStatus = ref('idle') // 'idle' | 'checking' | 'available' | 'unavailable'
const error = ref('')
const success = ref('')
const showSuccessModal = ref(false)
const createdBusinessName = ref('')
const createdBusinessSlug = ref('')
const isLoading = ref(false)
const coordinatesExtracted = ref(false)
const isLoadingCoords = ref(false)
const isLoadingGeocode = ref(false)
const geocodeSuccess = ref(false)
const addressSuggestions = ref([])
const showSuggestions = ref(false)
const searchTimeout = ref(null)
const currentPlan = ref(getDefaultPlan())
const currentBusinessCount = ref(0)
const userRole = ref(null)
const userEmail = ref(null)
const canCreate = computed(() => canCreateBusiness(currentBusinessCount.value, currentPlan.value, userRole.value, userEmail.value))
const existingBusinesses = ref([])
const copyFromBusiness = ref(false)
const selectedSourceBusiness = ref('')
const sourceBusinessData = ref(null)

let slugCheckTimeout = null

// Buscar sugerencias de direcciones mientras el usuario escribe
const searchAddresses = async () => {
  // Limpiar timeout anterior
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  // Si la dirección tiene menos de 3 caracteres, no buscar
  if (!form.value.address || form.value.address.trim().length < 3) {
    addressSuggestions.value = []
    showSuggestions.value = false
    return
  }

  // Esperar 300ms después de que el usuario deje de escribir
  searchTimeout.value = setTimeout(async () => {
    try {
      const suggestions = await $fetch('/api/geocode/search', {
        method: 'GET',
        params: { q: form.value.address },
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
  form.value.address = suggestion.displayName
  form.value.latitude = suggestion.latitude
  form.value.longitude = suggestion.longitude
  addressSuggestions.value = []
  showSuggestions.value = false
  geocodeSuccess.value = true
  
  // Limpiar el mensaje después de 5 segundos
  setTimeout(() => {
    geocodeSuccess.value = false
  }, 5000)
}

// Buscar dirección sin número de casa
const searchAddressWithoutNumber = async () => {
  if (!form.value.address || form.value.address.trim().length < 3) {
    return
  }
  
  // Remover el número de casa si existe (patrón: número al final)
  const numberPattern = /\s+(\d+)\s*$/
  const addressWithoutNumber = form.value.address.replace(numberPattern, '').trim()
  
  if (addressWithoutNumber.length >= 3) {
    form.value.address = addressWithoutNumber
    await searchAddresses()
    // Forzar mostrar sugerencias
    showSuggestions.value = true
  }
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
  form.value.address = address
  geocodeSuccess.value = true
  setTimeout(() => {
    geocodeSuccess.value = false
  }, 5000)
}

// Geocodificar dirección (convertir dirección a coordenadas)
const geocodeAddress = async () => {
  if (!form.value.address || !form.value.address.trim()) {
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
      body: { address: form.value.address },
    })

    if (response.success && response.latitude && response.longitude) {
      form.value.latitude = response.latitude
      form.value.longitude = response.longitude
      geocodeSuccess.value = true
      
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
  if (!form.value.googleMapsUrl || !form.value.googleMapsUrl.trim()) {
    coordinatesExtracted.value = false
    error.value = 'Por favor, ingresá una URL de Google Maps'
    setTimeout(() => {
      error.value = ''
    }, 3000)
    return
  }

  coordinatesExtracted.value = false
  isLoadingCoords.value = true
  
  try {
    
    // Intentar extraer directamente del URL
    let coords = extractCoordinatesFromGoogleMapsUrl(form.value.googleMapsUrl)
    
    // Si es un link corto o no se encontraron coordenadas, intentar resolverlo
    if (!coords || form.value.googleMapsUrl.includes('goo.gl') || form.value.googleMapsUrl.includes('maps.app.goo.gl')) {
      try {
        coords = await resolveShortUrlAndExtractCoordinates(form.value.googleMapsUrl)
      } catch (err) {
        console.error('Error resolving short URL:', err)
        // Si falla, intentar extraer de la URL original de nuevo
        if (!coords) {
          coords = extractCoordinatesFromGoogleMapsUrl(form.value.googleMapsUrl)
        }
      }
    }
    
    if (coords && coords.latitude && coords.longitude) {
      form.value.latitude = coords.latitude
      form.value.longitude = coords.longitude
      coordinatesExtracted.value = true
      
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => {
        coordinatesExtracted.value = false
      }, 5000)
    } else {
      error.value = 'No se pudieron extraer las coordenadas de esta URL. Verificá que sea un link válido de Google Maps.'
      setTimeout(() => {
        error.value = ''
      }, 5000)
    }
  } catch (err) {
    console.error('Error extracting coordinates:', err)
    error.value = 'Error al extraer las coordenadas. Intentá nuevamente.'
    setTimeout(() => {
      error.value = ''
    }, 5000)
  } finally {
    isLoadingCoords.value = false
  }
}

const generateSlug = () => {
  if (!form.value.name) {
    form.value.slug = ''
    slugStatus.value = 'idle'
    return
  }

  // Generar slug desde el nombre
  const slug = form.value.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Eliminar guiones múltiples

  form.value.slug = slug

  // Verificar disponibilidad después de un pequeño delay
  if (slugCheckTimeout) {
    clearTimeout(slugCheckTimeout)
  }

  if (slug.length > 0) {
    slugCheckTimeout = setTimeout(() => {
      checkSlugAvailability()
    }, 500)
  } else {
    slugStatus.value = 'idle'
  }
}

const checkSlugAvailability = async () => {
  if (!form.value.slug || form.value.slug.length === 0) {
    slugStatus.value = 'idle'
    return
  }

  // Validar formato
  const slugRegex = /^[a-z0-9-]+$/
  if (!slugRegex.test(form.value.slug)) {
    slugStatus.value = 'idle'
    return
  }

  slugStatus.value = 'checking'
  error.value = '' // Limpiar errores previos

  try {
    const response = await $fetch('/api/businesses/check-slug', {
      method: 'POST',
      body: { slug: form.value.slug },
    })

    slugStatus.value = response.available ? 'available' : 'unavailable'
    
    if (!response.available) {
      error.value = 'Esta URL ya está en uso. Por favor, elegí otra.'
    }
  } catch (err) {
    console.error('Error checking slug:', err)
    slugStatus.value = 'idle'
    error.value = 'Error al verificar la disponibilidad de la URL'
  }
}

const handleCopyToggle = () => {
  if (!copyFromBusiness.value) {
    // Si se desactiva, limpiar datos
    selectedSourceBusiness.value = ''
    sourceBusinessData.value = null
    resetForm()
  }
}

const selectSourceBusiness = async (slug) => {
  selectedSourceBusiness.value = slug
  await loadBusinessData()
}

const loadBusinessData = async () => {
  if (!selectedSourceBusiness.value) {
    sourceBusinessData.value = null
    return
  }

  try {
    const business = await fetchBusinessBySlug(selectedSourceBusiness.value)
    if (business) {
      sourceBusinessData.value = business
      
      // Pre-llenar formulario con datos del comercio seleccionado
      form.value.name = `${business.name} (copia)`
      form.value.description = business.description || ''
      form.value.backgroundColor = business.backgroundColor || business.primaryColor || business.themeColor || '#ffffff'
      form.value.fontFamily = business.fontFamily || 'inter'
      form.value.headerImageUrl = business.headerImageUrl || ''
      form.value.headerImageOverlay = business.headerImageOverlay || false
      form.value.socialMedia = {
        instagram: business.socialMedia?.instagram || '',
        facebook: business.socialMedia?.facebook || '',
        whatsapp: business.socialMedia?.whatsapp || '',
        tiktok: business.socialMedia?.tiktok || '',
      }
      form.value.googleMapsUrl = business.googleMapsUrl || ''
      form.value.address = business.address || ''
      form.value.latitude = business.latitude || null
      form.value.longitude = business.longitude || null
      
      // Generar nuevo slug desde el nombre
      generateSlug()
    }
  } catch (err) {
    console.error('Error loading business data:', err)
    error.value = 'Error al cargar los datos del comercio seleccionado'
  }
}

const getTotalItems = (business) => {
  if (!business.menu?.sections) return 0
  const sections = business.menu?.sections || business.sections || []
  return sections.reduce((total, section) => {
    return total + (section.items?.length || 0)
  }, 0)
}

const getFontName = (fontId) => {
  const font = getFontById(fontId || 'inter')
  return font.name
}

const resetForm = () => {
  form.value = {
    name: '',
    slug: '',
    description: '',
    backgroundColor: '#ffffff',
    fontFamily: 'inter',
    headerImageUrl: '',
    headerImageOverlay: false,
    socialMedia: {
      instagram: '',
      facebook: '',
      whatsapp: '',
      tiktok: '',
    },
    googleMapsUrl: '',
    latitude: null,
    longitude: null,
  }
  slugStatus.value = 'idle'
  error.value = ''
  success.value = ''
}

const handleSubmit = async () => {
  if (!canCreate.value) {
    error.value = 'No podés crear más comercios con tu plan actual. Actualizá tu plan en la sección de facturación.'
    return
  }

  if (slugStatus.value !== 'available') {
    error.value = 'Por favor, verificá que la URL esté disponible'
    return
  }

  error.value = ''
  isLoading.value = true

  // Obtener userId del localStorage
  let userId = null
  if (process.client) {
    const auth = localStorage.getItem('qrmenu-auth')
    if (auth) {
      try {
        const parsed = JSON.parse(auth)
        userId = parsed.userId
      } catch {
        // Si no hay userId, continuar sin él (para compatibilidad)
      }
    }
  }

  if (!userId) {
    error.value = 'No se pudo identificar tu usuario. Por favor, iniciá sesión nuevamente.'
    isLoading.value = false
    return
  }

  try {
    // Si hay datos de un comercio fuente, copiar también las secciones
    let sections = []
    
    if (sourceBusinessData.value) {
      // Copiar las secciones, regenerando IDs para evitar conflictos
      const sourceSections = sourceBusinessData.value.menu?.sections || sourceBusinessData.value.sections || []
      sections = sourceSections.map(section => ({
        id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: section.name,
        description: section.description,
        items: section.items.map(item => ({
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
          tags: item.tags ? [...item.tags] : [],
          isAvailable: item.isAvailable !== false,
        })),
      }))
    }
    
    // Crear estructura del comercio
    const business = {
      id: `business-${Date.now()}`,
      slug: form.value.slug,
      name: form.value.name,
      description: form.value.description || undefined,
      backgroundColor: form.value.backgroundColor,
      fontFamily: form.value.fontFamily || 'inter',
      headerImageUrl: form.value.headerImageUrl || undefined,
      headerImageOverlay: form.value.headerImageUrl && form.value.headerImageOverlay ? true : undefined,
      primaryColor: form.value.backgroundColor, // Mantener para compatibilidad
      themeColor: form.value.backgroundColor, // Mantener para compatibilidad
      userId: userId,
      socialMedia: Object.keys(form.value.socialMedia).some(
        key => form.value.socialMedia[key]
      ) ? form.value.socialMedia : undefined,
      googleMapsUrl: form.value.googleMapsUrl || undefined,
      address: form.value.address || undefined,
      latitude: form.value.latitude || undefined,
      longitude: form.value.longitude || undefined,
      sections: sections,
      isActive: true,
    }

    const result = await saveBusinessToAPI(business)

    if (result) {
      // Limpiar errores previos
      error.value = ''
      isLoading.value = false
      
      // Guardar información del comercio creado
      createdBusinessName.value = form.value.name
      createdBusinessSlug.value = form.value.slug
      
      // Mostrar modal de éxito
      showSuccessModal.value = true
    } else {
      error.value = 'No se pudo crear el comercio. Por favor, intentá nuevamente.'
      isLoading.value = false
    }
  } catch (err) {
    console.error('Error creating business:', err)
    error.value = err.data?.message || err.message || 'Error al crear el comercio. Por favor, intentá nuevamente.'
    isLoading.value = false
    success.value = '' // Limpiar mensaje de éxito si hay error
  }
}

// Cerrar modal de éxito
function closeSuccessModal() {
  showSuccessModal.value = false
}

// Ir a selección de comercios
function goToSelectBusiness() {
  showSuccessModal.value = false
  router.push('/select-business')
}

onMounted(async () => {
  // Obtener comercios actuales para verificar límites
  const businesses = await fetchAllBusinesses()
  currentBusinessCount.value = businesses.length
  existingBusinesses.value = businesses

  // Obtener plan y rol del usuario desde localStorage
  if (process.client) {
    const auth = localStorage.getItem('qrmenu-auth')
    if (auth) {
      try {
        const parsed = JSON.parse(auth)
        userRole.value = parsed.role || null
        userEmail.value = parsed.email || null
        
        // Si el email es el admin, forzar plan enterprise
        if (parsed.email === 'gonzalezoctavio5@gmail.com') {
          const enterprisePlan = getPlanById('enterprise')
          if (enterprisePlan) {
            currentPlan.value = enterprisePlan
            userRole.value = 'admin' // Asegurar que sea admin
          }
        }
      } catch (error) {
        console.error('Error parsing auth:', error)
      }
    }
  }
  
  // Obtener plan del usuario desde la API (solo si no es el admin)
  if (userRole.value !== 'admin' && process.client) {
    try {
      const auth = localStorage.getItem('qrmenu-auth')
      if (auth) {
        const parsed = JSON.parse(auth)
        const profile = await $fetch('/api/users/profile', {
          query: { userId: parsed.userId }
        })
        if (profile && profile.user && profile.user.plan) {
          const plan = getPlanById(profile.user.plan)
          if (plan) {
            currentPlan.value = plan
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Si hay error, usar plan por defecto
    }
  }
})

useHead({
  title: 'Crear comercio · MapaMorfi',
})
</script>

<style scoped>
.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.2s ease-in;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div > div,
.modal-leave-to > div > div {
  transform: scale(0.95) translateY(-10px);
}

.modal-enter-to > div > div,
.modal-leave-from > div > div {
  transform: scale(1) translateY(0);
}
</style>

