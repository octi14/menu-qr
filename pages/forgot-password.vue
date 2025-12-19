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
        <h2 class="text-xl font-semibold">Recuperar contraseña</h2>
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Ingresá tu email y te enviaremos un link para restablecer tu contraseña
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="error" class="rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4">
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <div v-if="success" class="rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 p-4">
          <p class="text-sm text-emerald-600 dark:text-emerald-400">{{ success }}</p>
        </div>

        <div v-if="!success">
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

        <button
          v-if="!success"
          type="submit"
          :disabled="isLoading"
          class="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Enviando...</span>
          <span v-else>Enviar link de recuperación</span>
        </button>

        <div class="text-center">
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
import { ref } from 'vue'
import { useTheme } from '~/composables/useTheme'
import ThemeToggle from '~/components/ThemeToggle.vue'

definePageMeta({
  layout: false,
})

const { theme } = useTheme()

const email = ref('')
const error = ref('')
const success = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  isLoading.value = true

  try {
    const response = await $fetch('/api/users/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })

    if (response && response.success) {
      success.value = 'Si el email existe en nuestro sistema, recibirás un link para restablecer tu contraseña.'
    }
  } catch (err) {
    console.error('Error sending reset password:', err)
    // Por seguridad, siempre mostramos el mismo mensaje
    success.value = 'Si el email existe en nuestro sistema, recibirás un link para restablecer tu contraseña.'
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Recuperar contraseña · MapaMorfi',
})
</script>


