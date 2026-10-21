<script setup lang="ts">
import type { ArticleMeta } from '#shared/types/article'

const props = withDefaults(defineProps<{ articles: ArticleMeta[], headingLevel?: 2 | 3 }>(), { headingLevel: 2 })

const headingTag = computed(() => `h${props.headingLevel}`)
</script>

<template>
  <ul class="article-list">
    <li
      v-for="article in props.articles"
      :key="article.slug"
    >
      <article>
        <component :is="headingTag">
          <NuxtLink :to="`/articles/${article.slug}`">{{ article.title }}</NuxtLink>
        </component>
        <p class="meta">
          <time :datetime="article.date">{{ formatDate(article.date) }}</time> · {{ article.readingMinutes }} min read
        </p>
        <p>{{ article.description }}</p>
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
      </article>
    </li>
  </ul>
</template>

<style scoped>
.article-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.article-list > li + li {
  margin-block-start: var(--space-6);
}

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
