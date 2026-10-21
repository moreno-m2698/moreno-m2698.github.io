import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { statSync } from 'node:fs'
import { extname, join, resolve as resolvePath, sep } from 'node:path'

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.woff2': 'font/woff2',
}

function candidatesFor(relPath) {
  if (relPath === '' || relPath.endsWith('/')) return [`${relPath}index.html`]
  return [relPath, `${relPath}/index.html`, `${relPath}.html`]
}

function isFile(path) {
  try {
    return statSync(path).isFile()
  }
  catch {
    return false
  }
}

// Returns the absolute path of the file that a URL path (relative to root) maps to, or null.
// Synchronous, so callers may use it with or without await.
export function resolveFile(root, relPath) {
  const rootDir = resolvePath(root)
  for (const candidate of candidatesFor(relPath)) {
    const full = resolvePath(rootDir, candidate)
    // Blocks path traversal. The separator stops a sibling such as "public-old" from passing.
    if (full !== rootDir && !full.startsWith(rootDir + sep)) continue
    if (isFile(full)) return full
  }
  return null
}

async function send(res, status, file, contentType) {
  const body = await readFile(file)
  res.writeHead(status, { 'content-type': contentType })
  res.end(body)
}

export function startStaticServer({ root, base, port = 0 }) {
  const server = createServer(async (req, res) => {
    try {
      const { pathname } = new URL(req.url ?? '/', 'http://localhost')
      const relPath = pathname.startsWith(base)
        ? decodeURIComponent(pathname.slice(base.length))
        : null
      const file = relPath === null ? null : resolveFile(root, relPath)

      if (file) {
        const type = CONTENT_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream'
        await send(res, 200, file, type)
        return
      }

      // Like GitHub Pages: serve the custom 404 page with status 404.
      const notFound = join(root, '404.html')
      if (isFile(notFound)) {
        await send(res, 404, notFound, CONTENT_TYPES['.html'])
      }
      else {
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
        res.end('Not found')
      }
    }
    catch {
      // A malformed URL (for example a bad %-escape) is treated as not found.
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('Not found')
    }
  })

  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, '127.0.0.1', () => {
      const address = server.address()
      resolve({
        origin: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((done) => {
          server.closeAllConnections()
          server.close(() => done())
        }),
      })
    })
  })
}
