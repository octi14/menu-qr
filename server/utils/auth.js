import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

/**
 * Hashea una contraseña usando bcrypt
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} - Contraseña hasheada
 */
export async function hashPassword(password) {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Verifica una contraseña contra un hash
 * @param {string} password - Contraseña en texto plano
 * @param {string} hash - Hash almacenado
 * @returns {Promise<boolean>} - true si la contraseña coincide
 */
export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash)
}

/**
 * Genera un token JWT para un usuario
 * @param {object} payload - Datos del usuario (userId, email, role)
 * @returns {string} - Token JWT
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

/**
 * Verifica y decodifica un token JWT
 * @param {string} token - Token JWT
 * @returns {object|null} - Payload decodificado o null si es inválido
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

/**
 * Extrae el token del header Authorization
 * @param {object} event - Evento de Nuxt
 * @returns {string|null} - Token o null
 */
export function getTokenFromHeader(event) {
  const authHeader = event.node.req.headers.authorization
  if (!authHeader) return null
  
  // Formato: "Bearer <token>"
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null
  
  return parts[1]
}

/**
 * Requiere autenticación y retorna el usuario autenticado
 * @param {object} event - Evento de Nuxt
 * @returns {Promise<object>} - Usuario autenticado
 */
export async function requireAuth(event) {
  const token = getTokenFromHeader(event)
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'No autorizado: Token no proporcionado',
    })
  }

  const decoded = verifyToken(token)
  if (!decoded || !decoded.userId) {
    throw createError({
      statusCode: 401,
      message: 'No autorizado: Token inválido',
    })
  }

  const { getDatabase } = await import('./mongodb')
  const { ObjectId } = await import('mongodb')
  const db = await getDatabase()
  
  if (!db) {
    throw createError({
      statusCode: 500,
      message: 'Error de conexión con la base de datos',
    })
  }

  const user = await db.collection('users').findOne({ 
    _id: new ObjectId(decoded.userId) 
  })
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'No autorizado: Usuario no encontrado',
    })
  }

  // Adjuntar usuario al contexto del evento
  event.context.user = user
  
  // Retornar usuario con _id convertido a string para compatibilidad
  return {
    ...user,
    _id: user._id,
    id: user._id.toString(),
  }
}

