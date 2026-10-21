# Portfolio Constitution

> **Status:** Draft v1.1.1, last amended 2026-10-20. Not yet ratified.
> This document sets the non-negotiable principles for building the portfolio site. The spec (`portfolio-spec.md`) says *what* to build; this says *how decisions get made*.
> **Precedence:** Constitution > Spec > Technical plans > Code. When they conflict, either fix the lower document or amend this one. Never quietly ignore a principle.

Wording: **MUST** is a hard rule, and failing it blocks a merge. **SHOULD** is the default, and any deviation is written down with a reason. **MAY** is optional.

---

## Core Principles

### I. Accessibility Is Non-Negotiable
- The site MUST meet **WCAG 2.2 AA** on every page, in both light and dark themes.
- Semantic HTML comes first. ARIA is used only when no native element fits.
- Everything MUST work with a keyboard alone, with a visible focus indicator and a logical tab order. Every page MUST include a "skip to content" link.
- Text contrast MUST be at least 4.5:1, or 3:1 for large text and UI components.
- Animation MUST respect `prefers-reduced-motion`. Reduced motion means no transitions, not just shorter ones.
- Images MUST have meaningful `alt` text, or `alt=""` when they're decorative. Diagrams MUST have a text alternative. Inline SVG MUST have `role="img"` and a `<title>` (plus `<desc>` for complex diagrams); SVG used as an `<img>` MUST have `alt` text. Diagram colors MUST adapt to light and dark themes or work on both.
- Automated accessibility checks (axe) MUST run in CI, and any violation fails the build. Each new page or component MUST also be checked by hand with a keyboard and a screen reader before release.

### II. Static-First, Content Without JavaScript
- Every route MUST be pre-rendered to static HTML at build time.
- Articles, project cards, navigation and contact links MUST be readable with JavaScript turned off. JavaScript only adds extras: search, the theme toggle, and page transitions.
- Each page MUST have its own `<title>`, meta description and Open Graph/Twitter tags in the HTML it ships with.
- The site has no runtime server and no database. Anything dynamic, such as the search index, is generated at build time.

### III. Content Lives in the Repository
- Articles are **hand-written HTML files**. Projects are a **typed TypeScript data file** (e.g. `content/projects.ts` exporting an array with a `Project` type), so missing or misspelled fields are type errors. Both live in the repo, and publishing means committing and pushing.
- Each article is a **complete, valid HTML document**: `<!doctype html>`, `<html lang>`, a `<head>` holding its metadata, and a `<body>` holding the article content. The build takes the content from `<body>` and wraps it in the site layout. The article's `<body>` MUST NOT contain site navigation or inline `<style>`/`<script>`.
- Article HTML MUST use semantic elements (`<h2>`–`<h4>`, `<figure>`/`<figcaption>`, `<pre><code class="language-…">`) so styling, highlighting and accessibility work without per-article fixes. Article headings start at `<h2>`, because the layout renders the title as `<h1>`.
- **Article metadata lives in the article's `<head>`**, in `<title>` and `<meta name="…" content="…">` tags, following the **article metadata standard** below. `<title>` is required (valid HTML requires it anyway); every other tag is optional.

  | Tag | Required | Format | Used by |
  |---|---|---|---|
  | `<title>` | **Required** | Plain text, not empty | Page title, lists, search |
  | `description` | Optional | Plain text, about 160 characters | Search, list previews, meta description, share previews |
  | `date` | Optional | `YYYY-MM-DD`, a real calendar date | Publish date shown, list order, latest articles on Home |
  | `updated` | Optional | `YYYY-MM-DD`, a real calendar date | An "Updated on …" line on the article |
  | `series` | Optional | Plain text. Articles with the same value form one series | Series links |
  | `tags` | Optional | Obsidian-style tags separated by whitespace (rules below) | Tags shown on the article, tag filter, search |

  **Tag rules** (modeled on Obsidian):
  - Each tag MAY start with `#`, which is not part of the tag (`#vue` and `vue` are the same tag).
  - A tag contains only letters, numbers, `-`, `_` and `/`. It has no spaces, and it MUST NOT be made only of numbers.
  - `/` nests tags: `vue/reactivity` is a child of `vue`. A tag MUST NOT start or end with `/` or contain `//`. Filtering by a parent tag also matches its children.
  - Tags are case-insensitive: they are compared and displayed in lowercase. Duplicates are removed.
  - Example: `<meta name="tags" content="#vue/reactivity #javascript #til">`.

