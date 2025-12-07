# Configuración de Variables de Entorno en Vercel

## Problema
Si el deploy funciona pero no puedes conectarte a la base de datos, es porque las variables de entorno no están configuradas en Vercel.

## Solución: Configurar Variables de Entorno en Vercel

### Paso 1: Ir a la configuración del proyecto en Vercel

1. Entrá a [vercel.com](https://vercel.com) e iniciá sesión
2. Seleccioná tu proyecto `menu-qr`
3. Andá a **Settings** (Configuración)
4. En el menú lateral, click en **Environment Variables** (Variables de Entorno)

### Paso 2: Agregar las variables de entorno

Necesitás agregar las siguientes variables:

#### Variables requeridas:

1. **MONGODB_URI**
   - **Value**: Tu cadena de conexión completa de MongoDB Atlas
   - **Ejemplo**: `mongodb+srv://octi14:TU_PASSWORD@qr-menu.pbqkukc.mongodb.net/?retryWrites=true&w=majority`
   - **Importante**: Si tu contraseña tiene caracteres especiales, codificalos:
     - `@` → `%40`
     - `#` → `%23`
     - `%` → `%25`
     - `&` → `%26`
     - `+` → `%2B`
     - `/` → `%2F`
     - `=` → `%3D`
     - `?` → `%3F`
   - **Environments**: Seleccioná **Production**, **Preview**, y **Development**

2. **MONGODB_DB**
   - **Value**: `qr-menu`
   - **Environments**: Seleccioná **Production**, **Preview**, y **Development**

3. **JWT_SECRET** (si usás autenticación)
   - **Value**: Una cadena secreta aleatoria (podés generar una con: `openssl rand -base64 32`)
   - **Environments**: Seleccioná **Production**, **Preview**, y **Development**

### Paso 3: Configurar MongoDB Atlas para permitir conexiones desde Vercel

Vercel usa IPs dinámicas, así que necesitás permitir conexiones desde cualquier IP:

1. Entrá a [MongoDB Atlas](https://cloud.mongodb.com)
2. Seleccioná tu cluster
3. Andá a **Network Access** (o **IP Access List**)
4. Click en **Add IP Address**
5. Click en **Allow Access from Anywhere**
6. Esto agregará `0.0.0.0/0` a la lista (permite desde cualquier IP)
7. Click en **Confirm**

**⚠️ Nota de seguridad**: Permitir acceso desde cualquier IP es necesario para Vercel, pero asegurate de:
- Usar una contraseña fuerte
- No compartir tu cadena de conexión
- Considerar usar MongoDB Atlas IP Access List más restrictiva si conocés las IPs de Vercel (aunque cambian frecuentemente)

### Paso 4: Redesplegar la aplicación

Después de agregar las variables de entorno:

1. En Vercel, andá a la pestaña **Deployments**
2. Click en los tres puntos (`...`) del último deployment
3. Seleccioná **Redeploy**
4. O simplemente hacé un nuevo push a GitHub y Vercel desplegará automáticamente

### Paso 5: Verificar que funciona

1. Después del redeploy, andá a tu aplicación en Vercel
2. Intentá usar alguna funcionalidad que requiera la base de datos
3. Si sigue sin funcionar, revisá los logs:
   - En Vercel, andá a **Deployments**
   - Click en el deployment más reciente
   - Click en **Functions** o **Logs** para ver los errores

## Verificar variables de entorno en el código

Si querés verificar que las variables están disponibles, podés agregar un endpoint temporal:

```javascript
// server/api/test-env.get.js
export default defineEventHandler(async (event) => {
  return {
    hasMongoUri: !!process.env.MONGODB_URI,
    hasMongoDb: !!process.env.MONGODB_DB,
    // No devuelvas los valores reales por seguridad
  }
})
```

Luego visitá `/api/test-env` en tu deploy para verificar.

## Troubleshooting

### Error: "MongoDB no está configurado"
- Verificá que las variables de entorno estén configuradas en Vercel
- Verificá que estén seleccionadas para el ambiente correcto (Production/Preview/Development)
- Hacé un redeploy después de agregar las variables

### Error: "Authentication failed"
- Verificá que la contraseña en `MONGODB_URI` esté correctamente codificada si tiene caracteres especiales
- Verificá que el usuario exista en MongoDB Atlas (Database Access)

### Error: "IP not whitelisted"
- Verificá que hayas agregado `0.0.0.0/0` en Network Access de MongoDB Atlas
- Esperá unos minutos después de agregar la IP (puede tardar en propagarse)

### Error: "Connection timeout"
- Verificá que el cluster de MongoDB Atlas esté activo (no pausado)
- Verificá que la cadena de conexión sea correcta

## Checklist final

- [ ] Variables de entorno agregadas en Vercel (MONGODB_URI, MONGODB_DB, JWT_SECRET)
- [ ] Variables configuradas para Production, Preview y Development
- [ ] MongoDB Atlas permite conexiones desde 0.0.0.0/0 (o IPs específicas de Vercel)
- [ ] Usuario de MongoDB existe y tiene permisos correctos
- [ ] Contraseña codificada correctamente si tiene caracteres especiales
- [ ] Aplicación redesplegada después de agregar las variables
- [ ] Logs revisados para verificar que no hay errores de conexión

