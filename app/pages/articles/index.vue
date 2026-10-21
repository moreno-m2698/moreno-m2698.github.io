<script setup lang="ts">
import { site } from '~~/content/site'
import type { ArticleMeta } from '#shared/types/article'

const { data: articles } = await useFetch<ArticleMeta[]>('/api/articles', { default: () => [] })

usePageSeo({ title: 'Articles', description: `Articles by ${site.name}.` })
</script>

<template>
  <div>
    <h1>Articles</h1>
    <ArticleList
      v-if="articles.length"
      :articles="articles"
    />
    <p v-else>
      No articles yet.
    </p>
  </div>
</template>
