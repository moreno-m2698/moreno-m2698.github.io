<script setup lang="ts">
import { site } from '~~/content/site'

const props = withDefaults(defineProps<{ includeResume?: boolean }>(), { includeResume: false })

const resumeUrl = assetUrl('/resume.pdf')
</script>

<template>
  <ul class="contact-links">
    <li v-if="props.includeResume">
      <a :href="resumeUrl">Resume (PDF)</a>
    </li>
    <li><a :href="site.contact.linkedinUrl">LinkedIn</a></li>
    <li><a :href="site.contact.githubUrl">GitHub</a></li>
    <li><a :href="`mailto:${site.contact.email}`">Email</a></li>
  </ul>
</template>

<style scoped>
.contact-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
