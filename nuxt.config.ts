import { readFileSync } from 'node:fs'

const deployConfig = JSON.parse(readFileSync(new URL('./deploy.config.json', import.meta.url), 'utf8')) as { baseURL: string }
let baseURL = process.env.NUXT_APP_BASE_URL || deployConfig.baseURL
if (!baseURL.startsWith('/')) baseURL = `/${baseURL}`
if (!baseURL.endsWith('/')) baseURL = `${baseURL}/`

export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  devtools: { enabled: true },
  app: { baseURL, head: { htmlAttrs: { lang: 'en' } } },
  compatibilityDate: '2026-10-20',
  nitro: { prerender: { crawlLinks: true, failOnError: true } },
  typescript: { strict: true, typeCheck: false, tsConfig: { include: ['../content/**/*'] } },
  eslint: { config: { stylistic: true } },
})
