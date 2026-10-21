# Milestone 1 plan: scaffold, layout, skeleton pages, article loading, Phase 1 checks

## Status (2026-10-20): read this first when resuming

- **Plan status: approved by the user on 2026-10-20** (including the pnpm 12 updates).
- **Progress:** Batch A done on 2026-10-20 (typecheck, lint, validate:html and generate pass; negative article checks verified). Changes made during A: TypeScript pinned to 6.x, `@types/node@^24` added, the `fileURLToPath` import moved to C1.
- **Batch B written and partly verified on 2026-10-20.** typecheck, lint and validate:html pass. `pnpm generate` fails **as expected** until Batch C, because the nav links to `/about`, `/projects`, `/articles` and `/resume` (the crawler has `failOnError: true`). By the user's decision, the CSP step was checked by running `node scripts/postgenerate.mjs` by hand on the partial output: the CSP meta comes right after `<meta charset>`, there are 4 inline scripts and 4 matching hashes, `200.html` is removed, and a second run is refused. Confirmed: `404.html` from `nuxt generate` is a JavaScript-only shell (`<div id="__nuxt"></div>`), so C13 is needed.
- **Carried over to Batch C:** run the rest of B17 (a full `pnpm generate`, then in `pnpm preview`: no CSP console errors, toggle persistence with no flash, OS theme following, no-JS nav, skip link focus, 320px layout) together with C14.
- Change during B: the layout has a single root `<div class="site">` (B11).
- **Batch C written and verified on 2026-10-20** (except browser checks). lint, typecheck and validate:html pass. `pnpm generate` and `pnpm generate:fixtures` each passed 5 of 5 runs, with each page rendered once. Every HTML file has its CSP right after charset, with hashes equal to its inline scripts. Every route has a `_payload.json`. The deploy build has no fixtures, "No articles yet", and no latest-articles section. Metadata fallbacks and the malformed-date failure were verified, and the preview server checks pass. Changes during C: the crawler is off with explicit routes (C1, Nitro bug), `usePageSeo` has `noindex` for error pages (C11), and `getFirstCommitDate` never throws. The page descriptions the implementer wrote were accepted as placeholders until the real copy is written.
- **Still open from B17/C14 (needs a browser):** no CSP console errors; theme toggle persistence with no flash; following the OS theme; with JavaScript disabled, the pages, nav and 404 are readable; skip link focus; 320px layout with no horizontal scroll; client-side navigation between pages. Next: these checks, then Batch D.
- **Toolchain: ready.** Node **v24.22.0** (via nvm-windows) and pnpm **12.14.0** (via Corepack) are installed. The plan has been updated for pnpm 12 (see "Environment findings").
- **Manual step still needed before Batch D (not before Batch A):** on GitHub, set repo Settings → Pages → Source → **GitHub Actions** (one-time).
- **Questions:** all 7 in section 6 were answered on 2026-10-20 (spec Q22–Q30). Question 3 changed the plan: articles now follow a metadata standard (constitution III).
- **Next steps:**
  1. Implement Batch A → D in order, following the workflow in `CLAUDE.md` (`implementer` per batch, then `test-runner`; checks at the end of each batch). Work on a branch; commit or push only when the user asks.
- **Subagents:** the agents in `.claude/agents/` load at session start. If one isn't found, run it as a general-purpose agent with the same model and tell it to follow that agent's file.
- Decisions Q14–Q21 (spec) and constitution v0.16.0 are committed. Q22–Q32 and constitution v1.1.1 (article metadata standard, Technical Baseline, TypeScript 6 pin) are committed on the `milestone-1` branch.

---

## Environment findings (read before Batch A)

- **Node v24.22.0** (Node 24 LTS) is active via nvm-windows; other versions are also installed, so `nvm use` switches machine-wide. **pnpm 12.14.0** is enabled through Corepack.
- **pnpm 12 differences from the pnpm 10 this plan was first written for** (tested 2026-10-20 in a scratch project):
  - pnpm settings in **`.npmrc` are ignored** (`shell-emulator`, `engine-strict` read as `undefined`). Settings go in **`pnpm-workspace.yaml`** in camelCase (`shellEmulator`, `engineStrict`). That file works without a `packages` field for a single-package repo.
  - The **`"pnpm"` field in `package.json` is no longer read** (pnpm warns and ignores it), and `onlyBuiltDependencies` is not honored in `pnpm-workspace.yaml` either. Build-script approval is the **`allowBuilds`** map in `pnpm-workspace.yaml` (`esbuild: true`), which `pnpm approve-builds <pkg>` writes.
  - Unapproved build scripts are now an **error** (`ERR_PNPM_IGNORED_BUILDS`, exit 1), not a warning, so the install fails until they are approved.
  - With `shellEmulator: true`, `FOO=1 cmd` scripts work on Windows. With `engineStrict: true`, a root `engines` mismatch fails the install (`ERR_PNPM_UNSUPPORTED_ENGINE`).
  - `pnpm run` first checks that dependencies are installed and installs them if not (`verifyDepsBeforeRun`). This is harmless here.
- `core.autocrlf=true`. Every file in the git index is already LF. Adding `.gitattributes` is safe. **Do NOT run** `git add --renormalize`, `git checkout -- .` or any re-checkout without checking `git status` first, so no uncommitted edits are overwritten. The implementer must not touch `constitution.md` or `portfolio-spec.md`.

---

## 1. Features covered and principles that apply

**Features**
- Skeleton or full in this milestone: F-01, F-02, F-03, F-08/F-09 (skeleton card), F-10 (basic list), F-14, F-15, F-19, F-20, F-21, F-22.
- Partly covered:
  - F-24: titles, descriptions, canonical URL and semantic markup are in; the sitemap is not.
  - F-25: OG and Twitter "summary" tags, with no image yet.
- Placeholder sections only: F-04 to F-07 (About).
- **Not in this milestone:** F-11 (tag filter), F-12 (search), F-13 (series links), F-16 (Shiki), F-17/F-18 (images, diagrams), F-23 (motion).

**Principles**
- I: accessibility, axe in CI.
- II: static-first, works without JavaScript, per-page meta tags.
- III: HTML articles, `<head>` metadata, fallbacks, slugs.
- IV: plain CSS, tokens, mobile-first, `.prose`.
- V: no heavy client JS.
- VI: CSP, no third-party code.
- VII: few dependencies.
- VIII: Phase 1 gates.
- Hosting: base URL, static `404.html`, `fetch-depth: 0`.

## 2. Key decisions, with dependency justifications

**Dependencies (devDependencies unless noted)**

| Package | Justification |
|---|---|
| `nuxt@^4`, `vue`, `vue-router` (dependencies) | The framework (decided). Pin `^4` because Nuxt 5 may exist by now. |
| `typescript@^6.0`, `vue-tsc` | Required by `nuxt typecheck` for the strict TypeScript gate. **TypeScript is pinned to 6.x** (user decision, 2026-10-20): TypeScript 7 is the latest release, but typescript-eslint 8.72 (used by `@nuxt/eslint`) only supports `<6.1.0`. Revisit when typescript-eslint supports 7. |
| `@types/node@^24` | Node type definitions for `nuxt.config.ts` (`node:fs`, `node:url`, `process`); without it `nuxt typecheck` fails with TS2591. Types only, never shipped. Added in A3 with the user's approval (2026-10-20). |
| `eslint`, `@nuxt/eslint` | Linting, plus formatting through its built-in stylistic rules, so Prettier isn't needed. |
| `html-validate` | The article HTML validation gate (named in the constitution). |
| `node-html-parser` | A small, fast HTML parser used at build time for article metadata and body extraction, and reused by the link checker. Much lighter than cheerio or jsdom. It never ships to the browser. |
| `@playwright/test` | Headless Chromium for the axe scan. The same package covers Phase 2 end-to-end tests, so it isn't a second tool later. |
| `@axe-core/playwright` | The axe engine the constitution requires, driven through Playwright. |

**Deliberately not added:**
- **linkinator:** replaced by a ~60-line `scripts/check-links.mjs` that reuses node-html-parser.
- **pa11y-ci:** pulls in Puppeteer as a second browser stack; Playwright + axe is already proposed in the constitution.
- **cross-env:** replaced by pnpm's built-in `shellEmulator: true` (in `pnpm-workspace.yaml`), which makes `FOO=1 cmd` work on Windows.
- **serve / http-server:** replaced by a ~50-line `node:http` static server.
- **prettier, @nuxt/fonts, @nuxt/image, sitemap:** not needed this milestone.

