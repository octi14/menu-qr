<template>
  <!-- Renderizar según layout seleccionado -->
  <MenuTabs
    v-if="showActivePublicMenu && menuLayout === 'tabs'"
    :business="business"
    :backgroundColor="backgroundColor"
    :text-color="textColor"
    :price-color="priceColor"
    :font-family="fontFamily"
    :should-show-prices="shouldShowPrices"
    :active-delivery-platforms="activeDeliveryPlatforms"
    :is-open-now="isOpenNow"
    :is-authenticated="isAuthenticated"
    :is-favorite="isFavorite"
    :is-loading-favorite="isLoadingFavorite"
    @toggle-favorite="toggleFavorite"
    @share-whatsapp="shareOnWhatsApp"
    @share-facebook="shareOnFacebook"
    @copy-link="copyLink"
    @export-pdf="exportToPDF"
  />
  <MenuGrid
    v-else-if="showActivePublicMenu && menuLayout === 'grid'"
    :business="business"
    :backgroundColor="backgroundColor"
    :text-color="textColor"
    :price-color="priceColor"
    :font-family="fontFamily"
    :should-show-prices="shouldShowPrices"
    :active-delivery-platforms="activeDeliveryPlatforms"
    :is-open-now="isOpenNow"
    :is-authenticated="isAuthenticated"
    :is-favorite="isFavorite"
    :is-loading-favorite="isLoadingFavorite"
    @toggle-favorite="toggleFavorite"
    @share-whatsapp="shareOnWhatsApp"
    @share-facebook="shareOnFacebook"
    @copy-link="copyLink"
    @export-pdf="exportToPDF"
  />
  <MenuCategories
    v-else-if="showActivePublicMenu && menuLayout === 'categories'"
    :business="business"
    :backgroundColor="backgroundColor"
    :text-color="textColor"
    :price-color="priceColor"
    :font-family="fontFamily"
    :should-show-prices="shouldShowPrices"
    :active-delivery-platforms="activeDeliveryPlatforms"
    :is-open-now="isOpenNow"
    :is-authenticated="isAuthenticated"
    :is-favorite="isFavorite"
    :is-loading-favorite="isLoadingFavorite"
    @toggle-favorite="toggleFavorite"
    @share-whatsapp="shareOnWhatsApp"
    @share-facebook="shareOnFacebook"
    @copy-link="copyLink"
    @export-pdf="exportToPDF"
  />
  <!-- Layout vertical/clásico (por defecto) -->
  <div
    v-else-if="showActivePublicMenu"
    class="min-h-screen transition-all duration-300 ease-in-out"
    :style="{
      backgroundColor: backgroundColor,
      fontFamily: fontFamily,
      color: textColor,
      '--price-color': priceColor,
    }"
  >
    <div class="mx-auto flex min-h-screen max-w-2xl flex-col gap-10 px-5 py-10 sm:px-6">
      <header class="space-y-6 pb-8 border-b" :style="{ borderColor: `${textColor}20` }" role="banner">
        <!-- Volver al mapa + acciones -->
        <div class="flex w-full items-center gap-2">
          <MenuBackToDiscoverLink :color="textColor" />
          <div class="flex min-w-0 flex-1 items-center justify-end gap-3">
          <!-- Botón de favoritos (solo si está autenticado) -->
          <button
            v-if="isAuthenticated"
            @click="toggleFavorite"
            :disabled="isLoadingFavorite"
            class="p-2 rounded-full transition-all hover:scale-110 disabled:opacity-50"
            :style="{
              backgroundColor: isFavorite ? `${priceColor}20` : `${textColor}15`,
              color: isFavorite ? priceColor : textColor,
            }"
            :title="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
          >
            <svg
              v-if="isFavorite"
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <svg
              v-else
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          <!-- Búsqueda -->
          <div class="relative flex-1 max-w-xs">
            <label for="menu-search" class="sr-only">Buscar en el menú</label>
            <input
              id="menu-search"
              v-model="searchQuery"
              type="text"
              placeholder="Buscar en el menú..."
              class="w-full rounded-lg border px-4 py-2 text-sm outline-none transition-colors"
              :style="{
                borderColor: `${textColor}30`,
                backgroundColor: `${textColor}08`,
                color: textColor,
              }"
              aria-label="Buscar en el menú"
            />
            <svg
              class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60"
              :style="{ color: textColor }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <!-- Horarios (solo icono) -->
          <button
            v-if="business.openingHours"
            @click="showHoursModal = true"
            class="rounded-lg border p-2 transition-all hover:scale-110"
            :style="{
              borderColor: `${textColor}30`,
              backgroundColor: `${textColor}08`,
              color: textColor,
            }"
            :title="isOpenNow ? 'Abierto ahora' : 'Cerrado ahora'"
            :aria-label="isOpenNow ? 'Abierto ahora - Ver horarios' : 'Cerrado ahora - Ver horarios'"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <!-- Botones de plataformas de pedidos -->
          <template v-if="activeDeliveryPlatforms.length > 0">
            <a
              v-for="platform in activeDeliveryPlatforms"
              :key="platform.id"
              :href="platform.url"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-lg p-1.5 transition-all hover:scale-110 flex items-center justify-center"
              :title="`Pedir por ${platform.name}`"
            >
              <img 
                v-if="platform.logo"
                :src="platform.logo" 
                :alt="platform.name"
                loading="lazy" 
                class="h-5 w-5 object-contain"
              />
              <span v-else class="text-xs font-medium px-2">{{ platform.name }}</span>
            </a>
          </template>
          <!-- Compartir -->
          <div class="relative">
            <button
              @click="showShareMenu = !showShareMenu"
              class="rounded-lg border p-2 transition-colors"
              :style="{
                borderColor: `${textColor}30`,
                backgroundColor: `${textColor}08`,
                color: textColor,
              }"
              title="Compartir menú"
              aria-label="Compartir menú"
              :aria-expanded="showShareMenu"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <ShareMenu
              v-model="showShareMenu"
              :backgroundColor="backgroundColor"
              :text-color="textColor"
              @share-whatsapp="shareOnWhatsApp"
              @share-facebook="shareOnFacebook"
              @copy-link="copyLink"
              @export-pdf="exportToPDF"
            />
          </div>
          </div>
        </div>
        
        <!-- Imagen de header con o sin overlay -->
        <div v-if="business.headerImageUrl" class="-mx-5 sm:-mx-6 rounded-2xl overflow-hidden shadow-lg relative">
          <img
            :src="business.headerImageUrl"
            :alt="`Imagen de ${business.name}`"
            loading="eager"
            class="w-full h-48 sm:h-64 object-cover"
          />
          <!-- Overlay con nombre del comercio sobre la imagen -->
          <div
            v-if="business.headerImageOverlay"
            class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <h1 
              class="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none text-white drop-shadow-lg px-4 text-center"
              :class="headingWeightClass"
            >
              {{ business.name }}
            </h1>
          <p v-if="business.description" class="text-base sm:text-lg opacity-90 leading-relaxed italic max-w-xl mx-auto mt-3 text-white drop-shadow-md px-4 text-center">
            {{ business.description }}
          </p>
          </div>
        </div>

        <!-- Modal de horarios -->
        <div
          v-if="showHoursModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="showHoursModal = false"
          role="dialog"
          aria-modal="true"
          aria-labelledby="hours-modal-title"
        >
          <div
            class="rounded-2xl border p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            :style="{
              borderColor: `${textColor}30`,
              backgroundColor: backgroundColor,
              color: textColor,
            }"
            @click.stop
            role="document"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 id="hours-modal-title" class="text-lg font-semibold">Horarios de atención</h3>
            <button
              @click="showHoursModal = false"
              class="p-1 rounded-lg hover:bg-black/10 transition-colors"
              aria-label="Cerrar modal de horarios"
            >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="space-y-2 text-sm">
              <div
                v-for="(hours, day) in business.openingHours"
                :key="day"
                class="flex justify-between py-2 border-b"
                :style="{ borderColor: `${textColor}20` }"
              >
                <span class="capitalize font-medium">{{ day }}:</span>
                <span v-if="hours.closed" class="opacity-60">Cerrado</span>
                <span v-else>{{ hours.open }} - {{ hours.close }}</span>
              </div>
            </div>
            <div v-if="!isOpenNow" class="mt-4 text-center text-sm font-medium p-3 rounded-lg" :style="{ backgroundColor: `${priceColor}20`, color: priceColor }">
              ⚠️ Actualmente cerrado
            </div>
          </div>
        </div>
        
        <!-- Nombre del comercio - destacado y centrado (solo si no hay overlay y no está oculto) -->
        <div v-if="(!business.headerImageUrl || !business.headerImageOverlay) && !business.hideName" class="text-center space-y-4">
          <h1 
            class="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none"
            :class="headingWeightClass"
          >
            {{ business.name }}
          </h1>
          <p v-if="business.description" class="text-base sm:text-lg opacity-80 leading-relaxed italic max-w-xl mx-auto">
            {{ business.description }}
          </p>
        </div>
        
        <!-- Redes sociales y ubicación - centradas -->
        <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
          <!-- Redes sociales -->
          <div
            v-if="hasSocialMedia"
            class="flex items-center gap-3"
          >
            <a
              v-if="business.socialMedia?.instagram"
              :href="business.socialMedia.instagram"
              target="_blank"
              rel="noopener noreferrer"
              class="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Instagram"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              v-if="business.socialMedia?.facebook"
              :href="business.socialMedia.facebook"
              target="_blank"
              rel="noopener noreferrer"
              class="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Facebook"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              v-if="business.socialMedia?.whatsapp"
              :href="business.socialMedia.whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              class="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="WhatsApp"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
            <a
              v-if="business.socialMedia?.tiktok"
              :href="business.socialMedia.tiktok"
              target="_blank"
              rel="noopener noreferrer"
              class="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="TikTok"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>
          
          <!-- Ubicación Google Maps -->
          <a
            v-if="business.googleMapsUrl"
            :href="business.googleMapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-sm opacity-80 hover:opacity-100 transition-opacity"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Ubicación</span>
          </a>
        </div>
      </header>

      <main class="flex-1 space-y-12 pb-12" role="main">
        <section
          v-for="section in filteredSections"
          :key="section.id"
          class="space-y-6"
        >
          <!-- Título de sección (clickeable para colapsar/expandir) -->
          <div class="space-y-3">
            <button
              @click="toggleSection(section.id)"
              class="w-full flex items-center gap-4 group"
              :aria-label="`${isSectionCollapsed(section.id) ? 'Expandir' : 'Colapsar'} sección ${section.name}`"
              :aria-expanded="!isSectionCollapsed(section.id)"
            >
              <h2 
                class="text-2xl sm:text-3xl md:text-4xl tracking-tight text-left flex-shrink-0"
                :class="headingWeightClass"
              >
                {{ section.name }}
              </h2>
              <!-- Línea decorativa -->
              <div class="flex-1 h-px opacity-30" :style="{ backgroundColor: textColor }" />
              <!-- Icono de expandir/colapsar -->
              <div class="flex-shrink-0 transition-transform duration-200" :class="{ 'rotate-90': isSectionCollapsed(section.id) }">
                <svg 
                  class="h-6 w-6 opacity-60 group-hover:opacity-100 transition-opacity" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <p v-if="section.description" class="text-sm sm:text-base opacity-80 leading-relaxed italic max-w-2xl">
              {{ section.description }}
            </p>
          </div>
          
          <!-- Items de la sección (colapsable) -->
          <div 
            v-show="!isSectionCollapsed(section.id)"
            class="space-y-6 transition-all duration-300"
          >
            <article
              v-for="item in section.items"
              :key="item.id"
              class="group relative"
            >
              <!-- Contenido del ítem -->
              <div class="flex items-start justify-between gap-4 sm:gap-6">
                <!-- Imagen del ítem como miniatura -->
                <div class="flex-shrink-0">
                  <img
                    :src="getMenuItemImageSrc(item, section.name)"
                    :alt="`${item.name}${item.description ? ' - ' + item.description : ''}`"
                    loading="lazy"
                    class="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105 shadow-md bg-slate-100"
                  />
                </div>
                
                <div class="flex-1 space-y-3 min-w-0">
                  <div class="space-y-2">
                    <h3 
                      class="text-xl sm:text-2xl leading-tight tracking-tight"
                      :class="headingWeightClass"
                    >
                      {{ item.name }}
                    </h3>
                    <p v-if="item.description" class="text-sm sm:text-base leading-relaxed opacity-80 max-w-2xl">
                      {{ item.description }}
                    </p>
                  </div>
                  <!-- Tags -->
                  <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-2 pt-1">
                    <span
                      v-for="tag in item.tags"
                      :key="tag"
                      class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium opacity-80 border"
                      :style="{
                        backgroundColor: `${textColor}12`,
                        color: textColor,
                        borderColor: `${textColor}25`,
                      }"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
                
                <!-- Precio, disponibilidad y botón de pedido -->
                <div class="flex flex-col items-end gap-2 flex-shrink-0 pt-1">
                  <span
                    v-if="item.price != null && shouldShowPrices"
                    class="text-2xl sm:text-3xl font-bold tabular-nums whitespace-nowrap"
                    :style="{ color: priceColor }"
                  >
                    ${{ item.price.toLocaleString('es-AR') }}
                  </span>
                  <span
                    v-if="item.isAvailable === false"
                    class="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 border border-amber-200"
                  >
                    agotado
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer class="mt-auto border-t pt-8" :style="{ borderColor: `${textColor}20` }" role="contentinfo">
        <div class="flex items-center justify-center gap-2 text-xs opacity-60">
          <span class="italic">Menú</span>
          <span>·</span>
          <span>
            Hecho con
            <NuxtLink
              to="/"
              class="font-semibold underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded"
              :style="{ color: priceColor }"
            >
              MapaMorfi
            </NuxtLink>
          </span>
        </div>
      </footer>
    </div>

  </div>
  <div v-else-if="business && business.isActive === false" class="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
    <div class="max-w-md text-center space-y-4 px-6">
      <h1 class="text-2xl font-semibold">Menú no disponible</h1>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Este menú está temporalmente suspendido. Por favor contactá al comercio.
      </p>
    </div>
  </div>
  <div v-else-if="business && !isPublic" class="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
    <div class="max-w-md text-center space-y-4 px-6">
      <div class="mx-auto w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
        <svg class="w-12 h-12 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h1 class="text-2xl font-semibold">Menú en modo demo</h1>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Este menú está en modo demo y no está disponible públicamente. Para hacer tu menú público y generar códigos QR, necesitás un plan de pago.
      </p>
      <NuxtLink
        to="/billing"
        class="inline-flex items-center gap-2 mt-4 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
      >
        Ver planes disponibles
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>
    </div>
  </div>
  <div
    v-else-if="pending"
    class="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50"
  >
    <AppLoadingScreen
      title="Cargando menú…"
      subtitle="Preparando productos y precios"
    />
  </div>
  <div v-else-if="!pending" class="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
    <div class="max-w-md text-center space-y-4 px-6">
      <h1 class="text-2xl font-semibold">Menú no encontrado</h1>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Verificá que hayas escaneado el QR correcto o consultá al comercio.
      </p>
    </div>
  </div>
  
  <!-- Toast Notification (siempre disponible fuera de los condicionales) -->
  <Toast
    v-model:message="toastMessage"
    :type="toastType"
    :duration="3000"
  />
