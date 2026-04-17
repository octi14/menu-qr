/**
 * Convierte menu-ph-*.png → .webp (máx 512px lado, calidad ~78) y borra el PNG.
 * Uso: node scripts/encode-menu-placeholders.mjs
 */
import sharp from 'sharp'
import { readdir, unlink, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pub = join(__dirname, '..', 'public')

for (const f of await readdir(pub)) {
  if (!f.startsWith('menu-ph-') || !f.endsWith('.png')) continue
  const inp = join(pub, f)
  const out = join(pub, f.replace(/\.png$/i, '.webp'))
  await sharp(inp)
    .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78, effort: 4 })
    .toFile(out)
  await unlink(inp)
  const st = await stat(out)
  console.log(`${f} → ${out.split(/[/\\]/).pop()} (${Math.round(st.size / 1024)} KB)`)
}
