<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors pb-20 md:pb-0">
    <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">Contacto y Soporte</h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          ¿Tenés alguna pregunta, sugerencia o necesitás ayuda? Estamos acá para ayudarte.
        </p>
      </div>

      <!-- Formulario de contacto -->
      <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nombre -->
          <div>
            <label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Nombre <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Tu nombre completo"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="tu@email.com"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            />
          </div>

          <!-- Tipo de consulta -->
          <div>
            <label for="type" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tipo de consulta <span class="text-red-500">*</span>
            </label>
            <select
              id="type"
              v-model="form.type"
              required
              class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            >
              <option value="">Seleccionar tipo...</option>
              <option value="support">Soporte técnico</option>
              <option value="feature_request">Solicitud de función</option>
              <option value="bug_report">Reporte de error</option>
              <option value="billing">Facturación y planes</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <!-- Asunto -->
          <div>
            <label for="subject" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Asunto <span class="text-red-500">*</span>
            </label>
            <input
              id="subject"
              v-model="form.subject"
              type="text"
              required
              placeholder="Resumen breve de tu consulta"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            />
          </div>

          <!-- Mensaje -->
          <div>
            <label for="message" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Mensaje <span class="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              v-model="form.message"
              required
              rows="6"
              placeholder="Describí tu consulta o problema en detalle..."
              class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors resize-none"
            ></textarea>
          </div>

          <!-- Mensajes de éxito/error -->
          <div v-if="successMessage" class="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <p class="text-sm text-emerald-800 dark:text-emerald-300">{{ successMessage }}</p>
          </div>
          <div v-if="errorMessage" class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-800 dark:text-red-300">{{ errorMessage }}</p>
          </div>

          <!-- Botón de envío -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full rounded-lg bg-emerald-500 text-white px-6 py-3 font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="isSubmitting">Enviando...</span>
            <span v-else>Enviar consulta</span>
            <svg v-if="!isSubmitting" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>

      <!-- Información adicional -->
      <div class="mt-12 grid md:grid-cols-2 gap-6">
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg class="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Email</h3>
          </div>
          <p class="text-slate-600 dark:text-slate-400 text-sm">
            También podés contactarnos directamente por email:
          </p>
          <a href="mailto:soporte@mapamorfi.com" class="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
            soporte@mapamorfi.com
          </a>
        </div>

        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg class="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Tiempo de respuesta</h3>
          </div>
          <p class="text-slate-600 dark:text-slate-400 text-sm">
            Nos comprometemos a responder todas las consultas en un plazo máximo de 48 horas hábiles.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})

const form = ref({
  name: '',
  email: '',
  type: '',
  subject: '',
  message: '',
})

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const handleSubmit = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await $fetch('/api/tickets', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        type: form.value.type,
        subject: form.value.subject,
        message: form.value.message,
      },
    })

    if (response.success) {
      successMessage.value = '¡Tu consulta fue enviada correctamente! Te responderemos a la brevedad.'
      // Limpiar formulario
      form.value = {
        name: '',
        email: '',
        type: '',
        subject: '',
        message: '',
      }
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    }
  } catch (error) {
    console.error('Error sending contact form:', error)
    errorMessage.value = error.data?.message || error.message || 'Error al enviar la consulta. Por favor, intentá nuevamente.'
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Contacto y Soporte · MapaMorfi',
})
</script>



