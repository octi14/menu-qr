/**
 * Categorías de comercios y sus íconos para el mapa
 */
export const BUSINESS_CATEGORIES = [
  {
    id: 'cafeteria',
    name: 'Cafetería',
    icon: '☕',
    color: '#8B4513', // Marrón café
  },
  {
    id: 'pizzeria',
    name: 'Pizzería',
    icon: '🍕',
    color: '#FF6B35', // Naranja
  },
  {
    id: 'parrilla',
    name: 'Parrilla',
    icon: '🥩',
    color: '#DC2626', // Rojo
  },
  {
    id: 'cerveceria',
    name: 'Cervecería',
    icon: '🍺',
    color: '#F59E0B', // Ámbar
  },
  {
    id: 'restaurante',
    name: 'Restaurante',
    icon: '🍽️',
    color: '#10B981', // Verde esmeralda
  },
  {
    id: 'bar',
    name: 'Bar',
    icon: '🍸',
    color: '#8B5CF6', // Púrpura
  },
  {
    id: 'heladeria',
    name: 'Heladería',
    icon: '🍦',
    color: '#EC4899', // Rosa
  },
  {
    id: 'panaderia',
    name: 'Panadería',
    icon: '🥖',
    color: '#F97316', // Naranja oscuro
  },
  {
    id: 'sushi',
    name: 'Sushi',
    icon: '🍣',
    color: '#06B6D4', // Cyan
  },
  {
    id: 'comida_peruana',
    name: 'Comida Peruana',
    icon: '🇵🇪',
    color: '#DC2626', // Rojo (colores de la bandera peruana)
  },
  {
    id: 'comida_mexicana',
    name: 'Comida Mexicana',
    icon: '🌮',
    color: '#16A34A', // Verde (colores de la bandera mexicana)
  },
  {
    id: 'comida_thai',
    name: 'Comida Thai',
    icon: '🍜',
    color: '#DC2626', // Rojo (colores de la bandera tailandesa)
  },
  {
    id: 'vegano',
    name: 'Vegano',
    icon: '🌱',
    color: '#10B981', // Verde
  },
  {
    id: 'pancheria',
    name: 'Panchería/Hamburguesería',
    icon: '🍔',
    color: '#F59E0B', // Naranja/Ámbar
  },
  {
    id: 'otro',
    name: 'Otro',
    icon: '📍',
    color: '#10B981', // Verde por defecto
  },
]

export function getCategoryById(categoryId) {
  return BUSINESS_CATEGORIES.find(cat => cat.id === categoryId) || BUSINESS_CATEGORIES.find(cat => cat.id === 'otro')
}

export function getCategoryIcon(categoryId) {
  const category = getCategoryById(categoryId)
  return category ? category.icon : '📍'
}

export function getCategoryColor(categoryId) {
  const category = getCategoryById(categoryId)
  return category ? category.color : '#10B981'
}

export const useBusinessCategories = () => {
  return {
    BUSINESS_CATEGORIES,
    getCategoryById,
    getCategoryIcon,
    getCategoryColor,
  }
}

