<script setup lang="ts">
import { site } from '~~/content/site'

const resumeUrl = assetUrl('/resume.pdf')

usePageSeo({ description: site.description })
</script>

<template>
  <section>
    <hgroup>
      <h1>
        Rain n' roses
      </h1>
      <p>The personal site and portfolio of Portland-based full-stack software engineer Michael Moreno</p>
    </hgroup>
    <nav>
      <ul>
        <li>
          <a :href="resumeUrl">Resume</a>
        </li>
        <li>
          <NuxtLink to="/projects">Projects</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about">About</NuxtLink>
        </li>
      </ul>
    </nav>
  </section>
  <section>
    <h2>
      About Me
    </h2>
    <p>
      I am a software developer currently based in the area surrounding Portland, Oregon.
    </p>
    <h3>Where to find me</h3>
    <ul>
      <li>
        <a :href="site.contact.githubUrl">GitHub</a>
      </li>
      <li>
        <a :href="resumeUrl">Resume</a>
      </li>
      <li>
        <a :href="site.contact.linkedinUrl">LinkedIn</a>
      </li>
    </ul>
  </section>
    <!-- Font comparison (temporary). A font that isn't available falls back to the browser default. -->
    <h2>Generic families</h2>
    <ul>
      <li><code>serif</code><p style="font-family: serif">Hello World</p></li>
      <li><code>sans-serif</code><p style="font-family: sans-serif">Hello World</p></li>
      <li><code>monospace</code><p style="font-family: monospace">Hello World</p></li>
      <li><code>cursive</code><p style="font-family: cursive">Hello World</p></li>
      <li><code>fantasy</code><p style="font-family: fantasy">Hello World</p></li>
      <li><code>system-ui</code><p style="font-family: system-ui">Hello World</p></li>
      <li><code>emoji</code><p style="font-family: emoji">Hello World 👋🌍</p><span>Chrome, Edge, Safari</span></li>
    </ul>
</template>

<style scoped src="../assets/css/pages/index.css"></style>
