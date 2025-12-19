<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors flex items-center justify-center px-4">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center space-y-2">
        <div class="flex items-center justify-center gap-2 mb-4">
          <h1 class="text-2xl font-semibold">MapaMorfi</h1>
          <div class="relative z-10">
            <ThemeToggle />
          </div>
        </div>
        <h2 class="text-xl font-semibold">Iniciar sesión</h2>
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Ingresá tus credenciales para acceder al panel
        </p>
        <div v-if="$route.query.registered === 'true'" class="mt-4 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 p-3">
          <p class="text-sm text-emerald-600 dark:text-emerald-400">
            ¡Cuenta creada exitosamente! Iniciá sesión para continuar.
          </p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="error" class="rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4">
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Contraseña
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 pr-12 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
              aria-label="Mostrar/ocultar contraseña"
            >
              <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
        </button>
      </form>

      <div class="text-center space-y-2">
        <NuxtLink
          to="/forgot-password"
          class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </NuxtLink>
        <p class="text-sm text-slate-600 dark:text-slate-400">
          ¿No tenés una cuenta?
          <NuxtLink to="/register" class="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
            Registrate
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const handleSubmit = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const response = await $fetch('/api/users/verify', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })

    if (response && response.user && response.token) {
      if (process.client) {
        localStorage.setItem(
          'qrmenu-auth',
          JSON.stringify({
            userId: response.user.id,
            email: response.user.email,
            loggedIn: true,
            role: response.user.role,
            token: response.token, // Guardar token JWT
          })
        )
      }
      router.push('/select-business')
    }
  } catch (err) {
    console.error('Error en login:', err)
    // Mostrar el mensaje de error del servidor o un mensaje genérico
    error.value = err.data?.message || err.message || 'Email o contraseña incorrectos'
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Iniciar sesión · MapaMorfi',
})
</script>