- **The standard is extensible.** A new tag is added by adding a row to the table above (with its format and fallback) and a field to the typed article metadata in code, in the same change. The build ignores `<meta>` tags it doesn't recognize, so authors MAY add other valid tags freely.
- Article files MUST pass an HTML validator in CI. A validation error fails the build.
- **Missing tags never fail the build.** A tag that is absent, or whose `content` is empty, uses the fallback below.
- **Malformed tags fail the article check.** A recognized tag that is present but doesn't match its format (e.g. a `date` that isn't a real `YYYY-MM-DD` date, or a tag containing a space or made only of numbers) MUST fail the article check in CI, naming the file, the tag and the problem.
- Fallbacks:

  | Missing | Used by | Fallback |
  |---|---|---|
  | `date` | Latest articles on Home, list order, displayed date | Date of the article file's first git commit. CI MUST check out full git history (`fetch-depth: 0`) for this to work. If the file isn't committed yet (a local draft), the file's last-modified date |
  | `updated` | "Updated on" line | Not shown |
  | `description` | Search, list previews, meta description, share previews | First paragraph of the article body, as plain text, truncated to about 160 characters |
  | `tags` | Tag filter, tags shown on the article | No tags shown; the article appears only under "All" |
  | `series` | Series links | No series links. Parts of a series are ordered by date, oldest first |
- The slug is the file name (e.g. `articles/vue-reactivity.html` → `/articles/vue-reactivity`). Reading time is calculated at build time from the body text and is never written by hand.

  Example using every tag in the standard:

  ```html
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Understanding Vue Reactivity</title>
    <meta name="description" content="How Vue tracks dependencies, and why it matters.">
    <meta name="date" content="2026-10-20">
    <meta name="updated" content="2026-11-02">
    <meta name="series" content="Learning Vue">
    <meta name="tags" content="#vue/reactivity #javascript">
  </head>
  <body>
    <p>Article content starts here…</p>
  </body>
  </html>
  ```
- Article slugs are **permanent once published**, because the host can't do redirects (see Hosting).
- No CMS and no external content APIs.

