<template>
  <div class="min-h-screen transition-all duration-300 ease-in-out" :style="{ backgroundColor, fontFamily, color: textColor, '--price-color': priceColor }">
    <div class="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-5 py-10 sm:px-6">
      <!-- Barra superior con acciones -->
      <div class="flex items-center justify-end gap-3 mb-4">
        <!-- Botón de favoritos -->
        <button
          v-if="isAuthenticated"
          @click="$emit('toggle-favorite')"
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
        
        <!-- Horarios -->
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
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        
        <!-- Plataformas de pedidos -->
        <template v-if="activeDeliveryPlatforms && activeDeliveryPlatforms.length > 0">
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
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <ShareMenu
            v-model="showShareMenu"
            :backgroundColor="backgroundColor"
            :text-color="textColor"
            @share-whatsapp="$emit('share-whatsapp')"
            @share-facebook="$emit('share-facebook')"
            @copy-link="$emit('copy-link')"
            @export-pdf="$emit('export-pdf')"
          />
        </div>
      </div>
      
      <!-- Hero Image con logo overlay -->
      <div v-if="business.headerImageUrl" class="relative -mx-5 sm:-mx-6 rounded-2xl overflow-hidden shadow-lg">
        <img
          :src="business.headerImageUrl"
          :alt="business.name"
          loading="eager"
          class="w-full h-64 sm:h-80 object-cover"
        />
        <div
          v-if="business.headerImageOverlay"
          class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <h1 
            class="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none text-white drop-shadow-lg px-4 text-center"
            :class="isPacifico ? 'font-medium tracking-wide' : isScriptFont ? 'font-semibold tracking-wide' : 'font-bold'"
          >
            {{ business.name }}
          </h1>
          <p v-if="business.description" class="text-base sm:text-lg opacity-90 leading-relaxed italic max-w-xl mx-auto mt-3 text-white drop-shadow-md px-4 text-center">
            {{ business.description }}
          </p>
        </div>
      </div>
      
      <!-- Nombre del comercio (solo si no hay header image o no tiene overlay) -->
      <div v-if="(!business.headerImageUrl || !business.headerImageOverlay) && !business.hideName" class="text-center space-y-4">
        <h1 
          class="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none"
          :class="isPacifico ? 'font-medium tracking-wide' : isScriptFont ? 'font-semibold tracking-wide' : 'font-bold'"
        >
          {{ business.name }}
        </h1>
        <p v-if="business.description" class="text-base sm:text-lg opacity-80 leading-relaxed italic max-w-xl mx-auto">
          {{ business.description }}
        </p>
      </div>
      
      <!-- Información de contacto y horarios -->
      <div class="flex flex-wrap items-center justify-center gap-4 text-sm">
        <div v-if="business.address" class="flex items-center gap-2 px-4 py-2 rounded-lg border" :style="{ borderColor: `${textColor}30`, backgroundColor: `${textColor}08` }">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{{ business.address }}</span>
        </div>
        <div v-if="business.openingHours" class="flex items-center gap-2 px-4 py-2 rounded-lg border" :style="{ borderColor: `${textColor}30`, backgroundColor: `${textColor}08` }">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ isOpenNow ? 'Abierto ahora' : 'Cerrado' }}</span>
        </div>
        <a
          v-if="business.googleMapsUrl"
          :href="business.googleMapsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-4 py-2 rounded-lg border" 
          :style="{ borderColor: `${textColor}30`, backgroundColor: `${textColor}08` }"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>Ver en Maps</span>
        </a>
      </div>

      <!-- Sección "Menus" con categorías en cards -->
      <section class="space-y-6">
        <h2 class="text-3xl font-bold text-center">Menus</h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="section in sections"
            :key="section.id"
            @click="selectedCategory = section.id"
            class="group relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-105"
            :style="{
              borderColor: selectedCategory === section.id ? priceColor : `${textColor}30`,
              backgroundColor: selectedCategory === section.id ? `${priceColor}10` : `${textColor}05`,
            }"
          >
            <!-- Imagen de la categoría (usar primera imagen de ítem o placeholder) -->
            <div class="aspect-video overflow-hidden bg-slate-200">
              <img
                v-if="getCategoryImage(section)"
                :src="getCategoryImage(section)"
                :alt="section.name"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div v-else class="w-full h-full flex items-center justify-center" :style="{ backgroundColor: priceColor, opacity: 0.2 }">
                <svg class="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <!-- Contenido de la categoría -->
            <div class="p-6 space-y-3">
              <h3 
                class="text-xl font-bold"
                :class="isPacifico ? 'font-medium' : isScriptFont ? 'font-semibold' : 'font-bold'"
              >
                {{ section.name }}
              </h3>
              <p v-if="section.description" class="text-sm opacity-80 line-clamp-2">
                {{ section.description }}
              </p>
              <button
                class="w-full px-4 py-2 rounded-lg font-medium transition-colors"
                :style="
                  selectedCategory === section.id
                    ? { backgroundColor: priceColor, color: getContrastTextColor(priceColor) }
                    : { backgroundColor: `${textColor}15`, color: textColor }
                "
              >
                Ver menú
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Ítems de la categoría seleccionada -->
      <section v-if="selectedCategory" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold">
            {{ selectedSection?.name }}
          </h2>
          <button
            @click="selectedCategory = null"
            class="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
            :style="{
              borderColor: `${textColor}30`,
              backgroundColor: `${textColor}08`,
              color: textColor,
            }"
          >
            Volver
          </button>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <article
            v-for="item in selectedSectionItems"
            :key="item.id"
            class="flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-md"
            :style="{
              borderColor: `${textColor}20`,
              backgroundColor: `${textColor}05`,
            }"
          >
            <div class="flex-shrink-0">
              <img
                v-if="item.imageUrl"
                :src="item.imageUrl"
                :alt="item.name"
                loading="lazy"
                class="w-20 h-20 rounded-lg object-cover"
              />
              <div v-else class="w-20 h-20 rounded-lg bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
                <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <!-- Plato -->
                  <ellipse cx="12" cy="17" rx="8" ry="2" stroke="currentColor" fill="currentColor" opacity="0.2"/>
                  <ellipse cx="12" cy="17" rx="8" ry="2" stroke="currentColor" fill="none"/>
                  <!-- Comida en el plato -->
                  <circle cx="9" cy="14" r="2" fill="currentColor" opacity="0.6"/>
                  <circle cx="15" cy="14" r="2.5" fill="currentColor" opacity="0.6"/>
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.7"/>
                </svg>
              </div>
            </div>
            
            <div class="flex-1 space-y-2 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <h3 
                    class="text-lg font-semibold leading-tight"
                    :class="isPacifico ? 'font-medium' : isScriptFont ? 'font-semibold' : 'font-bold'"
                  >
                    {{ item.name }}
                  </h3>
                  <p v-if="item.description" class="text-sm opacity-80 mt-1">
                    {{ item.description }}
                  </p>
                </div>
                <span
                  v-if="item.price != null && shouldShowPrices"
                  class="text-xl font-bold tabular-nums whitespace-nowrap flex-shrink-0"
                  :style="{ color: priceColor }"
                >
                  ${{ item.price.toLocaleString('es-AR') }}
                </span>
              </div>
              
              <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-2">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium opacity-80 border"
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
          </article>
        </div>
      </section>
      
      <!-- Footer -->
      <footer class="mt-auto border-t pt-8" :style="{ borderColor: `${textColor}20` }" role="contentinfo">
        <div class="flex items-center justify-center gap-2 text-xs opacity-60">
          <span class="italic">Menú</span>
          <span>·</span>
          <span>
            Hecho con
            <span class="font-semibold" :style="{ color: priceColor }">
              MapaMorfi
            </span>
          </span>
        </div>
      </footer>
      
      <!-- Modal de horarios -->
      <div
        v-if="showHoursModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="showHoursModal = false"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="rounded-2xl border p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
          :style="{
            borderColor: `${textColor}30`,
            backgroundColor: backgroundColor,
            color: textColor,
          }"
          @click.stop
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Horarios de atención</h3>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getContrastTextColor } from '~/composables/useColorUtils'
import { getFontById } from '~/composables/useFonts'
import { normalizeBusinessSections, filterSectionsWithItems } from '~/composables/useMenuNormalizer'