**Directory layout (Nuxt 4)**
- `app/` is the source directory. In Nuxt 4, `~` points to `app/`, `~~` to the repo root, and `#shared` to `shared/`.
- `server/`, `shared/`, `public/`, `content/`, `scripts/` and `tests/` all sit at the root.

**Base URL**
- `deploy.config.json` at the root holds `{ "baseURL": "/portfolio/" }`. It is the single source, read by both `nuxt.config.ts` and the Node scripts. The env var `NUXT_APP_BASE_URL` overrides it.
- Local checks also run under `/portfolio/`, so any hard-coded root path is caught.
- When the custom domain arrives, change the value to `/`.

**Article loading**
- Nitro server routes read and parse the HTML files during prerender:
  - `/api/articles` returns the metadata list.
  - `/api/article/<slug>` returns one article. It uses the singular `article` on purpose: if it were `articles/<slug>`, the prerendered `api/articles` file would clash with a directory of the same name.
- Pages call `useFetch`. `nuxt generate` writes each result into the page's payload, so nothing runs on the server at runtime.

**Fixture mechanism**
- With the env flag `PORTFOLIO_FIXTURES=1`, `nuxt.config.ts` adds `tests/fixtures/articles/` to `runtimeConfig.articleDirs`.
- `pnpm dev` and `pnpm generate:fixtures` (used by `pnpm check`) set the flag. Plain `pnpm generate` (the deploy build) does not.
- In CI, `scripts/verify-no-fixtures.mjs` fails the deploy job if any fixture slug appears in the output.

**CSP**
- The CSP is added **after the build**, by `scripts/postgenerate.mjs`. Nuxt emits inline scripts of its own (the `window.__NUXT__` config, and possibly an import map) in addition to the theme script, so a fixed hash can't work.
- The script hashes every inline `<script>` in each HTML file and inserts a `<meta http-equiv="Content-Security-Policy">` right after `<meta charset>`.
- Because the CSP exists only in the built output, `nuxt dev` is unaffected.
- `style-src 'unsafe-inline'` is a deliberate, documented gap: Nuxt inlines component CSS, and Vue style bindings can't be hashed.

**404 page**
- `nuxt generate` writes `404.html` (and `200.html`) as a JavaScript-only SPA shell, which breaks Principle II. *Verify this in Batch C.*
- Instead, `app/pages/404.vue` is prerendered to `404/index.html`, and `postgenerate.mjs` copies it over `404.html` and deletes `200.html`.
- `app/error.vue` renders the same `NotFound` component, so a real 404 on GitHub Pages looks the same after hydration.

**Theme**
- Tokens use the CSS `light-dark()` function, so each color is defined once:
  - `:root { color-scheme: light dark }`
  - `[data-theme="light"] { color-scheme: light }`
  - `[data-theme="dark"] { color-scheme: dark }`
- `light-dark()` is supported in the last two versions of every target browser.
- An inline head script applies a stored choice before first paint.
- The toggle is a `<button aria-pressed>` rendered inside `<ClientOnly>`, with a same-size invisible fallback so there is no layout shift. Without JavaScript, no dead button is shown.

**Articles list**
- Search and tag *controls* are omitted (no non-working placeholders). Tags are shown as text on each item.

---

## 3. Batches

Each batch ends with its own checks. **After every batch, run `pnpm lint:fix`, then all scripts that exist so far.** Use pnpm only, and don't commit.

### BATCH A: scaffold and tooling

**A0 (prerequisite, user or cli-runner)**
- Node 24 LTS and pnpm are installed.
- `node -v` prints v24.x.

**A1. Write these files by hand.** Don't use `nuxi init`: the directory isn't empty, and `--force` is risky here.

1. **`.gitattributes`**
   ```
   * text=auto eol=lf
   *.pdf binary
   *.png binary
   *.jpg binary
   *.jpeg binary
   *.webp binary
   *.avif binary
   *.ico binary
   *.woff2 binary
   ```

2. **`.gitignore`**
   ```
   node_modules/
   .nuxt/
   .output/
   .nitro/
   .cache/
   .data/
   dist/
   logs/
   *.log
   .env
   .env.*
   !.env.example
   .DS_Store
   .idea/
   .vscode/*
   !.vscode/extensions.json
   test-results/
   playwright-report/
   ```

3. **`.nvmrc`:** `24`

4. **`pnpm-workspace.yaml`** (pnpm 12 reads its settings here, not from `.npmrc`; no `.npmrc` is needed)
   ```yaml
   shellEmulator: true
   engineStrict: true
   ```
   A2 adds an `allowBuilds` map to this file.

5. **`deploy.config.json`:** `{ "baseURL": "/portfolio/" }`

6. **`package.json`**
   - Fields: `"name": "portfolio"`, `"private": true`, `"type": "module"`.
   - `"engines": { "node": ">=24 <25", "pnpm": ">=12" }`
   - `"packageManager": "pnpm@<exact version from pnpm --version>"`
   - Scripts:
     ```
     "postinstall": "nuxt prepare",
     "dev": "PORTFOLIO_FIXTURES=1 nuxt dev",
     "generate": "nuxt generate",
     "build": "pnpm generate",
     "typecheck": "nuxt typecheck",
     "lint": "eslint . --max-warnings 0",
     "lint:fix": "eslint . --fix",
     "validate:html": "html-validate \"content/articles/**/*.html\" \"tests/fixtures/articles/**/*.html\" && node scripts/check-article-rules.mjs"
     ```

7. **`tsconfig.json`** (the Nuxt 4 template):
   ```json
   { "files": [], "references": [
     { "path": "./.nuxt/tsconfig.app.json" }, { "path": "./.nuxt/tsconfig.server.json" },
     { "path": "./.nuxt/tsconfig.shared.json" }, { "path": "./.nuxt/tsconfig.node.json" } ] }
   ```
   *Verify against the current `nuxi init` template*, for example by scaffolding into the scratchpad and comparing.

8. **`nuxt.config.ts`** (initial version):
   ```ts
   import { readFileSync } from 'node:fs'

   const deployConfig = JSON.parse(readFileSync(new URL('./deploy.config.json', import.meta.url), 'utf8')) as { baseURL: string }
   let baseURL = process.env.NUXT_APP_BASE_URL || deployConfig.baseURL
   if (!baseURL.startsWith('/')) baseURL = `/${baseURL}`
   if (!baseURL.endsWith('/')) baseURL = `${baseURL}/`

   export default defineNuxtConfig({
     compatibilityDate: '2026-10-20',
     devtools: { enabled: true },
     modules: ['@nuxt/eslint'],
     app: { baseURL, head: { htmlAttrs: { lang: 'en' } } },
     typescript: { strict: true, typeCheck: false, tsConfig: { include: ['../content/**/*'] } },
     eslint: { config: { stylistic: true } },
     nitro: { prerender: { crawlLinks: true, failOnError: true } },
   })
   ```
   Don't import `fileURLToPath` yet: lint fails on an unused import. C1 adds it. ESLint's `nuxt/nuxt-config-keys-order` rule reorders the keys (e.g. `modules` first); let `pnpm lint:fix` do that.

9. **`eslint.config.mjs`**
   ```js
   // @ts-check
   import withNuxt from './.nuxt/eslint.config.mjs'
   export default withNuxt({
     files: ['scripts/**/*.mjs'],
     languageOptions: { globals: { process: 'readonly', console: 'readonly', URL: 'readonly' } },
   })
   ```
   If lint reports `no-undef` for another Node global used in the scripts, add it to this list.

10. **`.htmlvalidate.json`**
    ```json
    { "extends": ["html-validate:recommended"],
      "rules": { "doctype-style": ["error", { "style": "lowercase" }],
                 "heading-level": ["error", { "minInitialRank": "h2" }] } }
    ```
    - The `doctype-style` change matches the constitution's lowercase doctype.
    - The `heading-level` change is needed because articles start at `<h2>`.
    - Don't relax any other rule. If one conflicts with the constitution, report it.

11. **`app/app.vue`** (temporary): `<template><NuxtPage /></template>`

12. **`app/pages/index.vue`** (temporary): `<h1>Portfolio</h1>` plus `useHead({ title: 'Portfolio' })`.

