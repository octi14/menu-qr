<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold mb-2">Panel de Atención al Cliente</h1>
        <p class="text-slate-600 dark:text-slate-400">
          Gestioná tickets y solicitudes de los usuarios
        </p>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="mb-6 space-y-4">
        <div class="flex flex-wrap gap-4">
          <select
            v-model="statusFilter"
            class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="in_progress">En progreso</option>
            <option value="resolved">Resueltos</option>
            <option value="closed">Cerrados</option>
          </select>
          <select
            v-model="typeFilter"
            class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
          >
            <option value="">Todos los tipos</option>
            <option value="delete_business">Eliminar comercio</option>
            <option value="support">Soporte</option>
            <option value="feature_request">Solicitud de función</option>
            <option value="bug_report">Reporte de error</option>
          </select>
        </div>
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por asunto, mensaje, email o nombre..."
            class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 pl-10 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
          />
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>

      <!-- Lista de tickets -->
      <div v-else-if="filteredTickets.length > 0" class="space-y-4">
        <div
          v-for="ticket in filteredTickets"
          :key="ticket.id"
          class="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs font-medium',
                    getStatusClass(ticket.status)
                  ]"
                >
                  {{ getStatusLabel(ticket.status) }}
                </span>
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs font-medium',
                    getPriorityClass(ticket.priority)
                  ]"
                >
                  {{ getPriorityLabel(ticket.priority) }}
                </span>
                <span class="px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {{ getTypeLabel(ticket.type) }}
                </span>
              </div>
              <h3 class="text-lg font-semibold mb-1">{{ ticket.subject }}</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">{{ ticket.message }}</p>
              <div class="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span>Usuario: {{ ticket.userEmail }}</span>
                <span v-if="ticket.businessSlug">
                  Comercio: 
                  <NuxtLink :to="`/${ticket.businessSlug}/menu`" class="text-emerald-600 dark:text-emerald-400 hover:underline">
                    {{ ticket.businessSlug }}
                  </NuxtLink>
                </span>
                <span>Creado: {{ formatDate(ticket.createdAt) }}</span>
              </div>
              <div v-if="ticket.response" class="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <p class="text-sm font-medium text-emerald-900 dark:text-emerald-200 mb-1">Respuesta:</p>
                <p class="text-sm text-emerald-800 dark:text-emerald-300 whitespace-pre-wrap">{{ ticket.response }}</p>
                <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                  Respondido por {{ ticket.respondedBy }} el {{ formatDate(ticket.respondedAt) }}
                </p>
              </div>
              
              <!-- Campo para agregar/editar respuesta -->
              <div v-if="editingResponseId === ticket.id" class="mt-4 space-y-2">
                <label class="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Respuesta
                </label>
                <textarea
                  v-model="responseTexts[ticket.id]"
                  rows="4"
                  placeholder="Escribí tu respuesta aquí..."
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors resize-none"
                ></textarea>
                <div class="flex gap-2">
                  <button
                    @click="saveResponse(ticket.id)"
                    class="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors"
                  >
                    Guardar respuesta
                  </button>
                  <button
                    @click="cancelEditResponse"
                    class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
              <button
                v-else
                @click="startEditResponse(ticket.id, ticket.response)"
                class="mt-4 px-3 py-1.5 rounded-lg border border-emerald-500 text-emerald-600 dark:text-emerald-400 text-xs font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
              >
                {{ ticket.response ? 'Editar respuesta' : 'Agregar respuesta' }}
              </button>
            </div>
            <div class="flex flex-col gap-2">
              <select
                v-model="ticket.status"
                @change="updateTicketStatus(ticket.id, ticket.status)"
                class="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              >
                <option value="pending">Pendiente</option>
                <option value="in_progress">En progreso</option>
                <option value="resolved">Resuelto</option>
                <option value="closed">Cerrado</option>
              </select>
              <button
                v-if="ticket.type === 'delete_business' && ticket.status !== 'resolved'"
                @click="showDeleteConfirm(ticket)"
                class="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
              >
                Eliminar comercio
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sin tickets -->
      <div v-else class="text-center py-20">
        <div class="max-w-md mx-auto">
          <svg
            class="mx-auto h-16 w-16 text-slate-400 dark:text-slate-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-xl font-semibold mb-2">No hay tickets</h3>
          <p class="text-slate-600 dark:text-slate-400">
            {{ statusFilter || typeFilter || searchQuery ? 'No se encontraron tickets con los filtros seleccionados' : 'Aún no hay tickets registrados' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold mb-4">Confirmar eliminación</h3>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-6">
          ¿Estás seguro de que querés eliminar el comercio "{{ selectedTicket?.businessSlug }}"? Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-3">
          <button
            @click="confirmDeleteBusiness"
            class="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
})

