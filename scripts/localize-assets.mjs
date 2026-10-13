// One-time, explicit migration of the existing static image URLs and symbol font.
// No credentials or database access. Re-running preserves the source manifest.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const digest = value => createHash('sha256').update(value).digest('hex')
const pattern = /https:\/\/(?:images\.unsplash\.com|lh3\.googleusercontent\.com)\/[^\s"'<>`)]+/g
async function walk(dir) {
  const result = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) result.push(...await walk(file))
    else if (/\.(tsx?|css)$/.test(file)) result.push(file)
  }
  return result
}
async function download(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(45000), headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  } })
  if (!response.ok) throw new Error(`${new URL(url).hostname}: HTTP ${response.status}`)
  return { bytes: Buffer.from(await response.arrayBuffer()), type: response.headers.get('content-type') || '' }
}
const files = await walk(path.join(root, 'src'))
const originals = new Map(await Promise.all(files.map(async file => [file, await readFile(file, 'utf8')])))
const urls = [...new Set([...originals.values()].flatMap(text => [...text.matchAll(pattern)].map(m => m[0])))].sort()
await mkdir(path.join(root, 'public/assets/images'), { recursive: true })
await mkdir(path.join(root, 'public/assets/fonts'), { recursive: true })
const manifestPath = path.join(root, 'docs/local-assets.json')
let manifest = { images: [], fonts: [] }
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')) } catch (e) { if (e.code !== 'ENOENT') throw e }
const mapping = new Map()
const errors = []
// Download all assets before modifying any source references.
let cursor = 0
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < urls.length) {
    const url = urls[cursor++]
    try {
      const cached = manifest.images.find(row => row.source === url)
      if (cached) {
        const bytes = await readFile(path.join(root, 'public', cached.local)).catch(() => null)
        if (bytes && digest(bytes) === cached.sha256) { mapping.set(url, cached.local); continue }
      }
      const { bytes, type } = await download(url)
      const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' }[type.split(';')[0]]
      if (!ext || bytes.length < 100) throw new Error(`Unexpected image type ${type}`)
      const local = `/assets/images/${digest(url).slice(0, 20)}.${ext}`
      await writeFile(path.join(root, 'public', local), bytes)
      mapping.set(url, local)
      manifest.images = manifest.images.filter(row => row.source !== url)
      manifest.images.push({ source: url, local, bytes: bytes.length, sha256: digest(bytes) })
      console.log(`Downloaded ${mapping.size}/${urls.length}`)
    } catch (e) { errors.push({ url, error: e.message }) }
  }
}))
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
if (errors.length) { console.error(JSON.stringify(errors, null, 2)); process.exit(1) }
const fontSource = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
let css = (await download(fontSource)).bytes.toString('utf8')
const fontUrls = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^\s)]+/g) || [])]
if (!fontUrls.length) throw new Error('No symbol font found')
for (const url of fontUrls) {
  const { bytes } = await download(url)
  const signature = bytes.subarray(0, 4).toString()
  const extension = signature === 'wOF2' ? 'woff2' : signature === 'wOFF' ? 'woff' : bytes.readUInt32BE(0) === 0x00010000 ? 'ttf' : null
  if (!extension) throw new Error('Unexpected font format')
  const local = `/assets/fonts/material-symbols-${digest(bytes).slice(0, 12)}.${extension}`
  await writeFile(path.join(root, 'public', local), bytes)
  css = css.replaceAll(url, local)
  manifest.fonts = manifest.fonts.filter(row => row.source !== url)
  manifest.fonts.push({ source: url, local, bytes: bytes.length, sha256: digest(bytes) })
}
const license = await download('https://raw.githubusercontent.com/google/material-design-icons/master/LICENSE')
await writeFile(path.join(root, 'public/assets/fonts/Material-Symbols-LICENSE.txt'), license.bytes)
await writeFile(path.join(root, 'src/app/material-symbols.css'), css)
for (const [file, original] of originals) {
  let updated = original.replace(pattern, url => mapping.get(url) || url)
  if (file === path.join(root, 'src/app/globals.css')) updated = updated.replace(/^@import url\([^\r\n]+\);/, '@import "./material-symbols.css";')
  if (file === path.join(root, 'src/app/layout.tsx')) updated = updated.replace(/      <head>\r?\n        <link href="https:\/\/fonts\.googleapis\.com[^\r\n]+\r?\n      <\/head>\r?\n/, '')
  if (updated !== original) await writeFile(file, updated)
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`Localized ${mapping.size} images and ${fontUrls.length} font files.`)