13. **`content/articles/.gitkeep`:** an empty file.

14. **`tests/fixtures/articles/sample-article.html`**
    - A complete document: `<!doctype html>`, `<html lang="en">`, and a `<head>` containing:
      - `<meta charset="utf-8">`
      - `<title>Sample article (test fixture)</title>`
      - `<meta name="description" content="A test-only article used to check the article pipeline. Never published.">`
      - `<meta name="date" content="2026-10-20">`
      - `<meta name="updated" content="2026-10-21">`
      - `<meta name="tags" content="#testing #fixtures/sample">` (exercises `#`, nesting and the metadata standard)
    - The `<body>` contains:
      - an intro `<p>`
      - an `<h2>`, then a `<p>` with an external link and `<code>`
      - a `<ul>` with two items
      - a short **one-line** `<pre><code class="language-ts">const answer: number = 42</code></pre>`, kept short so the block doesn't scroll, which axe would flag
      - an `<h3>`, then a `<blockquote><p>…</p></blockquote>`
    - No `<h1>`, `<nav>`, `<style>` or `<script>`. Void tags are written without `/`, and there's no trailing whitespace.

15. **`tests/fixtures/articles/minimal-article.html`**
    - Only `<meta charset>` and `<title>Minimal article (test fixture)</title>`: no description, date, updated, series or tags.
    - The body has two `<p>`s. The first is more than 200 characters long, to exercise summary truncation. This fixture tests the fallbacks.

16. **`shared/utils/article-meta.ts`**: the article metadata standard (constitution III, spec Q24–Q26) as one pure module. It is the single source for both the build (C5) and the CI article check (item 17).
    - **No imports, and only erasable TypeScript syntax** (no `enum`, `namespace` or parameter properties), so Node 24 can import the `.ts` file directly through its built-in type stripping.
    - Exports:
      - `ARTICLE_META_NAMES = ['description', 'date', 'updated', 'series', 'tags'] as const`
      - `readMetaMap(entries: Iterable<[name: string, content: string]>): Map<string, string>`: lowercases and trims names, trims content, **skips empty content** (empty counts as missing), and keeps the first occurrence.
      - `isIsoDate(value: string): boolean`: matches `/^\d{4}-\d{2}-\d{2}$/` **and** is a real calendar date (`new Date(\`${value}T00:00:00Z\`)` is valid and `toISOString().slice(0, 10) === value`, so `2026-02-30` fails).
      - `TAG_PATTERN = /^(?![\d/]+$)[\p{L}\p{N}_-]+(?:\/[\p{L}\p{N}_-]+)*$/u`: letters, numbers, `-`, `_`; `/` only between segments; not made only of numbers.
      - `parseTags(content: string): { tags: string[], errors: string[] }`: split on `/\s+/`, drop empties, strip **one** leading `#`, lowercase, test against `TAG_PATTERN` (an invalid token adds an error such as `invalid tag "#has,comma"`), and de-duplicate in first-seen order.
      - `validateArticleMeta(meta: Map<string, string>): string[]`: returns `` `${name}: ${problem}` `` for each recognized tag that is present but malformed: `date`/`updated` not `isIsoDate`, and every `parseTags` error. `description` and `series` accept any non-empty text. Unrecognized names are ignored.
      - `tagMatches(tag: string, filter: string): boolean`: `tag === filter || tag.startsWith(\`${filter}/\`)`. It's for F-11 later, but it belongs with the tag rules.

17. **`scripts/check-article-rules.mjs`**
    - Checks every `*.html` in `content/articles/` and `tests/fixtures/articles/`. A missing directory counts as empty.
    - Parse each file with `parse(html, { comment: false, blockTextElements: { script: true, noscript: true, style: true } })` from `node-html-parser`.
    - Import `readMetaMap` and `validateArticleMeta` from `'../shared/utils/article-meta.ts'` (Node 24 type stripping). If that import doesn't work, **stop and report**; don't copy the rules into the script.
    - Errors to report:
      - the file name, without `.html`, doesn't match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
      - `<html lang>` is missing or empty
      - `head title` is missing or has empty text
      - there's no `<body>`
      - `body` contains any of `nav`, `style`, `script` or `h1`
      - every message from `validateArticleMeta(readMetaMap(<head meta[name] → [name, content]>))`
    - Print `file: message` for each error and exit 1 if there were any. Otherwise print `N article file(s) OK`.

**A2. Install (cli-runner)**
1. `pnpm add nuxt@^4 vue vue-router`
2. `pnpm add -D typescript@^6.0 vue-tsc eslint @nuxt/eslint html-validate node-html-parser` (TypeScript 6, see section 2)
3. pnpm 12 fails the install with `ERR_PNPM_IGNORED_BUILDS` ("Ignored build scripts: …") until build scripts are approved. Approve exactly the listed packages with `pnpm approve-builds <pkg> <pkg> …` (expected: `esbuild`, `@parcel/watcher`, maybe `unrs-resolver`), which writes them to `allowBuilds` in `pnpm-workspace.yaml`. Then re-run `pnpm install`. **Report the list to the main session**; don't approve packages beyond the ones pnpm names, and don't use `--all`.
4. If `@nuxt/eslint` reports a peer conflict with ESLint 10, run `pnpm add -D eslint@^9`. (Done 2026-10-20: no conflict; ESLint 10.13 is supported. The build scripts approved were `esbuild` and `unrs-resolver`.)

**A3. Verify**
- [ ] `pnpm install` succeeds and runs `nuxt prepare`.
- [ ] `.nuxt/tsconfig.app.json` exists and its `include` contains `../content/**/*`.
- [ ] `pnpm typecheck`, `pnpm lint` and `pnpm validate:html` all pass. Also break a fixture on purpose and confirm validation fails for each, reverting after each one:
  - an `<h1>` in the body
  - `date` set to `Oct 5`, then to `2026-02-30`
  - `tags` containing `#123`, then `#vue//x`, then `#a,b`
  - Also confirm an **empty** `tags` or `date` (`content=""`) passes, because empty counts as missing.
- [ ] `pnpm generate` writes `.output/public/index.html`, and the asset URLs in it start with `/portfolio/_nuxt/`.
- [ ] `git ls-files --eol` shows new files as `i/lf`.

### BATCH B: tokens, global CSS, layout, theme, CSP

**B1. `content/site.ts`** (Q14, with placeholders clearly marked)
```ts
export interface SiteContact { linkedinUrl: string, githubUrl: string, email: string }
export interface Site { name: string, jobTitle: string, tagline: string, description: string, origin: string, contact: SiteContact }
// PLACEHOLDER values (spec Q14): replace before launch.
export const site: Site = {
  name: 'Your Name', jobTitle: 'Full-stack developer',
  tagline: 'PLACEHOLDER: one-line tagline.',
  description: 'Portfolio, projects and articles of a full-stack developer.',
  origin: 'https://moreno-m2698.github.io',
  contact: { linkedinUrl: 'https://www.linkedin.com/in/PLACEHOLDER', githubUrl: 'https://github.com/moreno-m2698', email: 'placeholder@example.com' },
}
```
Import it with `import { site } from '~~/content/site'`.

**B2. `app/assets/css/tokens.css`** (all on `:root`)

Start the file with a comment: "Breakpoints: 40rem, 64rem. Use literally in `@media (min-width: …)` only; never max-width for layout."

- **Theme setup:** `color-scheme: light dark`. Also add `:root[data-theme="light"]{color-scheme:light}` and `:root[data-theme="dark"]{color-scheme:dark}`.
- **Colors** (`light-dark(light, dark)`). All text pairs are AA or better.

  | Token | Light | Dark | Notes |
  |---|---|---|---|
  | `--color-bg` | `#ffffff` | `#121212` | |
  | `--color-surface` | `#f5f5f5` | `#1e1e1e` | |
  | `--color-text` | `#1a1a1a` | `#ececec` | |
  | `--color-text-muted` | `#555555` | `#a3a3a3` | about 7:1 on bg, at least 6.6:1 on surface |
  | `--color-border` | `#d4d4d4` | `#3a3a3a` | decorative only |
  | `--color-border-strong` | `#767676` | `#8a8a8a` | 3:1 or better, for UI component edges |
  | `--color-link` | `#1d4ed8` | `#8ab4f8` | 6.7:1 / 8.7:1 |
  | `--color-focus` | `#1d4ed8` | `#8ab4f8` | |

