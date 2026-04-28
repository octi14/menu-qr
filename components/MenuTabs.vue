<template>
  <div class="min-h-screen transition-all duration-300 ease-in-out" :style="rootStyle">
    <div class="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-5 py-8 sm:px-6">
      <!-- Barra superior con acciones -->
      <div class="flex w-full items-center gap-2 mb-4">
        <div
          v-if="isPreview"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
          :style="{
            borderColor: `${textColor}30`,
            backgroundColor: `${textColor}10`,
            color: textColor,
          }"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Vista previa
        </div>
        <MenuBackToDiscoverLink v-else :color="textColor" />
        <div class="flex min-w-0 flex-1 items-center justify-end gap-3">
        <!-- Botón de favoritos -->
        <button
          v-if="isAuthenticated && !isPreview"
          type="button"
          @click="$emit('toggle-favorite')"
          :disabled="isLoadingFavorite"
          class="p-2 rounded-full transition-all hover:scale-110 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2"
          :style="{
            backgroundColor: isFavorite ? `${priceColor}20` : `${textColor}15`,
            color: isFavorite ? priceColor : textColor,
          }"
          :title="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
          :aria-pressed="isFavorite"
          :aria-label="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
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
        
        <MenuDeliveryAppsBar
          :platforms="activeDeliveryPlatforms"
          :text-color="textColor"
          :is-preview="isPreview"
        />
        
        <div v-if="!isPreview" class="relative">
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
      </div>
      
      <!-- Header -->
      <header class="space-y-4 pb-6 border-b" :style="{ borderColor: `${textColor}20` }" role="banner">
        <!-- Imagen de header con overlay -->
        <div v-if="business.headerImageUrl" class="-mx-5 sm:-mx-6 rounded-2xl overflow-hidden shadow-lg relative">
          <img
            :src="business.headerImageUrl"
            :alt="`Imagen de ${business.name}`"
            loading="eager"
            class="w-full h-48 sm:h-64 object-cover"
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
        <div v-if="(!business.headerImageUrl || !business.headerImageOverlay) && !business.hideName" class="text-center space-y-2">
          <h1 
            class="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none"
            :class="isPacifico ? 'font-medium tracking-wide' : isScriptFont ? 'font-semibold tracking-wide' : 'font-bold'"
          >
            {{ business.name }}
          </h1>
          <p v-if="business.description" class="text-sm sm:text-base opacity-80 leading-relaxed italic max-w-xl mx-auto">
            {{ business.description }}
          </p>
        </div>
        
        <MenuSocialLinksBar :business="business" :text-color="textColor" />
      </header>

      <div v-if="editable && isPreview" class="flex items-center justify-between gap-3">
        <p class="text-sm font-medium opacity-90">Secciones e ítems</p>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
          :style="{ borderColor: priceColor, color: priceColor, backgroundColor: `${priceColor}10` }"
          @click="addSection"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva sección
        </button>
      </div>

      <!-- Tabs de categorías -->
      <div class="sticky top-0 z-40 bg-inherit pb-2 border-b" :style="{ borderColor: `${textColor}20`, backgroundColor }">
        <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button
            v-for="section in sections"
            :key="section.id"
            @click="activeTab = section.id"
            class="group px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
            :style="
              activeTab === section.id
                ? { backgroundColor: priceColor, color: getContrastTextColor(priceColor) }
                : { backgroundColor: `${textColor}15`, color: textColor }
            "
          >
            <span class="inline-flex items-center gap-1">
              <span v-if="!isEditing('section', section.id, 'name')">{{ section.name }}</span>
              <input
                v-else
                v-model="section.name"
                class="w-24 rounded border border-slate-300 bg-white/90 px-1.5 py-0.5 text-xs text-slate-900"
                @click.stop
                @blur="stopEditing"
                @keydown.enter.prevent="stopEditing"
              />
              <span
                v-if="editable && !isEditing('section', section.id, 'name')"
                class="opacity-0 transition-opacity group-hover:opacity-60"
                title="Editar"
                @click.stop="startEditing('section', section.id, 'name')"
              >
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </span>
              <span
                v-if="editable && isPreview && activeTab === section.id && !isEditing('section', section.id, 'name')"
                class="inline-flex items-center justify-center opacity-85 transition-opacity hover:opacity-100"
                :style="deleteIconStyle"
                title="Eliminar sección"
                aria-label="Eliminar sección"
                role="button"
                @click.stop="openDeleteSectionConfirm(section)"
              >
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
                </svg>
              </span>
            </span>
          </button>
        </div>
        
        <!-- Búsqueda -->
        <div class="relative mt-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar en el menú..."
          class="w-full rounded-lg border px-4 py-2 text-sm outline-none transition-colors"
          :style="{
            borderColor: `${textColor}30`,
            backgroundColor: `${textColor}08`,
            color: textColor,
          }"
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
      </div>

      <!-- Lista de ítems de la categoría activa -->
      <main class="flex-1 space-y-4" role="main">
        <div v-if="editable && isPreview && activeSection" class="flex items-center justify-end">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
            :style="{ borderColor: priceColor, color: priceColor, backgroundColor: `${priceColor}10` }"
            @click="addItemToActiveSection"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Agregar ítem
          </button>
        </div>
        <article
          v-for="item in activeSectionItems"
          :key="item.id"
          class="group/item relative flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-md"
          :style="{
            borderColor: `${textColor}20`,
            backgroundColor: `${textColor}05`,
          }"
        >
          <!-- Imagen del ítem -->
          <div class="flex-shrink-0">
            <img
              :src="getMenuItemImageSrc(item, activeSection?.name)"
              :alt="item.name"
              loading="lazy"
              class="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover bg-slate-100"
            />
          </div>
          
          <!-- Contenido del ítem -->
          <div class="flex-1 space-y-2 min-w-0">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <h3 
                  class="text-lg sm:text-xl leading-tight"
                  :class="isPacifico ? 'font-medium' : isScriptFont ? 'font-semibold' : 'font-bold'"
                >
                  <span v-if="!isEditing('item', item.id, 'name')" class="group inline-flex items-center gap-1">
                    {{ item.name }}
                    <button
                      v-if="editable"
                      type="button"
                      class="opacity-0 transition-opacity group-hover:opacity-60"
                      title="Editar"
                      @click.stop="startEditing('item', item.id, 'name')"
                    >
                      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </span>
                  <input
                    v-else
                    v-model="item.name"
                    class="w-full rounded border border-slate-300 bg-white/90 px-2 py-1 text-sm text-slate-900"
                    @blur="stopEditing"
                    @keydown.enter.prevent="stopEditing"
                  />
                </h3>
                <p v-if="item.description && !isEditing('item', item.id, 'description')" class="group text-sm opacity-80 mt-1 line-clamp-2">
                  <span class="inline-flex items-center gap-1">
                    {{ item.description }}
                    <button
                      v-if="editable"
                      type="button"
                      class="opacity-0 transition-opacity group-hover:opacity-60"
                      title="Editar"
                      @click.stop="startEditing('item', item.id, 'description')"
                    >
                      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </span>
                </p>
                <textarea
                  v-else-if="isEditing('item', item.id, 'description')"
                  v-model="item.description"
                  rows="2"
                  class="mt-1 w-full resize-none rounded border border-slate-300 bg-white/90 px-2 py-1 text-xs text-slate-900"
                  @blur="stopEditing"
                />
              </div>
              <div class="flex flex-col items-end gap-2 flex-shrink-0">
                <span
                  v-if="item.price != null && shouldShowPrices && !isEditing('item', item.id, 'price')"
                  class="group inline-flex items-center gap-1 text-xl sm:text-2xl font-bold tabular-nums whitespace-nowrap"
                  :style="{ color: priceColor }"
                >
                  ${{ item.price.toLocaleString('es-AR') }}
                  <button
                    v-if="editable"
                    type="button"
                    class="opacity-0 transition-opacity group-hover:opacity-60"
                    title="Editar precio"
                    @click.stop="startEditing('item', item.id, 'price')"
                  >
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </span>
                <input
                  v-else-if="shouldShowPrices && isEditing('item', item.id, 'price')"
                  v-model.number="item.price"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-24 rounded border border-slate-300 bg-white/90 px-2 py-1 text-sm text-slate-900"
                  @blur="stopEditing"
                  @keydown.enter.prevent="stopEditing"
                />
                <button
                  v-if="editable && isPreview"
                  type="button"
                  class="absolute right-2 top-2 p-0.5 opacity-0 transition-opacity group-hover/item:opacity-100"
                  :style="deleteIconStyle"
                  title="Eliminar ítem"
                  @click.stop="openDeleteItemConfirm(item)"
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
                  </svg>
                </button>
                <span
                  v-if="item.isAvailable === false"
                  class="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800"
                >
                  agotado
                </span>
              </div>
            </div>
            
            <!-- Tags -->
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
        
        <div v-if="activeSectionItems.length === 0" class="text-center py-12 text-sm opacity-60">
          No hay ítems en esta categoría
        </div>
      </main>

      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4"
        @click.self="closeDeleteConfirm"
      >
        <div class="w-full max-w-md rounded-xl border bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100">
            {{ deleteTargetType === 'section' ? '¿Eliminar sección?' : '¿Eliminar ítem?' }}
          </h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Se eliminará
            <span class="font-medium">"{{ deleteTargetName }}"</span>
            {{ deleteTargetType === 'section' ? ' y sus ítems.' : '.' }}
          </p>
          <div class="mt-4 flex items-center justify-end gap-2">
            <button type="button" class="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700" @click="closeDeleteConfirm">Cancelar</button>
            <button type="button" class="rounded-md border border-red-600 bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700" @click="confirmDelete">Sí, eliminar</button>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <footer class="mt-auto border-t pt-8" :style="{ borderColor: `${textColor}20` }" role="contentinfo">
        <div class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs opacity-60">
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
          <span aria-hidden="true">·</span>
          <NuxtLink
            to="/privacidad"
            class="underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded"
            :style="{ color: priceColor }"
          >
            Privacidad
          </NuxtLink>
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
import { ref, computed, watch, toRef } from 'vue'
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
  isPreview: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle-favorite', 'share-whatsapp', 'share-facebook', 'copy-link', 'export-pdf'])

