# Portfolio Constitution

> **Status:** v2.0.0, last amended 2026-11-07. In force.
> This document sets the principles for building the portfolio site. The spec (`portfolio-spec.md`) says *what* to build; this says *how decisions get made*.
> **Precedence:** Constitution > Spec > Technical plans > Code. When they conflict, fix the lower document or amend this one.
> **v2.0.0 in one line:** this is a one-person site built in limited time, so the principles are **goals checked when a review is asked for**, not gates that block every change (spec Q37).

Wording: **MUST** is a hard rule. **SHOULD** is the default; deviate when there's a reason. **MAY** is optional. Breaking a MUST or SHOULD never blocks a push or a deploy: it is found and fixed at review time (see VIII).

---

## Core Principles

### I. Accessibility Is the Goal
- The target is **WCAG 2.2 AA** on every page, in both light and dark themes.
- Semantic HTML comes first. ARIA is used only when no native element fits.
- Everything SHOULD work with a keyboard alone, with a visible focus indicator and a logical tab order. Every page has a "skip to content" link (built into the layout).
- Text contrast SHOULD be at least 4.5:1, or 3:1 for large text and UI components.
- Animation MUST respect `prefers-reduced-motion`. Reduced motion means no transitions, not just shorter ones.
- Images need meaningful `alt` text, or `alt=""` when they're decorative. Inline SVG gets `role="img"` and a `<title>`.
- **How it's checked:** the automated accessibility check (axe, light and dark) runs as part of `/review-frontend` and reports problems without blocking anything. A manual keyboard and screen reader pass happens **before milestones that matter** (for example, before sharing the site with recruiters), not on every release (spec Q39).

### II. Static-First, Content Without JavaScript
- Every route is pre-rendered to static HTML at build time.
- Articles, project cards, navigation and contact links SHOULD be readable with JavaScript turned off. JavaScript only adds extras, such as the theme toggle.
- Each page has its own `<title>`, meta description and Open Graph/Twitter tags in the HTML it ships with.
- The site has no runtime server and no database.

### III. Content Lives in the Repository
- Articles are **hand-written HTML files** in `content/articles/`. Projects are a **typed TypeScript data file** (`content/projects.ts`). Publishing means committing and pushing.
- Each article is a **complete HTML document**: `<!doctype html>`, `<html lang>`, a `<head>` holding its metadata, and a `<body>` holding the article content. The build takes the content from `<body>` and wraps it in the site layout. The `<body>` SHOULD NOT contain site navigation, `<h1>` or inline `<style>`/`<script>`.
- Article HTML SHOULD use semantic elements (`<h2>`–`<h4>`, `<figure>`/`<figcaption>`, `<pre><code>`). Article headings start at `<h2>`, because the layout renders the title as `<h1>`.
- **Article metadata lives in the article's `<head>`**, following this standard:

  | Tag | Required | Format | Used for | Fallback when missing |
  |---|---|---|---|---|
  | `<title>` | Yes | Plain text | Page title, lists | The slug |
  | `description` | No | Plain text, about 160 characters | Meta description, list previews | First paragraph, truncated to about 160 characters |
  | `date` | No | `YYYY-MM-DD` | Displayed date, list order | Date of the file's first git commit (CI checks out full history), or the file's last-modified date if uncommitted |
  | `updated` | No | `YYYY-MM-DD` | "Updated on …" line | Not shown |
  | `tags` | No | Obsidian-style tags separated by whitespace | Tags shown on the article and in lists | No tags |

  **Tag rules** (modeled on Obsidian): an optional leading `#` is not part of the tag; a tag contains only letters, numbers, `-`, `_` and `/`; it isn't made only of numbers; `/` nests tags (`vue/reactivity`) and can't start or end a tag or appear twice in a row; tags are lowercase and de-duplicated. Example: `<meta name="tags" content="#vue/reactivity #javascript #til">`.

- **Bad metadata never fails the build** (spec Q41). A malformed value (e.g. a `date` that isn't a real `YYYY-MM-DD` date, or an invalid tag) logs a warning naming the file, the tag and the problem, and the build uses the fallback (an invalid tag is skipped). `pnpm validate:html` reports the same problems on demand.
- The build ignores `<meta>` tags it doesn't recognize. A new tag is added to the standard by adding a row above and a field in code in the same change.
- The slug is the file name (`articles/vue-reactivity.html` → `/articles/vue-reactivity`): lowercase letters, numbers and hyphens. An invalid or duplicate slug **does** fail the build, because it can't produce a working URL. Slugs SHOULD stay permanent once published (the host can't redirect).
- Reading time is calculated at build time: body words ÷ 200, rounded, minimum 1 minute.
- No CMS and no external content APIs.

### IV. Minimal by Default, Extensible by Design
- The visual design is minimal and typography-led, and it is itself the design showcase.
- **Styling is plain CSS**: global stylesheets plus `<style scoped>` blocks in Vue single-file components. No utility framework (e.g. Tailwind) and no CSS-in-JS.
- **Design tokens** (color, type scale, spacing, radii, motion durations) are CSS custom properties in `app/assets/css/tokens.css`. Components SHOULD use tokens rather than hard-coded values.
- **Mobile-first CSS.** Base styles target the smallest screens; larger layouts are added with `min-width` media queries at **40rem** and **64rem**. Avoid `max-width` queries for layout.
- Layouts SHOULD work from a 320px-wide viewport up, with no horizontal scrolling, and reflow at 400% zoom.
- Component styles SHOULD be scoped. Global CSS is for tokens, reset/base styles, themes, and the article prose stylesheet (`.prose`).
- No UI kit or theme template dictates the layout.

