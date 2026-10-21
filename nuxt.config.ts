import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const deployConfig = JSON.parse(readFileSync(new URL('./deploy.config.json', import.meta.url), 'utf8')) as { baseURL: string }
let baseURL = process.env.NUXT_APP_BASE_URL || deployConfig.baseURL
if (!baseURL.startsWith('/')) baseURL = `/${baseURL}`
if (!baseURL.endsWith('/')) baseURL = `${baseURL}/`

const includeFixtures = process.env.PORTFOLIO_FIXTURES === '1'
const articleDirs = [fileURLToPath(new URL('./content/articles/', import.meta.url))]
if (includeFixtures) articleDirs.push(fileURLToPath(new URL('./tests/fixtures/articles/', import.meta.url)))

// Routes are listed explicitly instead of crawled: with a non-root baseURL, Nitro's crawler queues every page
// both with and without the base and renders it twice, which races on the payload cache (EPERM on Windows).
// See nitrojs/nitro#4441 and PR #4688; revisit crawlLinks once that fix ships in a Nuxt release.
const articleRoutes = articleDirs
  .filter(dir => existsSync(dir))
  .flatMap(dir => readdirSync(dir).filter(name => name.endsWith('.html')))
  .map(name => `/articles/${name.slice(0, -'.html'.length)}`)
const prerenderRoutes = ['/', '/about', '/projects', '/articles', '/resume', '/404', ...articleRoutes]

export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  devtools: { enabled: true },
  app: { baseURL, head: { htmlAttrs: { lang: 'en' } } },
  css: ['~/assets/css/tokens.css', '~/assets/css/reset.css', '~/assets/css/base.css', '~/assets/css/prose.css'],
  // Private keys: server-only, never sent to the client.
  runtimeConfig: { articleDirs, repoRoot: fileURLToPath(new URL('./', import.meta.url)) },
  compatibilityDate: '2026-10-20',
  nitro: { prerender: { crawlLinks: false, failOnError: true, routes: prerenderRoutes } },
  typescript: { strict: true, typeCheck: false, tsConfig: { include: ['../content/**/*'] } },
  eslint: { config: { stylistic: true } },
})