const searchQuery = ref('')
const activeTab = ref(null)
const showShareMenu = ref(false)
const showHoursModal = ref(false)
const editingKey = ref(null)
const showDeleteConfirm = ref(false)
const deleteTargetType = ref('')
const deleteTargetId = ref('')
const deleteTargetName = ref('')
const deleteTargetSectionId = ref('')

const businessRef = toRef(props, 'business')
const { addSection, deleteSection, addItem, deleteItem } = useMenuSectionEditor(businessRef)

// Obtener secciones del menú usando el normalizador
const sections = computed(() => {
  if (!props.business) return []

  // En modo editable trabajamos sobre la referencia real del business
  if (props.editable && props.isPreview && Array.isArray(props.business.sections)) {
    return props.business.sections.filter((s) => Array.isArray(s?.items))
  }

  const normalizedSections = normalizeBusinessSections(props.business)
  return filterSectionsWithItems(normalizedSections)
})

// Establecer tab activa por defecto (primera sección) cuando sections cambia
watch(sections, (newSections) => {
  if (newSections.length > 0 && !activeTab.value) {
    activeTab.value = newSections[0].id
  }
}, { immediate: true })

// Sección activa
const activeSection = computed(() => {
  return sections.value.find(s => s.id === activeTab.value) || sections.value[0]
})