- **Fonts:**
  - `--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
  - `--font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`
- **Type scale:**
  - `--font-size-0: .875rem`, `--font-size-1: 1rem`, `--font-size-2: 1.25rem`, `--font-size-3: 1.5rem`, `--font-size-4: 2rem`, `--font-size-5: 2.5rem`
  - `--line-height-tight: 1.2`, `--line-height-base: 1.6`
  - `--font-weight-normal: 400`, `--font-weight-bold: 700`
- **Spacing:** `--space-1` to `--space-8` = `.25rem`, `.5rem`, `.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem`, `4rem`.
- **Radii and borders:** `--radius-1: .25rem`, `--radius-2: .5rem`, `--border-width: 1px`, `--focus-width: 3px`.
- **Layout:** `--measure: 65ch`, `--page-max: 64rem`.
- **Motion:** `--duration-fast: 150ms`, `--duration-base: 250ms`, `--easing-standard: cubic-bezier(.2,0,0,1)`.

**B3. `app/assets/css/reset.css`**
- `*,*::before,*::after { box-sizing: border-box }`
- Margin 0 on `body`, headings, `p`, `figure`, `blockquote`, `dl`, `dd`.
- `html { -webkit-text-size-adjust: 100%; text-size-adjust: 100% }`
- `img, svg, video { display: block; max-width: 100%; height: auto }`
- `input, button, textarea, select { font: inherit }`
- `p, h1, h2, h3, h4, li { overflow-wrap: break-word }` (prevents overflow at 320px)

**B4. `app/assets/css/base.css`**
- **Body:** background `--color-bg`, color `--color-text`, `--font-sans`, `--font-size-1`, `--line-height-base`.
- **Headings:** `--line-height-tight`. Sizes: `h1` = `--font-size-4`, rising to `--font-size-5` at `@media (min-width: 40rem)`; `h2` = `--font-size-3`; `h3` = `--font-size-2`.
- **Links:** color `--color-link`, `text-decoration: underline`, `text-underline-offset: .15em`.
- **Focus:** `:focus-visible { outline: var(--focus-width) solid var(--color-focus); outline-offset: 2px }`. Add `main:focus { outline: none }` (main is only a programmatic skip target).
- **`.container`:** `max-width: var(--page-max)`, `margin-inline: auto`, `padding-inline: var(--space-4)`; at `@media (min-width: 40rem)` the padding becomes `var(--space-6)`.
- **`.visually-hidden`:** the standard clip pattern.
- **`.skip-link`:** absolutely positioned, off-screen via `translateY(-200%)`, with surface background, padding and a border token. `.skip-link:focus { transform: none }`.
- **Motion:**
  - `@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth } }`
  - `@media (prefers-reduced-motion: reduce) { :root { --duration-fast: 0ms; --duration-base: 0ms } *,*::before,*::after { transition: none !important; animation: none !important; scroll-behavior: auto !important } }`

**B5. `app/assets/css/prose.css`** (everything under `.prose`)
- `.prose { max-width: var(--measure) }`
- Flow spacing: `.prose > * + * { margin-block-start: var(--space-4) }`. `.prose h2, .prose h3, .prose h4` get a larger top margin (`--space-7`, `--space-6`, `--space-5`) and `h4` uses `--font-size-1` bold.
- Lists: `ul, ol` get `padding-inline-start: var(--space-6)`.
- `blockquote`: left border `--color-border-strong`, padding `--space-4`, color `--color-text-muted`.
- `code`: `--font-mono`, `.9em`.
- `pre`: `--color-surface` background, padding `--space-4`, `--radius-2`, `overflow-x: auto`.
- Media: `figure` uses flow spacing; `figcaption` is `--font-size-0`, muted. `img` gets `--radius-1`.
- Also: `hr` (border token), and `table` (`border-collapse`, cell padding `--space-2`, border token).
- Note in a comment: scrollable `pre` blocks need keyboard access (handled when F-16 lands).

**B6. Register the CSS in `nuxt.config.ts`:**
`css: ['~/assets/css/tokens.css', '~/assets/css/reset.css', '~/assets/css/base.css', '~/assets/css/prose.css']`

**B7. `app/utils/theme-script.ts`**
```ts
export const THEME_STORAGE_KEY = 'theme'
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})()`
```

**B8. `app/components/ThemeToggle.vue`**
- Template: `<button type="button" class="theme-toggle" :aria-pressed="isDark ? 'true' : 'false'" @click="toggle">Dark theme</button>`. The visible label stays fixed; the state is carried by `aria-pressed`.
- In `onMounted`:
  - If `document.documentElement.dataset.theme` is `'light'` or `'dark'`, set `isDark` from it.
  - Otherwise use `matchMedia('(prefers-color-scheme: dark)').matches`, and add a `change` listener that updates `isDark` only while no explicit theme is set. Remove the listener in `onBeforeUnmount`.
- `toggle()`: next = `isDark ? 'light' : 'dark'`. Set `document.documentElement.dataset.theme = next`, then `try { localStorage.setItem(THEME_STORAGE_KEY, next) } catch {}`, then flip `isDark`.
- Scoped styles: tokens only. Padding `--space-2 --space-3`, border `--border-width solid var(--color-border-strong)`, `--radius-1`, transparent background, `color: inherit`, `min-block-size: 2.75rem` (target size). When `[aria-pressed="true"]`, background `--color-surface`.

**B9. `app/components/SiteHeader.vue`**
- Links: `[{to:'/',label:'Home'},{to:'/about',label:'About'},{to:'/projects',label:'Projects'},{to:'/articles',label:'Articles'},{to:'/resume',label:'Resume'}]`
- Markup: `<header class="site-header"><div class="container site-header__inner">`, containing:
  - `<NuxtLink to="/" class="site-name">{{ site.name }}</NuxtLink>`
  - `<nav aria-label="Main"><ul class="site-nav">` with `<li>` + `<NuxtLink>` per link
  - `<ClientOnly><ThemeToggle /><template #fallback><span class="theme-toggle-placeholder" aria-hidden="true">Dark theme</span></template></ClientOnly>`
- Scoped CSS, mobile first:
  - `__inner`: flex, `flex-wrap: wrap`, `gap: var(--space-3)`, `align-items: center`, `padding-block: var(--space-4)`.
  - `.site-nav`: `list-style: none`, `padding: 0`, flex, wrap, `gap: var(--space-1) var(--space-3)`. Links get `padding-block: var(--space-2)`, so targets are at least 24px.
  - `[aria-current="page"]`: `font-weight: var(--font-weight-bold)`.
  - The placeholder copies the toggle's padding and border tokens, plus `visibility: hidden`.
  - At `@media (min-width: 40rem)`: `__inner` uses `justify-content: space-between` and `flex-wrap: nowrap`.
  - Bottom border: border token.

**B10. `app/components/SiteFooter.vue`**
- `<footer class="site-footer"><div class="container">`, containing a `<ul class="contact-links">` with three items:
  - `<a :href="site.contact.linkedinUrl">LinkedIn</a>`
  - `<a :href="site.contact.githubUrl">GitHub</a>`
  - `<a :href="\`mailto:${site.contact.email}\`">Email</a>`
- No `target="_blank"`.
- Scoped CSS: top border token, `padding-block: var(--space-6)`, flex wrap with `gap: var(--space-4)`, no list style.
- Batch C replaces this list with `<ContactLinks />`.

**B11. `app/layouts/default.vue`**
`<div class="site"><a class="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main" class="container site-main" tabindex="-1"><slot /></main><SiteFooter /></div>`. Scoped: `.site-main { padding-block: var(--space-7) }`.
Nuxt requires a layout to have a **single root element** (for layout transitions), and `vue/no-multiple-template-root` enforces it. The wrapper is a plain `<div>`, so landmarks are unchanged (user decision, 2026-10-20).

**B12. `app/app.vue`** (final version)
```vue
<script setup lang="ts">
useHead({
  meta: [{ name: 'color-scheme', content: 'light dark' }],
  link: [{ rel: 'icon', href: 'data:,' }],
  script: [{ innerHTML: THEME_SCRIPT, tagPriority: 'critical' }],
})
</script>
<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout><NuxtPage /></NuxtLayout>
</template>
```
*Verify:* Unhead v2 uses `innerHTML` (or `textContent`) for inline scripts. Confirm the generated head contains the theme script verbatim.

