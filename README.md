# MapaMorfi · Menús digitales para tu comercio

**MapaMorfi** es una plataforma construida con **Nuxt.js 3** y Tailwind CSS para crear y gestionar menús digitales con códigos QR. Perfecta para restaurantes, bares, cervecerías y cualquier negocio gastronómico que quiera digitalizar su menú.

## 🚀 Tecnologías

- **Nuxt.js 3** - Framework Vue.js
- **Vue 3** - Framework JavaScript
- **JavaScript** - Lenguaje principal
- **Tailwind CSS** - Estilos
- **MongoDB Atlas** - Base de datos
- **QR Code** - Generación de códigos QR

## 📋 Configuración inicial

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar MongoDB Atlas:**
   - Creá un archivo `.env` en la raíz del proyecto
   - Agregá tu conexión a MongoDB:
     ```env
     MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/?retryWrites=true&w=majority
     MONGODB_DB=qr-menu
     ```
   - Reemplazá `usuario` y `contraseña` con tus credenciales reales

3. **Inicializar usuario admin (opcional):**
   - Ejecutá el servidor: `npm run dev`
   - Visitá `http://localhost:3000/setup` (si existe)
   - O creá el usuario directamente en MongoDB

## 🛠️ Comandos

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Generar sitio estático
npm run generate
```

Luego abrí `http://localhost:3000` en tu navegador.

## 📁 Estructura del Proyecto

```
├── assets/          # CSS, imágenes, etc.
├── components/      # Componentes Vue reutilizables
├── composables/     # Composables (lógica reutilizable)
├── layouts/         # Layouts de la aplicación
├── pages/           # Rutas automáticas (file-based routing)
├── server/          # API routes y lógica del servidor
│   ├── api/         # Endpoints de la API
│   └── utils/       # Utilidades del servidor
├── types/           # Tipos TypeScript
└── nuxt.config.ts   # Configuración de Nuxt
```

## 🗺️ Rutas principales

- `/` · Landing page
- `/login` · Iniciar sesión
- `/select-business` · Seleccionar comercio
- `/create-business` · Crear nuevo comercio
- `/[slug]/menu` · Menú público (para QR)
- `/[slug]/panel` · Panel de administración
- `/billing` · Planes y facturación

## 🔌 API Routes

- `GET /api/businesses` - Obtener todos los comercios
- `GET /api/businesses?slug=xxx` - Obtener comercio por slug
- `POST /api/businesses` - Crear/actualizar comercio
- `PUT /api/businesses/[slug]` - Actualizar comercio
- `POST /api/businesses/check-slug` - Verificar disponibilidad de slug
- `POST /api/users/verify` - Verificar credenciales

## 🚢 Deploy

### Vercel / Netlify

1. Conectá tu repositorio
2. El build se detecta automáticamente
3. Agregá las variables de entorno (`MONGODB_URI`, `MONGODB_DB`)

### Build manual

```bash
npm run build
# Los archivos estarán en .output/
```

## 📝 Notas

- Los menús son accesibles públicamente mediante QR codes
- El panel de administración requiere autenticación
- Los datos se guardan en MongoDB Atlas
- Soporta múltiples comercios por usuario
- Sistema de planes y límites de comercios

