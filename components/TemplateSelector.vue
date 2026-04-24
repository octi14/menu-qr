<template>
  <div class="space-y-3">
    <div>
      <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
        Plantilla
      </h3>
      <p class="text-sm text-slate-900 dark:text-slate-50 font-medium">
        Estilo base del menú
      </p>
    </div>

    <!-- Grid de templates -->
    <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-1">
      <button
        v-for="template in MENU_TEMPLATES"
        :key="template.id"
        type="button"
        @click="applyTemplate(template.id, $event)"
        :class="[
          'relative group rounded-2xl border p-2.5 text-left transition-all duration-200 sm:p-3 lg:flex lg:items-center lg:gap-3',
          selectedTemplateId === template.id
            ? 'border-emerald-400 bg-emerald-50/80 dark:bg-emerald-900/20 shadow-sm ring-1 ring-emerald-400/50'
            : 'border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800'
        ]"
        :aria-label="`Aplicar plantilla ${template.name}`"
      >
        <!-- Badge de seleccionado -->
        <div
          v-if="selectedTemplateId === template.id"
          class="absolute top-2 right-2 z-10"
        >
          <div class="rounded-full bg-emerald-500 text-white p-1 shadow ring-2 ring-white dark:ring-slate-800">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <!-- Preview visual del template -->
        <div
          class="mb-2.5 rounded-xl overflow-hidden border h-20 flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.015] sm:h-24 lg:mb-0 lg:h-16 lg:w-16 lg:flex-shrink-0"
          :style="{
            backgroundColor: template.preview.backgroundColor,
            borderColor: selectedTemplateId === template.id 
              ? template.preview.primaryColor 
              : `${template.preview.primaryColor}40`,
          }"
        >
          <!-- Mini preview del menú -->
          <div class="w-full px-2 py-1.5 space-y-1">
            <!-- Header simulado -->
            <div
              class="h-2.5 rounded-full"
              :style="{
                backgroundColor: template.preview.primaryColor,
                opacity: 0.4,
              }"
            ></div>
            <!-- Items simulado -->
            <div class="space-y-1">
              <div
                class="h-2 rounded"
                :style="{
                  backgroundColor: template.preview.primaryColor,
                  opacity: 0.7,
                }"
              ></div>
              <div class="flex items-center justify-between gap-2">
                <div
                  class="h-1.5 rounded flex-1"
                  :style="{
                    backgroundColor: template.preview.secondaryColor,
                    opacity: 0.5,
                  }"
                ></div>
                <div
                  class="h-1.5 w-10 rounded"
                  :style="{
                    backgroundColor: template.preview.accentColor,
                    opacity: 0.9,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Información del template -->
        <div class="min-w-0 lg:flex-1">
          <div class="flex items-center gap-2 mb-1">
            <h4 class="font-medium text-sm text-slate-900 dark:text-slate-50 truncate">
              {{ template.name }}
            </h4>
            <div
              v-if="selectedTemplateId === template.id"
              class="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500 text-white"
            >
              Activa
            </div>
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed lg:line-clamp-1">
            {{ template.description }}
          </p>
        </div>

        <!-- Indicador de hover -->
        <div
          v-if="selectedTemplateId !== template.id"
          class="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-500/5"
        ></div>
      </button>
    </div>

    <!-- Nota informativa -->
    <div class="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 p-2.5">
      <div class="flex items-start gap-3">
        <svg class="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
          Luego podés ajustar colores y tipografía.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MENU_TEMPLATES } from '~/composables/useTemplates'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

// Template seleccionado actualmente
const selectedTemplateId = computed(() => {
  return props.modelValue?.appliedTemplate || null
})

// Aplicar template
function applyTemplate(templateId, event) {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  const template = MENU_TEMPLATES.find(t => t.id === templateId)
  if (!template) return

  const updatedBusiness = {
    ...props.modelValue,
    backgroundColor: template.colors.backgroundColor,
    fontFamily: template.preview.fontFamily,
    appliedTemplate: templateId,
  }

  // Si existen campos para otros colores, también los aplicamos
  if (template.colors.primaryColor) {
    updatedBusiness.primaryColor = template.colors.primaryColor
  }
  if (template.colors.secondaryColor) {
    updatedBusiness.secondaryColor = template.colors.secondaryColor
  }
  if (template.colors.accentColor) {
    updatedBusiness.accentColor = template.colors.accentColor
  }
  if (template.colors.themeColor) {
    updatedBusiness.themeColor = template.colors.themeColor
  }

  emit('update:modelValue', updatedBusiness)
}
</script>

