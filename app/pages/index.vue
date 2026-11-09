<script setup lang="ts">
import { site } from '~~/content/site'

usePageSeo({ description: site.description })
</script>

<template>
  <div class="home">
    <h1>{{ site.name }}</h1>
  </div>
</template>

<style scoped src="../assets/css/pages/index.css"></style>
