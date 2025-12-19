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
        <h2 class="text-xl font-semibold">Crear cuenta</h2>
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Registrate para comenzar a crear tus menús digitales
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="error" class="rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4">
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Contraseña <span class="text-red-500">*</span>
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            minlength="6"
            class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            placeholder="Mínimo 6 caracteres"
          />
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            La contraseña debe tener al menos 6 caracteres
          </p>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Confirmar contraseña <span class="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            placeholder="Repetí tu contraseña"
          />
        </div>

        <div>
          <label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Nombre completo
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            placeholder="Tu nombre (opcional)"
          />
        </div>

        <div class="flex items-start gap-2">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="mt-1 rounded border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500"
          />
          <label for="terms" class="text-sm text-slate-600 dark:text-slate-400">
            Acepto los
            <NuxtLink to="/terms" class="text-emerald-600 dark:text-emerald-400 hover:underline">
              términos y condiciones
            </NuxtLink>
            y la
            <NuxtLink to="/privacy" class="text-emerald-600 dark:text-emerald-400 hover:underline">
              política de privacidad
            </NuxtLink>
          </label>
        </div>

        <button
          type="submit"
          :disabled="isLoading || !isFormValid"
          class="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Creando cuenta...</span>
          <span v-else>Crear cuenta</span>
        </button>
      </form>

      <div class="text-center">
        <p class="text-sm text-slate-600 dark:text-slate-400">
          ¿Ya tenés una cuenta?
          <NuxtLink to="/login" class="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
            Iniciar sesión
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from '#app'
import { useTheme } from '~/composables/useTheme'
import ThemeToggle from '~/components/ThemeToggle.vue'

definePageMeta({
  layout: false,
})

const router = useRouter()
const { theme } = useTheme()

const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  acceptTerms: false,
})

const error = ref('')
const isLoading = ref(false)

const isFormValid = computed(() => {
  return (
    form.value.email &&
    form.value.password.length >= 6 &&
    form.value.password === form.value.confirmPassword &&
    form.value.acceptTerms
  )
})

const handleSubmit = async () => {
  error.value = ''

  // Validación adicional
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (form.value.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch('/api/users/register', {
      method: 'POST',
      body: {
        email: form.value.email,
        password: form.value.password,
        name: form.value.name || undefined,
      },
    })

    if (response && response.success) {
      // Redirigir al login con mensaje de éxito
      router.push({
        path: '/login',
        query: { registered: 'true' },
      })
    }
  } catch (err) {
    console.error('Error registering user:', err)
    error.value = err.data?.message || err.message || 'Error al crear la cuenta. Por favor, intentá nuevamente.'
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Crear cuenta · MapaMorfi',
})
</script>


