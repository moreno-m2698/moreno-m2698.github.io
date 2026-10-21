// Article metadata standard (constitution III). Single source for the build and the CI article check.
// Keep this file free of imports and TypeScript-only syntax beyond type annotations, so Node 24 can
// import it directly through built-in type stripping.

export const ARTICLE_META_NAMES = ['description', 'date', 'updated', 'series', 'tags'] as const

// Lowercases and trims names, trims content, skips empty content (empty counts as missing),
// and keeps the first occurrence of each name.
export function readMetaMap(entries: Iterable<[name: string, content: string]>): Map<string, string> {
  const map = new Map<string, string>()
  for (const [rawName, rawContent] of entries) {
    const name = rawName.trim().toLowerCase()
    const content = rawContent.trim()
    if (!content || map.has(name)) continue
    map.set(name, content)
  }
  return map
}

// Matches YYYY-MM-DD and checks that it is a real calendar date (2026-02-30 fails).
export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

// Letters, numbers, '-', '_'; '/' only between segments; not made only of numbers.
export const TAG_PATTERN = /^(?![\d/]+$)[\p{L}\p{N}_-]+(?:\/[\p{L}\p{N}_-]+)*$/u

// Splits on whitespace, strips one leading '#', lowercases, validates and de-duplicates (first seen order).
export function parseTags(content: string): { tags: string[], errors: string[] } {
  const tags: string[] = []
  const errors: string[] = []
  for (const token of content.split(/\s+/)) {
    if (!token) continue
    const tag = (token.startsWith('#') ? token.slice(1) : token).toLowerCase()
    if (!TAG_PATTERN.test(tag)) {
      errors.push(`invalid tag "${token}"`)
      continue
    }
    if (!tags.includes(tag)) tags.push(tag)
  }
  return { tags, errors }
}

// Returns one message per recognized tag that is present but malformed. Unrecognized names are ignored.
export function validateArticleMeta(meta: Map<string, string>): string[] {
  const problems: string[] = []
  for (const name of ['date', 'updated'] as const) {
    const value = meta.get(name)
    if (value !== undefined && !isIsoDate(value)) {
      problems.push(`${name}: "${value}" is not a real YYYY-MM-DD date`)
    }
  }
  const tags = meta.get('tags')
  if (tags !== undefined) {
    for (const error of parseTags(tags).errors) {
      problems.push(`tags: ${error}`)
    }
  }
  return problems
}

export function tagMatches(tag: string, filter: string): boolean {
  return tag === filter || tag.startsWith(`${filter}/`)
}
