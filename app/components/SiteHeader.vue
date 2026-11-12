<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <ClientOnly>
        <ThemeToggle />
        <template #fallback>
          <span
            class="theme-toggle-placeholder"
            aria-hidden="true"
          >Switch to light theme</span>
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
  justify-content: flex-end;
  align-items: center;
}

.theme-toggle-placeholder {
  min-block-size: 2.75rem;
  padding: var(--space-2) var(--space-3);
  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-1);
  visibility: hidden;
}
</style>
