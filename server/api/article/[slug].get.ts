import type { Article } from '#shared/types/article'

export default defineEventHandler(async (event): Promise<Article> => {
  const slug = getRouterParam(event, 'slug')
  const article = (await getArticles()).find(item => item.slug === slug)
  if (!article) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }
  return article
})