// Ítems de la sección activa filtrados por búsqueda
const activeSectionItems = computed(() => {
  if (!activeSection.value) return []
  
  let items = activeSection.value.items || []
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    items = items.filter(item => {
      const nameMatch = item.name?.toLowerCase().includes(query)
      const descMatch = item.description?.toLowerCase().includes(query)
      const tagMatch = item.tags?.some(tag => tag.toLowerCase().includes(query))
      return nameMatch || descMatch || tagMatch
    })
  }
  
  return items
})

// Verificar tipo de fuente
const fontId = computed(() => props.business?.fontFamily || 'inter')
const isScriptFont = computed(() => fontId.value === 'dancing' || fontId.value === 'pacifico')
const isPacifico = computed(() => fontId.value === 'pacifico')

// Estilo del contenedor principal
const rootStyle = computed(() => ({
  backgroundColor: props.backgroundColor,
  fontFamily: props.fontFamily,
  color: props.textColor,
  '--price-color': props.priceColor
}))
const deleteIconStyle = computed(() => {
  const contrastOnBg = getContrastTextColor(props.backgroundColor || '#ffffff')
  const iconColor = contrastOnBg === '#ffffff' ? '#fecaca' : '#b91c1c'
  const lightHalo = 'rgba(255,255,255,0.75)'
  const darkHalo = 'rgba(15,23,42,0.65)'
  return {
    color: iconColor,
    filter: `drop-shadow(0 0 1px ${lightHalo}) drop-shadow(0 1px 1px ${darkHalo})`,
  }
})