### V. Performance
- Keep pages light: little client JavaScript, images with set dimensions and modern formats, below-the-fold images lazy-loaded, fonts with `font-display: swap` and only the weights used.
- No fixed budget numbers for now. Revisit if the site feels slow.

### VI. Privacy by Default
- No analytics, trackers or third-party cookies.
- Scripts and media are self-hosted. Pages MUST NOT load third-party scripts.
- **Exception: web fonts.** Fonts MAY come from an external service such as Google Fonts; downloading them at build time and serving them from this site is preferred. Any third-party domain the site loads from must be added to the CSP.

### VII. Simplicity and Restraint
- Prefer built-in browser and framework features over adding a dependency. Add a dependency when it clearly saves work, and say why in the commit.
- Don't build features that aren't wanted yet. The spec's "Removed for now" list holds ideas until they're asked for again.

### VIII. Checks Run on Request
- **Nothing blocks a push or a deploy except a failed build.** CI only installs, builds and deploys; if the build fails, the previous version stays live (spec Q43).
- The checks stay in the repo as tools: `pnpm typecheck` (strict TypeScript), `pnpm lint`, `pnpm validate:html` (article HTML and metadata), `pnpm check:links`, `pnpm check:a11y` (axe in light and dark), or all of them with `pnpm check`.
- They run when the owner asks for a review with `/review-frontend`, which reports recommendations and changes nothing unless asked. Reviews happen when the owner is ready, not after every change.
- Automated tests (unit, end-to-end) are not required. Add them if a piece of logic keeps breaking.

---

## Technical Baseline

| Area | Decision |
|---|---|
| Framework | Vue 3: Composition API, `<script setup>`, TypeScript (strict) |
| Rendering | **Nuxt 4** (built on Vite), static generation via `nuxt generate` |
| Content | Articles as HTML files in `content/articles/`, loaded and pre-rendered at build time |
| Project data | Typed TypeScript array (`content/projects.ts`) |
| Site identity | `content/site.ts` (name, tagline, contact links) |
| Article metadata | `<title>` and `<meta>` tags in each article's `<head>` (Principle III); malformed values warn and fall back |
| Styling | Plain CSS + Vue `<style scoped>` blocks, with custom-property design tokens |
| Fonts | External services such as Google Fonts allowed; downloading at build and self-hosting preferred |
| Theme | `prefers-color-scheme` by default via CSS; manual choice stored in `localStorage` and applied by a tiny inline script before first paint |
| Security policy (CSP) | Added after the build as a `<meta http-equiv>` tag, with a hash for every inline script (`scripts/postgenerate.mjs`). `style-src 'unsafe-inline'` is an accepted gap, because Nuxt inlines component CSS |
| Review tools | `html-validate` + `scripts/check-article-rules.mjs`, `scripts/check-links.mjs`, Playwright + `@axe-core/playwright` (`scripts/check-a11y.mjs`) |
| Test fixtures | Test-only articles in `tests/fixtures/articles/`, included only when `PORTFOLIO_FIXTURES=1` (`pnpm dev` and `pnpm check` set it; the deploy build doesn't) |
| Base URL | `deploy.config.json` (`/`), read by the Nuxt config and the scripts; `NUXT_APP_BASE_URL` overrides it. Don't hard-code root paths |
| Prerender routes | Listed explicitly in `nuxt.config.ts` (`prerenderRoutes`); a new page must be added there. The crawler is off because of nitrojs/nitro#4441; revisit when PR #4688 ships |
| Package manager | **pnpm 12**, lockfile committed; settings in `pnpm-workspace.yaml` |
| Runtime | **Node 24 LTS** |
| TypeScript | **6.x**, pinned until typescript-eslint supports 7 |

---

## Hosting & Deployment

- **Host: GitHub Pages**, deployed by GitHub Actions on every push to `main` that builds successfully. The repository is **public**.
- **Day-to-day work happens on `main`** (spec Q38). Use a short-lived branch for risky experiments, such as a redesign or a build/config change, and merge it when it looks right. No PR or check is required to merge.
- **Address:** `https://moreno-m2698.github.io/` (repo `moreno-m2698/moreno-m2698.github.io`, base path `/`).
- **Custom domain:** to be purchased; set up with a `CNAME` file and HTTPS enforced. Check that the github.io address redirects after the switch.
- **Limits of this host:** no custom HTTP headers (CSP lives in a `<meta>` tag), no server redirects (hence permanent slugs), no preview sites (preview locally with `pnpm generate && pnpm preview`). A static `404.html` is generated for the custom 404 page.

### Public Repository Rules
- No secrets, tokens or private notes in the repo, ever.
- Draft articles are publicly readable in the source. Keep unfinished drafts out of `content/articles/` on `main` (keep them local or on a branch).
- The resume PDF is committed and served at `/resume.pdf`, replaced under the same name. It MUST NOT include a home address or phone number, because every old version stays readable in git history.

---

## Governance
- Amend this document in a commit that bumps the version (**MAJOR:** a principle removed or redefined; **MINOR:** one added; **PATCH:** wording) and updates the date. Record the decision in the spec's decisions log.
- Earlier versions (v1.x, with blocking quality gates and a full feature workflow) are in git history.
