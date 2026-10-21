<script setup lang="ts">
const homeUrl = assetUrl('/')
</script>

<template>
  <section>
    <h1>Page not found</h1>
    <p>The page you were looking for does not exist or has moved.</p>
    <p><a :href="homeUrl">Go to the home page</a></p>
  </section>
</template>
