<script setup lang="ts">
import { site } from '~~/content/site'
import type { ArticleMeta } from '#shared/types/article'

const { data: articles } = await useFetch<ArticleMeta[]>('/api/articles', { default: () => [] })
const latest = computed(() => articles.value.slice(0, 3))

usePageSeo({ description: site.description })
</script>

<template>
  <div>
    <HomeHero />
    <section
      v-if="latest.length"
      aria-labelledby="latest-heading"
    >
      <h2 id="latest-heading">
        Latest articles
      </h2>
      <ArticleList
        :articles="latest"
        :heading-level="3"
      />
      <p><NuxtLink to="/articles">All articles</NuxtLink></p>
    </section>
  </div>
</template>
