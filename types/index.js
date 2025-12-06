// Tipos compartidos (documentación JSDoc para referencia)
// En JavaScript no hay tipos, pero mantenemos esta estructura para documentación

/**
 * @typedef {Object} MenuItem
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {number} [price]
 * @property {string} [imageUrl]
 * @property {string[]} [tags]
 * @property {boolean} [isAvailable]
 */

/**
 * @typedef {Object} MenuSection
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {MenuItem[]} items
 */

/**
 * @typedef {Object} Menu
 * @property {string} id
 * @property {string} name
 * @property {MenuSection[]} sections
 */

/**
 * @typedef {Object} SocialMedia
 * @property {string} [instagram]
 * @property {string} [facebook]
 * @property {string} [twitter]
 * @property {string} [whatsapp]
 * @property {string} [tiktok]
 */

/**
 * @typedef {Object} Business
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string} [description]
 * @property {string} [logoUrl] - URL del logo para mostrar en el mapa (solo enterprise)
 * @property {string} [headerImageUrl]
 * @property {boolean} [headerImageOverlay]
 * @property {boolean} [hideName] - Si es true, oculta el nombre del comercio y muestra solo la imagen header como banner
 * @property {string} [themeColor]
 * @property {string} [primaryColor]
 * @property {string} [backgroundColor]
 * @property {string} [fontFamily]
 * @property {string} [secondaryColor]
 * @property {string} [accentColor]
 * @property {SocialMedia} [socialMedia]
 * @property {string} [googleMapsUrl]
 * @property {string} [address] - Dirección del comercio
 * @property {number} [latitude]
 * @property {number} [longitude]
 * @property {string} [category] - Rubro del comercio (cafeteria, pizzeria, parrilla, etc.)
 * @property {string} [pedidosYaUrl] - URL de PedidosYa para pedidos (deprecated, usar deliveryPlatforms)
 * @property {Object} [deliveryPlatforms] - Plataformas de pedidos externas
 * @property {Object} [deliveryPlatforms.pedidosYa] - { url: string, enabled: boolean }
 * @property {Object} [deliveryPlatforms.rappi] - { url: string, enabled: boolean }
 * @property {Object} [deliveryPlatforms.agilpedido] - { url: string, enabled: boolean }
 * @property {Object} [deliveryPlatforms.pedidodirecto] - { url: string, enabled: boolean }
 * @property {boolean} [showPrices] - Si es false, oculta precios en menú (pero siempre se muestran en QR)
 * @property {MenuSection[]} sections - Secciones del menú (estructura nueva)
 * @property {Menu} [menu] - Estructura antigua (deprecated, se migra automáticamente a sections)
 * @property {boolean} [isActive]
 * @property {Date} [suspendedAt]
 * @property {Object} [openingHours] - Horarios de atención
 * @property {string} [appliedTemplate] - ID del template predefinido aplicado (para referencia)
 */

/**
 * @typedef {Object} Plan
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {number} maxBusinesses
 * @property {string[]} features
 * @property {boolean} [popular]
 */

/**
 * @typedef {Object} Subscription
 * @property {string} id
 * @property {string} userId
 * @property {string} planId
 * @property {"active" | "cancelled" | "past_due" | "trialing"} status
 * @property {Date} currentPeriodStart
 * @property {Date} currentPeriodEnd
 * @property {boolean} [cancelAtPeriodEnd]
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} password
 * @property {"admin" | "business"} role
 * @property {string[]} [businessIds]
 * @property {Subscription} [subscription]
 * @property {Date} createdAt
 */