</template>

<script setup>
const route = useRoute()
const { fetchBusinessBySlug } = useBusinesses()
const { trackEvent } = useAnalytics()

const slug = route.params.slug
const business = ref(null)
const pending = ref(true)
const isPublic = ref(true)

const showActivePublicMenu = computed(
  () => !!business.value && business.value.isActive !== false && isPublic.value
)

const { calculatePriceColor, getContrastTextColor, isLightColor } = useColorUtils()
const { getCachedMenu, setCachedMenu } = useMenuCache()


// Verificar si está abierto ahora
const isOpenNow = computed(() => {
  if (!business.value?.openingHours) return true
  
  const now = new Date()
  const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
  const today = dayNames[now.getDay()]
  const todayHours = business.value.openingHours[today]
  
  if (!todayHours || todayHours.closed) return false
  
  const [openHour, openMin] = todayHours.open.split(':').map(Number)
  const [closeHour, closeMin] = todayHours.close.split(':').map(Number)
  const currentHour = now.getHours()
  const currentMin = now.getMinutes()
  
  const openTime = openHour * 60 + openMin
  const closeTime = closeHour * 60 + closeMin
  const currentTime = currentHour * 60 + currentMin
  
  return currentTime >= openTime && currentTime <= closeTime
})
const { getFontById, getDefaultFont } = useFonts()

