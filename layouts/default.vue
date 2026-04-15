<template>
  <div>
    <Navbar />
    <slot />
  </div>
</template>

<script setup>
// El tema se aplica una sola vez en composables/useTheme.js (watch + script inline en nuxt.config).
// No enlazar class del <html> aquí: compite con applyTheme y con otros layouts al navegar.
</script>
