// Prefixes a path under public/ with the app base URL. Call it in <script setup>, not inline in templates.
export function assetUrl(path: string): string {
  const base = useRuntimeConfig().app.baseURL.replace(/\/+$/, '')
  return `${base}/${path.replace(/^\/+/, '')}`
}