**B13. `app/composables/usePageSeo.ts`**
```ts
interface PageSeo { title?: string, description: string, type?: 'website' | 'article' }
export function usePageSeo(seo: PageSeo): void
```
- `fullTitle = seo.title ? \`${seo.title} · ${site.name}\` : site.name`
- `base = useRuntimeConfig().app.baseURL`, `path = useRoute().path`
- `url = new URL(path === '/' ? base : \`${base}${path.replace(/^\//, '')}/\`, site.origin).href` (trailing slash, because GitHub Pages serves directories)
- `useSeoMeta({ title: fullTitle, description, ogTitle: fullTitle, ogDescription: description, ogType: seo.type ?? 'website', ogUrl: url, ogSiteName: site.name, twitterCard: 'summary', twitterTitle: fullTitle, twitterDescription: description })`
- `useHead({ link: [{ rel: 'canonical', href: url }] })`
- Then update the temporary `pages/index.vue` to call `usePageSeo({ description: site.description })`.

**B14. Shared script helpers (plain Node ESM, no dependencies)**

- **`scripts/lib/config.mjs`** exports:
  - `baseURL`: the same logic as `nuxt.config`: read `deploy.config.json` via `new URL('../../deploy.config.json', import.meta.url)`, let the env override it, and normalize leading and trailing slashes.
  - `outputDir`: `fileURLToPath(new URL('../../.output/public/', import.meta.url))`
  - `repoRoot`: `fileURLToPath(new URL('../../', import.meta.url))`

- **`scripts/lib/html-files.mjs`** exports two functions:
  - `listHtmlFiles(dir)`: `readdir(dir, { recursive: true })`, filter `.html`, convert `\` to `/`, sort.
  - `fileToUrlPath(rel, base)`: `'index.html'` → `base`; `x/index.html` → `base + 'x/'`; anything else → `base + rel`.

- **`scripts/lib/static-server.mjs`** exports two functions:
  - `resolveFile(root, relPath)`:
    - Candidates: if `relPath` is `''` or ends with `/`, try `relPath + 'index.html'`. Otherwise try `relPath`, then `relPath + '/index.html'`, then `relPath + '.html'`.
    - For each candidate, compute `resolve(root, c)`, skip it if it doesn't start with `resolve(root)` (blocks path traversal), and return it if `stat().isFile()`.
    - Return `null` if nothing matches.
  - `startStaticServer({ root, base, port = 0 })`:
    - A `node:http` server listening on `127.0.0.1`. It resolves to `{ origin, close }`.
    - Request handling: take `pathname` from `new URL(req.url, 'http://localhost')`. If it starts with `base`, call `resolveFile(root, decodeURIComponent(pathname.slice(base.length)))`.
    - When no file is found, serve `404.html` with status 404, matching GitHub Pages.
    - Content types map: `.html` / `.js` / `.mjs` / `.css` / `.json` / `.txt` (with `; charset=utf-8`), plus `.svg`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`, `.ico`, `.pdf`, `.xml`, `.woff2`. Anything else is `application/octet-stream`.

- **`scripts/serve.mjs`:** `startStaticServer({ root: outputDir, base: baseURL, port: 4173 })` and print `${origin}${baseURL}`.

**B15. `scripts/postgenerate.mjs`** (CSP part; Batch C adds the 404 step)
- Use `listHtmlFiles(outputDir)`. Fail with exit 1 if it finds none.
- `await rm(join(outputDir, '200.html'), { force: true })`. The SPA fallback isn't used on GitHub Pages.
- For each HTML file:
  - Throw if it already contains `http-equiv="Content-Security-Policy"` (case-insensitive).
  - Collect hashes: for each match of `/<script\b(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi` with a non-empty `m[1]`, compute `'sha256-' + createHash('sha256').update(m[1], 'utf8').digest('base64')` and wrap it in single quotes. All inline scripts are hashed, including JSON and importmap blocks; extra hashes do no harm.
  - Build the CSP: `default-src 'self'; script-src 'self' <hashes>; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'`
  - Insert `<meta http-equiv="Content-Security-Policy" content="…">` right after the first `<meta charset=…>` tag. If there is none, insert it right after `<head…>`. Throw if neither insertion point is found.
  - Write the file back.
- Add a comment explaining that `style-src 'unsafe-inline'` is an accepted gap: Nuxt inlines component CSS.

**B16. `package.json` script changes**
```
"generate": "nuxt generate && node scripts/postgenerate.mjs",
"preview": "node scripts/serve.mjs"
```

**B17. Verify**
- [ ] typecheck, lint and generate all pass.
- [ ] `.output/public/index.html` has the CSP meta right after charset, and its `script-src` contains one hash per inline script.
- [ ] `200.html` is gone.
- [ ] `pnpm preview`, then open `http://localhost:4173/portfolio/`:
  - No CSP errors in the console.
  - The toggle works, and the choice survives a reload with no flash of the wrong theme.
  - Changing the OS theme with no stored choice follows the OS.
- [ ] With JavaScript disabled: the nav works, there's no toggle, and the OS theme applies.
- [ ] The skip link is the first Tab stop and moves focus to `<main>`.
- [ ] At 320px width there's no horizontal scroll, and the nav wraps.
- [ ] `grep -rn "max-width" app/` shows no `@media (max-width`.
- [ ] Components hard-code no colors, spacing or font sizes (tokens only).

### BATCH C: content loading and pages

**C1. `nuxt.config.ts` additions**
```ts
import { fileURLToPath } from 'node:url' // with the other imports
const includeFixtures = process.env.PORTFOLIO_FIXTURES === '1'
const articleDirs = [fileURLToPath(new URL('./content/articles/', import.meta.url))]
if (includeFixtures) articleDirs.push(fileURLToPath(new URL('./tests/fixtures/articles/', import.meta.url)))
// in defineNuxtConfig:
runtimeConfig: { articleDirs, repoRoot: fileURLToPath(new URL('./', import.meta.url)) },
nitro: { prerender: { crawlLinks: false, failOnError: true, routes: prerenderRoutes } },
```
**Changed during C (user decision, 2026-10-20): the crawler is off and routes are listed explicitly.** `prerenderRoutes` is `['/', '/about', '/projects', '/articles', '/resume', '/404']` plus `/articles/<slug>` for every `.html` file in `articleDirs`, read in `nuxt.config.ts`. Reason: with a non-root `baseURL`, Nitro's crawler queues every page both with and without the base and renders it twice. On Windows the two renders race on the payload cache and fail with `EPERM` (nitrojs/nitro#4441, open; fix proposed in PR #4688, not merged). Broken-link detection is covered by `check-links.mjs` (D2). **Revisit `crawlLinks: true` once PR #4688 ships in a Nuxt release.** A new page must be added to `prerenderRoutes`.
These keys are private: server-only and never sent to the client.

**C2. `package.json`:** add `"generate:fixtures": "PORTFOLIO_FIXTURES=1 pnpm generate"`.

**C3. `shared/types/article.ts`**
```ts
export interface ArticleMeta { slug: string, title: string, description: string, date: string /* YYYY-MM-DD */, updated: string | null /* YYYY-MM-DD */, tags: string[] /* lowercase, no '#' */, series: string | null, readingMinutes: number }
export interface Article extends ArticleMeta { lang: string, bodyHtml: string }
```
Import it with `import type { … } from '#shared/types/article'`.

**C4. `server/utils/git-date.ts`**

`getFirstCommitDate(file: string, repoRoot: string): string`
- Try `execFileSync('git', ['log', '--follow', '--diff-filter=A', '--format=%as', '--', file], { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })`. Split into non-empty trimmed lines and return the last one (the oldest commit).
- On error or empty output, return `statSync(file).mtime.toISOString().slice(0, 10)`. This covers a file that isn't committed yet; see question 2. The function never throws.

