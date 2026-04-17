<template>
  <div
    :class="[
      'flex flex-col items-center justify-center gap-4 text-center',
      fullScreen ? 'min-h-[50vh] sm:min-h-[60vh]' : 'py-12',
    ]"
    role="status"
    aria-live="polite"
  >
    <div class="relative inline-flex h-12 w-12 items-center justify-center" aria-hidden="true">
      <div
        class="absolute inset-0 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin"
      />
      <!-- Icono vectorial (evita PNG con “QR” ilegible del icon-192) -->
      <svg
        class="relative h-6 w-6 text-emerald-600 dark:text-emerald-400"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.709 16.709 0 006.682-6.134l.015-.028.037-.053a.75.75 0 00-.23-.81l-7.071-6.188a.75.75 0 00-.93 0L4.66 15.22a.75.75 0 00-.23.81l.037.053.015.028a16.709 16.709 0 006.68 6.134zM12 12a2 2 0 100-4 2 2 0 000 4z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <div class="space-y-1 px-4">
      <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
        {{ title }}
      </p>
      <p v-if="subtitle" class="text-xs text-slate-500 dark:text-slate-400">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Cargando…',
  },
  subtitle: {
    type: String,
    default: '',
  },
  fullScreen: {
    type: Boolean,
    default: true,
  },
})
</script>
