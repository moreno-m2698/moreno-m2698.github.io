<script setup lang="ts">
import type { Project } from '~~/content/projects'

const props = defineProps<{ project: Project }>()

const imageSrc = computed(() => props.project.image ? assetUrl(props.project.image.src) : undefined)
</script>

<template>
  <article class="card">
    <h2>{{ project.name }}</h2>
    <img
      v-if="project.image"
      :src="imageSrc"
      :alt="project.image.alt"
      :width="project.image.width"
      :height="project.image.height"
      loading="lazy"
    >
    <p>{{ project.summary }}</p>
    <ul
      class="stack"
      aria-label="Tech stack"
    >
      <li
        v-for="item in project.stack"
        :key="item"
      >
        {{ item }}
      </li>
    </ul>
    <p class="card__links">
      <a :href="project.repoUrl">Source code<span class="visually-hidden"> for {{ project.name }}</span></a>
      <template v-if="project.demoUrl">
        ·
        <a :href="project.demoUrl">Live demo<span class="visually-hidden"> of {{ project.name }}</span></a>
      </template>
    </p>
  </article>
</template>

<style scoped>
.card {
  height: 100%;
  padding: var(--space-5);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-2);
}

.card > * + * {
  margin-block-start: var(--space-3);
}

.card h2 {
  font-size: var(--font-size-2);
}

.stack {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--font-size-0);
}

.stack li {
  padding: var(--space-1) var(--space-2);
  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-1);
}

.card img {
  max-width: 100%;
  height: auto;
}
</style>
