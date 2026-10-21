<script setup lang="ts">
import { site } from '~~/content/site'

const resumeUrl = assetUrl('/resume.pdf')

usePageSeo({ title: 'Resume', description: `Resume of ${site.name}, available as a PDF.` })
</script>

<template>
  <div>
    <h1>Resume</h1>
    <p>My resume is available as a PDF.</p>
    <p><a :href="resumeUrl">Download resume (PDF)</a></p>
  </div>
</template>
