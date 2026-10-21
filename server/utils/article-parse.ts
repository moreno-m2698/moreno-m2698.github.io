import { parse } from 'node-html-parser'
import type { Article } from '#shared/types/article'
import { parseTags, readMetaMap, validateArticleMeta } from '#shared/utils/article-meta'

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const SUMMARY_MAX = 160

// Collapses whitespace. Longer text is cut at a word boundary and ends with an ellipsis.
function summarize(text: string): string {
  const collapsed = text.replace(/\s+/g, ' ').trim()
  if (collapsed.length <= SUMMARY_MAX) return collapsed
  const cut = collapsed.slice(0, SUMMARY_MAX - 3)
  const space = cut.lastIndexOf(' ')
  return `${space > 0 ? cut.slice(0, space) : cut}…`
}

// Parses one article file. Throws if the metadata is malformed (constitution III).
export function parseArticle({ html, slug, resolveFallbackDate }: { html: string, slug: string, resolveFallbackDate: () => string }): Article {
  // Same options as scripts/check-article-rules.mjs, except that <pre> is not treated as text, so <pre><code> is parsed.
  const root = parse(html, {
    comment: false,
    blockTextElements: { script: true, noscript: true, style: true },
  })

  const entries = root.querySelectorAll('head meta[name]').map(meta => [
    meta.getAttribute('name') ?? '',
    meta.getAttribute('content') ?? '',
  ] as [string, string])
  const meta = readMetaMap(entries)

  const problems = validateArticleMeta(meta)
  if (problems.length > 0) {
    throw new Error(`Article "${slug}" has invalid metadata: ${problems.join('; ')}`)
  }

  const body = root.querySelector('body')
  const bodyText = body?.text ?? ''
  const words = bodyText.split(/\s+/).filter(Boolean).length

  const title = root.querySelector('head title')?.text.replace(/\s+/g, ' ').trim() || slug
  const description = meta.get('description') ?? summarize(body?.querySelector('p')?.text ?? '')
  const tags = meta.has('tags') ? parseTags(meta.get('tags') ?? '').tags : []

  return {
    slug,
    title,
    description,
    date: meta.get('date') ?? resolveFallbackDate(),
    updated: meta.get('updated') ?? null,
    tags,
    series: meta.get('series') ?? null,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    lang: root.querySelector('html')?.getAttribute('lang')?.trim() || 'en',
    bodyHtml: body?.innerHTML.trim() ?? '',
  }
}