const tickets = ref([])
const isLoading = ref(true)
const statusFilter = ref('')
const typeFilter = ref('')
const searchQuery = ref('')
const showDeleteModal = ref(false)
const selectedTicket = ref(null)
const editingResponseId = ref(null)
const responseTexts = ref({})

const loadTickets = async () => {
  isLoading.value = true
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
      throw new Error('No estás autenticado')
    }

    const query = new URLSearchParams()
    if (statusFilter.value) query.append('status', statusFilter.value)
    if (typeFilter.value) query.append('type', typeFilter.value)
    
    tickets.value = await $fetch(`/api/tickets?${query.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  } catch (error) {
    console.error('Error loading tickets:', error)
    tickets.value = []
    if (error.data?.message) {
      alert(error.data.message)
    }
  } finally {
    isLoading.value = false
  }
}

const filteredTickets = computed(() => {
  let filtered = tickets.value

  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(ticket => {
      return (
        ticket.subject?.toLowerCase().includes(query) ||
        ticket.message?.toLowerCase().includes(query) ||
        ticket.userEmail?.toLowerCase().includes(query) ||
        ticket.userName?.toLowerCase().includes(query) ||
        ticket.response?.toLowerCase().includes(query)
      )
    })
  }

  return filtered
})

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendiente',
    in_progress: 'En progreso',
    resolved: 'Resuelto',
    closed: 'Cerrado',
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
    in_progress: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    resolved: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300',
    closed: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  }
  return classes[status] || classes.pending
}

const getPriorityLabel = (priority) => {
  const labels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente',
  }
  return labels[priority] || priority
}

const getPriorityClass = (priority) => {
  const classes = {
    low: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    medium: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    urgent: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  }
  return classes[priority] || classes.medium
}

const getTypeLabel = (type) => {
  const labels = {
    delete_business: 'Eliminar comercio',
    support: 'Soporte',
    feature_request: 'Solicitud de función',
    bug_report: 'Reporte de error',
  }
  return labels[type] || type
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const updateTicketStatus = async (ticketId, newStatus) => {
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
      throw new Error('No estás autenticado')
    }

    await $fetch(`/api/tickets/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: { status: newStatus },
    })
    await loadTickets()
  } catch (error) {
    console.error('Error updating ticket:', error)
    alert(error.data?.message || error.message || 'Error al actualizar el ticket')
  }
}

const startEditResponse = (ticketId, currentResponse) => {
  editingResponseId.value = ticketId
  responseTexts.value[ticketId] = currentResponse || ''
}

const cancelEditResponse = () => {
  editingResponseId.value = null
}

const saveResponse = async (ticketId) => {
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
      throw new Error('No estás autenticado')
    }

    await $fetch(`/api/tickets/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: { response: responseTexts.value[ticketId] },
    })
    
    editingResponseId.value = null
    await loadTickets()
  } catch (error) {
    console.error('Error saving response:', error)
    alert(error.data?.message || error.message || 'Error al guardar la respuesta')
  }
}

const showDeleteConfirm = (ticket) => {
  selectedTicket.value = ticket
  showDeleteModal.value = true
}

const confirmDeleteBusiness = async () => {
  if (!selectedTicket.value) return
  
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
      throw new Error('No estás autenticado')
    }

    await $fetch(`/api/tickets/${selectedTicket.value.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: {
        status: 'resolved',
        deleteBusiness: true,
      },
    })
    showDeleteModal.value = false
    selectedTicket.value = null
    await loadTickets()
  } catch (error) {
    console.error('Error deleting business:', error)
    alert(error.data?.message || error.message || 'Error al eliminar el comercio')
  }
}

watch([statusFilter, typeFilter], () => {
  loadTickets()
})

onMounted(() => {
  loadTickets()
})

useHead({
  title: 'CRM · Panel de Atención al Cliente',
})
</script>

