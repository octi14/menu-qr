// Templates predefinidos para aplicar estilos profesionales a los menús

export const MENU_TEMPLATES = [
  {
    id: 'minimalista',
    name: 'Minimalista',
    description: 'Diseño limpio y moderno con líneas simples y colores neutros',
    preview: {
      backgroundColor: '#ffffff',
      primaryColor: '#000000',
      secondaryColor: '#6b7280',
      accentColor: '#111827',
      themeColor: '#000000',
      fontFamily: 'inter',
    },
    colors: {
      backgroundColor: '#ffffff',
      primaryColor: '#000000',
      secondaryColor: '#6b7280',
      accentColor: '#111827',
      themeColor: '#000000',
    },
  },
  {
    id: 'clasico',
    name: 'Clásico',
    description: 'Estilo elegante y tradicional con tipografía serif refinada',
    preview: {
      backgroundColor: '#f9fafb',
      primaryColor: '#1f2937',
      secondaryColor: '#4b5563',
      accentColor: '#374151',
      themeColor: '#1f2937',
      fontFamily: 'playfair',
    },
    colors: {
      backgroundColor: '#f9fafb',
      primaryColor: '#1f2937',
      secondaryColor: '#4b5563',
      accentColor: '#374151',
      themeColor: '#1f2937',
    },
  },
  {
    id: 'moderno',
    name: 'Moderno',
    description: 'Colores vibrantes y diseño contemporáneo y dinámico',
    preview: {
      backgroundColor: '#ffffff',
      primaryColor: '#059669',
      secondaryColor: '#10b981',
      accentColor: '#047857',
      themeColor: '#059669',
      fontFamily: 'montserrat',
    },
    colors: {
      backgroundColor: '#ffffff',
      primaryColor: '#059669',
      secondaryColor: '#10b981',
      accentColor: '#047857',
      themeColor: '#059669',
    },
  },
  {
    id: 'elegante',
    name: 'Elegante',
    description: 'Sofisticado con toques dorados y tipografía serif elegante',
    preview: {
      backgroundColor: '#111827',
      primaryColor: '#fbbf24',
      secondaryColor: '#fcd34d',
      accentColor: '#f59e0b',
      themeColor: '#fbbf24',
      fontFamily: 'crimson',
    },
    colors: {
      backgroundColor: '#111827',
      primaryColor: '#fbbf24',
      secondaryColor: '#fcd34d',
      accentColor: '#f59e0b',
      themeColor: '#fbbf24',
    },
  },
  {
    id: 'casual',
    name: 'Casual',
    description: 'Ambiente acogedor con colores cálidos y diseño amigable',
    preview: {
      backgroundColor: '#fff7ed',
      primaryColor: '#ea580c',
      secondaryColor: '#fb923c',
      accentColor: '#c2410c',
      themeColor: '#ea580c',
      fontFamily: 'nunito',
    },
    colors: {
      backgroundColor: '#fff7ed',
      primaryColor: '#ea580c',
      secondaryColor: '#fb923c',
      accentColor: '#c2410c',
      themeColor: '#ea580c',
    },
  },
]

export function getTemplateById(templateId) {
  return MENU_TEMPLATES.find(t => t.id === templateId) || null
}

export function getDefaultTemplate() {
  return MENU_TEMPLATES[0]
}

/**
 * Aplica un template a un objeto de comercio
 * @param {Object} business - Objeto del comercio
 * @param {string} templateId - ID del template a aplicar
 * @returns {Object} - Objeto del comercio con los estilos del template aplicados
 */
export function applyTemplateToBusiness(business, templateId) {
  const template = getTemplateById(templateId)
  if (!template) return business

  return {
    ...business,
    backgroundColor: template.colors.backgroundColor,
    primaryColor: template.colors.primaryColor,
    secondaryColor: template.colors.secondaryColor,
    accentColor: template.colors.accentColor,
    themeColor: template.colors.themeColor,
    fontFamily: template.preview.fontFamily,
    appliedTemplate: templateId, // Guardamos el template aplicado para referencia
  }
}

export const useTemplates = () => {
  return {
    MENU_TEMPLATES,
    getTemplateById,
    getDefaultTemplate,
    applyTemplateToBusiness,
  }
}



