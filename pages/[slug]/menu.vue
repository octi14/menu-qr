<template>
  <!-- Renderizar según layout seleccionado -->
  <MenuTabs
    v-if="showActivePublicMenu && menuLayout === 'tabs'"
    :business="business"
    :backgroundColor="backgroundColor"
    :text-color="textColor"
    :price-color="priceColor"
    :font-family="fontFamily"
    :should-show-prices="shouldShowPrices"
    :active-delivery-platforms="activeDeliveryPlatforms"
    :is-open-now="isOpenNow"
    :is-authenticated="isAuthenticated"
    :is-favorite="isFavorite"
    :is-loading-favorite="isLoadingFavorite"
    @toggle-favorite="toggleFavorite"
    @share-whatsapp="shareOnWhatsApp"
    @share-facebook="shareOnFacebook"
    @copy-link="copyLink"
    @export-pdf="exportToPDF"
  />
  <MenuGrid
    v-else-if="showActivePublicMenu && menuLayout === 'grid'"
    :business="business"
    :backgroundColor="backgroundColor"
    :text-color="textColor"
    :price-color="priceColor"
    :font-family="fontFamily"
    :should-show-prices="shouldShowPrices"
    :active-delivery-platforms="activeDeliveryPlatforms"
    :is-open-now="isOpenNow"
    :is-authenticated="isAuthenticated"
    :is-favorite="isFavorite"
    :is-loading-favorite="isLoadingFavorite"
    @toggle-favorite="toggleFavorite"
    @share-whatsapp="shareOnWhatsApp"
    @share-facebook="shareOnFacebook"
    @copy-link="copyLink"
    @export-pdf="exportToPDF"
  />
  <MenuCategories
    v-else-if="showActivePublicMenu && menuLayout === 'categories'"
    :business="business"
    :backgroundColor="backgroundColor"
    :text-color="textColor"
    :price-color="priceColor"
    :font-family="fontFamily"
    :should-show-prices="shouldShowPrices"
    :active-delivery-platforms="activeDeliveryPlatforms"
    :is-open-now="isOpenNow"
    :is-authenticated="isAuthenticated"
    :is-favorite="isFavorite"
    :is-loading-favorite="isLoadingFavorite"
    @toggle-favorite="toggleFavorite"
    @share-whatsapp="shareOnWhatsApp"
    @share-facebook="shareOnFacebook"
    @copy-link="copyLink"
    @export-pdf="exportToPDF"
  />
  <MenuTwoColumns
    v-else-if="showActivePublicMenu && menuLayout === 'two-columns'"
    :business="business"
    :backgroundColor="backgroundColor"
    :text-color="textColor"
    :price-color="priceColor"
    :font-family="fontFamily"
    :should-show-prices="shouldShowPrices"
    :active-delivery-platforms="activeDeliveryPlatforms"
    :is-open-now="isOpenNow"
    :is-authenticated="isAuthenticated"
    :is-favorite="isFavorite"
    :is-loading-favorite="isLoadingFavorite"
    @toggle-favorite="toggleFavorite"
    @share-whatsapp="shareOnWhatsApp"
    @share-facebook="shareOnFacebook"
    @copy-link="copyLink"
    @export-pdf="exportToPDF"
  />
  <MenuVerticalLayout
    v-else-if="showActivePublicMenu"
    :business="business"
    :backgroundColor="backgroundColor"
    :text-color="textColor"
    :price-color="priceColor"
    :font-family="fontFamily"
    :heading-weight-class="headingWeightClass"
    :should-show-prices="shouldShowPrices"
    :active-delivery-platforms="activeDeliveryPlatforms"
    :is-open-now="isOpenNow"
    :has-social-media="hasSocialMedia"
    :is-authenticated="isAuthenticated"
    :is-favorite="isFavorite"
    :is-loading-favorite="isLoadingFavorite"
    :is-preview="false"
    @toggle-favorite="toggleFavorite"
    @share-whatsapp="shareOnWhatsApp"
    @share-facebook="shareOnFacebook"
    @copy-link="copyLink"
    @export-pdf="exportToPDF"
  />
  <div v-else-if="business && business.isActive === false" class="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
    <div class="max-w-md text-center space-y-4 px-6">
      <h1 class="text-2xl font-semibold">Menú no disponible</h1>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Este menú está temporalmente suspendido. Por favor contactá al comercio.
      </p>
    </div>
  </div>
  <div
    v-else-if="pending"
    class="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50"
    aria-busy="true"
    aria-live="polite"
  >
    <AppLoadingScreen
      title="Cargando menú…"
      subtitle="Preparando productos y precios"
    />
  </div>
  <div
    v-else-if="!pending && menuLoadError"
    class="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 px-6"
  >
    <div class="max-w-md text-center space-y-4">
      <h1 class="text-2xl font-semibold">No pudimos cargar el menú</h1>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Puede ser un problema de conexión o del servidor. Revisá tu red e intentá de nuevo.
      </p>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
        @click="retryLoadMenu"
      >
        Reintentar
      </button>
    </div>
  </div>
  <div
    v-else-if="!pending && !menuLoadError"
    class="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50"
  >
    <div class="max-w-md text-center space-y-4 px-6">
      <h1 class="text-2xl font-semibold">Menú no encontrado</h1>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Verificá que hayas escaneado el QR correcto o consultá al comercio.
      </p>
    </div>
  </div>
  
  <!-- Toast Notification (siempre disponible fuera de los condicionales) -->
  <Toast
    v-model:message="toastMessage"
    :type="toastType"
    :duration="3000"
  />
