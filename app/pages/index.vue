<script setup lang="ts">
import { site } from '~~/content/site'

const resumeUrl = assetUrl('/resume.pdf')
usePageSeo({ description: site.description })
</script>

<template>
  <div class="home">
    <section class="home-hero">
      <hgroup>
        <h1 class="home-hero__title">
          <span class="segment segment--first">Michael</span>
          <span class="segment segment--second">Moreno</span>
        </h1>
        <p class="home-hero__description">
          The portfolio site of Portland-based full-stack software engineer Michael Moreno
        </p>
      </hgroup>
    </section>
    <section class="home-about reveal-links">
      <h2 class="home-about__title">
        About me
      </h2>
      <div class="home-about__content">
        <p>Greetings! I'm Michael, a full-stack developer in the PNW who's interested in creating applications that are thoughtful, functional, and accessible to all.</p>
        <div>
          <h3>What I know</h3>
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
        </div>
        <div>
          <h3>Where to find me</h3>
          <ul>
            <li><a :href="site.contact.githubUrl">GitHub</a></li>
            <li><a :href="resumeUrl">Resume</a></li>
            <li><a :href="site.contact.linkedinUrl">LinkedIn</a></li>
          </ul>
        </div>
      </div>
    </section>
    <section class="home-projects reveal-links">
      <h2 class="home-projects__title">
        Projects
      </h2>
      <div class="home-projects__content">
        <div>
          <h3>Full-Stack Match Analytics App</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <a href="https://github.com/moreno-m2698">Full-Stack Match Analytics App on GitHub</a>
        </div>
        <div>
          <h3>Discord Media Manager Bot</h3>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <a href="https://github.com/moreno-m2698">Discord Media Manager Bot on GitHub</a>
        </div>
        <div>
          <h3>Full-Stack Music Web App</h3>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          <a href="https://github.com/moreno-m2698">Full-Stack Music Web App on GitHub</a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped src="../assets/css/pages/index.css"></style>
