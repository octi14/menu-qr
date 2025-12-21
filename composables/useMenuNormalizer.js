/**
 * Normaliza la estructura de datos de un business para asegurar consistencia
 * en sections e items a través de toda la aplicación
 */

/**
 * Normaliza un item del menú asegurando que tenga todas las propiedades necesarias
 * @param {Object} item - Item a normalizar
 * @returns {Object} - Item normalizado
 */
const normalizeItem = (item) => {
  if (!item || typeof item !== 'object') {
    return null
  }

  // Asegurar que el item tenga un ID
  if (!item.id) {
    item.id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Normalizar propiedades requeridas
  return {
    id: item.id,
    name: item.name || '',
    description: item.description || '',
    price: item.price != null ? Number(item.price) : null,
    imageUrl: item.imageUrl || '',
    tags: Array.isArray(item.tags) ? item.tags.filter(tag => tag && typeof tag === 'string') : [],
    isAvailable: item.isAvailable !== false, // Por defecto true
  }
}

/**
 * Normaliza una sección del menú asegurando que tenga la estructura correcta
 * @param {Object} section - Sección a normalizar
 * @returns {Object} - Sección normalizada
 */
const normalizeSection = (section) => {
  if (!section || typeof section !== 'object') {
    return null
  }

  // Asegurar que la sección tenga un ID
  if (!section.id) {
    section.id = `sec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Normalizar items dentro de la sección
  let items = []
  if (Array.isArray(section.items)) {
    items = section.items
      .map(normalizeItem)
      .filter(item => item !== null && item.name && item.name.trim() !== '')
  }

  return {
    id: section.id,
    name: section.name || '',
    description: section.description || '',
    items: items,
  }
}

/**
 * Normaliza la estructura de sections de un business
 * Maneja migración de business.menu.sections a business.sections
 * @param {Object} business - Business object a normalizar
 * @returns {Array} - Array de secciones normalizadas
 */
export const normalizeBusinessSections = (business) => {
  if (!business || typeof business !== 'object') {
    return []
  }

  // Intentar obtener sections de diferentes ubicaciones posibles
  let sections = []
  
  // Primero intentar business.sections (estructura nueva)
  if (Array.isArray(business.sections)) {
    sections = business.sections
  } 
  // Luego intentar business.menu.sections (estructura antigua)
  else if (business.menu && Array.isArray(business.menu.sections)) {
    sections = business.menu.sections
  }

  // Normalizar todas las secciones
  const normalizedSections = sections
    .map(normalizeSection)
    .filter(section => section !== null && section.name && section.name.trim() !== '')

  return normalizedSections
}

/**
 * Normaliza un business completo asegurando que sections esté en la ubicación correcta
 * @param {Object} business - Business object a normalizar
 * @returns {Object} - Business normalizado con sections en business.sections
 */
export const normalizeBusiness = (business) => {
  if (!business || typeof business !== 'object') {
    return null
  }

  // Crear copia del business
  const normalized = { ...business }

  // Normalizar sections y asegurar que estén en business.sections
  normalized.sections = normalizeBusinessSections(business)

  // Eliminar business.menu.sections si existe (ya migrado a sections)
  if (normalized.menu && normalized.menu.sections) {
    delete normalized.menu.sections
    // Si menu queda vacío, eliminar menu completo
    if (Object.keys(normalized.menu).length === 0) {
      delete normalized.menu
    }
  }

  return normalized
}

/**
 * Valida que una sección tenga items válidos
 * @param {Object} section - Sección a validar
 * @returns {Boolean} - true si la sección tiene items válidos
 */
export const hasValidItems = (section) => {
  if (!section || typeof section !== 'object') {
    return false
  }

  if (!Array.isArray(section.items)) {
    return false
  }

  return section.items.length > 0 && section.items.some(item => {
    return item && typeof item === 'object' && item.name && item.name.trim() !== ''
  })
}

/**
 * Filtra secciones que tienen items válidos
 * @param {Array} sections - Array de secciones a filtrar
 * @returns {Array} - Array de secciones con items válidos
 */
export const filterSectionsWithItems = (sections) => {
  if (!Array.isArray(sections)) {
    return []
  }

  return sections.filter(hasValidItems)
}