// Color base seleccionado por el usuario
const baseColor = computed(() => {
  return business.value?.backgroundColor || business.value?.primaryColor || business.value?.themeColor || '#ffffff'
})

// Color de fondo - siempre usa el color base sin adaptación al tema
const backgroundColor = computed(() => {
  return baseColor.value
})

const fontFamily = computed(() => {
  const fontId = business.value?.fontFamily || 'inter'
  const font = getFontById(fontId)
  return font.family
})

/** Peso tipográfico unificado para títulos según fuente del menú */
const headingWeightClass = computed(() => {
  const fontId = business.value?.fontFamily || 'inter'
  if (fontId === 'pacifico') return 'font-medium tracking-wide'
  if (fontId === 'dancing') return 'font-semibold tracking-wide'
  return 'font-bold'
})

// Estado de secciones colapsadas (por defecto todas expandidas)
const collapsedSections = ref(new Set())
const searchQuery = ref('')
const showShareMenu = ref(false)
const showHoursModal = ref(false)
const isFavorite = ref(false)
const isLoadingFavorite = ref(false)
const isAuthenticated = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// Color de texto que se adapta al fondo
const textColor = computed(() => {
  return getContrastTextColor(backgroundColor.value)
})

// Color del precio que se adapta al fondo (basado en luminosidad del color de fondo, no en el tema global)
const priceColor = computed(() => {
  // Determinar si el fondo es claro u oscuro basándose en su luminosidad
  const bgIsLight = isLightColor(backgroundColor.value)
  return calculatePriceColor(backgroundColor.value, !bgIsLight)
})