**C5. `server/utils/article-parse.ts`** (pure function, so it's ready for Phase 2 unit tests)
- Exports: `SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/` and `parseArticle({ html, slug, resolveFallbackDate }: { html: string, slug: string, resolveFallbackDate: () => string }): Article`.
- Parse with `node-html-parser` and the same options as the rules script. Don't list `pre` in `blockTextElements`, so `<pre><code>` gets parsed as elements.
- Meta map: `readMetaMap` from `#shared/utils/article-meta` over `head meta[name]` (`name`, `content`) pairs.
- **Malformed values:** if `validateArticleMeta(map)` returns any errors, throw an `Error` listing them with the slug. This mirrors the CI article check, so `nuxt generate` fails too (constitution III, spec Q26).
- Field rules (the standard's tags only; anything else is ignored):

  | Field | Source and fallback |
  |---|---|
  | `title` | Collapsed text of `head title`, or `slug` if that's empty |
  | `description` | `meta description`, otherwise a summary of the first `body p` text |
  | `date` | `meta date` (already validated); otherwise `resolveFallbackDate()`, which is only called when needed |
  | `updated` | `meta updated` (already validated), or `null` |
  | `tags` | `parseTags(meta tags).tags`, or `[]` |
  | `series` | `meta series`, or `null` |
  | `lang` | `html` `lang` attribute, or `'en'` |
  | `bodyHtml` | `body.innerHTML.trim()` |
  | `readingMinutes` | `Math.max(1, Math.round(words / 200))`, where `words` is the body `.text` split on `\s+`, with empties filtered out |

- `summarize`: collapse whitespace. If the result is longer than 160 characters, cut to 157, back up to the last space, and append `…`.

**C6. `server/utils/articles.ts`**
- `getArticles(): Promise<Article[]>`. In dev (`import.meta.dev`), read fresh on every call. Otherwise cache the promise in a module variable.
- `loadArticles`:
  - `const { articleDirs, repoRoot } = useRuntimeConfig()`.
  - For each dir: `readdir`. If the directory is missing, skip it.
  - Take `.html` files, sorted. The slug is `basename(name, '.html')`.
  - Throw an `Error` if the slug fails `SLUG_PATTERN`, or if it's a duplicate across dirs. These are content errors, so failing the build is correct. A missing *tag* never throws.
  - Read the file, then call `parseArticle({ html, slug, resolveFallbackDate: () => getFirstCommitDate(file, repoRoot) })`.
  - Sort by date descending, then slug ascending.
- `toMeta(a: Article): ArticleMeta`: build the object explicitly from the eight meta fields (`slug`, `title`, `description`, `date`, `updated`, `tags`, `series`, `readingMinutes`).

**C7. Server routes**
- `server/api/articles.get.ts`: `defineEventHandler(async (): Promise<ArticleMeta[]> => (await getArticles()).map(toMeta))`
- `server/api/article/[slug].get.ts`: `const slug = getRouterParam(event, 'slug')`, then find the article. If it isn't found, `throw createError({ statusCode: 404, statusMessage: 'Article not found' })`. Return the `Article`.

**C8. `content/projects.ts`**
```ts
export interface ProjectImage { src: string, alt: string, width: number, height: number } // src relative to public/, e.g. '/images/x.webp'
export interface Project { name: string, summary: string, stack: string[], repoUrl: string, demoUrl?: string, image?: ProjectImage }
// PLACEHOLDER (spec Q14 style): replace with real projects.
export const projects: Project[] = [{ name: 'Example project (placeholder)', summary: 'PLACEHOLDER: 1–3 sentences on role, dates, problem solved and outcome.', stack: ['Vue', 'TypeScript'], repoUrl: 'https://github.com/moreno-m2698' }]
```

**C9. Utilities**
- `app/utils/asset-url.ts`: `assetUrl(path)` returns `\`${useRuntimeConfig().app.baseURL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}\``. Call it in `<script setup>`, not inline in templates.
- `app/utils/format-date.ts`: a module-level `new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' })`. `formatDate(iso)` formats `new Date(\`${iso}T00:00:00Z\`)`. The UTC time zone keeps the server render and the client hydration identical.

**C10. Components** (presentational: data in through props, scoped CSS with tokens only)
- **`ContactLinks.vue`**
  - Prop: `includeResume?: boolean` (default `false`).
  - A `<ul class="contact-links">` with an optional `<li><a :href="resumeUrl">Resume (PDF)</a></li>`, where `resumeUrl = assetUrl('/resume.pdf')`, followed by LinkedIn, GitHub and Email. Flex wrap.
  - `SiteFooter` now uses `<ContactLinks />`.
- **`HomeHero.vue`:** `<section class="hero"><h1>{{ site.name }}</h1><p class="hero__title">{{ site.jobTitle }}</p><p>{{ site.tagline }}</p><ContactLinks include-resume /></section>`. This covers F-01 and F-03.
- **`ArticleList.vue`**
  - Props: `articles: ArticleMeta[]`, `headingLevel?: 2 | 3` (default 2). `headingTag = computed(() => \`h${props.headingLevel}\`)`.
  - Markup: `<ul class="article-list">` → `<li><article>`, containing:
    - `<component :is="headingTag"><NuxtLink :to="\`/articles/${a.slug}\`">{{ a.title }}</NuxtLink></component>`
    - `<p class="meta"><time :datetime="a.date">{{ formatDate(a.date) }}</time> · {{ a.readingMinutes }} min read</p>`
    - `<p>{{ a.description }}</p>`
    - `<ul v-if="a.tags.length" class="tags" aria-label="Tags">`, with each tag shown as `#{{ tag }}` (spec Q25)
  - No list style; muted color for the meta line.
- **`ProjectCard.vue`**
  - Prop: `project: Project`.
  - Markup: `<article class="card">`, containing:
    - `<h2>{{ project.name }}</h2>`
    - Optional `<img :src="assetUrl(image.src)" :alt :width :height loading="lazy">`
    - `<p>{{ summary }}</p>`
    - `<ul aria-label="Tech stack">`
    - `<p class="card__links">` with `<a :href="repoUrl">Source code<span class="visually-hidden"> for {{ name }}</span></a>` and, if `demoUrl`, `Live demo<span class="visually-hidden"> of {{ name }}</span>`
  - Border token, `--radius-2`, padding `--space-5`.
- **`NotFound.vue`:** `<section><h1>Page not found</h1><p>The page you were looking for does not exist or has moved.</p><p><a :href="homeUrl">Go to the home page</a></p></section>`, with `homeUrl = assetUrl('/')`. It uses a plain `<a>` (a full load), so it works from the error state and without JavaScript.

**C11. Pages** (each calls `usePageSeo`; each has exactly one `<h1>`)
- **`pages/index.vue`** (replace the temporary version):
  - `const { data: articles } = await useFetch<ArticleMeta[]>('/api/articles', { default: () => [] })`
  - `latest = computed(() => articles.value.slice(0, 3))`
  - `<HomeHero />`, then `<section v-if="latest.length" aria-labelledby="latest-heading"><h2 id="latest-heading">Latest articles</h2><ArticleList :articles="latest" :heading-level="3" /><p><NuxtLink to="/articles">All articles</NuxtLink></p></section>`. Hidden when empty (Q20).
  - `usePageSeo({ description: site.description })`.
- **`pages/about.vue`:** `<h1>About</h1>` plus `<section>`s with `<h2>` Bio, Skills, Experience and Currently learning, each with clearly marked placeholder text. No `<img>` until a real photo exists. Description: "About {name}: background, skills and experience."
- **`pages/projects.vue`:**
  - `<h1>Projects</h1>`, then `<ul class="project-grid" v-if="projects.length">` with `<li><ProjectCard :project /></li>`, otherwise `<p>No projects yet.</p>`.
  - Grid: one column by default; 2 columns at `@media (min-width: 40rem)`; `gap: var(--space-5)`.
- **`pages/articles/index.vue`:** the same `useFetch` call. `<h1>Articles</h1>`, then `<ArticleList>` (h2 items), or `<p>No articles yet.</p>`. No search or tag controls in this milestone.
- **`pages/articles/[slug].vue`**
  - `definePageMeta({ key: route => route.fullPath })`
  - `const slug = String(useRoute().params.slug)`
  - `const { data } = await useFetch<Article>(\`/api/article/${slug}\`)`
  - If `!data.value`, `throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })`.
  - `const article = data.value`
  - `usePageSeo({ title: article.title, description: article.description || site.description, type: 'article' })`
  - Template:
    - `<article :lang="article.lang !== 'en' ? article.lang : undefined">`
    - `<header><h1>{{ article.title }}</h1><p class="meta"><time :datetime>…</time> · {{ article.readingMinutes }} min read</p>`, then `<p v-if="article.updated" class="meta">Updated on <time :datetime="article.updated">{{ formatDate(article.updated) }}</time></p>`, plus the tags list shown as `#tag` (F-15), then `</header>`
    - `<!-- eslint-disable-next-line vue/no-v-html -- trusted repo content (constitution III) -->` followed by `<div class="prose" v-html="article.bodyHtml" />`
- **`pages/resume.vue`:** `<h1>Resume</h1><p>My resume is available as a PDF.</p><p><a :href="resumeUrl">Download resume (PDF)</a></p>`.
- **`pages/404.vue`:** `<NotFound />` and `usePageSeo({ title: 'Page not found', description: 'This page does not exist.', noindex: true })`. **Changed during C (user decision):** `usePageSeo` has a `noindex` option that adds robots `noindex` and omits the canonical link and `og:url`, because an error page is served at many URLs and shouldn't claim one address. `error.vue` uses it too.
- **`app/error.vue`**
  - `defineProps<{ error: NuxtError }>()`, with `import type { NuxtError } from '#app'`.
  - Template: `<NuxtLayout><NotFound v-if="error.statusCode === 404" /><section v-else><h1>Something went wrong</h1><p><a :href="homeUrl">Go to the home page</a></p></section></NuxtLayout>`
  - `usePageSeo` with a matching title, plus robots `noindex`.

**C12. Placeholder `public/resume.pdf`**
Generate it once by running this as a scratch Node script (not committed), with the cwd at the repo root. It computes correct xref offsets:
```js
const fs = require('fs'); const t = 'BT /F1 24 Tf 72 700 Td (Resume placeholder) Tj ET'
const objs = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
 '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
 `<< /Length ${t.length} >>\nstream\n${t}\nendstream`, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>']
let pdf = '%PDF-1.4\n'; const offs = []
objs.forEach((o, i) => { offs.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n` })
const x = pdf.length
pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('')
pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF\n`
fs.writeFileSync('public/resume.pdf', pdf, 'latin1')
```
The PDF contains no personal details (Q16).

