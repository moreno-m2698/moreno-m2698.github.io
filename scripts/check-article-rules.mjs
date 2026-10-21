import { readdir, readFile } from 'node:fs/promises'
import { basename, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'node-html-parser'
import { readMetaMap, validateArticleMeta } from '../shared/utils/article-meta.ts'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const repoRoot = fileURLToPath(new URL('../', import.meta.url))
const dirs = [
  fileURLToPath(new URL('../content/articles/', import.meta.url)),
  fileURLToPath(new URL('../tests/fixtures/articles/', import.meta.url)),
]

async function listHtml(dir) {
  try {
    const names = await readdir(dir)
    return names.filter(name => name.endsWith('.html')).sort().map(name => `${dir}${name}`)
  }
  catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

const files = (await Promise.all(dirs.map(listHtml))).flat()
const errors = []

for (const file of files) {
  const label = relative(repoRoot, file).replaceAll('\\', '/')
  const report = message => errors.push(`${label}: ${message}`)
  const slug = basename(file, '.html')
  if (!SLUG_PATTERN.test(slug)) report(`file name "${slug}" is not a valid slug (lowercase letters, numbers and hyphens)`)

  const root = parse(await readFile(file, 'utf8'), {
    comment: false,
    blockTextElements: { script: true, noscript: true, style: true },
  })

  const lang = root.querySelector('html')?.getAttribute('lang')?.trim()
  if (!lang) report('<html lang> is missing or empty')

  const title = root.querySelector('head title')
  if (!title || !title.text.trim()) report('<title> is missing or empty')

  const body = root.querySelector('body')
  if (!body) {
    report('there is no <body>')
  }
  else {
    for (const tag of ['nav', 'style', 'script', 'h1']) {
      if (body.querySelector(tag)) report(`<body> must not contain <${tag}>`)
    }
  }

  const entries = root.querySelectorAll('head meta[name]').map(meta => [
    meta.getAttribute('name') ?? '',
    meta.getAttribute('content') ?? '',
  ])
  for (const message of validateArticleMeta(readMetaMap(entries))) report(message)
}

if (errors.length > 0) {
  for (const error of errors) console.error(error)
  process.exit(1)
}
console.log(`${files.length} article file(s) OK`)
