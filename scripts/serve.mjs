import { baseURL, outputDir } from './lib/config.mjs'
import { startStaticServer } from './lib/static-server.mjs'

const server = await startStaticServer({ root: outputDir, base: baseURL, port: 4173 })
console.log(`${server.origin}${baseURL}`)
