# Portfolio Site — Specification

> Refined from an initial ideas note (removed; see git history) through clarifying Q&A, then narrowed on 2026-11-07 to fit the time available (Q37–Q45).
> Purpose: what to build. How decisions get made is in `constitution.md`.

---

## 1. Overview

A personal portfolio site, built from scratch, that acts as the central hub for professional networking. It has three jobs:

1. **Showcase** projects (all have public GitHub repos; a few also have live URLs).
2. **Link out** to the resume, LinkedIn, GitHub, and email.
3. **Publish articles**: a blog and learning diary about new concepts as they're learned.

The site should come across as a clean, smooth, professional showcase. **The site's own design is the design showcase**, so there is no separate gallery.

## 2. Goals & Audience

### Target role
- **Full-stack developer**

### Primary audiences
| Audience | What they need |
|---|---|
| Recruiters | Quick scan: who you are, your role, resume, how to contact you |
| Hiring managers | Depth: project summaries, tech stack, links to code |
| Other developers | Articles, code, repos |

## 3. Current Priority

**The home page** (Q45). Other pages get attention once Home reaches a state the owner is happy with. Nothing on the other pages blocks work on Home.

## 4. Site Map

| Route | Page | Status |
|---|---|---|
| `/` | Home | **Priority; design open** (§5.1) |
| `/about` | About | Planned; design not decided. Placeholder page live |
| `/projects` | Projects | Planned; design not decided. Placeholder page live |
| `/articles` | Articles list | Built (basic) |
| `/articles/:slug` | Article page | Built |
| `/resume.pdf` | Resume (PDF file, no page; Q46) | Placeholder PDF; real one still to come |
| `/404` | Custom not-found page | Built |

## 5. Page Requirements

### 5.1 Home
- **Fully open** (Q45): a blank canvas until the owner has built something they like. The current hero, latest-articles section and contact links are the Milestone 1 placeholder and can be kept, changed or removed. Record the design decisions here once the page settles.

### 5.2 About (tentative)
The page will exist; how it's built isn't decided (Q44). Ideas from the original spec, not requirements: bio with photo, skills, experience timeline, currently learning.

### 5.3 Projects (tentative)
The page will exist; how it's built isn't decided (Q44). Ideas from the original spec, not requirements: 1–5 hand-curated projects, cards only (no detail pages, no filtering), each with media, tech stack, repo and demo links, and a 1–3 sentence summary. Data lives in `content/projects.ts`.

### 5.4 Articles (list)
- All articles, newest first, with date, reading time, description and tags as text.
- Supports a **mix** of polished technical articles and informal diary-style learning entries.

### 5.5 Article (individual page)
- Title, date, "Updated on" line when set, reading time, tags, and the article body styled by the prose stylesheet.

### 5.6 Resume
- **PDF only**, committed and served at `/resume.pdf`. There is no `/resume` page (Q46): every Resume link, including the main navigation, opens the PDF directly.

### 5.7 Custom 404
- A styled "page not found" page that works without JavaScript.

### 5.8 Global (every page)
- Navigation to all main pages, always visible (wraps on narrow screens).
- Contact is **links only** (no contact form): LinkedIn, GitHub, Email.
- Light/dark mode: follows the OS by default, with a manual toggle.

## 6. Content Authoring

- Articles are **HTML files** in `content/articles/`, written as complete HTML documents (the build takes the `<body>` content and wraps it in the site layout).
- Metadata follows the standard in `constitution.md` (Principle III): a required `<title>`, plus optional `description`, `date`, `updated` and Obsidian-style `tags`. Bad values warn and fall back; they don't fail the build.
- Publishing: commit and push to `main`.
- Site identity (name, tagline, contact links) lives in `content/site.ts`; projects in `content/projects.ts`; About content in `app/pages/about.vue`.

## 7. Features

### 7.1 In the site now