</template>

<script setup>
const route = useRoute()
const { fetchBusinessBySlug } = useBusinesses()
const { trackEvent } = useAnalytics()

const slug = route.params.slug
const business = ref(null)
const pending = ref(true)
const menuLoadError = ref(false)
const isPublic = ref(true)

const showActivePublicMenu = computed(
  () => !!business.value && business.value.isActive !== false && isPublic.value
)

const { getCachedMenu, setCachedMenu } = useMenuCache()

const {
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
} = useMenuViewModel(business, { isPreview: false })

const isFavorite = ref(false)
const isLoadingFavorite = ref(false)
const isAuthenticated = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// Compartir funciones
const menuUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return ''
})

const shareOnWhatsApp = () => {
  const text = `¡Mirá el menú de ${business.value?.name}! ${menuUrl.value}`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

const shareOnFacebook = () => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(menuUrl.value)}`, '_blank')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(menuUrl.value)
    alert('Link copiado al portapapeles')
  } catch (error) {
    console.error('Error copying link:', error)
    alert('Error al copiar el link')
  }
}

/** Elementos a ocultar al generar PDF (mismo criterio en DOM y en el clon de html2canvas) */
const PDF_EXPORT_HIDE_SELECTORS = [
  '.absolute.right-5',
  '.absolute.right-0.top-full',
  'button[title*="favoritos"]',
  'button[title*="Favoritos"]',
  'header .flex.items-center.justify-end',
  '.relative.flex-1.max-w-xs',
  '.flex.items-center.justify-end.gap-3.mb-4',
  '.sticky.top-0.z-40',
  '.sticky.top-0 .relative.mt-3',
  'input[placeholder*="Buscar"]',
  'input[placeholder*="buscar"]',
  'input#menu-search',
  'input#menu-search-vertical',
  '.flex.items-center.justify-end.gap-3 button',
  '.flex.items-center.justify-end.gap-2 button',
  '.sticky.top-0 button',
  'a[target="_blank"][rel*="noopener"]',
  'button[aria-label*="Expandir"]',
  'button[aria-label*="Colapsar"]',
]

// Funciones helper para exportar PDF
const prepareElementsForPDF = (element) => {
  const originalDisplays = []

  const hideElementsBySelector = (selector, doc = document) => {
    const elements = doc.querySelectorAll(selector)
    elements.forEach((el) => {
      if (el && el.style) {
        originalDisplays.push({ element: el, display: el.style.display })
        el.style.display = 'none'
      }
    })
  }

  PDF_EXPORT_HIDE_SELECTORS.forEach((selector) => hideElementsBySelector(selector))
  
  // Preparar padding y márgenes
  const originalPadding = {
    top: element.style.paddingTop,
    bottom: element.style.paddingBottom,
    left: element.style.paddingLeft,
    right: element.style.paddingRight,
  }
  element.style.paddingTop = '0px'
  element.style.paddingBottom = '0px'
  element.style.paddingLeft = '0px'
  element.style.paddingRight = '0px'
  
  const originalMargin = {
    left: element.style.marginLeft,
    right: element.style.marginRight,
  }
  element.style.marginLeft = '0'
  element.style.marginRight = '0'
  
  // Preparar descripciones (remover line-clamp)
  const descriptions = element.querySelectorAll('.line-clamp-2, .line-clamp-3')
  const originalDescriptionStyles = []
  descriptions.forEach(desc => {
    originalDescriptionStyles.push({
      element: desc,
      classes: Array.from(desc.classList),
      style: {
        webkitLineClamp: desc.style.webkitLineClamp,
        display: desc.style.display,
        webkitBoxOrient: desc.style.webkitBoxOrient,
        overflow: desc.style.overflow
      }
    })
    desc.classList.remove('line-clamp-2', 'line-clamp-3')
    desc.style.webkitLineClamp = 'unset'
    desc.style.display = 'block'
    desc.style.webkitBoxOrient = 'unset'
    desc.style.overflow = 'visible'
  })
  
  // Ocultar imágenes
  const images = element.querySelectorAll('img')
  const originalImageDisplays = []
  images.forEach(img => {
    originalImageDisplays.push({ element: img, display: img.style.display })
    img.style.display = 'none'
  })
  
  return {
    originalDisplays,
    originalPadding,
    originalMargin,
    originalDescriptionStyles,
    originalImageDisplays,
  }
}

const restoreElementsAfterPDF = (element, { originalDisplays, originalPadding, originalMargin, originalDescriptionStyles, originalImageDisplays }) => {
  element.style.paddingTop = originalPadding.top || ''
  element.style.paddingBottom = originalPadding.bottom || ''
  element.style.paddingLeft = originalPadding.left || ''
  element.style.paddingRight = originalPadding.right || ''
  element.style.marginLeft = originalMargin.left || ''
  element.style.marginRight = originalMargin.right || ''
  
  originalImageDisplays.forEach(({ element: img, display }) => {
    if (img && img.style) img.style.display = display || ''
  })
  
  originalDescriptionStyles.forEach(({ element: el, classes, style }) => {
    if (el) {
      classes.forEach(cls => el.classList.add(cls))
      el.style.webkitLineClamp = style.webkitLineClamp
      el.style.display = style.display
      el.style.webkitBoxOrient = style.webkitBoxOrient
      el.style.overflow = style.overflow
    }
  })
  
  originalDisplays.forEach(({ element: el, display }) => {
    if (el && el.style) el.style.display = display
  })
}

const generatePDFPages = (pdf, canvas, imgWidth, imgHeight, pdfWidth, pdfHeight) => {
  const ratio = imgWidth / imgHeight
  let finalWidth = pdfWidth
  let finalHeight = pdfWidth / ratio
  const contentHeight = pdfHeight
  
  if (finalHeight > contentHeight) {
    finalHeight = contentHeight
    finalWidth = contentHeight * ratio
  }
  
  const imgData = canvas.toDataURL('image/png', 1.0)
  const totalHeight = finalHeight
  
  if (totalHeight <= contentHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, finalWidth, finalHeight, undefined, 'FAST')
  } else {
    const pageHeightPx = (contentHeight / totalHeight) * imgHeight
    let sourceY = 0
    
    // Primera página
    const firstPageHeight = Math.min(pageHeightPx, imgHeight)
    const tempCanvas1 = document.createElement('canvas')
    tempCanvas1.width = imgWidth
    tempCanvas1.height = firstPageHeight
    const tempCtx1 = tempCanvas1.getContext('2d')
    tempCtx1.drawImage(canvas, 0, 0, imgWidth, firstPageHeight, 0, 0, imgWidth, firstPageHeight)
    const firstPageData = tempCanvas1.toDataURL('image/png', 1.0)
    const firstPageHeightMm = (firstPageHeight / imgHeight) * finalHeight
    pdf.addImage(firstPageData, 'PNG', 0, 0, finalWidth, firstPageHeightMm, undefined, 'FAST')
    sourceY = firstPageHeight
    
    // Páginas adicionales
    while (sourceY < imgHeight) {
      pdf.addPage()
      const pageHeight = Math.min(pageHeightPx, imgHeight - sourceY)
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = imgWidth
      tempCanvas.height = pageHeight
      const tempCtx = tempCanvas.getContext('2d')
      tempCtx.drawImage(canvas, 0, sourceY, imgWidth, pageHeight, 0, 0, imgWidth, pageHeight)
      const tempImgData = tempCanvas.toDataURL('image/png', 1.0)
      const tempHeightMm = (pageHeight / imgHeight) * finalHeight
      pdf.addImage(tempImgData, 'PNG', 0, 0, finalWidth, tempHeightMm, undefined, 'FAST')
      sourceY += pageHeight
    }
  }
}

const exportToPDF = async () => {
  try {
    const { default: html2canvas } = await import('html2canvas')
    const { default: jsPDF } = await import('jspdf')

    const element = document.querySelector('.min-h-screen > .mx-auto')
    if (!element) return
    
    const prepared = prepareElementsForPDF(element)
    await new Promise(resolve => setTimeout(resolve, 200))

    // Configuración mejorada para html2canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Escala suficiente para buena calidad
      useCORS: true,
      allowTaint: false, // Cambiar a false para mejor manejo de imágenes
      backgroundColor: backgroundColor.value || '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      removeContainer: false,
      imageTimeout: 15000, // Aumentar timeout para imágenes
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('.min-h-screen > .mx-auto')
        if (!clonedElement) return
        
        // Aplicar las mismas preparaciones en el clon usando la función helper
        PDF_EXPORT_HIDE_SELECTORS.forEach((selector) => {
          clonedDoc.querySelectorAll(selector).forEach((el) => {
            if (el && el.style) el.style.display = 'none'
          })
        })
        
        clonedElement.style.paddingTop = '0px'
        clonedElement.style.paddingBottom = '0px'
        clonedElement.style.paddingLeft = '0px'
        clonedElement.style.paddingRight = '0px'
        clonedElement.style.marginLeft = '0'
        clonedElement.style.marginRight = '0'
        
        const clonedImages = clonedElement.querySelectorAll('img')
        clonedImages.forEach(img => img.style.display = 'none')
        
        const clonedDescriptions = clonedElement.querySelectorAll('.line-clamp-2, .line-clamp-3')
        clonedDescriptions.forEach(desc => {
          desc.classList.remove('line-clamp-2', 'line-clamp-3')
          desc.style.webkitLineClamp = 'unset'
          desc.style.display = 'block'
          desc.style.webkitBoxOrient = 'unset'
          desc.style.overflow = 'visible'
        })
      }
    })

    restoreElementsAfterPDF(element, prepared)

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = 210
    const pdfHeight = 297
    generatePDFPages(pdf, canvas, canvas.width, canvas.height, pdfWidth, pdfHeight)

    // Agregar footer en cada página
    const pageCount = pdf.internal.pages.length - 1
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setTextColor(128, 128, 128)
      pdf.text(
        `Hecho con MapaMorfi · Página ${i} de ${pageCount}`,
        pdfWidth / 2,
        pdfHeight - 3,
        { align: 'center' }
      )
    }

    pdf.save(`${business.value?.name || 'menu'}-menu.pdf`)
  } catch (error) {
    console.error('Error exporting PDF:', error)
    alert('Error al exportar el PDF. Por favor, intentá nuevamente.')
  }
}


const retryLoadMenu = async () => {
  menuLoadError.value = false
  pending.value = true
  await loadPublicMenu()
}

async function loadPublicMenu() {
  menuLoadError.value = false
  try {
    if (slug === 'demo') {
      try {
        const demo = await $fetch('/api/businesses/demo')
        if (demo) {
          business.value = normalizeBusiness(demo)
          pending.value = false
          return
        }
      } catch (error) {
        console.error('Error loading demo business:', error)
      }
    }

    const cachedBusiness = getCachedMenu(slug)
    if (cachedBusiness) {
      business.value = cachedBusiness
      pending.value = false
      fetchBusinessBySlug(slug).then((updatedBusiness) => {
        if (updatedBusiness) {
          business.value = updatedBusiness
          setCachedMenu(slug, updatedBusiness)
        }
      }).catch((err) => {
        console.error('Error loading updated business:', err)
      })
      return
    }

    business.value = await fetchBusinessBySlug(slug)

    if (!business.value) {
      pending.value = false
      return
    }

    setCachedMenu(slug, business.value)

    if (business.value) {
      try {
        const accessCheck = await $fetch(
          `/api/businesses/${encodeURIComponent(slug)}/check-access`
        )
        isPublic.value = accessCheck.isPublic === true
      } catch (err) {
        console.error('Error checking access:', err)
        isPublic.value = true
      }

      if (business.value.id) {
        trackEvent(business.value.id, 'menu_view')
      }
    }

    await checkAuthAndFavorite()
  } catch (error) {
    console.error('Error loading business:', error)
    if (error.statusCode === 404 || error.status === 404) {
      business.value = null
      menuLoadError.value = false
    } else {
      business.value = null
      menuLoadError.value = true
    }
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  loadPublicMenu()
})


// Los colores se actualizan automáticamente mediante computed properties
// cuando cambia baseColor

// Verificar autenticación y cargar estado de favorito
const checkAuthAndFavorite = async () => {
  if (!process.client) return
  
  const { getAuth, getToken } = useAuth()
  const auth = getAuth()
  if (auth) {
    isAuthenticated.value = true
    
    // Verificar si es favorito
    if (business.value?.id) {
      try {
        const token = getToken()
        const response = await $fetch(`/api/favorites/check?businessId=${business.value.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        isFavorite.value = response.isFavorite || false
      } catch (err) {
        console.error('Error checking favorite:', err)
      }
    }
  }
}

