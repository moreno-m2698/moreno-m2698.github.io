import { createHash } from 'node:crypto'
import { copyFile, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { outputDir } from './lib/config.mjs'
import { listHtmlFiles } from './lib/html-files.mjs'

// nuxt generate writes 404.html as a JavaScript-only shell, which breaks Principle II. Replace it with the
// prerendered /404 page (app/pages/404.vue), so the static 404 has its content without JavaScript.
try {
  await copyFile(join(outputDir, '404', 'index.html'), join(outputDir, '404.html'))
}
catch (error) {
  if (error.code === 'ENOENT') {
    console.error(`Missing ${join(outputDir, '404', 'index.html')}. The /404 page was not prerendered: check app/pages/404.vue and nitro.prerender.routes.`)
    process.exit(1)
  }
  throw error
}

// GitHub Pages has no SPA fallback, so the generated 200.html is removed.
await rm(join(outputDir, '200.html'), { force: true })

const files = await listHtmlFiles(outputDir)
if (files.length === 0) {
  console.error(`No HTML files found in ${outputDir}. Run "nuxt generate" first.`)
  process.exit(1)
}

const INLINE_SCRIPT = /<script\b(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi
const CSP_PRESENT = /http-equiv=["']?content-security-policy/i
const CHARSET_META = /<meta\s+charset=[^>]*>/i
const HEAD_OPEN = /<head\b[^>]*>/i

for (const rel of files) {
  const file = join(outputDir, rel)
  let html = await readFile(file, 'utf8')

  if (CSP_PRESENT.test(html)) {
    throw new Error(`${rel} already contains a Content-Security-Policy meta tag`)
  }

  // Every inline script is hashed, including JSON and importmap blocks. Extra hashes do no harm.
  const hashes = new Set()
  for (const match of html.matchAll(INLINE_SCRIPT)) {
    if (match[1].length === 0) continue
    hashes.add(`'sha256-${createHash('sha256').update(match[1], 'utf8').digest('base64')}'`)
  }

  const csp = [
    `default-src 'self'`,
    `script-src 'self' ${[...hashes].join(' ')}`.trimEnd(),
    // Accepted gap: Nuxt inlines component CSS and Vue style bindings can't be hashed, so
    // 'unsafe-inline' is needed for styles. It is documented in constitution Technical Baseline.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data:`,
    `font-src 'self'`,
    `connect-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join('; ')
  const meta = `<meta http-equiv="Content-Security-Policy" content="${csp}">`

  const charset = html.match(CHARSET_META)
  const head = html.match(HEAD_OPEN)
  if (charset) {
    html = html.slice(0, charset.index + charset[0].length) + meta + html.slice(charset.index + charset[0].length)
  }
  else if (head) {
    html = html.slice(0, head.index + head[0].length) + meta + html.slice(head.index + head[0].length)
  }
  else {
    throw new Error(`${rel}: no <meta charset> or <head> to insert the CSP into`)
  }

  await writeFile(file, html, 'utf8')
}

console.log(`CSP added to ${files.length} HTML file(s)`)
