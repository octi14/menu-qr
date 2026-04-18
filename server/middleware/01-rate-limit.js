/**
 * Limita intentos de login/registro por IP (memoria; en varias réplicas usar Redis/upstream).
 */
const buckets = new Map()
const WINDOW_MS = 15 * 60 * 1000
const MAX_POSTS_PER_WINDOW = 40

export default defineEventHandler((event) => {
  const path = event.path || ''
  if (
    path !== '/api/users/verify' &&
    path !== '/api/users/register'
  ) {
    return
  }
  if (event.method !== 'POST') {
    return
  }

  const ip =
    getRequestIP(event) ||
    event.node?.req?.socket?.remoteAddress ||
    'unknown'

  const now = Date.now()
  let bucket = buckets.get(ip)
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + WINDOW_MS }
    buckets.set(ip, bucket)
  }
  bucket.count += 1
  if (bucket.count > MAX_POSTS_PER_WINDOW) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: 'Demasiados intentos. Probá más tarde.',
    })
  }
})
