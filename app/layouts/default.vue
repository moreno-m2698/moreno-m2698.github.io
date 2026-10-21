<template>
  <div class="site">
    <a
      class="skip-link"
      href="#main"
    >Skip to content</a>
    <SiteHeader />
    <main
      id="main"
      class="container site-main"
      tabindex="-1"
    >
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.site-main {
  padding-block: var(--space-7);
}
</style>