**C13. `scripts/postgenerate.mjs`: add the 404 step**
This goes **first**, before the CSP loop: `copyFile(join(outputDir, '404', 'index.html'), join(outputDir, '404.html'))`. If the source is missing, fail with a clear message.

**C14. Verify**
- [ ] typecheck, lint and `validate:html` pass.
- [ ] `pnpm generate:fixtures` produces these routes, each as `index.html` under its directory: `/`, `about`, `projects`, `articles`, `articles/sample-article`, `articles/minimal-article`, `resume`, `404`. It also produces `404.html` with "Page not found" in its static HTML.
- [ ] `pnpm generate` without the flag produces **no** `articles/sample-article`, the articles page says "No articles yet", and Home has no latest-articles section.
- [ ] The minimal fixture shows a truncated first-paragraph description (at most 160 characters plus `…`) in both `<meta name="description">` and the list. Its date is the file's mtime until it's committed, then the git date. It has no tags and no "Updated on" line.
- [ ] The sample fixture shows tags `#testing` and `#fixtures/sample` and an "Updated on 21 October 2026" line.
- [ ] Put a malformed `date` in a fixture and confirm `pnpm generate:fixtures` fails with the slug and the problem. Revert.
- [ ] View source of an article page: the `<title>` is unique, and the description, `og:*`, `twitter:*` and canonical tags are all present. Canonical starts with `https://moreno-m2698.github.io/portfolio/`.
- [ ] The `<pre>` whitespace is preserved in the rendered article.
- [ ] With JavaScript disabled, all pages, the articles and the project card are readable in `pnpm preview`.
- [ ] `/portfolio/does-not-exist` in preview shows the styled 404, both with and without JavaScript.
- [ ] Before C13 was added, confirm `404.html` was indeed a JavaScript-only shell. Note what was found.

### BATCH D: checks and CI

**D1. Install:** `pnpm add -D @playwright/test @axe-core/playwright`, then `pnpm exec playwright install chromium`.

**D2. `scripts/check-links.mjs`**
- Use `listHtmlFiles(outputDir)`. If there are none, fail ("run a generate first").
- For each file:
  - Parse it with `node-html-parser`. Let `pagePath = fileToUrlPath(file, baseURL)` and collect the set of element ids.
  - Collect `href` from `a[href]` and `link[href]`, and `src` from `script[src]`, `img[src]`, `source[src]`, `iframe[src]`.
  - **Skip** anything that matches `/^[a-z][a-z0-9+.-]*:/i` (http, https, mailto, data) or starts with `//`.
  - **Fragment-only `#id`:** the id must exist on the same page.
  - **Everything else:**
    - Resolve with `u = new URL(ref, 'http://site.invalid' + pagePath)`.
    - If `u.pathname` doesn't start with `baseURL`, report "outside base path" (this catches hard-coded root paths).
    - Otherwise `resolveFile(outputDir, decodeURIComponent(u.pathname.slice(baseURL.length)))` must be non-null, or report "target not found".
- Print `file → ref (reason)` for each problem and exit 1 if any. Otherwise print a count of pages and links checked.

**D3. `scripts/check-a11y.mjs`**
- Imports: `chromium` from `@playwright/test`, and `AxeBuilder` from `@axe-core/playwright` (default export; *verify the current export form*).
- Start `startStaticServer({ root: outputDir, base: baseURL })` on port 0. List the HTML files; fail if there are none.
- `const browser = await chromium.launch()`.
- For `colorScheme` of `['light', 'dark']` (the constitution requires both themes):
  - `ctx = await browser.newContext({ colorScheme })`. Do **not** set `bypassCSP`.
  - For each file, open a new page:
    - Collect problems from `page.on('console', m => m.type() === 'error' && /Content Security Policy/i.test(m.text()))` and from `page.on('pageerror')`.
    - `res = await page.goto(origin + fileToUrlPath(file, baseURL), { waitUntil: 'networkidle' })`. Fail if `!res?.ok()`.
    - `results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()`
    - Record every violation: `[scheme] url: id (impact) help, then node targets`. Record CSP and page errors too.
    - Close the page.
- Close the browser and the server. Exit 1 on any failure. Otherwise print `N pages × 2 themes, 0 violations`.
- If axe can't be injected because of the CSP, **stop and report**. Don't enable `bypassCSP` silently.

**D4. `scripts/verify-no-fixtures.mjs`**
- Read the `*.html` names in `tests/fixtures/articles` and turn them into slugs.
- Fail if any of these exists: `outputDir/articles/<slug>`, `outputDir/api/article/<slug>`.
- Also fail if `outputDir/index.html` is missing.

**D5. Final `package.json` scripts** (the full set)
```
"postinstall": "nuxt prepare",
"dev": "PORTFOLIO_FIXTURES=1 nuxt dev",
"generate": "nuxt generate && node scripts/postgenerate.mjs",
"generate:fixtures": "PORTFOLIO_FIXTURES=1 pnpm generate",
"build": "pnpm generate",
"preview": "node scripts/serve.mjs",
"typecheck": "nuxt typecheck",
"lint": "eslint . --max-warnings 0",
"lint:fix": "eslint . --fix",
"validate:html": "html-validate \"content/articles/**/*.html\" \"tests/fixtures/articles/**/*.html\" && node scripts/check-article-rules.mjs",
"check:links": "node scripts/check-links.mjs",
"check:a11y": "node scripts/check-a11y.mjs",
"verify:no-fixtures": "node scripts/verify-no-fixtures.mjs",
"check": "pnpm typecheck && pnpm lint && pnpm validate:html && pnpm generate:fixtures && pnpm check:links && pnpm check:a11y"
```

**D6. `.github/workflows/deploy.yml`**
- Trigger on `push` to `main`, `pull_request`, and `workflow_dispatch`. Top-level `permissions: { contents: read }`.
- **Job `check`** (ubuntu-latest), steps in order:
  1. `actions/checkout@v5` with `fetch-depth: 0`
  2. `pnpm/action-setup@v4` (reads `packageManager`; confirm the version used supports pnpm 12)
  3. `actions/setup-node@v5` with `node-version-file: .nvmrc` and `cache: pnpm`
  4. `pnpm install --frozen-lockfile`
  5. `pnpm exec playwright install --with-deps chromium`
  6. `pnpm check`
