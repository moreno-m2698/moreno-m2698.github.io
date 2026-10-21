import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parse } from 'node-html-parser'
import { baseURL, outputDir } from './lib/config.mjs'
import { fileToUrlPath, listHtmlFiles } from './lib/html-files.mjs'
import { resolveFile } from './lib/static-server.mjs'

const SCHEME = /^[a-z][a-z0-9+.-]*:/i
const LINK_SELECTORS = [
  ['a[href]', 'href'],
  ['link[href]', 'href'],
  ['script[src]', 'src'],
  ['img[src]', 'src'],
  ['source[src]', 'src'],
  ['iframe[src]', 'src'],
]

const files = await listHtmlFiles(outputDir)
if (files.length === 0) {
  console.error(`No HTML files found in ${outputDir}. Run "pnpm generate" first.`)
  process.exit(1)
}

const problems = []
let linksChecked = 0

for (const file of files) {
  const pagePath = fileToUrlPath(file, baseURL)
  const root = parse(await readFile(join(outputDir, file), 'utf8'), {
    comment: false,
    blockTextElements: { script: true, noscript: true, style: true },
  })
  const ids = new Set(root.querySelectorAll('[id]').map(el => el.getAttribute('id')))

  const refs = LINK_SELECTORS.flatMap(([selector, attribute]) =>
    root.querySelectorAll(selector).map(el => el.getAttribute(attribute)).filter(ref => ref !== undefined),
  )

  for (const ref of refs) {
    if (SCHEME.test(ref) || ref.startsWith('//')) continue
    linksChecked++
    const report = reason => problems.push(`${file} → ${ref} (${reason})`)

    if (ref.startsWith('#')) {
      let id
      try {
        id = decodeURIComponent(ref.slice(1))
      }
      catch {
        report('malformed fragment')
        continue
      }
      if (!ids.has(id)) report('fragment id not found on this page')
      continue
    }

    const u = new URL(ref, `http://site.invalid${pagePath}`)
    if (!u.pathname.startsWith(baseURL)) {
      report(`outside base path ${baseURL}`)
      continue
    }
    let relPath
    try {
      relPath = decodeURIComponent(u.pathname.slice(baseURL.length))
    }
    catch {
      report('malformed URL')
      continue
    }
    if (!resolveFile(outputDir, relPath)) report('target not found')
  }
}

if (problems.length > 0) {
  console.error(`${problems.length} broken link(s):`)
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}

console.log(`${files.length} page(s), ${linksChecked} link(s) checked, 0 broken`)
