import { site } from '~~/content/site'

interface PageSeo { title?: string, description: string, type?: 'website' | 'article' }

export function usePageSeo(seo: PageSeo): void {
  const fullTitle = seo.title ? `${seo.title} · ${site.name}` : site.name
  const base = useRuntimeConfig().app.baseURL
  const path = useRoute().path
  // Trailing slash, because GitHub Pages serves directories.
  const url = new URL(path === '/' ? base : `${base}${path.replace(/^\//, '')}/`, site.origin).href

  useSeoMeta({
    title: fullTitle,
    description: seo.description,
    ogTitle: fullTitle,
    ogDescription: seo.description,
    ogType: seo.type ?? 'website',
    ogUrl: url,
    ogSiteName: site.name,
    twitterCard: 'summary',
    twitterTitle: fullTitle,
    twitterDescription: seo.description,
  })
  useHead({ link: [{ rel: 'canonical', href: url }] })
}
