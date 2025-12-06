export const PLANS = [
  {
    id: "free",
    name: "Gratis",
    description: "Perfecto para empezar",
    price: 0,
    maxBusinesses: 1,
    isDemo: true, // Solo demo, no público
    hasQR: false, // NO puede generar QR
    canExportPDF: false, // NO puede exportar PDF
    isPublic: false, // Menú NO es público
    canShare: false, // NO puede compartir link
    canScreenshot: false, // Bloquear captura de pantalla
    hasWhatsAppOrders: false, // No incluye pedidos por WhatsApp (removido)
    features: [
      "1 comercio",
      "Información básica del comercio",
      "Aparece en el mapa de descubrimiento",
      "Sin código QR",
      "Sin exportación a PDF",
    ],
  },
  {
    id: "basic",
    name: "Básico",
    description: "Ideal para emprendimientos y negocios pequeños",
    price: 3900, // Precio con impuestos
    priceWithoutTaxes: 3900, // Precio sin impuestos
    priceWithTaxes: 4719, // Precio con impuestos (21% IVA)
    maxBusinesses: 1,
    hasQR: true, // SÍ puede generar QR
    canExportPDF: true, // SÍ puede exportar PDF
    isPublic: true, // Menú es público
    canShare: true, // Puede compartir link
    canScreenshot: true, // Permite captura de pantalla
    hasWhatsAppOrders: false, // No incluye pedidos por WhatsApp (removido)
    features: [
      "1 comercio",
      "Menú QR ilimitado",
      "Menú público y compartible",
      "Aparece en mapa de descubrimiento ⭐",
      "Links a apps de pedidos (Rappi, PedidosYa, etc.)",
      "Personalización básica (colores, fuentes)",
      "Exportar menú a PDF ⭐",
      "Soporte por email",
    ],
  },
  {
    id: "professional",
    name: "Pro",
    description: "Ideal para negocios en expansión",
    price: 9900, // Precio con impuestos
    priceWithoutTaxes: 9900, // Precio sin impuestos
    priceWithTaxes: 11979, // Precio con impuestos (21% IVA)
    maxBusinesses: 5,
    hasQR: true,
    canExportPDF: true,
    isPublic: true,
    canShare: true,
    canScreenshot: true,
    hasWhatsAppOrders: false, // Removido
    hasYearlyBilling: true, // Soporte para billing anual
    yearlyPrice: 95040, // 20% descuento (9900 * 12 * 0.8)
    yearlyDiscount: 20, // Porcentaje de descuento
    features: [
      "Hasta 5 comercios",
      "Menú QR ilimitado",
      "Menú público y compartible",
      "Aparece destacado en el mapa ⭐",
      "Links a apps de pedidos",
      "Personalización completa (colores, fuentes, imágenes, header, logo)",
      "Exportar menú a PDF ⭐",
      "Analytics básicos",
      "Templates predefinidos",
      "Soporte prioritario",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Para grandes cadenas y franquicias",
    price: 24793, // Precio con impuestos
    priceWithoutTaxes: 24793, // Precio sin impuestos
    priceWithTaxes: 30000, // Precio con impuestos (21% IVA)
    maxBusinesses: 50,
    hasQR: true,
    canExportPDF: true,
    isPublic: true,
    canShare: true,
    canScreenshot: true,
    hasWhatsAppOrders: false, // Removido
    hasYearlyBilling: true, // Soporte para billing anual
    yearlyPrice: 238008, // 20% descuento (24793 * 12 * 0.8)
    yearlyDiscount: 20, // Porcentaje de descuento
    features: [
      "Hasta 50 comercios",
      "Menú QR ilimitado",
      "Menú público y compartible",
      "Aparece destacado en el mapa ⭐",
      "Links a apps de pedidos",
      "Personalización completa",
      "Logo personalizado en el mapa",
      "Analytics mejorados",
      "Gestión de múltiples ubicaciones",
      "Soporte dedicado",
    ],
  },
]

export function getPlanById(planId) {
  return PLANS.find((p) => p.id === planId)
}

export function getDefaultPlan() {
  // Por defecto, el plan gratuito
  return PLANS.find(p => p.id === 'free') || PLANS[0]
}

export function canCreateBusiness(currentBusinessCount, plan, userRole = null, userEmail = null) {
  // Los admins siempre pueden crear comercios ilimitados
  if (userRole === 'admin') {
    return true
  }
  // Verificar si es el email admin específico
  if (userEmail === 'gonzalezoctavio5@gmail.com') {
    return true
  }
  if (plan.maxBusinesses === -1) {
    return true
  }
  return currentBusinessCount < plan.maxBusinesses
}

export const usePlans = () => {
  return {
    PLANS,
    getPlanById,
    getDefaultPlan,
    canCreateBusiness,
  }
}