const isEditing = (type, id, field) => editingKey.value === `${type}:${id}:${field}`
const startEditing = (type, id, field) => { editingKey.value = `${type}:${id}:${field}` }
const stopEditing = () => { editingKey.value = null }
const addItemToActiveSection = () => {
  const sectionsList = Array.isArray(props.business?.sections) ? props.business.sections : []
  const sectionIndex = sectionsList.findIndex((s) => s?.id === activeSection.value?.id)
  if (sectionIndex >= 0) addItem(sectionIndex)
}

const openDeleteSectionConfirm = (section) => {
  if (showDeleteConfirm.value) return
  deleteTargetType.value = 'section'
  deleteTargetId.value = section?.id || ''
  deleteTargetName.value = section?.name || 'Sección'
  showDeleteConfirm.value = true
}

const openDeleteItemConfirm = (item) => {
  if (showDeleteConfirm.value) return
  deleteTargetType.value = 'item'
  deleteTargetId.value = item?.id || ''
  deleteTargetSectionId.value = activeSection.value?.id || ''
  deleteTargetName.value = item?.name || 'Ítem'
  showDeleteConfirm.value = true
}

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  deleteTargetType.value = ''
  deleteTargetId.value = ''
  deleteTargetSectionId.value = ''
  deleteTargetName.value = ''
}

const confirmDelete = () => {
  const sectionsList = Array.isArray(props.business?.sections) ? props.business.sections : []
  if (deleteTargetType.value === 'section') {
    const sectionIndex = sectionsList.findIndex((s) => s?.id === deleteTargetId.value)
    if (sectionIndex >= 0) deleteSection(sectionIndex)
    if (activeTab.value === deleteTargetId.value) {
      const fallback = sectionsList.find((s) => s?.id !== deleteTargetId.value)
      activeTab.value = fallback?.id || null
    }
  } else if (deleteTargetType.value === 'item') {
    const sectionIndex = sectionsList.findIndex((s) => s?.id === deleteTargetSectionId.value)
    if (sectionIndex >= 0) {
      const items = Array.isArray(sectionsList[sectionIndex]?.items) ? sectionsList[sectionIndex].items : []
      const itemIndex = items.findIndex((it) => it?.id === deleteTargetId.value)
      if (itemIndex >= 0) deleteItem(sectionIndex, itemIndex)
    }
  }
  closeDeleteConfirm()
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

