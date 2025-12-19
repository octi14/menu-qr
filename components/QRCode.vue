<template>
  <div class="flex flex-col items-center gap-4">
    <div
      ref="qrContainer"
      class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
    >
      <canvas ref="canvasRef" />
    </div>
    <button
      @click="downloadQR"
      class="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      <svg
        class="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Descargar QR
    </button>
  </div>
</template>

<script setup>
import QRCodeLib from 'qrcode'

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 200,
  },
  businessId: {
    type: String,
    default: null,
  },
})

const canvasRef = ref(null)
const qrContainer = ref(null)

const downloadQR = async () => {
  if (!canvasRef.value) return

  try {
    const dataUrl = canvasRef.value.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'mapamorfi-qr.png'
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Error al descargar QR:', error)
  }
}

const { trackEvent } = useAnalytics()

onMounted(async () => {
  if (!canvasRef.value) return

  try {
    // Agregar parámetro qr=true a la URL para que el menú sepa que viene de QR
    let qrUrl = props.value
    if (qrUrl && !qrUrl.includes('qr=true') && !qrUrl.includes('from=qr')) {
      const separator = qrUrl.includes('?') ? '&' : '?'
      qrUrl = `${qrUrl}${separator}qr=true`
    }
    
    await QRCodeLib.toCanvas(canvasRef.value, qrUrl, {
      width: props.size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    // Track QR scan cuando se genera (simula que alguien lo escaneó)
    if (props.businessId) {
      trackEvent(props.businessId, 'qr_scan')
    }
  } catch (error) {
    console.error('Error al generar QR:', error)
  }
})
</script>

