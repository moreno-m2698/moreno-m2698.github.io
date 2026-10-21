<script setup lang="ts">
import { site } from '~~/content/site'
import type { Article } from '#shared/types/article'

definePageMeta({ key: route => route.fullPath })

const slug = String(useRoute().params.slug)
const { data } = await useFetch<Article>(`/api/article/${slug}`)
if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}
const article = data.value

usePageSeo({
  title: article.title,
  description: article.description || site.description,
  type: 'article',
})
</script>

<template>
  <article :lang="article.lang !== 'en' ? article.lang : undefined">
    <header>
      <h1>{{ article.title }}</h1>
      <p class="meta">
        <time :datetime="article.date">{{ formatDate(article.date) }}</time> · {{ article.readingMinutes }} min read
      </p>
      <p
        v-if="article.updated"
        class="meta"
      >
        Updated on <time :datetime="article.updated">{{ formatDate(article.updated) }}</time>
      </p>
      <ul
        v-if="article.tags.length"
        class="tags"
        aria-label="Tags"
      >
        <li
          v-for="tag in article.tags"
          :key="tag"
        >
          #{{ tag }}
        </li>
      </ul>
    </header>
    <!-- eslint-disable vue/no-v-html -- trusted repo content (constitution III) -->
    <div
      class="prose"
      v-html="article.bodyHtml"
    />
    <!-- eslint-enable vue/no-v-html -->
  </article>
</template>

<style scoped>
.meta {
  color: var(--color-text-muted);
  font-size: var(--font-size-0);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-3);
  margin: var(--space-2) 0 0;
  padding: 0;
  list-style: none;
  font-size: var(--font-size-0);
  color: var(--color-text-muted);
}
</style>
