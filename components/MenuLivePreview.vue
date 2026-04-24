<template>
  <div
    v-if="business"
    :class="rootFrameClass"
  >
    <div :class="phoneShellClass">
      <div
        v-if="showPhoneChrome"
        class="pointer-events-none absolute left-1/2 top-1.5 z-30 h-5 w-36 -translate-x-1/2 rounded-full bg-slate-900/90 ring-1 ring-white/10 dark:bg-black/80"
      />
      <div
        v-if="showPhoneChrome"
        class="pointer-events-none absolute bottom-2 left-1/2 z-30 h-1.5 w-24 -translate-x-1/2 rounded-full bg-slate-900/40 dark:bg-white/20"
      />

      <div :class="viewportClass">
        <div
          v-if="isBusy"
          class="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-[1px] dark:bg-slate-950/50"
          role="status"
          aria-live="polite"
        >
          <div class="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow dark:border-slate-600 dark:bg-slate-900/90 dark:text-slate-200">
            <svg class="h-4 w-4 shrink-0 animate-spin text-emerald-600" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ busyLabel }}
          </div>
        </div>

        <div
          :class="[
            contentScrollClass,
            'overflow-y-auto overflow-x-hidden transition-opacity duration-200 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-400/35 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600/35 hover:[&::-webkit-scrollbar-thumb]:bg-slate-500/45 dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-500/45',
            { 'pointer-events-none opacity-90': isBusy },
          ]"
        >
          <MenuTabs
            v-if="showPreview && menuLayout === 'tabs'"
            :business="business"
            :backgroundColor="backgroundColor"
            :text-color="textColor"
            :price-color="priceColor"
            :font-family="fontFamily"
            :should-show-prices="shouldShowPrices"
            :active-delivery-platforms="activeDeliveryPlatforms"
            :is-open-now="isOpenNow"
            :is-authenticated="false"
            :is-favorite="false"
            :is-loading-favorite="false"
            :is-preview="true"
            :editable="editable"
            @toggle-favorite="noop"
            @share-whatsapp="noop"
            @share-facebook="noop"
            @copy-link="noop"
            @export-pdf="noop"
          />
          <MenuGrid
            v-else-if="showPreview && menuLayout === 'grid'"
            :business="business"
            :backgroundColor="backgroundColor"
            :text-color="textColor"
            :price-color="priceColor"
            :font-family="fontFamily"
            :should-show-prices="shouldShowPrices"
            :active-delivery-platforms="activeDeliveryPlatforms"
            :is-open-now="isOpenNow"
            :is-authenticated="false"
            :is-favorite="false"
            :is-loading-favorite="false"
            :is-preview="true"
            :editable="editable"
            @toggle-favorite="noop"
            @share-whatsapp="noop"
            @share-facebook="noop"
            @copy-link="noop"
            @export-pdf="noop"
          />
          <MenuCategories
            v-else-if="showPreview && menuLayout === 'categories'"
            :business="business"
            :backgroundColor="backgroundColor"
            :text-color="textColor"
            :price-color="priceColor"
            :font-family="fontFamily"
            :should-show-prices="shouldShowPrices"
            :active-delivery-platforms="activeDeliveryPlatforms"
            :is-open-now="isOpenNow"
            :is-authenticated="false"
            :is-favorite="false"
            :is-loading-favorite="false"
            :is-preview="true"
            :editable="editable"
            @toggle-favorite="noop"
            @share-whatsapp="noop"
            @share-facebook="noop"
            @copy-link="noop"
            @export-pdf="noop"
          />
          <MenuTwoColumns
            v-else-if="showPreview && menuLayout === 'two-columns'"
            :business="business"
            :backgroundColor="backgroundColor"
            :text-color="textColor"
            :price-color="priceColor"
            :font-family="fontFamily"
            :should-show-prices="shouldShowPrices"
            :active-delivery-platforms="activeDeliveryPlatforms"
            :is-open-now="isOpenNow"
            :is-authenticated="false"
            :is-favorite="false"
            :is-loading-favorite="false"
            :is-preview="true"
            :editable="editable"
            @toggle-favorite="noop"
            @share-whatsapp="noop"
            @share-facebook="noop"
            @copy-link="noop"
            @export-pdf="noop"
          />
          <MenuVerticalLayout
            v-else-if="showPreview"
            :business="business"
            :backgroundColor="backgroundColor"
            :text-color="textColor"
            :price-color="priceColor"
            :font-family="fontFamily"
            :heading-weight-class="headingWeightClass"
            :should-show-prices="shouldShowPrices"
            :active-delivery-platforms="activeDeliveryPlatforms"
            :is-open-now="isOpenNow"
            :has-social-media="hasSocialMedia"
            :is-authenticated="false"
            :is-favorite="false"
            :is-loading-favorite="false"
            :is-preview="true"
            :editable="editable"
            @toggle-favorite="noop"
            @share-whatsapp="noop"
            @share-facebook="noop"
            @copy-link="noop"
            @export-pdf="noop"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, toRef } from 'vue'

const props = defineProps({
  business: {
    type: Object,
    required: true,
  },
  isBusy: {
    type: Boolean,
    default: false,
  },
  busyLabel: {
    type: String,
    default: 'Guardando…',
  },
  /** 'phone' = marco estrecho; 'panel' = más ancho en el editor */
  variant: {
    type: String,
    default: 'phone',
    validator: (v) => v === 'phone' || v === 'panel',
  },
  /** Secciones e ítems editables dentro del marco (solo layout vertical) */
  editable: {
    type: Boolean,
    default: false,
  },
})

const businessRef = toRef(props, 'business')
const {
  backgroundColor,
  fontFamily,
  headingWeightClass,
  textColor,
  priceColor,
  menuLayout,
  isOpenNow,
  hasSocialMedia,
  activeDeliveryPlatforms,
  shouldShowPrices,
} = useMenuViewModel(businessRef, { isPreview: true })

const showPreview = computed(() => !!props.business)
const noop = () => {}
const showPhoneChrome = computed(() => props.variant === 'panel')

const rootFrameClass = computed(() => {
  const base =
    'relative mx-auto w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100/80 shadow-xl ring-1 ring-slate-900/5 dark:border-slate-700/80 dark:bg-slate-900/40 dark:ring-white/5'
  if (props.variant === 'panel') {
    return [base, 'max-w-[min(96vw,42rem)] p-2.5 sm:p-3']
  }
  return [base, 'max-w-[390px]']
})

const phoneShellClass = computed(() => {
  if (props.variant === 'panel') {
    return 'relative rounded-[2.2rem] border border-slate-700/70 bg-slate-950 p-2 shadow-[0_20px_60px_rgba(2,6,23,0.45)]'
  }
  return 'relative'
})

const viewportClass = computed(() => {
  if (props.variant === 'panel') {
    return 'relative overflow-hidden rounded-[1.7rem] border border-slate-800/80 bg-black'
  }
  return 'relative'
})

const contentScrollClass = computed(() => {
  if (props.variant === 'panel') {
    return 'max-h-[min(88vh,56rem)] min-h-[min(72vh,42rem)] pt-7 pb-5'
  }
  return 'max-h-[min(85vh,56rem)]'
})
</script>
