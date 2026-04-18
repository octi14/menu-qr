/**
 * URL única de Google Fonts alineada con composables/useFonts.js (AVAILABLE_FONTS).
 * Pesos: 400–700 para texto; script con 400 y 700.
 */
const families = [
  'Inter:wght@400;500;600;700',
  'Playfair+Display:wght@400;500;600;700',
  'Roboto:wght@400;500;700',
  'Lora:wght@400;500;600;700',
  'Montserrat:wght@400;500;600;700',
  'Merriweather:wght@400;700',
  'Poppins:wght@400;500;600;700',
  'Crimson+Text:wght@400;600;700',
  'Open+Sans:wght@400;500;600;700',
  'Raleway:wght@400;500;600;700',
  'Oswald:wght@400;500;600;700',
  'Lato:wght@400;700',
  'Source+Sans+Pro:wght@400;600;700',
  'Ubuntu:wght@400;500;700',
  'Nunito:wght@400;500;600;700',
  'Dancing+Script:wght@400;700',
  'Pacifico:wght@400',
]

export const GOOGLE_FONTS_STYLESHEET_HREF = `https://fonts.googleapis.com/css2?family=${families.join('&family=')}&display=swap`