// Toggle favorito
const toggleFavorite = async () => {
  if (!isAuthenticated.value || !business.value?.id) return
  
  isLoadingFavorite.value = true
  try {
    const { getToken } = useAuth()
    const token = getToken()
    if (!token) return
    
    if (isFavorite.value) {
      // Eliminar de favoritos
      await $fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: {
          businessId: business.value.id,
        },
      })
      isFavorite.value = false
      // Trigger toast - usar un timestamp para forzar el cambio
      toastType.value = 'success'
      const timestamp = Date.now()
      toastMessage.value = `Eliminado de favoritos-${timestamp}`
      console.log('Toast message set:', toastMessage.value)
    } else {
      // Agregar a favoritos
      await $fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: {
          businessId: business.value.id,
        },
      })
      isFavorite.value = true
      // Trigger toast - usar un timestamp para forzar el cambio
      toastType.value = 'success'
      const timestamp = Date.now()
      toastMessage.value = `Agregado a favoritos-${timestamp}`
      console.log('Toast message set:', toastMessage.value)
    }
  } catch (err) {
    console.error('Error toggling favorite:', err)
    // Trigger toast - usar un timestamp para forzar el cambio
    toastType.value = 'error'
    const timestamp = Date.now()
    toastMessage.value = `Error al actualizar favoritos-${timestamp}`
    console.log('Toast message set:', toastMessage.value)
  } finally {
    isLoadingFavorite.value = false
  }
}

