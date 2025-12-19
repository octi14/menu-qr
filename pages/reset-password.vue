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
        <h2 class="text-xl font-semibold">Restablecer contraseña</h2>
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Ingresá tu nueva contraseña
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="error" class="rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4">
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <div v-if="success" class="rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 p-4">
          <p class="text-sm text-emerald-600 dark:text-emerald-400">{{ success }}</p>
        </div>

        <div v-if="!success && !error">
          <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Nueva contraseña <span class="text-red-500">*</span>
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

        <div v-if="!success && !error">
          <label for="confirmPassword" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Confirmar nueva contraseña <span class="text-red-500">*</span>
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

        <button
          v-if="!success && !error"
          type="submit"
          :disabled="isLoading || !isFormValid"
          class="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Restableciendo...</span>
          <span v-else>Restablecer contraseña</span>
        </button>

        <div v-if="success" class="text-center">
          <NuxtLink
            to="/login"
            class="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
          >
            Ir al inicio de sesión
          </NuxtLink>
        </div>

        <div v-if="!success" class="text-center">
          <NuxtLink
            to="/login"
            class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Volver al inicio de sesión
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from '#app'
import { useTheme } from '~/composables/useTheme'
import ThemeToggle from '~/components/ThemeToggle.vue'

definePageMeta({
  layout: false,
})

const route = useRoute()
const router = useRouter()
const { theme } = useTheme()

const form = ref({
  password: '',
  confirmPassword: '',
})

const error = ref('')
const success = ref('')
const isLoading = ref(false)
const token = ref('')

const isFormValid = computed(() => {
  return (
    form.value.password.length >= 6 &&
    form.value.password === form.value.confirmPassword
  )
})

onMounted(() => {
  token.value = route.query.token
  if (!token.value) {
    error.value = 'Token de recuperación no válido o expirado'
  }
})

const handleSubmit = async () => {
  error.value = ''
  success.value = ''

  if (!token.value) {
    error.value = 'Token de recuperación no válido'
    return
  }

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
    const response = await $fetch('/api/users/reset-password', {
      method: 'POST',
      body: {
        token: token.value,
        password: form.value.password,
      },
    })

    if (response && response.success) {
      success.value = 'Contraseña restablecida exitosamente. Redirigiendo al inicio de sesión...'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } catch (err) {
    console.error('Error resetting password:', err)
    error.value = err.data?.message || err.message || 'Error al restablecer la contraseña. El token puede haber expirado.'
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Restablecer contraseña · MapaMorfi',
})
</script>


