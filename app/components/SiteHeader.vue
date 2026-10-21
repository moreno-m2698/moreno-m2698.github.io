<script setup lang="ts">
import { site } from '~~/content/site'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/articles', label: 'Articles' },
  { to: '/resume', label: 'Resume' },
]
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <NuxtLink
        to="/"
        class="site-name"
      >{{ site.name }}</NuxtLink>
      <nav aria-label="Main">
        <ul class="site-nav">
          <li
            v-for="link in links"
            :key="link.to"
          >
            <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
      <ClientOnly>
        <ThemeToggle />
        <template #fallback>
          <span
            class="theme-toggle-placeholder"
            aria-hidden="true"
          >Dark theme</span>
        </template>
      </ClientOnly>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  border-bottom: var(--border-width) solid var(--color-border);
}

.site-header__inner {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
  padding-block: var(--space-4);
}

.site-name {
  font-weight: var(--font-weight-bold);
  text-decoration: none;
  color: var(--color-text);
}

.site-nav {
  margin: 0;
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1) var(--space-3);
}

.site-nav a {
  display: inline-block;
  padding-block: var(--space-2);
}

.site-nav a[aria-current="page"] {
  font-weight: var(--font-weight-bold);
}

.theme-toggle-placeholder {
  min-block-size: 2.75rem;
  padding: var(--space-2) var(--space-3);
  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-1);
  visibility: hidden;
}

@media (min-width: 40rem) {
  .site-header__inner {
    justify-content: space-between;
    flex-wrap: nowrap;
  }
}
</style>
