<template>
  <NuxtLink
    to="/discover"
    class="inline-flex shrink-0 items-center justify-center rounded-lg p-1.5 transition-opacity motion-safe:active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
    :class="opacityClass"
    :style="color ? { color } : undefined"
    title="Volver al mapa"
    aria-label="Volver al mapa y listado de comercios"
  >
    <svg
      class="h-6 w-6"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </NuxtLink>
</template>

<script setup>
defineProps({
  /** Color del trazo (p. ej. color de texto del menú) */
  color: {
    type: String,
    default: '',
  },
})

const opacityClass = 'opacity-80 hover:opacity-100'
</script>
