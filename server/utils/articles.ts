import { readdir, readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import type { Article, ArticleMeta } from '#shared/types/article'
import { getFirstCommitDate } from './git-date'
import { SLUG_PATTERN, parseArticle } from './article-parse'

let cached: Promise<Article[]> | undefined

// Articles are read fresh in dev and cached for the rest of the build.
export function getArticles(): Promise<Article[]> {
  if (import.meta.dev) return loadArticles()
  cached ??= loadArticles()
  return cached
}

async function loadArticles(): Promise<Article[]> {
  const { articleDirs, repoRoot } = useRuntimeConfig()
  const articles: Article[] = []
  const seen = new Set<string>()

  for (const dir of articleDirs) {
    let names: string[]
    try {
      names = await readdir(dir)
    }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') continue
      throw error
    }

    for (const name of names.filter(name => name.endsWith('.html')).sort()) {
      const slug = basename(name, '.html')
      if (!SLUG_PATTERN.test(slug)) {
        throw new Error(`Article file "${name}" is not a valid slug (lowercase letters, numbers and hyphens)`)
      }
      if (seen.has(slug)) {
        throw new Error(`Duplicate article slug "${slug}" (${join(dir, name)})`)
      }
      seen.add(slug)

      const file = join(dir, name)
      const html = await readFile(file, 'utf8')
      articles.push(parseArticle({ html, slug, resolveFallbackDate: () => getFirstCommitDate(file, repoRoot) }))
    }
  }

  return articles.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
}

export function toMeta(article: Article): ArticleMeta {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    date: article.date,
    updated: article.updated,
    tags: article.tags,
    series: article.series,
    readingMinutes: article.readingMinutes,
  }
}
