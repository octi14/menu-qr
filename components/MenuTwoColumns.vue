<template>
  <div class="min-h-screen transition-all duration-300 ease-in-out" :style="{ backgroundColor, fontFamily, color: textColor, '--price-color': priceColor }">
    <div class="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:px-6">
      <div class="flex w-full items-center gap-2">
        <div
          v-if="isPreview"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
          :style="{ borderColor: `${textColor}30`, backgroundColor: `${textColor}10`, color: textColor }"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Vista previa
        </div>
        <MenuBackToDiscoverLink v-else :color="textColor" />
        <div class="flex min-w-0 flex-1 items-center justify-end gap-3">
          <button
            v-if="isAuthenticated && !isPreview"
            type="button"
            @click="$emit('toggle-favorite')"
            :disabled="isLoadingFavorite"
            class="rounded-full p-2 transition-all hover:scale-110 disabled:opacity-50"
            :style="{ backgroundColor: isFavorite ? `${priceColor}20` : `${textColor}15`, color: isFavorite ? priceColor : textColor }"
            :title="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
          >
            <svg v-if="isFavorite" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <button
            v-if="business.openingHours"
            @click="showHoursModal = true"
            class="rounded-lg border p-2 transition-all hover:scale-110"
            :style="{ borderColor: `${textColor}30`, backgroundColor: `${textColor}08`, color: textColor }"
            :title="isOpenNow ? 'Abierto ahora' : 'Cerrado ahora'"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <template v-if="activeDeliveryPlatforms && activeDeliveryPlatforms.length > 0 && !isPreview">
            <a
              v-for="platform in activeDeliveryPlatforms"
              :key="platform.id"
              :href="platform.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center rounded-lg p-1.5 transition-all hover:scale-110"
              :title="`Pedir por ${platform.name}`"
            >
              <img v-if="platform.logo" :src="platform.logo" :alt="platform.name" loading="lazy" class="h-5 w-5 object-contain" />
              <span v-else class="px-2 text-xs font-medium">{{ platform.name }}</span>
            </a>
          </template>

          <div v-if="!isPreview" class="relative">
            <button
              @click="showShareMenu = !showShareMenu"
              class="rounded-lg border p-2 transition-colors"
              :style="{ borderColor: `${textColor}30`, backgroundColor: `${textColor}08`, color: textColor }"
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

      <div class="space-y-2 text-center">
        <h1 v-if="!business.hideName" class="text-4xl font-bold tracking-tight">
          {{ business.name }}
        </h1>
        <p v-if="business.description" class="mx-auto max-w-3xl text-sm opacity-80">
          {{ business.description }}
        </p>
      </div>

      <div v-if="editable && isPreview" class="flex items-center justify-end">
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

      <section class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <article
          v-for="section in sections"
          :key="section.id"
          class="group rounded-2xl border p-4 shadow-sm transition-colors"
          :style="{ borderColor: `${textColor}22`, backgroundColor: `${textColor}06` }"
        >
          <div class="mb-3 flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <h2 class="text-xl font-bold leading-tight">
                <span v-if="!isEditing('section', section.id, 'name')" class="inline-flex items-center gap-1.5">
                  {{ section.name || 'Nueva sección' }}
                  <button
                    v-if="editable"
                    type="button"
                    class="opacity-0 transition-opacity group-hover:opacity-70"
                    title="Editar"
                    @click.stop="startEditing('section', section.id, 'name')"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </span>
                <input
                  v-else
                  v-model="section.name"
                  class="w-full rounded border border-slate-300 bg-white/90 px-2 py-1 text-sm text-slate-900"
                  @blur="stopEditing"
                  @keydown.enter.prevent="stopEditing"
                />
              </h2>
              <p v-if="section.description && !isEditing('section', section.id, 'description')" class="mt-1 text-sm opacity-80">
                <span class="inline-flex items-center gap-1.5">
                  {{ section.description }}
                  <button
                    v-if="editable"
                    type="button"
                    class="opacity-0 transition-opacity group-hover:opacity-70"
                    title="Editar"
                    @click.stop="startEditing('section', section.id, 'description')"
                  >
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </span>
              </p>
              <textarea
                v-else-if="isEditing('section', section.id, 'description')"
                v-model="section.description"
                rows="2"
                class="mt-1 w-full resize-none rounded border border-slate-300 bg-white/90 px-2 py-1 text-xs text-slate-900"
                @blur="stopEditing"
              />
            </div>
            <button
              v-if="editable && isPreview"
              type="button"
              class="p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
              :style="deleteIconStyle"
              title="Eliminar sección"
              aria-label="Eliminar sección"
              @click.stop="openDeleteSectionConfirm(section)"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div class="space-y-2">
            <article
              v-for="item in section.items || []"
              :key="item.id"
              class="group/item relative rounded-xl border p-3"
              :style="{ borderColor: `${textColor}18`, backgroundColor: `${backgroundColor}cc` }"
            >
              <button
                v-if="editable && isPreview"
                type="button"
                class="absolute right-2 top-2 p-0.5 opacity-0 transition-opacity group-hover/item:opacity-100"
                :style="deleteIconStyle"
                title="Eliminar ítem"
                aria-label="Eliminar ítem"
                @click.stop="openDeleteItemConfirm(item, section.id)"
              >
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
                </svg>
              </button>

              <div class="flex items-start justify-between gap-3 pr-6">
                <h3 class="font-semibold leading-tight">
                  <span v-if="!isEditing('item', item.id, 'name')" class="inline-flex items-center gap-1">
                    {{ item.name || 'Nuevo ítem' }}
                    <button
                      v-if="editable"
                      type="button"
                      class="opacity-0 transition-opacity group-hover/item:opacity-70"
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
                <div v-if="shouldShowPrices" class="text-sm font-bold" :style="{ color: priceColor }">
                  <span v-if="!isEditing('item', item.id, 'price')" class="inline-flex items-center gap-1">
                    ${{ Number(item.price || 0).toFixed(2) }}
                    <button
                      v-if="editable"
                      type="button"
                      class="opacity-0 transition-opacity group-hover/item:opacity-70"
                      title="Editar precio"
                      @click.stop="startEditing('item', item.id, 'price')"
                    >
                      <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </span>
                  <input
                    v-else
                    v-model.number="item.price"
                    type="number"
                    step="0.01"
                    min="0"
                    class="w-20 rounded border border-slate-300 bg-white/90 px-2 py-1 text-right text-sm text-slate-900"
                    @blur="stopEditing"
                    @keydown.enter.prevent="stopEditing"
                  />
                </div>
              </div>
              <p v-if="item.description && !isEditing('item', item.id, 'description')" class="mt-1 text-xs opacity-75">
                <span class="inline-flex items-center gap-1">
                  {{ item.description }}
                  <button
                    v-if="editable"
                    type="button"
                    class="opacity-0 transition-opacity group-hover/item:opacity-70"
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
            </article>

            <button
              v-if="editable && isPreview"
              type="button"
              class="mt-2 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
              :style="{ borderColor: priceColor, color: priceColor, backgroundColor: `${priceColor}10` }"
              @click="addItemToSection(section.id)"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Agregar ítem
            </button>
          </div>
        </article>
      </section>
    </div>

    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm" @click.self="closeDeleteConfirm">
      <div class="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        <h3 class="text-base font-semibold">Confirmar eliminación</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
          ¿Seguro que querés eliminar {{ deleteTargetType === 'section' ? 'la sección' : 'el ítem' }} <span class="font-medium">"{{ deleteTargetName }}"</span>?
        </p>
        <div class="mt-4 flex justify-end gap-2">
          <button type="button" class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700" @click="closeDeleteConfirm">
            Cancelar
          </button>
          <button type="button" class="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-sm text-red-700 hover:bg-red-500/20 dark:text-red-300" @click="confirmDelete">
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showHoursModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click.self="showHoursModal = false"
      role="dialog"
      aria-modal="true"
    >
      <div class="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl border p-6" :style="{ borderColor: `${textColor}30`, backgroundColor, color: textColor }">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold">Horarios de atención</h3>
          <button @click="showHoursModal = false" class="rounded-lg p-1 hover:bg-black/10" aria-label="Cerrar modal de horarios">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-2 text-sm">
          <div v-for="(hours, day) in business.openingHours" :key="day" class="flex justify-between border-b py-2" :style="{ borderColor: `${textColor}20` }">
            <span class="font-medium capitalize">{{ day }}:</span>
            <span v-if="hours.closed" class="opacity-60">Cerrado</span>
            <span v-else>{{ hours.open }} - {{ hours.close }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, toRef } from 'vue'