### IV. Minimal by Default, Extensible by Design
- The visual design is minimal and typography-led, and it is itself the design showcase.
- **Styling is plain CSS**: global stylesheets plus `<style scoped>` blocks in Vue single-file components. No utility framework (e.g. Tailwind) and no CSS-in-JS.
- **Design tokens** (color, type scale, spacing, radii, motion durations) are the single source of truth, defined as CSS custom properties in a global stylesheet. Components MUST NOT hard-code values that a token covers.
- **Mobile-first CSS.** Base styles (outside any media query) MUST target the smallest screens. Larger layouts are added with `min-width` media queries only. `max-width` queries MUST NOT be used for layout. Breakpoints are **40rem** and **64rem**, defined once in the design tokens file and reused everywhere. (CSS custom properties can't be used inside media queries, so the values are written literally in each query and documented next to the tokens.)
- Layouts MUST work from a 320px-wide viewport up, with no horizontal scrolling, and content MUST reflow at 400% zoom (WCAG 1.4.10).
- Component styles SHOULD be scoped. Global CSS is limited to tokens, reset/base styles, themes, and the **article prose stylesheet**. Article HTML is injected content that scoped styles don't reach, so it is styled by one global stylesheet scoped under an article container class (e.g. `.prose`).
- No UI kit or theme template may dictate the layout. New layouts and components MUST be addable by putting existing pieces together, without rewriting them.
- Components SHOULD be small, do one job, and be split into presentational and data-loading parts.

### V. Performance Budget
Provisional numbers, to be confirmed after the first build:
- Mobile scores: Largest Contentful Paint (LCP) under 2.5 s, Cumulative Layout Shift (CLS) under 0.1, Interaction to Next Paint (INP) under 200 ms.
- Initial JavaScript SHOULD stay under about 100 KB gzipped on content pages.
- Images MUST have set dimensions and modern formats. Images below the fold MUST lazy-load.
- Fonts MUST use `font-display: swap`, load only the weights and styles actually used, and be trimmed to the characters needed where the source allows it. Fonts from an external service MUST be preconnected (`<link rel="preconnect">`) to limit the extra connection cost.

### VI. Privacy by Default
- No analytics, trackers or third-party cookies.
- Scripts and media MUST be self-hosted. Pages MUST NOT load third-party scripts.
- **Exception: web fonts.** Fonts MAY come from an external font service such as Google Fonts. Downloading the font files at build time and serving them from this site is preferred, because it keeps all requests first-party at no cost to design choice. Loading from the service directly is allowed when that isn't practical.
- Any third-party domain the site loads from MUST be listed in the security policy (CSP) and recorded in the Technical Baseline. Loading fonts directly from a service shares visitors' IP addresses with that service.

### VII. Simplicity and Restraint
- Prefer built-in browser and framework features over adding a dependency. Each new runtime dependency MUST be justified in its PR.
- Don't build for features the spec doesn't ask for (YAGNI). Extensibility comes from clean structure, not speculative abstractions.

### VIII. Quality Gates
Checks are introduced in two phases so the MVP can launch quickly without giving up on accessibility.

**Phase 1: required from the first launch.** Before anything merges to `main`, all of these MUST pass:
- TypeScript in **strict** mode, with no type errors
- Linting and formatting
- Article files validate as HTML
- A successful static build with no broken internal links
- Automated accessibility checks (axe) over every built page
- Before each release that adds or changes a page or component: a manual keyboard and screen reader check

**Phase 2: added right after launch.** These become merge requirements once in place, and SHOULD be in place within the first iteration after launch:
- Unit tests for logic: search, reading time, series ordering, metadata extraction and fallbacks
- End-to-end tests for critical paths (navigation, theme toggle, search)

---

## Technical Baseline

| Area | Decision | Status |
|---|---|---|
| Framework | Vue 3: Composition API, `<script setup>`, TypeScript | Decided |
| Rendering | **Nuxt 4** (built on Vite), static generation via `nuxt generate` | Decided |
| Nuxt modules | `@nuxt/fonts` (download fonts at build), `@nuxt/image`, `@nuxtjs/sitemap` | Proposed |
| Content | Articles as HTML files in the repo, loaded and pre-rendered at build time | Decided |
| Project data | Typed TypeScript array (`content/projects.ts`) | Decided |
| About page content | Written directly in `pages/about.vue` (bio, skills, experience, currently learning) | Decided |
| Article metadata | `<title>` and `<meta>` tags in each article's `<head>`, following the extensible article metadata standard (`description`, `date`, `updated`, `series`, Obsidian-style `tags`); malformed values fail the article check (see Principle III) | Decided |
| HTML validation | `html-validate` over article files in CI, plus an article rules check (body content rules, slug format, metadata standard) | Decided |
| Syntax highlighting | Shiki, at build time, applied to `<pre><code class="language-…">` blocks (no client-side highlighter) | Proposed |
| Diagrams | **Both**: Mermaid written as text in a `<pre class="mermaid">` block and rendered to static SVG at build time (no Mermaid JavaScript shipped to visitors), and hand-made SVG for diagrams that need custom design | Decided |
| Search | Client-side over a build-time index of titles, tags and summaries | Proposed |
| Styling | Plain CSS + Vue `<style scoped>` blocks, with custom-property design tokens | Decided |
| Fonts | External services such as Google Fonts allowed; downloading at build and self-hosting preferred | Decided |
| Theme | `prefers-color-scheme` by default via CSS; manual choice stored in `localStorage` and applied by a tiny inline script (CSP hash) before first paint | Decided |
| Accessibility checks | Playwright + `@axe-core/playwright` over every built page, in light and dark color schemes; CSP violations and page errors also fail | Decided |
| Testing | Vitest (unit), Playwright (end-to-end) | Proposed |
| Security policy (CSP) | Added after the build as a `<meta http-equiv>` tag, with a hash for every inline script. `style-src 'unsafe-inline'` is an accepted, documented gap, because Nuxt inlines component CSS | Decided |
| Base URL | `deploy.config.json` is the single source, read by both the Nuxt config and the check scripts; `NUXT_APP_BASE_URL` overrides it. Changes to `/` when the custom domain arrives | Decided |
| Test fixtures | Test-only articles in `tests/fixtures/articles/`, included only when `PORTFOLIO_FIXTURES=1`; the deploy build fails if any appear in its output | Decided |
| Package manager | **pnpm 12**, with the lockfile committed; CI installs with `pnpm install --frozen-lockfile`. pnpm settings (`shellEmulator`, `engineStrict`, `allowBuilds`) live in `pnpm-workspace.yaml` | Decided |
| Runtime | **Node 24 LTS** | Decided |
| TypeScript | **6.x**, pinned because typescript-eslint (used by `@nuxt/eslint`) doesn't support TypeScript 7 yet; revisit when it does. `@types/node@^24` provides Node types for config and scripts | Decided |

---

## Hosting & Deployment

- **Host: GitHub Pages**, deployed by GitHub Actions on every push to `main`. The repository is **public**.
- `main` MUST always be deployable. Work happens on branches and merges after the quality gates pass.
- **Base path:** until the custom domain exists, the site is served at `https://moreno-m2698.github.io/portfolio/`. The build MUST take a configurable base URL, and no absolute root paths may be hard-coded.
- **Launch plan:** the MVP launches at the github.io address as soon as it's ready, without waiting for the domain.
- **Custom domain:** set up with a `CNAME` file once purchased, with HTTPS enforced. GitHub Pages then automatically redirects the github.io address to the custom domain, so links shared before the switch keep working. This MUST be checked after the switch.
- **Limits accepted as a consequence of this host:**
  - No custom HTTP headers. Security policy that can be expressed in a `<meta>` tag MUST be set there (e.g. CSP), and the rest is accepted as a gap.
  - No server redirects. Hence permanent slugs (Principle III).
  - No per-PR preview sites. Before merging, preview locally from the built output.
  - A static `404.html` MUST be generated for the custom 404 page.

### Public Repository Rules
- No secrets, tokens or private notes in the repo, ever. CI uses GitHub Actions secrets only.
- Draft articles are **publicly readable in the source** even when not published. Unfinished drafts SHOULD stay out of `main` (keep them on a branch or locally).
- The resume PDF is **committed to the repo** and served at a stable URL (`/resume.pdf`). It is updated by replacing the file, keeping the same name. It MUST NOT include a home address or phone number, because every old version stays readable in git history.

---

## Workflow
- Commits SHOULD be small and descriptive. Each PR covers one feature or fix, referencing feature IDs (F-xx) from the spec where it applies.
- New features MUST trace back to the spec. Out-of-scope ideas go into the spec as proposals first.

## Governance
- Amend this document by changing it in a commit or PR that bumps the version:
  - **MAJOR:** a principle is removed or redefined
  - **MINOR:** a principle or section is added
  - **PATCH:** wording or clarification only
- Each amendment updates the "last amended" date and, where relevant, the spec's decisions log.
- Review the constitution at the start of each new phase (technical planning, MVP launch, after launch).

## Open Questions
1. Confirm the performance budget numbers after the first build.
