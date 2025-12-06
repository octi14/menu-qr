<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-bold mb-4">Planes y Facturación</h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Elegí el plan que mejor se adapte al tamaño de tu negocio. Desde emprendimientos hasta grandes franquicias.
        </p>
      </div>

      <!-- Plan Actual (solo si está autenticado) -->
      <div v-if="isAuthenticated" class="mb-12">
        <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold mb-2">Plan Actual</h2>
              <p class="text-slate-600 dark:text-slate-400">
                <span class="font-semibold text-emerald-700 dark:text-emerald-300">{{ currentPlan.name }}</span>
                - ${{ formatPrice(getDisplayPrice(currentPlan)) }}/{{ (currentPlan.hasYearlyBilling && billingPeriod[currentPlan.id] === 'yearly') ? 'año' : 'mes' }}
                <span v-if="currentPlan.priceWithoutTaxes && currentPlan.priceWithoutTaxes !== currentPlan.priceWithTaxes" class="text-xs text-slate-500 dark:text-slate-400 ml-2">
                  (Sin impuestos: ${{ formatPrice(getDisplayPriceWithoutTaxes(currentPlan)) }})
                </span>
              </p>
              <p class="text-sm text-slate-500 dark:text-slate-500 mt-1">
                {{ currentPlan.maxBusinesses === -1 ? 'Comercios ilimitados' : `Hasta ${currentPlan.maxBusinesses} comercios` }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">Comercios usados</p>
              <p class="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {{ currentBusinessCount }} / {{ currentPlan.maxBusinesses === -1 ? '∞' : currentPlan.maxBusinesses }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Planes Disponibles -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div
          v-for="plan in PLANS"
          :key="plan.id"
          :class="[
            'relative rounded-2xl border-2 p-8 transition-all',
            plan.popular
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 shadow-lg scale-105'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40',
            plan.id === currentPlanId
              ? 'ring-2 ring-emerald-500 ring-offset-2'
              : ''
          ]"
        >
          <!-- Badge Popular -->
          <div
            v-if="plan.popular"
            class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-semibold"
          >
            Más Popular
          </div>

          <!-- Badge Actual -->
          <div
            v-if="isAuthenticated && plan.id === currentPlanId"
            class="absolute -top-4 right-4 bg-slate-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
          >
            Plan Actual
          </div>

          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
            <p v-if="plan.description" class="text-sm text-slate-500 dark:text-slate-500 mb-3 italic">
              {{ plan.description }}
            </p>
            
            <!-- Toggle Mensual/Anual para planes con billing anual -->
            <div v-if="plan.hasYearlyBilling" class="mb-4">
              <div class="flex items-center justify-center gap-2 mb-3">
                <button
                  @click="billingPeriod[plan.id] = 'monthly'"
                  :class="[
                    'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                    (billingPeriod[plan.id] || 'monthly') === 'monthly'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  ]"
                >
                  Mensual
                </button>
                <button
                  @click="billingPeriod[plan.id] = 'yearly'"
                  :class="[
                    'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                    billingPeriod[plan.id] === 'yearly'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  ]"
                >
                  Anual
                  <span class="ml-1 text-emerald-600 dark:text-emerald-400">-{{ plan.yearlyDiscount }}%</span>
                </button>
              </div>
            </div>
            
            <div class="mb-4">
              <span class="text-4xl font-bold">${{ formatPrice(getDisplayPrice(plan)) }}</span>
              <span class="text-slate-600 dark:text-slate-400">/{{ (plan.hasYearlyBilling && (billingPeriod[plan.id] || 'monthly') === 'yearly') ? 'año' : 'mes' }}</span>
            </div>
            <p v-if="plan.priceWithoutTaxes && plan.priceWithoutTaxes !== plan.priceWithTaxes" class="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Sin impuestos nacionales: ${{ formatPrice(getDisplayPriceWithoutTaxes(plan)) }}/{{ (plan.hasYearlyBilling && (billingPeriod[plan.id] || 'monthly') === 'yearly') ? 'año' : 'mes' }}
            </p>
            <p v-if="plan.hasYearlyBilling && (billingPeriod[plan.id] || 'monthly') === 'yearly'" class="text-xs text-emerald-600 dark:text-emerald-400 mb-2">
              Ahorrás ${{ formatPrice((getDisplayPriceWithTaxes(plan) * 12) - (plan.yearlyPrice || getDisplayPriceWithTaxes(plan) * 12)) }} al año
            </p>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {{ plan.maxBusinesses === -1 ? 'Comercios ilimitados' : `Hasta ${plan.maxBusinesses} comercios` }}
            </p>
          </div>

          <ul class="space-y-3 mb-8">
            <li
              v-for="feature in plan.features"
              :key="feature"
              class="flex items-start gap-2"
            >
              <svg
                class="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span class="text-sm text-slate-700 dark:text-slate-300">{{ feature }}</span>
            </li>
          </ul>

          <button
            v-if="!isAuthenticated || plan.id !== currentPlanId"
            @click="handleSelectPlan(plan.id)"
            :class="[
              'w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors',
              plan.popular
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 hover:bg-slate-300 dark:hover:bg-slate-700'
            ]"
          >
            {{ !isAuthenticated ? 'Comenzar con este plan' : (plan.id === currentPlanId ? 'Plan Actual' : 'Seleccionar Plan') }}
          </button>
          <div
            v-else-if="isAuthenticated && plan.id === currentPlanId"
            class="w-full rounded-lg px-4 py-3 text-sm font-medium text-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          >
            Plan Actual
          </div>
        </div>
      </div>

      <!-- Información Adicional -->
      <div class="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8">
        <h2 class="text-2xl font-bold mb-4">Preguntas Frecuentes</h2>
        <div class="space-y-6">
          <div>
            <h3 class="font-semibold mb-2">¿Puedo cambiar de plan en cualquier momento?</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm">
              Sí, podés cambiar de plan en cualquier momento. Si subís de plan, el cambio se aplica inmediatamente. 
              Si bajás de plan, el cambio se aplica al final del período de facturación actual.
            </p>
          </div>
          <div>
            <h3 class="font-semibold mb-2">¿Qué pasa si supero el límite de comercios?</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm">
              Si alcanzás el límite de comercios de tu plan, no podrás crear nuevos comercios hasta que actualices 
              tu plan o elimines algunos comercios existentes.
            </p>
          </div>
          <div>
            <h3 class="font-semibold mb-2">¿Hay algún cargo por cancelar?</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm">
              No, podés cancelar tu suscripción en cualquier momento sin cargos adicionales. 
              Seguirás teniendo acceso hasta el final del período de facturación actual.
            </p>
          </div>
        </div>
      </div>

      <!-- CTA para Grandes Cadenas -->
      <div class="mt-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-center text-white">
        <h2 class="text-3xl font-bold mb-4">¿Necesitás más de 50 comercios?</h2>
        <p class="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
          Consulte por planes personalizados para grandes cadenas y franquicias. 
          Ofrecemos soluciones escalables adaptadas a tus necesidades.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/contact"
            class="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-emerald-600 font-semibold hover:bg-emerald-50 transition-colors"
          >
            Contactar por planes Enterprise
          </NuxtLink>
          <a
            href="mailto:ventas@foodland.com?subject=Consulta%20Plan%20Enterprise%20Custom"
            class="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
          >
            Enviar email
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})

