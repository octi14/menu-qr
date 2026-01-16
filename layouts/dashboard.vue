<template>
  <div class="min-h-screen bg-white dark:bg-slate-950">
    <Navbar />
    <!-- Padding bottom para mobile (evitar que el contenido quede oculto detrás del navbar) -->
    <div class="pb-16 md:pb-0">
      <slot />
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const route = useRoute()
const isAuthenticated = ref(false)
const isChecking = ref(true)

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/discover',
]

const isPublicRoute = (path) => {
  return publicRoutes.some(route => path.startsWith(route))
}

const checkAuth = () => {
  if (!process.client) return false
  
  const { getAuthData } = useAuth()
  const auth = getAuthData()
  return auth?.loggedIn === true && auth?.userId
}

onMounted(() => {
  if (process.client) {
    // Solo verificar autenticación si no es una ruta pública
    if (!isPublicRoute(route.path)) {
      const authenticated = checkAuth()
      if (authenticated) {
        isAuthenticated.value = true
      } else {
        router.push('/login')
        return
      }
    }
    isChecking.value = false
  }
})

watch(() => route.path, (newPath) => {
  if (process.client && !isChecking.value) {
    // Solo verificar autenticación si no es una ruta pública
    if (!isPublicRoute(newPath)) {
      const authenticated = checkAuth()
      if (!authenticated) {
        router.push('/login')
      } else {
        isAuthenticated.value = true
      }
    }
  }
})
</script>

