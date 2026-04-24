import { computed, unref } from 'vue'
import { useColorUtils } from '~/composables/useColorUtils'
import { useFonts } from '~/composables/useFonts'

/** Plataformas de delivery activas a partir del objeto business (misma lógica que el menú público). */
export function getActiveDeliveryPlatformsForBusiness(business) {
  if (!business) return []
  if (!business.deliveryPlatforms) {
    if (business.pedidosYaUrl) {
      return [
        {
          id: 'pedidosYa',
          name: 'PedidosYa',
          url: business.pedidosYaUrl,
          logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/PedidosYa_logo.png',
        },
      ]
    }
    return []
  }

  const platformConfigs = {
    pedidosYa: {
      id: 'pedidosYa',
      name: 'PedidosYa',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/PedidosYa_logo.png',
    },
    rappi: {
      id: 'rappi',
      name: 'Rappi',
      logo: null,
    },
    agilpedido: {
      id: 'agilpedido',
      name: 'AgilPedido',
      logo: null,
    },
    pedidodirecto: {
      id: 'pedidodirecto',
      name: 'PedidoDirecto',
      logo: null,
    },
  }

  const platforms = []
  Object.keys(platformConfigs).forEach((key) => {
    const platform = business.deliveryPlatforms[key]
    if (platform && platform.enabled && platform.url) {
      platforms.push({
        ...platformConfigs[key],
        url: platform.url,
      })
    }
  })

  if (business.pedidosYaUrl && !platforms.find((p) => p.id === 'pedidosYa')) {
    platforms.push({
      id: 'pedidosYa',
      name: 'PedidosYa',
      url: business.pedidosYaUrl,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/PedidosYa_logo.png',
    })
  }

  return platforms
}

/**
 * @param {import('vue').Ref} businessRef
 * @param {{ isPreview?: boolean }} [options] - isPreview: no lee ?qr= de la URL para precios; solo showPrices
 */
export function useMenuViewModel(businessRef, options = {}) {
  const { isPreview = false } = options

  const { calculatePriceColor, getContrastTextColor, isLightColor } = useColorUtils()
  const { getFontById } = useFonts()

  const business = computed(() => unref(businessRef))

  const baseColor = computed(() => {
    const b = business.value
    if (!b) return '#ffffff'
    return b.backgroundColor || b.primaryColor || b.themeColor || '#ffffff'
  })

  const backgroundColor = computed(() => baseColor.value)

  const fontFamily = computed(() => {
    const fontId = business.value?.fontFamily || 'inter'
    const font = getFontById(fontId)
    return font.family
  })

  const headingWeightClass = computed(() => {
    const fontId = business.value?.fontFamily || 'inter'
    if (fontId === 'pacifico') return 'font-medium tracking-wide'
    if (fontId === 'dancing') return 'font-semibold tracking-wide'
    return 'font-bold'
  })

  const textColor = computed(() => getContrastTextColor(backgroundColor.value))

  const priceColor = computed(() => {
    const bgIsLight = isLightColor(backgroundColor.value)
    return calculatePriceColor(backgroundColor.value, !bgIsLight)
  })

  const menuLayout = computed(() => business.value?.menuLayout || 'vertical')

  const isOpenNow = computed(() => {
    const b = business.value
    if (!b?.openingHours) return true

    const now = new Date()
    const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
    const today = dayNames[now.getDay()]
    const todayHours = b.openingHours[today]

    if (!todayHours || todayHours.closed) return false

    const [openHour, openMin] = todayHours.open.split(':').map(Number)
    const [closeHour, closeMin] = todayHours.close.split(':').map(Number)
    const currentHour = now.getHours()
    const currentMin = now.getMinutes()

    const openTime = openHour * 60 + openMin
    const closeTime = closeHour * 60 + closeMin
    const currentTime = currentHour * 60 + currentMin

    return currentTime >= openTime && currentTime <= closeTime
  })

  const hasSocialMedia = computed(() => {
    const b = business.value
    if (!b?.socialMedia) return false
    const sm = b.socialMedia
    return !!(sm.instagram || sm.facebook || sm.whatsapp || sm.tiktok)
  })

  const activeDeliveryPlatforms = computed(() => getActiveDeliveryPlatformsForBusiness(business.value))

  const shouldShowPrices = computed(() => {
    if (isPreview) {
      if (business.value?.showPrices === false) return false
      return true
    }
    if (process.client) {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('qr') === 'true' || urlParams.get('from') === 'qr') {
        return true
      }
    }
    if (business.value?.showPrices === false) {
      return false
    }
    return true
  })

  return {
    business,
    baseColor,
    backgroundColor,
    fontFamily,
    headingWeightClass,
    textColor,
    priceColor,
    menuLayout,
    isOpenNow,
    hasSocialMedia,
    activeDeliveryPlatforms,
    shouldShowPrices,
  }
}
