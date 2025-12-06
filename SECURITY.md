# Seguridad - Configuración

## Variables de Entorno Requeridas

Para producción, es **CRÍTICO** configurar las siguientes variables de entorno:

```env
# MongoDB
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=qr-menu

# JWT - IMPORTANTE: Cambiar en producción
JWT_SECRET=tu-secret-key-super-segura-y-aleatoria-aqui
JWT_EXPIRES_IN=7d
```

## Generar JWT_SECRET Seguro

Para generar un JWT_SECRET seguro, puedes usar:

```bash
# Opción 1: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Opción 2: OpenSSL
openssl rand -hex 64

# Opción 3: Online
# Visita: https://generate-secret.vercel.app/64
```

## Características de Seguridad Implementadas

### ✅ Contraseñas Hasheadas
- Todas las contraseñas se hashean con **bcryptjs** (10 salt rounds)
- Las contraseñas nunca se almacenan en texto plano
- Verificación segura con `bcrypt.compare()`

### ✅ Tokens JWT
- Autenticación basada en tokens JWT
- Tokens expiran después de 7 días (configurable)
- Tokens incluyen: userId, email, role

### ✅ Endpoints Protegidos
- Middleware de autenticación disponible en `server/utils/middleware.js`
- Uso: `const auth = await requireAuth(event)`

## Migración de Usuarios Existentes

Si tienes usuarios con contraseñas sin hashear en la base de datos:

1. **NO** podrán hacer login hasta que restablezcan su contraseña
2. Deben usar la función "Olvidé mi contraseña"
3. El sistema detectará automáticamente contraseñas sin hashear y las rechazará

## Mejores Prácticas

1. **Nunca** compartas tu `JWT_SECRET`
2. **Nunca** commitees el archivo `.env` al repositorio
3. Usa diferentes `JWT_SECRET` para desarrollo y producción
4. Rota el `JWT_SECRET` periódicamente en producción
5. Considera usar un servicio de gestión de secretos (AWS Secrets Manager, etc.)

## Notas Importantes

- El fallback `admin/admin` en login es solo para desarrollo
- En producción, elimina o deshabilita el fallback hardcoded
- Los tokens JWT se almacenan en `localStorage` (considera usar httpOnly cookies en producción)