import { getContrastTextColor } from '~/composables/useColorUtils'
import { normalizeBusinessSections, filterSectionsWithItems } from '~/composables/useMenuNormalizer'

const props = defineProps({
  business: { type: Object, required: true },
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#1f2937' },
  priceColor: { type: String, default: '#059669' },
  fontFamily: { type: String, default: 'Inter, system-ui, sans-serif' },
  shouldShowPrices: { type: Boolean, default: true },
  activeDeliveryPlatforms: { type: Array, default: () => [] },
  isOpenNow: { type: Boolean, default: true },
  isAuthenticated: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  isLoadingFavorite: { type: Boolean, default: false },
  isPreview: { type: Boolean, default: false },
  editable: { type: Boolean, default: false },
})

defineEmits(['toggle-favorite', 'share-whatsapp', 'share-facebook', 'copy-link', 'export-pdf'])

const showShareMenu = ref(false)
const showHoursModal = ref(false)
const editingKey = ref(null)
const showDeleteConfirm = ref(false)
const deleteTargetType = ref('')
const deleteTargetId = ref('')
const deleteTargetSectionId = ref('')
const deleteTargetName = ref('')

const businessRef = toRef(props, 'business')
const { addSection, deleteSection, addItem, deleteItem } = useMenuSectionEditor(businessRef)

