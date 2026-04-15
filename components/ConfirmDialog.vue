<template>
  <Teleport to="body">
    <Transition name="confirm-dialog">
      <div
        v-if="modelValue"
        class="confirm-dialog-root fixed inset-0 z-[10000] flex items-end justify-center sm:items-center sm:p-4"
        role="presentation"
      >
        <div
          class="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          aria-hidden="true"
          @click="handleCancel"
        />
        <div
          class="modal-card relative z-10 flex max-h-[min(90vh,720px)] w-full max-w-md flex-col overflow-hidden rounded-t-[1.35rem] border border-slate-200/90 bg-white shadow-2xl dark:border-slate-700/80 dark:bg-slate-900 sm:rounded-2xl sm:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          @click.stop
        >
          <div
            class="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 sm:hidden"
            aria-hidden="true"
          />
          <div class="flex flex-1 flex-col gap-4 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6">
            <div class="flex gap-3">
              <div
                v-if="variant === 'danger'"
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/12 text-red-600 dark:bg-red-500/15 dark:text-red-400"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div class="min-w-0 flex-1 pt-0.5">
                <h2 :id="titleId" class="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  {{ title }}
                </h2>
                <p v-if="message" class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {{ message }}
                </p>
              </div>
            </div>
            <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                class="w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto sm:py-2.5"
                @click="handleCancel"
              >
                {{ cancelLabel }}
              </button>
              <button
                type="button"
                class="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 sm:w-auto sm:py-2.5"
                :class="
                  variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500'
                    : 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500'
                "
                @click="handleConfirm"
              >
                {{ confirmLabel }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Confirmar',
  },
  message: {
    type: String,
    default: '',
  },
  confirmLabel: {
    type: String,
    default: 'Aceptar',
  },
  cancelLabel: {
    type: String,
    default: 'Cancelar',
  },
  /** 'danger' muestra icono y estilo rojo en la acción principal */
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'danger'].includes(v),
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const titleId = `confirm-dialog-title-${Math.random().toString(36).slice(2, 9)}`

function handleConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

function onKeydown(e) {
  if (e.key === 'Escape' && props.modelValue) {
    e.preventDefault()
    handleCancel()
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (!process.client) return
    if (open) {
      document.addEventListener('keydown', onKeydown)
      const prev = document.body.style.overflow
      document.body.dataset.prevOverflow = prev || ''
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = document.body.dataset.prevOverflow || ''
      delete document.body.dataset.prevOverflow
    }
  },
)

onUnmounted(() => {
  if (!process.client) return
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = document.body.dataset.prevOverflow || ''
  delete document.body.dataset.prevOverflow
})
</script>

<style scoped>
.confirm-dialog-enter-active,
.confirm-dialog-leave-active {
  transition: opacity 0.22s ease;
}

.confirm-dialog-enter-active .modal-card,
.confirm-dialog-leave-active .modal-card {
  transition:
    transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.22s ease;
}

.confirm-dialog-enter-from,
.confirm-dialog-leave-to {
  opacity: 0;
}

.confirm-dialog-enter-from .modal-card,
.confirm-dialog-leave-to .modal-card {
  opacity: 0;
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .confirm-dialog-enter-from .modal-card,
  .confirm-dialog-leave-to .modal-card {
    transform: translateY(10px) scale(0.97);
  }
}
</style>
