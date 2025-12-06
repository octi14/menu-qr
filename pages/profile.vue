<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
    <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Mi perfil</h1>
        <p class="text-slate-600 dark:text-slate-400">
          Administrá tu información personal y configuración de cuenta
        </p>
      </div>

      <!-- Mensajes -->
      <div v-if="error" class="mb-6 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4">
        <div class="flex items-start gap-3">
          <svg class="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-red-600 dark:text-red-400 flex-1">{{ error }}</p>
        </div>
      </div>
      <div v-if="success" class="mb-6 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 p-4">
        <div class="flex items-start gap-3">
          <svg class="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-emerald-600 dark:text-emerald-400 flex-1">{{ success }}</p>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-12">
        <p class="text-slate-600 dark:text-slate-400">Cargando perfil...</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Información personal -->
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
          <h2 class="text-xl font-semibold mb-4">Información personal</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <input
                v-model="profile.email"
                type="email"
                disabled
                class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none cursor-not-allowed opacity-60"
              />
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                El email no se puede modificar
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nombre completo
              </label>
              <input
                v-model="profile.name"
                type="text"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                placeholder="Tu nombre"
              />
            </div>
            <button
              @click="updateProfile"
              :disabled="isSaving"
              class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="isSaving"
                class="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-else>Guardar cambios</span>
            </button>
          </div>
        </div>

        <!-- Cambiar contraseña -->
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
          <h2 class="text-xl font-semibold mb-4">Cambiar contraseña</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Contraseña actual
              </label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nueva contraseña
              </label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                minlength="6"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              />
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Mínimo 6 caracteres
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Confirmar nueva contraseña
              </label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              />
            </div>
            <button
              @click="updatePassword"
              :disabled="isChangingPassword"
              class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="isChangingPassword"
                class="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-else>Cambiar contraseña</span>
            </button>
          </div>
        </div>

        <!-- Direcciones guardadas -->
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Direcciones guardadas</h2>
            <NuxtLink
              to="/saved-addresses"
              class="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              Gestionar
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>
          
          <div v-if="isLoadingAddresses" class="text-center py-4">
            <p class="text-sm text-slate-600 dark:text-slate-400">Cargando direcciones...</p>
          </div>
          
          <div v-else-if="savedAddresses.length === 0" class="text-center py-6">
            <svg class="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">
              No tenés direcciones guardadas
            </p>
            <NuxtLink
              to="/saved-addresses"
              class="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              Agregar primera dirección
            </NuxtLink>
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="address in savedAddresses.slice(0, 3)"
              :key="address.id"
              class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
            >
              <svg class="h-5 w-5 text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                  {{ address.name }}
                </p>
                <p class="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {{ address.address }}
                </p>
              </div>
            </div>
            <div v-if="savedAddresses.length > 3" class="pt-2 border-t border-slate-200 dark:border-slate-700">
              <NuxtLink
                to="/saved-addresses"
                class="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                Ver todas ({{ savedAddresses.length }})
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Información de cuenta -->
        <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6">
          <h2 class="text-xl font-semibold mb-4">Información de cuenta</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <div>
                <p class="text-xs text-slate-600 dark:text-slate-400 mb-1">Plan actual</p>
                <p class="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                  {{ currentPlanName }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  ${{ currentPlanPrice }}/mes
                </p>
              </div>
              <NuxtLink
                to="/billing"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                Cambiar plan
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </NuxtLink>
            </div>
            <div class="space-y-3 text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
              <div class="flex justify-between">
                <span class="text-slate-600 dark:text-slate-400">Rol:</span>
                <span class="font-medium">{{ profile.role || 'user' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600 dark:text-slate-400">Cuenta creada:</span>
                <span class="font-medium">{{ formatDate(profile.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from '#app'
import { getPlanById } from '~/composables/usePlans'

definePageMeta({
  layout: 'dashboard',
})

const router = useRouter()

const profile = ref({
  email: '',
  name: '',
  plan: '',
  role: '',
  createdAt: null,
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const error = ref('')
const success = ref('')
const isLoading = ref(true)
const isSaving = ref(false)
const isChangingPassword = ref(false)
const savedAddresses = ref([])
const isLoadingAddresses = ref(false)

// Computed para el plan actual
const currentPlan = computed(() => {
  const planId = profile.value.plan || 'free'
  return getPlanById(planId)
})

const currentPlanName = computed(() => {
  return currentPlan.value?.name || 'Gratis'
})

const currentPlanPrice = computed(() => {
  return currentPlan.value?.price || 0
})

const loadProfile = async () => {
  isLoading.value = true
  error.value = ''

  try {
    // Obtener userId del localStorage
    let userId = null
    if (process.client) {
      const auth = localStorage.getItem('qrmenu-auth')
      if (auth) {
        try {
          const parsed = JSON.parse(auth)
          userId = parsed.userId
        } catch {
          // Error parsing
        }
      }
    }

    if (!userId) {
      router.push('/login')
      return
    }

    const response = await $fetch(`/api/users/profile?userId=${userId}`)
    if (response && response.user) {
      profile.value = response.user
    }
  } catch (err) {
    console.error('Error loading profile:', err)
    error.value = 'Error al cargar el perfil'
  } finally {
    isLoading.value = false
  }
}

const updateProfile = async () => {
  error.value = ''
  success.value = ''
  isSaving.value = true

  try {
    let userId = null
    if (process.client) {
      const auth = localStorage.getItem('qrmenu-auth')
      if (auth) {
        try {
          const parsed = JSON.parse(auth)
          userId = parsed.userId
        } catch {
          // Error parsing
        }
      }
    }

    if (!userId) {
      error.value = 'No se pudo identificar tu usuario'
      return
    }

    await $fetch('/api/users/profile', {
      method: 'PUT',
      body: {
        userId,
        name: profile.value.name,
      },
    })

    success.value = 'Perfil actualizado exitosamente'
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    console.error('Error updating profile:', err)
    error.value = err.data?.message || 'Error al actualizar el perfil'
  } finally {
    isSaving.value = false
  }
}

const updatePassword = async () => {
  error.value = ''
  success.value = ''

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  isChangingPassword.value = true

  try {
    let userId = null
    if (process.client) {
      const auth = localStorage.getItem('qrmenu-auth')
      if (auth) {
        try {
          const parsed = JSON.parse(auth)
          userId = parsed.userId
        } catch {
          // Error parsing
        }
      }
    }

    if (!userId) {
      error.value = 'No se pudo identificar tu usuario'
      return
    }

    await $fetch('/api/users/change-password', {
      method: 'POST',
      body: {
        userId,
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
      },
    })

    success.value = 'Contraseña actualizada exitosamente'
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    console.error('Error changing password:', err)
    error.value = err.data?.message || 'Error al cambiar la contraseña'
  } finally {
    isChangingPassword.value = false
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  try {
    const d = new Date(date)
    return d.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return 'N/A'
  }
}

const loadSavedAddresses = async () => {
  isLoadingAddresses.value = true
  try {
    // Obtener token del localStorage
    let token = null
    if (process.client) {
      const auth = localStorage.getItem('qrmenu-auth')
      if (auth) {
        try {
          const parsed = JSON.parse(auth)
          token = parsed.token
        } catch {
          // Error parsing
        }
      }
    }

    if (!token) {
      return
    }

    const response = await $fetch('/api/saved-addresses', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    savedAddresses.value = response || []
  } catch (err) {
    console.error('Error loading saved addresses:', err)
    // No mostrar error si no está autenticado, simplemente no cargar direcciones
  } finally {
    isLoadingAddresses.value = false
  }
}

onMounted(() => {
  loadProfile()
  loadSavedAddresses()
})

useHead({
  title: 'Mi perfil · FoodLand',
})
</script>