const props = defineProps({
  business: {
    type: Object,
    required: true,
  },
  backgroundColor: {
    type: String,
    default: '#ffffff',
  },
  textColor: {
    type: String,
    default: '#1f2937',
  },
  priceColor: {
    type: String,
    default: '#059669',
  },
  fontFamily: {
    type: String,
    default: 'Inter, system-ui, sans-serif',
  },
  shouldShowPrices: {
    type: Boolean,
    default: true,
  },
  activeDeliveryPlatforms: {
    type: Array,
    default: () => [],
  },
  isOpenNow: {
    type: Boolean,
    default: true,
  },
  isAuthenticated: {
    type: Boolean,
    default: false,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  isLoadingFavorite: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle-favorite', 'share-whatsapp', 'share-facebook', 'copy-link', 'export-pdf'])

const selectedCategory = ref(null)
const showShareMenu = ref(false)
const showHoursModal = ref(false)

// Obtener secciones del menú usando el normalizador
const sections = computed(() => {
  if (!props.business) return []
  
  // Normalizar y filtrar secciones con items válidos
  const normalizedSections = normalizeBusinessSections(props.business)
  return filterSectionsWithItems(normalizedSections)
})

// Sección seleccionada
const selectedSection = computed(() => {
  return sections.value.find(s => s.id === selectedCategory.value)
})

// Ítems de la sección seleccionada
const selectedSectionItems = computed(() => {
  if (!selectedSection.value) return []
  return selectedSection.value.items || []
})

// Obtener imagen de categoría (primera imagen de ítem)
const getCategoryImage = (section) => {
  if (!section.items || section.items.length === 0) return null
  const itemWithImage = section.items.find(item => item.imageUrl)
  return itemWithImage?.imageUrl || null
}

// isOpenNow viene como prop, no necesita computed

// Verificar tipo de fuente
const fontId = computed(() => props.business?.fontFamily || 'inter')
const isScriptFont = computed(() => fontId.value === 'dancing' || fontId.value === 'pacifico')
const isPacifico = computed(() => fontId.value === 'pacifico')
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