// Layout del menú (por defecto 'vertical')
const menuLayout = computed(() => {
  return business.value?.menuLayout || 'vertical'
})

const hasSocialMedia = computed(() => {
  if (!business.value?.socialMedia) return false
  const sm = business.value.socialMedia
  return !!(sm.instagram || sm.facebook || sm.whatsapp || sm.tiktok)
})

// Plataformas de pedidos activas
const activeDeliveryPlatforms = computed(() => {
  if (!business.value?.deliveryPlatforms) {
    // Migrar pedidosYaUrl antiguo si existe
    if (business.value?.pedidosYaUrl) {
      return [{
        id: 'pedidosYa',
        name: 'PedidosYa',
        url: business.value.pedidosYaUrl,
        logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/PedidosYa_logo.png'
      }]
    }
    return []
  }
  
  const platforms = []
  const platformConfigs = {
    pedidosYa: {
      id: 'pedidosYa',
      name: 'PedidosYa',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/PedidosYa_logo.png'
    },
    rappi: {
      id: 'rappi',
      name: 'Rappi',
      logo: null // Agregar logo si está disponible
    },
    agilpedido: {
      id: 'agilpedido',
      name: 'AgilPedido',
      logo: null
    },
    pedidodirecto: {
      id: 'pedidodirecto',
      name: 'PedidoDirecto',
      logo: null
    }
  }
  
  Object.keys(platformConfigs).forEach(key => {
    const platform = business.value.deliveryPlatforms[key]
    if (platform && platform.enabled && platform.url) {
      platforms.push({
        ...platformConfigs[key],
        url: platform.url
      })
    }
  })
  
  // También incluir pedidosYaUrl antiguo si existe (para compatibilidad)
  if (business.value?.pedidosYaUrl && !platforms.find(p => p.id === 'pedidosYa')) {
    platforms.push({
      id: 'pedidosYa',
      name: 'PedidosYa',
      url: business.value.pedidosYaUrl,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/PedidosYa_logo.png'
    })
  }
  
  return platforms
})

