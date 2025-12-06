export const useTheme = () => {
  // Función para obtener el tema desde localStorage (con validación)
  const getStoredTheme = () => {
    if (!process.client) return null
    try {
      const saved = localStorage.getItem("qrmenu-theme")
      if (saved === "dark" || saved === "light") {
        return saved
      }
    } catch (e) {
      console.warn("Error reading theme from localStorage:", e)
    }
    return null
  }

  // Función para obtener tema inicial
  const getInitialTheme = () => {
    if (process.server) {
      return "dark" // Valor por defecto para SSR
    }
    
    if (process.client) {
      // SIEMPRE priorizar localStorage si existe (evita cambios automáticos)
      const stored = getStoredTheme()
      if (stored) {
        return stored
      }
      
      // Solo usar preferencias del sistema si NO hay preferencia guardada
      try {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        return prefersDark ? "dark" : "light"
      } catch (e) {
        return "dark"
      }
    }
    
    return "dark"
  }

  // Crear estado compartido (persiste entre navegaciones)
  const theme = useState("theme", getInitialTheme)

  // Función centralizada para aplicar el tema
  const applyTheme = (themeValue) => {
    if (!process.client || !themeValue) return
    
    try {
      const root = document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(themeValue)
      root.setAttribute("data-theme", themeValue)
      
      // Guardar en localStorage para persistencia
      localStorage.setItem("qrmenu-theme", themeValue)
    } catch (e) {
      console.warn("Error applying theme:", e)
    }
  }

  // Sincronizar estado con localStorage al inicializar (solo en cliente, una sola vez)
  if (process.client) {
    // Sincronizar estado desde localStorage si existe
    const storedTheme = getStoredTheme()
    if (storedTheme && storedTheme !== theme.value) {
      theme.value = storedTheme
    }
    
    // Escuchar cambios en localStorage desde otras pestañas (solo una vez)
    if (!window.__themeStorageListenerAdded) {
      try {
        window.addEventListener('storage', (e) => {
          if (e.key === 'qrmenu-theme' && e.newValue) {
            if (e.newValue === 'dark' || e.newValue === 'light') {
              if (theme.value !== e.newValue) {
                theme.value = e.newValue
              }
            }
          }
        })
        window.__themeStorageListenerAdded = true
      } catch (e) {
        // Ignorar errores de storage event
      }
    }
  }

  const toggleTheme = () => {
    const newTheme = theme.value === "dark" ? "light" : "dark"
    theme.value = newTheme
    // applyTheme ya se llamará automáticamente desde el watch
  }

  // Watch para aplicar tema cuando cambia (solo una vez al cambiar)
  watch(theme, (newTheme) => {
    if (process.client && newTheme) {
      applyTheme(newTheme)
    }
  }, { immediate: false })
  
  // Aplicar tema inicial al montar (solo si no está ya aplicado)
  if (process.client) {
    // Usar nextTick para asegurar que el DOM esté listo
    nextTick(() => {
      const currentTheme = theme.value
      const root = document.documentElement
      if (!root.classList.contains(currentTheme)) {
        applyTheme(currentTheme)
      }
    })
  }

  return {
    theme: readonly(theme),
    toggleTheme,
  }
}

