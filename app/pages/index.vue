<script setup lang="ts">
import { site } from '~~/content/site'

const resumeUrl = assetUrl('/resume.pdf')
const firImageUrl = assetUrl('/douglas-fir-stock-photo.jpg')

usePageSeo({ description: site.description })
</script>

<template>
  <section class="home-hero">
    <hgroup>
      <h1 class="home-hero__title">
        <span class="segment segment--first">Michael</span>
        <span class="segment segment--second">Moreno</span>
      </h1>
      <p class="home-hero__description">The portfolio site of Portland-based full-stack software engineer Michael Moreno</p>
    </hgroup>
  </section>    
     <nav class="home-nav">
      <ul>
        <li><a :href="resumeUrl">Resume</a></li>
        <li><NuxtLink to="/projects">Projects</NuxtLink></li>
        <li><NuxtLink to="/about">About</NuxtLink></li>
      </ul>
    </nav>
  <section class="home-about">
    <h2>About the developer</h2>
    <p>I'm Michael, full-stack developer with experience working in the software solutions space.</p>
    <h3>What I am good at</h3>
    <ul>
      <li>JavaScript & TypeScript</li>
      <li>HTML & CSS</li>
      <li>React.js & Vue.js</li>
      <li>Java</li>
      <li>Python</li>
      <li>PHP</li>
      <li>Spring Boot</li>
      <li>Web Content Accessibility Guidelines 2.1 (WCAG)</li>
      <li>AWS</li>
    </ul>
    <h3>Where to find me</h3>
    <ul>
      <li><a :href="site.contact.githubUrl">GitHub</a></li>
      <li><a :href="resumeUrl">Resume</a></li>
      <li><a :href="site.contact.linkedinUrl">LinkedIn</a></li>
    </ul>
  </section>
</template>

<style scoped src="../assets/css/pages/index.css"></style>
