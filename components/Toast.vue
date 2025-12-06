<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="show && displayMessage"
        class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[10001] pointer-events-none"
        style="z-index: 10001;"
      >
        <div
          class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm pointer-events-auto min-w-[200px] max-w-[90vw]"
          :class="[
            type === 'success' 
              ? 'bg-emerald-500 text-white border-emerald-600' 
              : type === 'error'
              ? 'bg-red-500 text-white border-red-600'
              : 'bg-slate-800 text-white border-slate-700'
          ]"
        >
          <svg
            v-if="type === 'success'"
            class="h-5 w-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg
            v-else-if="type === 'error'"
            class="h-5 w-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="text-sm font-medium">{{ displayMessage }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted, computed, nextTick } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'success', // 'success' | 'error' | 'info'
  },
  duration: {
    type: Number,
    default: 3000, // 3 segundos por defecto
  },
})

const emit = defineEmits(['update:message'])

const show = ref(false)
let timeoutId = null

// Extraer el mensaje sin el timestamp
const displayMessage = computed(() => {
  if (!props.message) return ''
  // Remover el timestamp si existe (formato: "mensaje-timestamp")
  const parts = props.message.split('-')
  if (parts.length > 1 && !isNaN(parts[parts.length - 1])) {
    return parts.slice(0, -1).join('-')
  }
  return props.message
})

const clearMessage = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  show.value = false
  setTimeout(() => {
    emit('update:message', '')
  }, 300) // Esperar a que termine la animación
}

// Auto-mostrar y ocultar cuando hay un mensaje
watch(() => props.message, (newMessage, oldMessage) => {
  // Limpiar timeout anterior
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  
  // Solo mostrar si hay un mensaje nuevo y diferente al anterior
  if (newMessage && newMessage !== oldMessage && newMessage.trim() !== '') {
    // Forzar que show sea false primero para reiniciar la animación
    show.value = false
    // Usar nextTick para asegurar que el cambio se aplique antes de mostrar
    nextTick(() => {
      show.value = true
      timeoutId = setTimeout(() => {
        clearMessage()
      }, props.duration)
    })
  } else if (!newMessage || newMessage.trim() === '') {
    show.value = false
  }
}, { immediate: true })

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>

