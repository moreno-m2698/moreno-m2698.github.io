export interface ArticleMeta { slug: string, title: string, description: string, date: string /* YYYY-MM-DD */, updated: string | null /* YYYY-MM-DD */, tags: string[] /* lowercase, no '#' */, series: string | null, readingMinutes: number }
export interface Article extends ArticleMeta { lang: string, bodyHtml: string }
