// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['scripts/**/*.mjs'],
  languageOptions: { globals: { process: 'readonly', console: 'readonly', URL: 'readonly' } },
})
