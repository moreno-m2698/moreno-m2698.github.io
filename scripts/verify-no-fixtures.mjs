import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { outputDir } from './lib/config.mjs'

// The deploy build must not contain test-only articles (tests/fixtures/articles, see PORTFOLIO_FIXTURES).
const fixturesDir = fileURLToPath(new URL('../tests/fixtures/articles/', import.meta.url))

let names = []
try {
  names = await readdir(fixturesDir)
}
catch (error) {
  if (error.code !== 'ENOENT') throw error
}

const slugs = names.filter(name => name.endsWith('.html')).map(name => basename(name, '.html'))
const problems = []

for (const slug of slugs) {
  for (const rel of [`articles/${slug}`, `api/article/${slug}`]) {
    if (existsSync(join(outputDir, rel))) problems.push(`fixture article "${slug}" was generated at ${rel}`)
  }
}

if (!existsSync(join(outputDir, 'index.html'))) {
  problems.push('index.html is missing: run "pnpm generate" first')
}

if (problems.length > 0) {
  console.error(`Fixture check failed:\n${problems.map(problem => `  ${problem}`).join('\n')}`)
  process.exit(1)
}

console.log(`No fixtures in ${outputDir} (${slugs.length} fixture slug(s) checked)`)