- **Job `build`**
  - `needs: check`; `if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'`
  - Steps:
    1. The same checkout (`fetch-depth: 0`), pnpm, node and install steps
    2. `pnpm generate`
    3. `pnpm verify:no-fixtures`
    4. `pnpm check:links`
    5. `actions/configure-pages@v5`
    6. `actions/upload-pages-artifact@v4` with `path: .output/public`
- **Job `deploy`**
  - `needs: build`; `permissions: { pages: write, id-token: write }`
  - `environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }`
  - `concurrency: { group: pages, cancel-in-progress: false }`
  - Step: `actions/deploy-pages@v4` with `id: deployment`.
- *Verify the latest major versions of each action.* The repo setting Pages → Source → "GitHub Actions" is a manual step for the user.

**D7. Verify**
- [ ] `pnpm check` passes locally from a clean state (delete `.output` and `.nuxt` first, then `pnpm install`).
- [ ] Break the links on purpose (a `<NuxtLink to="/nope">`, then a raw `href="/about"` that skips the base) and confirm `check:links` fails both ways. Revert.
- [ ] Break the contrast on purpose (set `--color-text-muted` to `#bbbbbb`) and confirm `check:a11y` fails. Revert.
- [ ] Change the theme script by one character *after* generate, then run `check:a11y` and confirm a CSP error is reported. Rebuild.
- [ ] `pnpm generate && pnpm verify:no-fixtures` passes. `pnpm generate:fixtures && pnpm verify:no-fixtures` fails, which is expected.
- [ ] The workflow YAML is valid (`actionlint` if available, or by inspection).

---

## 4. How each Phase 1 gate is met

| Gate | How |
|---|---|
| Strict TypeScript | `typescript.strict: true`; `pnpm typecheck` runs `nuxt typecheck` (vue-tsc over the Nuxt 4 project references). `content/` is added to the app tsconfig include. |
| Lint and format | `@nuxt/eslint` with stylistic rules; `--max-warnings 0`. |
| Article HTML validation | `html-validate` (recommended, plus 2 documented rule options) over articles **and** fixtures, plus `check-article-rules.mjs`: body has no nav, style, script or h1; `lang` and `title` present; slug format valid; metadata values match the standard (shared rules in `shared/utils/article-meta.ts`). |
| Build without broken internal links | `nuxt generate` with `failOnError: true`; `check-links.mjs` checks every `href`/`src` and same-page fragment, and enforces the base path. |
| axe on every built page | `check-a11y.mjs` scans every `.html` in the output, under both light and dark color schemes, with WCAG 2.0/2.1/2.2 A and AA tags. It also fails on CSP violations and page errors. |
| No-JavaScript content (II) | Every route is prerendered. The toggle is the only client-only element. The 404 page is static HTML. Checked by hand in B17 and C14. |
| Manual keyboard and screen reader check | Required before release. It isn't automated; add it to the PR checklist. |

## 5. Version-sensitive points for the implementer to verify

1. **Nuxt 4** (pin `^4`):
   - `app/` is the source directory; `server/`, `shared/` and `public/` stay at the root.
   - The `~`, `~~` and `#shared` aliases.
   - `useFetch` data defaults to `undefined`.
   - `<NuxtRouteAnnouncer>` exists.
   - `import type { NuxtError } from '#app'`.
2. **The `tsconfig.json` references template.** If `nuxt typecheck` reports TS6307 for `content/*.ts`, confirm the `typescript.tsConfig.include` merge actually landed in `.nuxt/tsconfig.app.json`.
3. **Unhead v2 inline script syntax** (`innerHTML`, `tagPriority`).
4. **Generate behavior:** whether `nuxt generate` still writes SPA-shell `200.html` and `404.html`; which inline scripts Nuxt emits (the `__NUXT__` config, an importmap if `entryImportMap` is on); and whether the prerender crawler tries to prerender `/resume.pdf`. If it does, add `nitro.prerender.ignore: ['/resume.pdf']`.
5. **`import.meta.url`** inside `nuxt.config.ts` (jiti).
6. **pnpm 12** (verified 2026-10-20): settings go in `pnpm-workspace.yaml` (`shellEmulator`, `engineStrict`, `allowBuilds`); `.npmrc` pnpm settings and the `package.json` `"pnpm"` field are ignored. Still to check: that `pnpm/action-setup` supports pnpm 12 (see D6).
7. **ESLint 9 vs 10** compatibility with `@nuxt/eslint`.
8. **html-validate:** the `doctype-style` and `heading-level` option names; what happens with an empty `content/articles` glob; and that it doesn't flag the standard's `<meta name>` values (`date`, `updated`, `series`, `tags`).
9. **`@axe-core/playwright`** export form, and its `playwright-core` peer under pnpm.
10. **GitHub Actions** major versions.
11. **Node 24** as the active LTS; `fs.readdir({ recursive: true })`.
12. **Node 24 type stripping:** that `scripts/check-article-rules.mjs` can `import` `shared/utils/article-meta.ts` directly with no flag, and that the `\p{L}` regex works in both Node and the Nitro build.

## 6. Questions for the user (defaults are built into the plan)

1. **Answered (spec Q22): two states, as planned.** **Theme toggle states:** the plan uses a two-state light/dark button (`aria-pressed`). Once you choose, there's no way back to "follow the OS" except clearing storage. Is that OK for the MVP, or do you want three states (System / Light / Dark)?
2. **Answered (spec Q23, constitution v0.16.1): file modified time, as planned.** **Date fallback for uncommitted articles:** the constitution defines only the date of the first git commit. For a file that isn't committed yet (local drafts), the plan falls back to the file's modified time so the build never fails. OK?
3. **Answered (spec Q24–Q26, constitution v1.0.0): replaced by a metadata standard.** Required `<title>`; optional `description`, `date`, `updated`, `series`, Obsidian-style `tags`; no `keywords` or `series-part`; malformed values fail the article check. The original question, for the record: **Recognized meta names:** since there's no fixed standard, the build has to look for *some* names. Proposed:
   - date: `date`, `dcterms.date`, `article:published_time`
   - tags: `keywords`, else `tags`
   - series: `series` and `series-part`
   - description: `description`

   Should these be recorded in the spec as "names the build recognizes"?
4. **Answered (spec Q27): 200 wpm, minimum 1, as planned.** **Reading speed:** reading time uses 200 words per minute, minimum 1 minute. OK?
5. **Answered (spec Q28): straight to the PDF, as planned.** **Home "Resume" CTA:** the plan links straight to `/resume.pdf` rather than to the `/resume` page. OK?
6. **Answered (spec Q29): omitted, as planned.** **Search and tag controls:** the plan omits them from the Articles list this milestone instead of showing placeholders that don't work. OK?
7. **Answered (spec Q30, constitution v1.1.0): recorded now.** **Record in the constitution:** should the main session record these decisions (a version bump and Technical Baseline rows, per CLAUDE.md)?
   - Playwright + `@axe-core/playwright` and html-validate change from Proposed to Decided.
   - The post-build CSP hashing approach, and the `style-src 'unsafe-inline'` gap.
   - `deploy.config.json` as the single source for the base URL.
   - The `PORTFOLIO_FIXTURES` flag.

## 7. Final verification checklist (after Batch D)

- [ ] `pnpm install --frozen-lockfile && pnpm check` passes from a clean clone.
- [ ] The `pnpm generate` output contains no fixtures; `verify:no-fixtures` and `check:links` pass on it.
- [ ] Every HTML file in the output has a CSP meta right after charset, and there are no CSP console errors.
- [ ] `404.html` is static, styled and readable without JavaScript.
- [ ] Every page has a unique `<title>`, a meta description, OG and Twitter tags, and a canonical URL in the shipped HTML.
- [ ] The skip link is first, the nav is always visible and wraps at 320px, there's no horizontal scroll at 320px or at 400% zoom, and focus is visible everywhere.
- [ ] The theme follows the OS, the toggle works, the choice persists with no flash, and the OS theme applies without JavaScript.
- [ ] `prefers-reduced-motion: reduce` removes all transitions.
- [ ] No `max-width` media queries; no hard-coded values that a token covers; no third-party requests.
- [ ] Every dependency in `package.json` matches the justified list in section 2.
- [ ] `git status` shows that `constitution.md` and `portfolio-spec.md` were not touched by the implementer.
- [ ] Manual keyboard and screen reader pass over all pages, in both themes, before merge to `main`.