import { readdir } from 'node:fs/promises'

// All .html files under dir, as '/'-separated paths relative to dir, sorted.
export async function listHtmlFiles(dir) {
  const names = await readdir(dir, { recursive: true })
  return names
    .map(name => name.replaceAll('\\', '/'))
    .filter(name => name.endsWith('.html'))
    .sort()
}

// Maps a file path (relative to the output root) to the URL path a visitor requests.
export function fileToUrlPath(rel, base) {
  if (rel === 'index.html') return base
  if (rel.endsWith('/index.html')) return base + rel.slice(0, -'index.html'.length)
  return base + rel
}
