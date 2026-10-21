<script setup lang="ts">
import { THEME_STORAGE_KEY } from '~/utils/theme-script'

const isDark = ref(false)
let media: MediaQueryList | undefined

// Follows the OS theme, but only while no explicit choice is set on <html>.
function onSystemThemeChange(event: MediaQueryListEvent) {
  if (!document.documentElement.dataset.theme) isDark.value = event.matches
}

onMounted(() => {
  const explicit = document.documentElement.dataset.theme
  media = window.matchMedia('(prefers-color-scheme: dark)')
  if (explicit === 'light' || explicit === 'dark') {
    isDark.value = explicit === 'dark'
  }
  else {
    isDark.value = media.matches
  }
  media.addEventListener('change', onSystemThemeChange)
})

onBeforeUnmount(() => {
  media?.removeEventListener('change', onSystemThemeChange)
})

function toggle() {
  const next = isDark.value ? 'light' : 'dark'
  document.documentElement.dataset.theme = next
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next)
  }
  catch {
    // Storage is unavailable (private mode or blocked): the choice applies for this page view only.
  }
  isDark.value = !isDark.value
}
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-pressed="isDark ? 'true' : 'false'"
    @click="toggle"
  >
    Dark theme
  </button>
</template>

<style scoped>
.theme-toggle {
  min-block-size: 2.75rem;
  padding: var(--space-2) var(--space-3);
  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-1);
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.theme-toggle[aria-pressed="true"] {
  background: var(--color-surface);
}
</style>
