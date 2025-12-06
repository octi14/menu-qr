<template>
  <div class="space-y-4">
    <div>
      <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
        Plantilla de diseño
      </h3>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Elegí una plantilla profesional para aplicar estilos a tu menú con un solo click
      </p>
    </div>

    <!-- Grid de templates -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        v-for="template in MENU_TEMPLATES"
        :key="template.id"
        type="button"
        @click="applyTemplate(template.id, $event)"
        :class="[
          'relative group rounded-xl border-2 p-4 text-left transition-all',
          selectedTemplateId === template.id
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-lg ring-2 ring-emerald-500/20'
            : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 bg-white dark:bg-slate-800 hover:shadow-md'
        ]"
        :aria-label="`Aplicar plantilla ${template.name}`"
      >
        <!-- Badge de seleccionado -->
        <div
          v-if="selectedTemplateId === template.id"
          class="absolute top-3 right-3 z-10"
        >
          <div class="rounded-full bg-emerald-500 text-white p-1.5 shadow-lg ring-2 ring-white dark:ring-slate-800">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <!-- Preview visual del template -->
        <div
          class="mb-4 rounded-lg overflow-hidden border-2 h-28 flex items-center justify-center transition-all group-hover:scale-[1.02] shadow-sm"
          :style="{
            backgroundColor: template.preview.backgroundColor,
            borderColor: selectedTemplateId === template.id 
              ? template.preview.primaryColor 
              : `${template.preview.primaryColor}40`,
          }"
        >
          <!-- Mini preview del menú -->
          <div class="w-full px-3 py-2.5 space-y-2">
            <!-- Header simulado -->
            <div
              class="h-2.5 rounded-full"
              :style="{
                backgroundColor: template.preview.primaryColor,
                opacity: 0.4,
              }"
            ></div>
            <!-- Items simulado -->
            <div class="space-y-1.5">
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
        <div>
          <div class="flex items-center gap-2 mb-1">
            <h4 class="font-semibold text-sm text-slate-900 dark:text-slate-50">
              {{ template.name }}
            </h4>
            <div
              v-if="selectedTemplateId === template.id"
              class="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500 text-white"
            >
              Seleccionado
            </div>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
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
    <div class="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
      <div class="flex items-start gap-3">
        <svg class="h-5 w-5 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Podés personalizar los colores y la tipografía después de aplicar una plantilla. La plantilla solo establece valores iniciales recomendados.
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

