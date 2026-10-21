<script setup lang="ts">
import { projects } from '~~/content/projects'
import { site } from '~~/content/site'

usePageSeo({ title: 'Projects', description: `Projects by ${site.name}.` })
</script>

<template>
  <div>
    <h1>Projects</h1>
    <ul
      v-if="projects.length"
      class="project-grid"
    >
      <li
        v-for="project in projects"
        :key="project.name"
      >
        <ProjectCard :project="project" />
      </li>
    </ul>
    <p v-else>
      No projects yet.
    </p>
  </div>
</template>

<style scoped>
.project-grid {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: 1fr;
  margin: var(--space-5) 0 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 40rem) {
  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
