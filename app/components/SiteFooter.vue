<script setup lang="ts">
import { site } from '~~/content/site'
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <ul class="contact-links">
        <li><a :href="site.contact.linkedinUrl">LinkedIn</a></li>
        <li><a :href="site.contact.githubUrl">GitHub</a></li>
        <li><a :href="`mailto:${site.contact.email}`">Email</a></li>
      </ul>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: var(--border-width) solid var(--color-border);
  padding-block: var(--space-6);
}

.contact-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