| ID | Feature | Status |
|---|---|---|
| F-01 | Hero/intro section | Built as a placeholder; Home is open (Q45) |
| F-02 | Latest articles section | Built as a placeholder; Home is open (Q45) |
| F-03 | Resume / LinkedIn / GitHub / Email links | Built (Home and footer) |
| F-04–F-07 | About: bio + photo, skills, experience, currently learning | Placeholder; tentative (Q44) |
| F-08/F-09 | Project cards: media, stack, links, summary | Placeholder card; tentative (Q44) |
| F-10 | Article list | Built |
| F-14 | Reading time estimate | Built |
| F-15 | Tags shown on articles (as text) | Built |
| F-19 | HTML article authoring in repo | Built |
| F-20 | Resume PDF download | Built (placeholder PDF); the `/resume` page was removed (Q46) |
| F-21 | Custom 404 page | Built |
| F-22 | Light/dark mode with manual toggle | Built |
| F-24 | Basic SEO: titles, meta descriptions, canonical URLs, semantic markup | Built (no sitemap) |
| F-25 | Social share previews: Open Graph / Twitter tags | Built (no share image) |

### 7.2 Removed for now (Q40)
Not in scope. Any of these can come back by asking for it and moving it to §7.1. The IDs are kept so history stays traceable.

| ID | Feature |
|---|---|
| F-11 | Tag filtering |
| F-12 | Article search (titles, tags, summaries) |
| F-13 | Article series links (the `series` metadata tag was dropped too, Q41) |
| F-16 | Syntax-highlighted code blocks (Shiki) |
| F-17 | Image handling in articles (plain `<img>` in article HTML still works) |
| F-18 | Diagrams in articles (build-time Mermaid, custom SVG) |
| F-23 | Motion: page transitions, scroll reveals |
| F-24 (part) | Sitemap |
| F-25 (part) | Share image |

## 8. Design

- **Visual direction: minimal / clean**: lots of whitespace, restrained color, typography-led.
- No existing branding; colors, typography and logo are defined from scratch. The current palette and system font stack are placeholders, changed by editing the design tokens.
- The site's design is itself the design showcase.

## 9. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Accessibility | **WCAG 2.2 AA** as the goal, checked at review time (Q39) |
| Motion | Respect `prefers-reduced-motion` |
| Responsiveness | Mobile- and desktop-friendly |
| Browser support | Latest 2 versions of Chrome, Edge, Firefox, Safari (desktop and mobile) |
| Analytics | **None** |
| SEO | Basic SEO + social share tags |
| Domain | Custom domain to be purchased; live at `moreno-m2698.github.io` until then |
| Site repository | **Public**; the portfolio is **not** listed as a project |

## 10. Decisions Log