// Verificar si se debe mostrar precios
// En QR siempre se muestran, en menú público depende de showPrices
const shouldShowPrices = computed(() => {
  // Si viene de QR (hay parámetro qr=true o similar), siempre mostrar
  if (process.client) {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('qr') === 'true' || urlParams.get('from') === 'qr') {
      return true
    }
  }
  
  // Si showPrices es false, no mostrar (pero solo en menú público, no en QR)
  if (business.value?.showPrices === false) {
    return false
  }
  
  // Por defecto, mostrar precios (si showPrices es true o undefined)
  return true
})

const toggleSection = (sectionId) => {
  if (collapsedSections.value.has(sectionId)) {
    collapsedSections.value.delete(sectionId)
  } else {
    collapsedSections.value.add(sectionId)
  }
}

const isSectionCollapsed = (sectionId) => {
  return collapsedSections.value.has(sectionId)
}

// Filtrar secciones e ítems según búsqueda
const filteredSections = computed(() => {
  if (!business.value) return []
  
  // Usar normalizador para obtener secciones consistentes
  let sections = filterSectionsWithItems(normalizeBusinessSections(business.value))
  
  if (sections.length === 0) return []
  
  if (!searchQuery.value.trim()) return sections

  const query = searchQuery.value.toLowerCase().trim()
  return sections
    .map(section => {
      const filteredItems = (section.items || []).filter(item => {
        if (!item || !item.name) return false
        const nameMatch = item.name?.toLowerCase().includes(query)
        const descMatch = item.description?.toLowerCase().includes(query)
        const tagMatch = Array.isArray(item.tags) && item.tags.some(tag => tag?.toLowerCase().includes(query))
        return nameMatch || descMatch || tagMatch
      })
      return { ...section, items: filteredItems }
    })
    .filter(section => section.items && section.items.length > 0)
})

// Compartir funciones
const menuUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return ''
})

const shareOnWhatsApp = () => {
  const text = `¡Mirá el menú de ${business.value?.name}! ${menuUrl.value}`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  showShareMenu.value = false
}

