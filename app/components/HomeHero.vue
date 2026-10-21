<script setup lang="ts">
import { site } from '~~/content/site'
</script>

<template>
  <section class="hero">
    <h1>{{ site.name }}</h1>
    <p class="hero__title">
      {{ site.jobTitle }}
    </p>
    <p>{{ site.tagline }}</p>
    <ContactLinks include-resume />
  </section>
</template>

<style scoped>
.hero__title {
  font-size: var(--font-size-2);
  color: var(--color-text-muted);
}

.hero > * + * {
  margin-block-start: var(--space-4);
}
</style>
