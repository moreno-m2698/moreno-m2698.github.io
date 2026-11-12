<template>
  <div class="site">
    <a
      class="skip-link"
      href="#main"
    >Skip to content</a>
    <SiteHeader />
    <main
      id="main"
      class="container"
      tabindex="-1"
    >
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
