<template>
  <div>
    <Navbar />
    <slot />
  </div>
</template>

<script setup>
const { theme } = useTheme()

// Aplicar tema al HTML durante SSR (solo para SSR)
useHead({
  htmlAttrs: {
    class: computed(() => theme.value),
  },
})

// El tema ya se aplica automáticamente en useTheme, 
// pero nos aseguramos de que esté sincronizado al montar
onMounted(() => {
  if (process.client) {
    // Sincronizar con el estado del tema
    const currentTheme = theme.value
    const root = document.documentElement
    
    // Solo aplicar si no está ya aplicado
    if (!root.classList.contains(currentTheme)) {
      root.classList.remove('light', 'dark')
      root.classList.add(currentTheme)
      root.setAttribute('data-theme', currentTheme)
    }
  }
})
</script>

