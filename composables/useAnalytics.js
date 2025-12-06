/**
 * Composable para tracking de analytics
 */
export const useAnalytics = () => {
  const trackEvent = async (businessId, eventType, data = {}) => {
    if (!businessId || !eventType) return

    try {
      await $fetch('/api/analytics/track', {
        method: 'POST',
        body: {
          businessId,
          eventType,
          ...data,
        },
      })
    } catch (error) {
      console.error('Error tracking analytics:', error)
      // No mostrar error al usuario, solo loguear
    }
  }

  return {
    trackEvent,
  }
}

