// Tipografías disponibles para los menús
export const AVAILABLE_FONTS = [
  {
    id: 'inter',
    name: 'Inter',
    family: 'Inter, system-ui, -apple-system, sans-serif',
    description: 'Moderno y legible',
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    family: '"Playfair Display", serif',
    description: 'Elegante y clásico',
  },
  {
    id: 'roboto',
    name: 'Roboto',
    family: 'Roboto, sans-serif',
    description: 'Geométrico y limpio',
  },
  {
    id: 'lora',
    name: 'Lora',
    family: 'Lora, serif',
    description: 'Tradicional y acogedor',
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    family: 'Montserrat, sans-serif',
    description: 'Bold y contemporáneo',
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    family: 'Merriweather, serif',
    description: 'Serio y profesional',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    family: 'Poppins, sans-serif',
    description: 'Friendly y accesible',
  },
  {
    id: 'crimson',
    name: 'Crimson Text',
    family: '"Crimson Text", serif',
    description: 'Literario y refinado',
  },
  {
    id: 'opensans',
    name: 'Open Sans',
    family: '"Open Sans", sans-serif',
    description: 'Versátil y neutral',
  },
  {
    id: 'raleway',
    name: 'Raleway',
    family: 'Raleway, sans-serif',
    description: 'Elegante y minimalista',
  },
  {
    id: 'oswald',
    name: 'Oswald',
    family: 'Oswald, sans-serif',
    description: 'Condensado y fuerte',
  },
  {
    id: 'lato',
    name: 'Lato',
    family: 'Lato, sans-serif',
    description: 'Cálido y amigable',
  },
  {
    id: 'source',
    name: 'Source Sans Pro',
    family: '"Source Sans Pro", sans-serif',
    description: 'Claro y funcional',
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    family: 'Ubuntu, sans-serif',
    description: 'Moderno y distintivo',
  },
  {
    id: 'nunito',
    name: 'Nunito',
    family: 'Nunito, sans-serif',
    description: 'Redondeado y suave',
  },
  {
    id: 'dancing',
    name: 'Dancing Script',
    family: '"Dancing Script", cursive',
    description: 'Casual y expresivo',
  },
  {
    id: 'pacifico',
    name: 'Pacifico',
    family: 'Pacifico, cursive',
    description: 'Divertido y relajado',
  },
]

export function getFontById(fontId) {
  return AVAILABLE_FONTS.find(f => f.id === fontId) || AVAILABLE_FONTS[0]
}

export function getDefaultFont() {
  return AVAILABLE_FONTS[0]
}

export const useFonts = () => {
  return {
    AVAILABLE_FONTS,
    getFontById,
    getDefaultFont,
  }
}