const shareOnFacebook = () => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(menuUrl.value)}`, '_blank')
  showShareMenu.value = false
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(menuUrl.value)
    alert('Link copiado al portapapeles')
  } catch (error) {
    console.error('Error copying link:', error)
    alert('Error al copiar el link')
  }
  showShareMenu.value = false
}

/** Elementos a ocultar al generar PDF (mismo criterio en DOM y en el clon de html2canvas) */
const PDF_EXPORT_HIDE_SELECTORS = [
  '.absolute.right-5',
  '.absolute.right-0.top-full',
  'button[title*="favoritos"]',
  'button[title*="Favoritos"]',
  'header .flex.items-center.justify-end',
  '.relative.flex-1.max-w-xs',
  '.flex.items-center.justify-end.gap-3.mb-4',
  '.sticky.top-0.z-40',
  '.sticky.top-0 .relative.mt-3',
  'input[placeholder*="Buscar"]',
  'input[placeholder*="buscar"]',
  'input#menu-search',
  '.flex.items-center.justify-end.gap-3 button',
  '.flex.items-center.justify-end.gap-2 button',
  '.sticky.top-0 button',
  'a[target="_blank"][rel*="noopener"]',
  'button[aria-label*="Expandir"]',
  'button[aria-label*="Colapsar"]',
]

// Funciones helper para exportar PDF
const prepareElementsForPDF = (element) => {
  const originalDisplays = []

  const hideElementsBySelector = (selector, doc = document) => {
    const elements = doc.querySelectorAll(selector)
    elements.forEach((el) => {
      if (el && el.style) {
        originalDisplays.push({ element: el, display: el.style.display })
        el.style.display = 'none'
      }
    })
  }

  PDF_EXPORT_HIDE_SELECTORS.forEach((selector) => hideElementsBySelector(selector))
  
  // Preparar padding y márgenes
  const originalPadding = {
    top: element.style.paddingTop,
    bottom: element.style.paddingBottom,
    left: element.style.paddingLeft,
    right: element.style.paddingRight,
  }
  element.style.paddingTop = '0px'
  element.style.paddingBottom = '0px'
  element.style.paddingLeft = '0px'
  element.style.paddingRight = '0px'
  
  const originalMargin = {
    left: element.style.marginLeft,
    right: element.style.marginRight,
  }
  element.style.marginLeft = '0'
  element.style.marginRight = '0'
  
  // Preparar descripciones (remover line-clamp)
  const descriptions = element.querySelectorAll('.line-clamp-2, .line-clamp-3')
  const originalDescriptionStyles = []
  descriptions.forEach(desc => {
    originalDescriptionStyles.push({
      element: desc,
      classes: Array.from(desc.classList),
      style: {
        webkitLineClamp: desc.style.webkitLineClamp,
        display: desc.style.display,
        webkitBoxOrient: desc.style.webkitBoxOrient,
        overflow: desc.style.overflow
      }
    })
    desc.classList.remove('line-clamp-2', 'line-clamp-3')
    desc.style.webkitLineClamp = 'unset'
    desc.style.display = 'block'
    desc.style.webkitBoxOrient = 'unset'
    desc.style.overflow = 'visible'
  })
  
  // Ocultar imágenes
  const images = element.querySelectorAll('img')
  const originalImageDisplays = []
  images.forEach(img => {
    originalImageDisplays.push({ element: img, display: img.style.display })
    img.style.display = 'none'
  })
  
  return {
    originalDisplays,
    originalPadding,
    originalMargin,
    originalDescriptionStyles,
    originalImageDisplays,
  }
}

const restoreElementsAfterPDF = (element, { originalDisplays, originalPadding, originalMargin, originalDescriptionStyles, originalImageDisplays }) => {
  element.style.paddingTop = originalPadding.top || ''
  element.style.paddingBottom = originalPadding.bottom || ''
  element.style.paddingLeft = originalPadding.left || ''
  element.style.paddingRight = originalPadding.right || ''
  element.style.marginLeft = originalMargin.left || ''
  element.style.marginRight = originalMargin.right || ''
  
  originalImageDisplays.forEach(({ element: img, display }) => {
    if (img && img.style) img.style.display = display || ''
  })
  
  originalDescriptionStyles.forEach(({ element: el, classes, style }) => {
    if (el) {
      classes.forEach(cls => el.classList.add(cls))
      el.style.webkitLineClamp = style.webkitLineClamp
      el.style.display = style.display
      el.style.webkitBoxOrient = style.webkitBoxOrient
      el.style.overflow = style.overflow
    }
  })
  
  originalDisplays.forEach(({ element: el, display }) => {
    if (el && el.style) el.style.display = display
  })
}

const generatePDFPages = (pdf, canvas, imgWidth, imgHeight, pdfWidth, pdfHeight) => {
  const ratio = imgWidth / imgHeight
  let finalWidth = pdfWidth
  let finalHeight = pdfWidth / ratio
  const contentHeight = pdfHeight
  
  if (finalHeight > contentHeight) {
    finalHeight = contentHeight
    finalWidth = contentHeight * ratio
  }
  
  const imgData = canvas.toDataURL('image/png', 1.0)
  const totalHeight = finalHeight
  
  if (totalHeight <= contentHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, finalWidth, finalHeight, undefined, 'FAST')
  } else {
    const pageHeightPx = (contentHeight / totalHeight) * imgHeight
    let sourceY = 0
    
    // Primera página
    const firstPageHeight = Math.min(pageHeightPx, imgHeight)
    const tempCanvas1 = document.createElement('canvas')
    tempCanvas1.width = imgWidth
    tempCanvas1.height = firstPageHeight
    const tempCtx1 = tempCanvas1.getContext('2d')
    tempCtx1.drawImage(canvas, 0, 0, imgWidth, firstPageHeight, 0, 0, imgWidth, firstPageHeight)
    const firstPageData = tempCanvas1.toDataURL('image/png', 1.0)
    const firstPageHeightMm = (firstPageHeight / imgHeight) * finalHeight
    pdf.addImage(firstPageData, 'PNG', 0, 0, finalWidth, firstPageHeightMm, undefined, 'FAST')
    sourceY = firstPageHeight
    
    // Páginas adicionales
    while (sourceY < imgHeight) {
      pdf.addPage()
      const pageHeight = Math.min(pageHeightPx, imgHeight - sourceY)
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = imgWidth
      tempCanvas.height = pageHeight
      const tempCtx = tempCanvas.getContext('2d')
      tempCtx.drawImage(canvas, 0, sourceY, imgWidth, pageHeight, 0, 0, imgWidth, pageHeight)
      const tempImgData = tempCanvas.toDataURL('image/png', 1.0)
      const tempHeightMm = (pageHeight / imgHeight) * finalHeight
      pdf.addImage(tempImgData, 'PNG', 0, 0, finalWidth, tempHeightMm, undefined, 'FAST')
      sourceY += pageHeight
    }
  }
}

const exportToPDF = async () => {
  try {
    const { default: html2canvas } = await import('html2canvas')
    const { default: jsPDF } = await import('jspdf')

    const element = document.querySelector('.min-h-screen > .mx-auto')
    if (!element) return
    
    const prepared = prepareElementsForPDF(element)
    await new Promise(resolve => setTimeout(resolve, 200))

    // Configuración mejorada para html2canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Escala suficiente para buena calidad
      useCORS: true,
      allowTaint: false, // Cambiar a false para mejor manejo de imágenes
      backgroundColor: backgroundColor.value || '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      removeContainer: false,
      imageTimeout: 15000, // Aumentar timeout para imágenes
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('.min-h-screen > .mx-auto')
        if (!clonedElement) return
        
        // Aplicar las mismas preparaciones en el clon usando la función helper
        PDF_EXPORT_HIDE_SELECTORS.forEach((selector) => {
          clonedDoc.querySelectorAll(selector).forEach((el) => {
            if (el && el.style) el.style.display = 'none'
          })
        })
        
        clonedElement.style.paddingTop = '0px'
        clonedElement.style.paddingBottom = '0px'
        clonedElement.style.paddingLeft = '0px'
        clonedElement.style.paddingRight = '0px'
        clonedElement.style.marginLeft = '0'
        clonedElement.style.marginRight = '0'
        
        const clonedImages = clonedElement.querySelectorAll('img')
        clonedImages.forEach(img => img.style.display = 'none')
        
        const clonedDescriptions = clonedElement.querySelectorAll('.line-clamp-2, .line-clamp-3')
        clonedDescriptions.forEach(desc => {
          desc.classList.remove('line-clamp-2', 'line-clamp-3')
          desc.style.webkitLineClamp = 'unset'
          desc.style.display = 'block'
          desc.style.webkitBoxOrient = 'unset'
          desc.style.overflow = 'visible'
        })
      }
    })

    restoreElementsAfterPDF(element, prepared)

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = 210
    const pdfHeight = 297
    generatePDFPages(pdf, canvas, canvas.width, canvas.height, pdfWidth, pdfHeight)

    // Agregar footer en cada página
    const pageCount = pdf.internal.pages.length - 1
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setTextColor(128, 128, 128)
      pdf.text(
        `Hecho con MapaMorfi · Página ${i} de ${pageCount}`,
        pdfWidth / 2,
        pdfHeight - 3,
        { align: 'center' }
      )
    }

    pdf.save(`${business.value?.name || 'menu'}-menu.pdf`)
    showShareMenu.value = false
  } catch (error) {
    console.error('Error exporting PDF:', error)
    alert('Error al exportar el PDF. Por favor, intentá nuevamente.')
  }
}


onMounted(async () => {
  try {
    // Si es el slug de demo, cargar el business de demo
    if (slug === 'demo') {
      try {
        const demo = await $fetch('/api/businesses/demo')
        if (demo) {
          business.value = normalizeBusiness(demo)
          pending.value = false
          return
        }
      } catch (error) {
        console.error('Error loading demo business:', error)
      }
    }

    // Intentar cargar desde caché primero para mostrar contenido rápido
    const cachedBusiness = getCachedMenu(slug)
    if (cachedBusiness) {
      business.value = cachedBusiness
      pending.value = false
      // Cargar versión actualizada en background
      fetchBusinessBySlug(slug).then(updatedBusiness => {
        if (updatedBusiness) {
          business.value = updatedBusiness
          setCachedMenu(slug, updatedBusiness)
        }
      }).catch(err => {
        console.error('Error loading updated business:', err)
      })
      return
    }

    // Si no hay caché, cargar normalmente
    business.value = await fetchBusinessBySlug(slug)
    
    // Si no se encontró el comercio, no usar mock data (dejar que muestre el 404)
    if (!business.value) {
      pending.value = false
      return
    }

    // Guardar en caché después de cargar
    setCachedMenu(slug, business.value)

    // Verificar si el menú es público según el plan del usuario
    if (business.value) {
      try {
        const accessCheck = await $fetch(`/api/businesses/${slug}/check-access`)
        isPublic.value = accessCheck.isPublic === true
      } catch (err) {
        console.error('Error checking access:', err)
        // Por defecto, permitir acceso si hay error
        isPublic.value = true
      }

      // Track menu view
      if (business.value.id) {
        trackEvent(business.value.id, 'menu_view')
      }
    }
    
    // Verificar autenticación y cargar favoritos
    await checkAuthAndFavorite()
  } catch (error) {
    console.error('Error loading business:', error)
    // Si es un 404, no usar mock data - dejar que se muestre el estado de error
    if (error.statusCode === 404 || error.status === 404) {
      business.value = null
    } else {
      // Para otros errores, dejar business como null
      business.value = null
    }
  } finally {
    pending.value = false
  }
})


// Los colores se actualizan automáticamente mediante computed properties
// cuando cambia baseColor

// Verificar autenticación y cargar estado de favorito
const checkAuthAndFavorite = async () => {
  if (!process.client) return
  
  const { getAuth, getToken } = useAuth()
  const auth = getAuth()
  if (auth) {
    isAuthenticated.value = true
    
    // Verificar si es favorito
    if (business.value?.id) {
      try {
        const token = getToken()
        const response = await $fetch(`/api/favorites/check?businessId=${business.value.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        isFavorite.value = response.isFavorite || false
      } catch (err) {
        console.error('Error checking favorite:', err)
      }
    }
  }
}

