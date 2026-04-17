// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  experimental: {
    appManifest: false
  },
  
  devServer: {
    host: '0.0.0.0', // Escuchar en todas las interfaces de red
    port: 3000,
  },
  
  css: ['~/assets/css/main.css'],
  
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
  },
  
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    mongodbDb: process.env.MONGODB_DB,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    public: {
      // Variables públicas si las necesitas
    }
  },
  
  vite: {
    optimizeDeps: {
      include: ['nuxt']
    },
    ssr: {
      noExternal: []
    }
  },
  
  app: {
    head: {
      title: 'MapaMorfi · Menús digitales para tu comercio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'description', content: 'MapaMorfi - Plataforma de menús digitales con códigos QR para tu comercio.' },
        { name: 'theme-color', content: '#10b981' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'MapaMorfi' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Lora:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Poppins:wght@400;500;600;700&family=Crimson+Text:wght@400;600;700&family=Open+Sans:wght@400;500;600;700&family=Raleway:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&family=Lato:wght@400;500;700&family=Source+Sans+Pro:wght@400;600;700&family=Ubuntu:wght@400;500;700&family=Nunito:wght@400;500;600;700&family=Dancing+Script:wght@400;700&family=Pacifico&display=swap' },
        { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', crossorigin: '' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'icon', type: 'image/png', href: '/icon-192.png' },
        { rel: 'apple-touch-icon', href: '/icon-192.png' }
      ],
      script: [
        { 
          innerHTML: `
            (function() {
              try {
                const saved = localStorage.getItem('qrmenu-theme');
                if (saved === 'dark' || saved === 'light') {
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(saved);
                  document.documentElement.setAttribute('data-theme', saved);
                }
              } catch (e) {}
            })();
          `,
          type: 'text/javascript',
        },
        { src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', crossorigin: '', defer: false }
      ]
    }
  }
})