const router = useRouter()
const { PLANS, getPlanById, getDefaultPlan } = usePlans()
const { fetchAllBusinesses } = useBusinesses()

const isAuthenticated = ref(false)
const currentPlanId = ref('free')
const currentPlan = computed(() => getPlanById(currentPlanId.value) || getDefaultPlan())
const businesses = ref([])
const currentBusinessCount = computed(() => businesses.value.length)
const isLoading = ref(true)

// Billing period por plan (mensual o anual)
const billingPeriod = ref({})

// Obtener precio con impuestos a mostrar según el período de facturación
const getDisplayPrice = (plan) => {
  if (!plan) return 0
  // Usar priceWithTaxes si está disponible, sino usar price
  const basePrice = plan.priceWithTaxes || plan.price || 0
  if (plan.hasYearlyBilling && billingPeriod.value[plan.id] === 'yearly') {
    // Calcular precio anual con impuestos
    const monthlyWithTaxes = basePrice
    const yearlyWithTaxes = plan.yearlyPrice || (monthlyWithTaxes * 12 * 0.8) // 20% descuento
    return yearlyWithTaxes
  }
  return basePrice
}

// Obtener precio sin impuestos a mostrar según el período de facturación
const getDisplayPriceWithoutTaxes = (plan) => {
  if (!plan) return 0
  const basePrice = plan.priceWithoutTaxes || plan.price || 0
  if (plan.hasYearlyBilling && billingPeriod.value[plan.id] === 'yearly') {
    // Calcular precio anual sin impuestos
    const monthlyWithoutTaxes = basePrice
    const yearlyWithoutTaxes = (monthlyWithoutTaxes * 12 * 0.8) // 20% descuento
    return yearlyWithoutTaxes
  }
  return basePrice
}

// Obtener precio con impuestos (para cálculos)
const getDisplayPriceWithTaxes = (plan) => {
  if (!plan) return 0
  return plan.priceWithTaxes || plan.price || 0
}

// Formatear precio con separador de miles
const formatPrice = (price) => {
  if (price === 0) return '0'
  return new Intl.NumberFormat('es-AR').format(price)
}

const handleSelectPlan = (planId) => {
  if (!isAuthenticated.value) {
    // Si no está autenticado, redirigir al registro
    router.push({
      path: '/register',
      query: { plan: planId }
    })
    return
  }
  
  // Aquí se implementaría la lógica para cambiar de plan
  // Por ahora solo mostramos un mensaje
  alert(`Funcionalidad de cambio de plan próximamente. Plan seleccionado: ${getPlanById(planId).name}`)
  // En producción, esto haría una llamada a la API para actualizar el plan del usuario
}

const loadUserPlan = async () => {
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

    if (userId) {
      const response = await $fetch(`/api/users/profile?userId=${userId}`)
      if (response && response.user && response.user.plan) {
        currentPlanId.value = response.user.plan
      }
    }
  } catch (err) {
    console.error('Error loading user plan:', err)
    // Usar plan por defecto si hay error
    currentPlanId.value = 'free'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  // Verificar si está autenticado
  if (process.client) {
    const auth = localStorage.getItem('qrmenu-auth')
    if (auth) {
      try {
        const parsed = JSON.parse(auth)
        if (parsed.loggedIn === true) {
          isAuthenticated.value = true
        }
      } catch {
        // Error parsing
      }
    }
  }
  
  // Inicializar billing period como mensual para todos los planes
  PLANS.forEach(plan => {
    if (plan.hasYearlyBilling) {
      billingPeriod.value[plan.id] = 'monthly'
    }
  })
  
  // Solo cargar datos del usuario si está autenticado
  if (isAuthenticated.value) {
    businesses.value = await fetchAllBusinesses()
    await loadUserPlan()
  } else {
    isLoading.value = false
  }
})

useHead({
  title: 'Planes y Facturación · FoodLand',
})
</script>