// Toggle favorito
const toggleFavorite = async () => {
  if (!isAuthenticated.value || !business.value?.id) return
  
  isLoadingFavorite.value = true
  try {
    const { getToken } = useAuth()
    const token = getToken()
    if (!token) return
    
    if (isFavorite.value) {
      // Eliminar de favoritos
      await $fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: {
          businessId: business.value.id,
        },
      })
      isFavorite.value = false
      // Trigger toast - usar un timestamp para forzar el cambio
      toastType.value = 'success'
      const timestamp = Date.now()
      toastMessage.value = `Eliminado de favoritos-${timestamp}`
      console.log('Toast message set:', toastMessage.value)
    } else {
      // Agregar a favoritos
      await $fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: {
          businessId: business.value.id,
        },
      })
      isFavorite.value = true
      // Trigger toast - usar un timestamp para forzar el cambio
      toastType.value = 'success'
      const timestamp = Date.now()
      toastMessage.value = `Agregado a favoritos-${timestamp}`
      console.log('Toast message set:', toastMessage.value)
    }
  } catch (err) {
    console.error('Error toggling favorite:', err)
    // Trigger toast - usar un timestamp para forzar el cambio
    toastType.value = 'error'
    const timestamp = Date.now()
    toastMessage.value = `Error al actualizar favoritos-${timestamp}`
    console.log('Toast message set:', toastMessage.value)
  } finally {
    isLoadingFavorite.value = false
  }
}

