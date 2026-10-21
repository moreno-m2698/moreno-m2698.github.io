<script setup lang="ts">
import { site } from '~~/content/site'

usePageSeo({ title: 'About', description: `About ${site.name}: background, skills and experience.` })
</script>

<template>
  <div>
    <h1>About</h1>
    <section>
      <h2>Bio</h2>
      <p>PLACEHOLDER: a short bio.</p>
    </section>
    <section>
      <h2>Skills</h2>
      <p>PLACEHOLDER: main skills and tools.</p>
    </section>
    <section>
      <h2>Experience</h2>
      <p>PLACEHOLDER: roles, employers and dates.</p>
    </section>
    <section>
      <h2>Currently learning</h2>
      <p>PLACEHOLDER: what you are learning now.</p>
    </section>
  </div>
</template>
