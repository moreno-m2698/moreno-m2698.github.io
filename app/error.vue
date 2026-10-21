<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const homeUrl = assetUrl('/')
const isNotFound = props.error.statusCode === 404

usePageSeo({
  title: isNotFound ? 'Page not found' : 'Something went wrong',
  description: isNotFound ? 'This page does not exist.' : 'Something went wrong on this page.',
  noindex: true,
})
</script>

<template>
  <NuxtLayout>
    <NotFound v-if="isNotFound" />
    <section v-else>
      <h1>Something went wrong</h1>
      <p><a :href="homeUrl">Go to the home page</a></p>
    </section>
  </NuxtLayout>
</template>