onMounted(async () => {
  await checkAuthAndFavorite()
})

watch(() => business.value?.id, async () => {
  if (business.value?.id) {
    await checkAuthAndFavorite()
  }
})

// Meta tags dinámicos para SEO
useHead({
  title: business.value ? `${business.value.name} · Menú` : 'Menú',
  meta: [
    {
      name: 'description',
      content: business.value?.description 
        ? `${business.value.description} - Menú digital de ${business.value.name}`
        : `Menú digital de ${business.value?.name || 'comercio'}`
    },
    // Open Graph
    {
      property: 'og:title',
      content: business.value ? `${business.value.name} · Menú` : 'Menú'
    },
    {
      property: 'og:description',
      content: business.value?.description 
        ? `${business.value.description} - Menú digital de ${business.value.name}`
        : `Menú digital de ${business.value?.name || 'comercio'}`
    },
    {
      property: 'og:image',
      content: business.value?.headerImageUrl || business.value?.logoUrl || ''
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: menuUrl.value
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: business.value ? `${business.value.name} · Menú` : 'Menú'
    },
    {
      name: 'twitter:description',
      content: business.value?.description 
        ? `${business.value.description} - Menú digital de ${business.value.name}`
        : `Menú digital de ${business.value?.name || 'comercio'}`
    },
    {
      name: 'twitter:image',
      content: business.value?.headerImageUrl || business.value?.logoUrl || ''
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: menuUrl.value
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: business.value?.name || '',
        description: business.value?.description || '',
        image: business.value?.headerImageUrl || business.value?.logoUrl || '',
        url: menuUrl.value,
        address: business.value?.address ? {
          '@type': 'PostalAddress',
          streetAddress: business.value.address
        } : undefined,
        geo: (business.value?.latitude && business.value?.longitude) ? {
          '@type': 'GeoCoordinates',
          latitude: business.value.latitude,
          longitude: business.value.longitude
        } : undefined,
        servesCuisine: business.value?.category || undefined,
        openingHoursSpecification: business.value?.openingHours ? Object.entries(business.value.openingHours).map(([day, hours]) => {
          if (hours.closed) return null
          return {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: `https://schema.org/${day.charAt(0).toUpperCase() + day.slice(1)}`,
            opens: hours.open,
            closes: hours.close
          }
        }).filter(Boolean) : undefined,
        sameAs: business.value?.socialMedia ? [
          business.value.socialMedia.instagram,
          business.value.socialMedia.facebook,
          business.value.socialMedia.whatsapp
        ].filter(Boolean) : undefined
      })
    }
  ]
})
</script>

