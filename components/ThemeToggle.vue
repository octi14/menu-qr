<template>
  <ClientOnly>
    <button
      type="button"
      class="relative z-50 inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-300/90 bg-white text-slate-800 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:shadow-none dark:hover:bg-slate-800 dark:focus-visible:ring-emerald-400/50 dark:focus-visible:ring-offset-slate-950"
      :aria-label="label"
      :title="label"
      @click.stop="toggleTheme"
    >
      <svg
        v-if="isDark"
        class="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <svg
        v-else
        class="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
    <template #fallback>
      <span
        class="relative z-50 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300/90 bg-white opacity-60 dark:border-slate-600 dark:bg-slate-900"
        aria-hidden="true"
      />
    </template>
  </ClientOnly>
</template>

<script setup>
const { theme, toggleTheme } = useTheme()

const isDark = computed(() => theme.value === 'dark')

const label = computed(() =>
  isDark.value ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro',
)
</script>
