import type { ArticleMeta } from '#shared/types/article'

export default defineEventHandler(async (): Promise<ArticleMeta[]> => (await getArticles()).map(toMeta))
