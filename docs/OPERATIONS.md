# Operación en producción (MapaMorfi)

## Variables de entorno obligatorias

| Variable | Uso |
|----------|-----|
| `MONGODB_URI` | Conexión a MongoDB Atlas o compatible |
| `MONGODB_DB` | Nombre de la base de datos |
| `JWT_SECRET` | Clave para firmar tokens (obligatoria en `NODE_ENV=production`; no usar el valor por defecto) |

Opcional: `JWT_EXPIRES_IN` (por defecto `7d`).

## Seguridad

- **JWT:** En producción, el arranque fallará al emitir o verificar tokens si `JWT_SECRET` falta o coincide con el placeholder de desarrollo.
- **Rate limiting:** Las rutas `POST /api/users/verify` y `POST /api/users/register` limitan intentos por IP en memoria. Con varias instancias detrás de un balanceador, conviene un límite en el proxy (p. ej. nginx/Cloudflare) o almacén compartido (Redis).

## MongoDB

- Índices recomendados según consultas frecuentes: por `slug` en la colección de comercios, por `email` en usuarios.
- Backups: activar backups continuos en Atlas (o política equivalente) y probar restauración al menos una vez.
- Rotación de credenciales de conexión si se sospecha filtración.

## Despliegue

- Tras cambios, ejecutar `npm run build` y desplegar el directorio de salida de Nuxt/Nitro según tu hosting.
- Mantener Node en una versión LTS compatible con el proyecto.

## Pruebas E2E (Playwright)

- Las pruebas ejecutan `npm run build:playwright` (`PLAYWRIGHT=1`), que desactiva el SSR solo en la ruta `/:slug/menu` para poder simular respuestas de API en el navegador. **No uses ese build para producción**; el artefacto normal es `npm run build` sin esa variable.