onMounted(async () => {
  await checkAuthAndFavorite()
})

watch(() => business.value?.id, async () => {
  if (business.value?.id) {
    await checkAuthAndFavorite()
  }
})

// Meta tags dinámicos para SEO
useHead({
  title: business.value ? `${business.value.name} · Menú` : 'Menú',
  meta: [
    {
      name: 'description',
      content: business.value?.description 
        ? `${business.value.description} - Menú digital de ${business.value.name}`
        : `Menú digital de ${business.value?.name || 'comercio'}`
    },
    // Open Graph
    {
      property: 'og:title',
      content: business.value ? `${business.value.name} · Menú` : 'Menú'
    },
    {
      property: 'og:description',
      content: business.value?.description 
        ? `${business.value.description} - Menú digital de ${business.value.name}`
        : `Menú digital de ${business.value?.name || 'comercio'}`
    },
    {
      property: 'og:image',
      content: business.value?.headerImageUrl || business.value?.logoUrl || ''
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: menuUrl.value
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: business.value ? `${business.value.name} · Menú` : 'Menú'
    },
    {
      name: 'twitter:description',
      content: business.value?.description 
        ? `${business.value.description} - Menú digital de ${business.value.name}`
        : `Menú digital de ${business.value?.name || 'comercio'}`
    },
    {
      name: 'twitter:image',
      content: business.value?.headerImageUrl || business.value?.logoUrl || ''
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: menuUrl.value
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: business.value?.name || '',
        description: business.value?.description || '',
        image: business.value?.headerImageUrl || business.value?.logoUrl || '',
        url: menuUrl.value,
        address: business.value?.address ? {
          '@type': 'PostalAddress',
          streetAddress: business.value.address
        } : undefined,
        geo: (business.value?.latitude && business.value?.longitude) ? {
          '@type': 'GeoCoordinates',
          latitude: business.value.latitude,
          longitude: business.value.longitude
        } : undefined,
        servesCuisine: business.value?.category || undefined,
        openingHoursSpecification: business.value?.openingHours ? Object.entries(business.value.openingHours).map(([day, hours]) => {
          if (hours.closed) return null
          return {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: `https://schema.org/${day.charAt(0).toUpperCase() + day.slice(1)}`,
            opens: hours.open,
            closes: hours.close
          }
        }).filter(Boolean) : undefined,
        sameAs: business.value?.socialMedia ? [
          business.value.socialMedia.instagram,
          business.value.socialMedia.facebook,
          business.value.socialMedia.whatsapp
        ].filter(Boolean) : undefined
      })
    }
  ]
})
</script>

