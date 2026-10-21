<script setup lang="ts">
import { THEME_SCRIPT } from '~/utils/theme-script'

useHead({
  meta: [{ name: 'color-scheme', content: 'light dark' }],
  link: [{ rel: 'icon', href: 'data:,' }],
  script: [{ innerHTML: THEME_SCRIPT, tagPriority: 'critical' }],
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout><NuxtPage /></NuxtLayout>
</template>
