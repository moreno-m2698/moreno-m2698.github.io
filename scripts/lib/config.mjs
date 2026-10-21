import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Same rules as nuxt.config.ts: deploy.config.json, overridden by NUXT_APP_BASE_URL.
const deployConfig = JSON.parse(readFileSync(new URL('../../deploy.config.json', import.meta.url), 'utf8'))
let base = process.env.NUXT_APP_BASE_URL || deployConfig.baseURL
if (!base.startsWith('/')) base = `/${base}`
if (!base.endsWith('/')) base = `${base}/`

export const baseURL = base
export const outputDir = fileURLToPath(new URL('../../.output/public/', import.meta.url))
export const repoRoot = fileURLToPath(new URL('../../', import.meta.url))
