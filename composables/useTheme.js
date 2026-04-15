let __themeClientInitialized = false

export const useTheme = () => {
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

  const getInitialTheme = () => {
    if (process.server) {
      return "dark"
    }

    if (process.client) {
      const stored = getStoredTheme()
      if (stored) {
        return stored
      }
      try {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        return prefersDark ? "dark" : "light"
      } catch (e) {
        return "dark"
      }
    }

    return "dark"
  }

  const theme = useState("theme", getInitialTheme)

  const applyTheme = (themeValue) => {
    if (!process.client || !themeValue) return

    try {
      const root = document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(themeValue)
      root.setAttribute("data-theme", themeValue)
      localStorage.setItem("qrmenu-theme", themeValue)
    } catch (e) {
      console.warn("Error applying theme:", e)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme.value === "dark" ? "light" : "dark"
    theme.value = newTheme
  }

  // Una sola suscripción en el cliente: evita condiciones de carrera al navegar
  if (process.client && !__themeClientInitialized) {
    __themeClientInitialized = true

    const stored = getStoredTheme()
    if (stored && stored !== theme.value) {
      theme.value = stored
    }

    watch(
      theme,
      (newTheme) => {
        if (newTheme) applyTheme(newTheme)
      },
      { immediate: true }
    )

    if (!window.__themeStorageListenerAdded) {
      try {
        window.addEventListener("storage", (e) => {
          if (e.key === "qrmenu-theme" && e.newValue) {
            if (e.newValue === "dark" || e.newValue === "light") {
              if (theme.value !== e.newValue) {
                theme.value = e.newValue
              }
            }
          }
        })
        window.__themeStorageListenerAdded = true
      } catch (e) {
        // Ignorar
      }
    }
  }

  return {
    theme: readonly(theme),
    toggleTheme,
  }
}
