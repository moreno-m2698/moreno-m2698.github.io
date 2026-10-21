import { chromium } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'
import { baseURL, outputDir } from './lib/config.mjs'
import { fileToUrlPath, listHtmlFiles } from './lib/html-files.mjs'
import { startStaticServer } from './lib/static-server.mjs'

// Checks every built page in light and dark color schemes. Each page runs under the CSP from postgenerate.mjs
// (bypassCSP is not set), so a CSP violation shows up as a console error and fails the check.
const COLOR_SCHEMES = ['light', 'dark']
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

const files = await listHtmlFiles(outputDir)
if (files.length === 0) {
  console.error(`No HTML files found in ${outputDir}. Run "pnpm generate" first.`)
  process.exit(1)
}

const server = await startStaticServer({ root: outputDir, base: baseURL })
const browser = await chromium.launch()
const problems = []

try {
  for (const colorScheme of COLOR_SCHEMES) {
    const context = await browser.newContext({ colorScheme })
    try {
      for (const file of files) {
        const urlPath = fileToUrlPath(file, baseURL)
        const label = `[${colorScheme}] ${urlPath}`
        const page = await context.newPage()
        const report = message => problems.push(`${label}: ${message}`)

        page.on('console', (message) => {
          if (message.type() === 'error' && /Content Security Policy/i.test(message.text())) {
            report(`CSP error: ${message.text()}`)
          }
        })
        page.on('pageerror', error => report(`page error: ${error.message}`))

        try {
          const response = await page.goto(`${server.origin}${urlPath}`, { waitUntil: 'networkidle' })
          if (!response?.ok()) {
            report(`HTTP ${response?.status() ?? 'no response'}`)
            continue
          }

          const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
          for (const violation of results.violations) {
            const targets = violation.nodes.map(node => node.target.join(' ')).join(' | ')
            report(`${violation.id} (${violation.impact}) ${violation.help}. Targets: ${targets}`)
          }
        }
        finally {
          await page.close()
        }
      }
    }
    finally {
      await context.close()
    }
  }
}
finally {
  await browser.close()
  await server.close()
}

if (problems.length > 0) {
  console.error(`${problems.length} accessibility or CSP problem(s):`)
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}

console.log(`${files.length} pages × ${COLOR_SCHEMES.length} themes, 0 violations`)
