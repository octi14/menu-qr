# Configuración de MongoDB Atlas

## Paso 1: Crear archivo .env.local

Creá un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# MongoDB Atlas Connection String
# Reemplazá <db_password> con tu contraseña real
MONGODB_URI=mongodb+srv://octi14:<db_password>@qr-menu.pbqkukc.mongodb.net/?retryWrites=true&w=majority

# Nombre de la base de datos
MONGODB_DB=qr-menu
```

**Importante:** Reemplazá `<db_password>` con tu contraseña real de MongoDB Atlas.

## Paso 2: Verificar la conexión

Una vez configurado, la aplicación intentará conectarse a MongoDB cuando uses las funciones de base de datos.

## Estructura de la base de datos

La aplicación usará una colección llamada `businesses` en la base de datos `qr-menu` para almacenar los comercios y sus menús.

## Funciones disponibles

- `getBusinessBySlug(slug)` - Obtiene un comercio por su slug
- `getAllBusinesses()` - Obtiene todos los comercios
- `saveBusiness(business)` - Guarda o actualiza un comercio
- `createBusiness(business)` - Crea un nuevo comercio