const sections = computed(() => {
  if (!props.business) return []
  if (props.editable && props.isPreview && Array.isArray(props.business.sections)) {
    return props.business.sections.filter((s) => Array.isArray(s?.items))
  }
  const normalizedSections = normalizeBusinessSections(props.business)
  return filterSectionsWithItems(normalizedSections)
})

const deleteIconStyle = computed(() => {
  const contrastOnBg = getContrastTextColor(props.backgroundColor || '#ffffff')
  const iconColor = contrastOnBg === '#ffffff' ? '#fecaca' : '#b91c1c'
  return {
    color: iconColor,
    filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.75)) drop-shadow(0 1px 1px rgba(15,23,42,0.65))',
  }
})

const isEditing = (type, id, field) => editingKey.value === `${type}:${id}:${field}`
const startEditing = (type, id, field) => { editingKey.value = `${type}:${id}:${field}` }
const stopEditing = () => { editingKey.value = null }

const addItemToSection = (sectionId) => {
  const sectionIndex = (props.business?.sections || []).findIndex((s) => s?.id === sectionId)
  if (sectionIndex >= 0) addItem(sectionIndex)
}

const openDeleteSectionConfirm = (section) => {
  if (showDeleteConfirm.value) return
  deleteTargetType.value = 'section'
  deleteTargetId.value = section?.id || ''
  deleteTargetName.value = section?.name || 'Sección'
  showDeleteConfirm.value = true
}

const openDeleteItemConfirm = (item, sectionId) => {
  if (showDeleteConfirm.value) return
  deleteTargetType.value = 'item'
  deleteTargetId.value = item?.id || ''
  deleteTargetSectionId.value = sectionId || ''
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
  } else {
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
