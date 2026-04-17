/**
 * Placeholders WebP en `public/menu-ph-*.webp` (generados y optimizados a ~512px).
 * Origen y fechas: `docs/menu-placeholders.md`
 */
export const MENU_PLACEHOLDER_DEFAULT = '/menu-ph-plato.webp'

const PATH = {
  plato: '/menu-ph-plato.webp',
  bebida: '/menu-ph-bebida.webp',
  cafe: '/menu-ph-cafe.webp',
  postre: '/menu-ph-postre.webp',
  ensalada: '/menu-ph-ensalada.webp',
  snack: '/menu-ph-snack.webp',
  pizza: '/menu-ph-pizza.webp',
}

const ENSALADA_HINT =
  /ensalada|caesar|verde|mixta|caprese|verdura(?!\s+principal)/i
const POSTRE_HINT =
  /postre|flan|helado|torta|brownie|dulce|alfajor|bud[ií]n|mousse|cheesecake|tiramis/i
const SNACK_HINT =
  /empanada|papas|picoteo|nacho|rabas|bravas|tabla|snack|entrada|bast[oó]n/i
const CAFE_HINT =
  /caf[eé]|espresso|cappuccino|latte|macchiato|cortado|americano|ristretto|flat\s*white/i
const DRINK_HINT =
  /bebidas?|gaseosa|cerveza|vino|jugo|licuado|batido|t[eé]\b|tea\b|agua\b|tragos|mojito|fernet|gin\b|ipa\b|stout|limonada|smoothie|champagne|whisky|whiskey|ron\b|combo.*bebida/i
const PIZZA_HINT =
  /pizza|pizzer|mozzarella|margherita|muzza|napolitana|calzone|fugazz|fain[aá]|fugazzeta/i

/**
 * URL de imagen del ítem, o placeholder WebP según nombre / tags / sección.
 * @param {object} item
 * @param {string} [sectionName]
 */
export function getMenuItemImageSrc(item, sectionName = '') {
  if (item?.imageUrl) return item.imageUrl
  const text = `${item?.name || ''} ${Array.isArray(item?.tags) ? item.tags.join(' ') : ''} ${sectionName || ''}`

  if (ENSALADA_HINT.test(text)) return PATH.ensalada
  if (POSTRE_HINT.test(text)) return PATH.postre
  if (SNACK_HINT.test(text)) return PATH.snack
  if (CAFE_HINT.test(text)) return PATH.cafe
  if (DRINK_HINT.test(text)) return PATH.bebida
  if (PIZZA_HINT.test(text)) return PATH.pizza
  return PATH.plato
}

export function useMenuItemPlaceholder() {
  return {
    getMenuItemImageSrc,
    MENU_PLACEHOLDER_DEFAULT,
    /** @deprecated usar MENU_PLACEHOLDER_DEFAULT */
    MENU_PLACEHOLDER_FOOD: PATH.plato,
    MENU_PLACEHOLDER_DRINK: PATH.bebida,
  }
}