| # | Question | Decision |
|---|---|---|
| Q1 | Project detail pages? | **Cards only**, with a 1–3 sentence summary; deeper detail in the GitHub README *(tentative since Q44)* |
| Q2 | Article authoring? | **HTML files in repo**, commit and push to publish (changed from Markdown/MDX) |
| Q3 | Tech stack? | **Vue 3 + Nuxt 4** (static generation); details in `constitution.md` |
| Q4 | Hosting? | **GitHub Pages** via GitHub Actions |
| Q5 | Is the portfolio a showcase project? | **No**: not listed (repo is public, see Q10) |
| Q6 | Visual direction? | **Minimal / clean** |
| Q7 | Design gallery? | **Dropped**: the site's own design is the showcase |
| Q8 | Featured projects on Home? | **Removed** *(superseded by Q45: Home is open)* |
| Q9 | Search scope? | Titles, tags, and summaries *(search removed for now, Q40)* |
| Q10 | Repository visibility? | **Public**, which enables free GitHub Pages hosting |
| Q11 | Styling? | **Plain CSS + Vue `<style scoped>` blocks**; no utility framework |
| Q12 | Where does article metadata live? | **In each article's `<head>`** (`<title>` + `<meta>` tags); articles are complete HTML documents |
| Q13 | "Sections page" from the original ideas? | **Dropped**: not needed |
| Q14 | Site identity values (name, tagline, contact URLs)? | **One typed file, `content/site.ts`**, with clearly marked placeholders until filled in |
| Q15 | Visual design for the first build? | **Neutral placeholder palette + system font stack** as design tokens; real design applied later by changing tokens |
| Q16 | Resume PDF before the real one exists? | **Placeholder PDF** at `/resume.pdf` (no personal details), replaced under the same name |
| Q17 | Mobile navigation? | **All links always visible, wrapping** on narrow screens; no menu button, no JavaScript |
| Q18 | Breakpoints? | **40rem and 64rem** (`min-width`, mobile-first) |
| Q19 | Article for testing before real articles exist? | **Test-only sample article** in a fixtures folder; never published |
| Q20 | Empty states? | Short text ("No articles yet", "No projects yet"); Home's latest-articles section hidden when empty |
| Q21 | Remember a manual theme choice? | **Yes**, in `localStorage`, applied by a tiny inline script before first paint; without JavaScript the OS setting applies |
| Q22 | Theme toggle states? | **Two states** (Light / Dark button, `aria-pressed`) *(superseded by Q47: action label, no `aria-pressed`)* |
| Q23 | Date for an undated article that isn't committed yet? | **The file's last-modified date**; the git first-commit date takes over once committed |
| Q24 | Standardize article metadata? | **Yes, an extensible standard**: required `<title>`; optional `description`, `date`, `updated`, `tags` *(`series` dropped by Q41)*. Unknown tags are ignored |
| Q25 | Tag format? | **Obsidian-style**, space-separated, `#` optional; nested with `/`; case-insensitive; no spaces; not all numbers |
| Q26 | Malformed metadata values? | Fail the article check in CI *(superseded by Q41: warn and fall back)* |
| Q27 | Reading time formula? | **Body words ÷ 200 per minute**, rounded, minimum 1 minute |
| Q28 | Where does the Resume call-to-action link? | **Straight to `/resume.pdf`**; the `/resume` page stays reachable from the main navigation *(superseded by Q46: no `/resume` page)* |
| Q29 | Search and tag controls before they're built? | **Omitted** (no disabled placeholders); tags shown as text |
| Q30 | Record Milestone 1 technical decisions in the constitution? | **Yes** (constitution v1.1.0) |
| Q31 | TypeScript 7 is unsupported by typescript-eslint; which version? | **Pin TypeScript 6.x** until typescript-eslint supports 7 |
| Q32 | `nuxt.config.ts` needs Node types; add a dependency? | **Yes, `@types/node@^24`** (dev only) |
| Q33 | Nitro's crawler renders every page twice with a non-root base URL (nitrojs/nitro#4441). Fix? | **Crawler off; routes listed explicitly**. Revisit when Nitro PR #4688 ships |
| Q34 | Canonical URL on error pages? | **None**: error pages get robots `noindex` and no canonical or `og:url` |
| Q35 | Meta descriptions for Projects, Articles, Resume and error pages? | **Placeholder wording accepted** until the real copy is written |
| Q36 | Where does the site live before the custom domain? | **At the root, `moreno-m2698.github.io`** (repo renamed; the previous site archived as `old-github-site`, 2026-10-21) |
| Q37 | The process is heavy for the time available. What changes? | **Principles become goals checked at review time**, not merge gates (constitution v2.0.0, 2026-11-07) |
| Q38 | Where does day-to-day work happen? | **On `main`**, pushed straight live; a short-lived branch only for risky experiments, with no PR or checks required |
| Q39 | How is accessibility enforced? | **WCAG 2.2 AA stays the goal.** Axe runs during `/review-frontend` and reports without blocking. The manual keyboard and screen reader pass happens before milestones that matter (e.g. sharing with recruiters) |
| Q40 | Which unbuilt features stay in scope? | **None for now.** F-11, F-12, F-13, F-16, F-17, F-18, F-23, the sitemap (F-24) and the share image (F-25) are removed until asked for again |
| Q41 | How should article writing work? | **Keep HTML.** Malformed metadata logs a warning and uses the fallback instead of failing the build; the `series` tag is dropped |
| Q42 | How do the owner and Claude work together? | **The owner leads**; Claude helps on request, working directly without the subagent pipeline (agents removed). `/review-frontend` is the only standing ritual, run when the owner asks. Plan documents only for large changes |
| Q43 | What happens to the existing checks and CI? | **CI only installs, builds and deploys.** The check scripts stay as review tools (`pnpm check`, `/review-frontend`); CSP hashing stays in the build |
| Q44 | About and Projects pages? | **They will exist, but their design isn't decided.** The current details are tentative ideas and don't block other work |
| Q45 | What's the priority, and what must Home contain? | **Home first**, and its contents are **fully open** until the owner has built something they like. Other pages come after |
| Q46 | Does the resume need its own page? | **No.** The `/resume` page is removed; every Resume link (main navigation, Home, footer) opens `/resume.pdf` directly (2026-11-11) |
| Q47 | What does the theme button say? | **The theme a click switches to** ("Switch to dark theme" / "Switch to light theme"). `aria-pressed` is dropped, because a toggle button's label must not change (2026-11-11) |
