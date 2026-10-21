# Portfolio Site — Specification

> Refined from an initial ideas note (removed; see git history) through clarifying Q&A.
> Purpose: a planning document for identifying features and deciding what to build.
> Scope: product and feature requirements only. Technical decisions (stack, hosting) are deferred to a separate technical planning phase.

---

## 1. Overview

A personal portfolio site, built from scratch, that acts as the central hub for professional networking. It has three jobs:

1. **Showcase** projects (all have public GitHub repos; a few also have live URLs).
2. **Link out** to the resume, LinkedIn, GitHub, and email.
3. **Publish articles**: a blog and learning diary about new concepts as they're learned.

The site should come across as a clean, smooth, professional showcase. **The site's own design is the design showcase**, so there is no separate gallery. It must stay extensible so custom components can be added later.

## 2. Goals & Audience

### Target role
- **Full-stack developer**

### Primary audiences
| Audience | What they need |
|---|---|
| Recruiters | Quick scan: who you are, your role, resume, how to contact you |
| Hiring managers | Depth: project summaries, tech stack, links to code |
| Other developers | Articles, code, repos |

### Primary visitor actions (all equally important)
- Get the resume
- Contact (through links)
- Read articles
- Explore code (GitHub repos and live demos)

## 3. Site Map

```
/                 Home
/about            About
/projects         Projects (cards only; no detail pages)
/articles         Articles list
/articles/:slug   Article page
/resume           Resume (PDF)
/404              Custom not-found page
```

## 4. Page Requirements

### 4.1 Home
- **Intro / hero**: name, title (Full-stack developer), short tagline
- **Latest articles**: previews of the most recent articles
- **Links / CTAs**: Resume, LinkedIn, GitHub, Email
- No featured projects section

### 4.2 About
- Bio with photo
- Skills (languages, frameworks, tools)
- Experience timeline (work history and education)
- Currently learning

### 4.3 Projects
- Expected count at launch: **1–5**
- Content is **hand-curated**, not pulled automatically from GitHub
- All repos are **public**
- **No filtering** (simple list or grid)
- **Cards only**: no per-project detail pages
- Each card shows:
  - Screenshots / media
  - Tech stack
  - Links: GitHub repo (always) and live demo (when one exists)
  - Short narrative summary (1–3 sentences) covering role, dates, problem solved, and outcome; deeper detail lives in the project's GitHub README

### 4.4 Articles (list)
- Tags / categories, used to group and filter
- Search over **titles, tags, and summaries/descriptions** (not full article text)
- Series (related multi-part articles linked together)
- Supports a **mix** of polished technical articles and informal diary-style learning entries

### 4.5 Article (individual page)
- Estimated reading time
- Article tags
- Content must support **code blocks with syntax highlighting**, images, and diagrams
- Math equations were *not* selected as requirements

### 4.6 Resume
- **PDF only**: the page displays and/or links to a downloadable PDF
- The PDF is committed to the repo and served at a stable URL (`/resume.pdf`)

### 4.7 Custom 404
- A styled "page not found" page

### 4.8 Global (every page)
- Navigation to all main pages
- Contact is **links only** (no contact form): LinkedIn, GitHub, Email
- Light/dark mode toggle

## 5. Content Authoring

- Articles are written as **HTML files in the site's repository** as complete, valid HTML documents (the build takes the `<body>` content and wraps it in the site layout)
- Article metadata follows the **article metadata standard** in `constitution.md` (Principle III): a required `<title>`, plus optional `description`, `date`, `updated`, `series` and Obsidian-style `tags` (e.g. `#vue/reactivity #javascript`). New tags can be added to the standard later
- Publishing workflow: commit and push
- Project cards are hand-curated content maintained in the repository, as a typed TypeScript data file
- About page content is written directly in the About page component

## 6. Feature List

Feature IDs are for referencing during planning. All features are **MVP** (required for first launch).

| ID | Feature | Area |
|---|---|---|
| F-01 | Hero/intro section | Home |
| F-02 | Latest articles section | Home |
| F-03 | Resume / LinkedIn / GitHub / Email CTAs | Home, Global |
| F-04 | Bio + photo | About |
| F-05 | Skills section | About |
| F-06 | Experience timeline | About |
| F-07 | Currently learning section | About |
| F-08 | Project card grid/list (curated, 1–5 items, no filtering) | Projects |
| F-09 | Project card: media, stack, repo/demo links, short summary | Projects |
| F-10 | Article list | Articles |
| F-11 | Tags / categories + tag filtering | Articles |
| F-12 | Article search (titles, tags, summaries) | Articles |
| F-13 | Article series | Articles |
| F-14 | Reading time estimate | Article |
| F-15 | Tags shown on article | Article |
| F-16 | Syntax-highlighted code blocks | Article |
| F-17 | Images in articles | Article |
| F-18 | Diagrams in articles | Article |
| F-19 | HTML article authoring in repo | Authoring |
| F-20 | Resume PDF page / download | Resume |
| F-21 | Custom 404 page | Global |
| F-22 | Light/dark mode: follows OS setting by default, with manual toggle | Global |
| F-23 | Moderate motion (page transitions, scroll reveals) | Global |
| F-24 | Basic SEO (titles, meta descriptions, sitemap, semantic markup) | Global |
| F-25 | Social share previews (Open Graph / Twitter cards) | Global |

## 7. Design & Extensibility

- **Visual direction: minimal / clean**: lots of whitespace, restrained color, typography-led
- No existing branding; colors, typography, and logo are defined from scratch
- The site's design is itself the design showcase; there is no separate gallery
- **Custom components**: the build must allow new layouts and components to be added later without working against a template

## 8. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Accessibility | **WCAG 2.2 AA** compliance |
| Motion | Moderate animation; must respect `prefers-reduced-motion` |
| Responsiveness | Mobile- and desktop-friendly |
| Browser support | Modern evergreen: latest 2 versions of Chrome, Edge, Firefox, Safari (desktop and mobile) |
| Analytics | **None** |
| SEO | Basic SEO + social share previews |
| Domain | Custom domain, **to be purchased**; launch first at `moreno-m2698.github.io/portfolio` and switch when bought |
| Site repository | **Public**; the portfolio is **not** listed as a project |
| Timeline | **ASAP**: launch the MVP within weeks, iterate afterward |

## 9. MVP Scope

Everything in §6 is in scope for the first launch:
- Home, About
- Projects (cards)
- Articles (list + article pages, including tags, search, series, reading time, code/images/diagrams)
- Resume (PDF) and custom 404

## 10. Decisions Log

| # | Question | Decision |
|---|---|---|
| Q1 | Project detail pages? | **Cards only**, with a 1–3 sentence summary; deeper detail in the GitHub README |
| Q2 | Article authoring? | **HTML files in repo**, commit and push to publish (changed from Markdown/MDX) |
| Q5 | Is the portfolio a showcase project? | **No**: not listed (repo is public, see Q10) |
| Q6 | Visual direction? | **Minimal / clean** |
| Q7 | Design gallery? | **Dropped**: the site's own design is the showcase |
| Q8 | Featured projects on Home? | **Removed**: no featured projects section |
| Q9 | Search scope? | **Titles, tags, and summaries** |
| Q10 | Repository visibility? | **Public**, which enables free GitHub Pages hosting |
| Q11 | Styling? | **Plain CSS + Vue `<style scoped>` blocks**; no utility framework |
| Q13 | "Sections page" from the original ideas? | **Dropped**: not needed |
| Q14 | Site identity values (name, tagline, contact URLs)? | **One typed file, `content/site.ts`**, with clearly marked placeholders until launch |
| Q15 | Visual design for the first build? | **Neutral placeholder palette + system font stack** as design tokens; real design applied later by changing tokens |
| Q16 | Resume PDF before the real one exists? | **Placeholder PDF** at `/resume.pdf` (no personal details), replaced under the same name |
| Q17 | Mobile navigation? | **All links always visible, wrapping** on narrow screens; no menu button, no JavaScript |
| Q18 | Breakpoints? | **40rem and 64rem** (`min-width`, mobile-first) |
| Q19 | Article for testing before real articles exist? | **Test-only sample article** in a fixtures folder; never published |
| Q20 | Empty states? | Short text ("No articles yet", "No projects yet"); Home's latest-articles section hidden when empty |
| Q21 | Remember a manual theme choice? | **Yes**, in `localStorage`, applied by a tiny inline script before first paint (allowed by hash in the CSP); without JavaScript the OS setting applies |
| Q22 | Theme toggle states? | **Two states** (Light / Dark button, `aria-pressed`); after a manual choice the OS setting no longer applies until storage is cleared |
| Q23 | Date for an undated article that isn't committed yet? | **The file's last-modified date**; the git first-commit date takes over once committed (constitution v0.16.1) |
| Q24 | Standardize article metadata? | **Yes, an extensible standard** (supersedes Q12's "no fixed standard"): required `<title>`; optional `description`, `date`, `updated`, `series`, `tags`. No `keywords` and no `series-part` (series parts are ordered by date). Unknown tags are ignored (constitution v1.0.0) |
| Q25 | Tag format? | **Obsidian-style**, space-separated, `#` optional; nested with `/` (filtering by a parent matches children); case-insensitive; no spaces; not all numbers |
| Q26 | Malformed metadata values? | **Fail the article check** in CI with the file, tag and problem. Missing or empty tags still use their fallbacks and never fail |
| Q27 | Reading time formula? | **Body words ÷ 200 per minute**, rounded, minimum 1 minute; code counts the same as prose |
| Q28 | Where does the Resume call-to-action link? | **Straight to `/resume.pdf`**; the `/resume` page stays reachable from the main navigation |
| Q29 | Search and tag controls before F-11/F-12 are built? | **Omitted** until they work (no disabled placeholders); tags still shown as text on each article |
| Q30 | Record Milestone 1 technical decisions in the constitution? | **Yes, now** (constitution v1.1.0): Playwright + axe, html-validate, post-build CSP hashing, `deploy.config.json` base URL, `PORTFOLIO_FIXTURES`, pnpm 12, Node 24 |
| Q31 | TypeScript 7 is unsupported by typescript-eslint; which version? | **Pin TypeScript 6.x** until typescript-eslint supports 7 (constitution v1.1.1) |
| Q32 | `nuxt.config.ts` needs Node types; add a dependency? | **Yes, `@types/node@^24`** (dev only, types only) |
| Q33 | Nitro's crawler renders every page twice with a non-root base URL (nitrojs/nitro#4441), breaking Windows builds. Fix? | **Crawler off; routes listed explicitly** (static pages + one per article file). Revisit when Nitro PR #4688 ships |
| Q34 | Canonical URL on error pages? | **None**: error pages get robots `noindex` and no canonical or `og:url` |
| Q35 | Meta descriptions for Projects, Articles, Resume and error pages? | **Placeholder wording accepted**; real copy comes with the real site identity before launch |
| Q12 | Where does article metadata live? | **In each article's `<head>`** (`<title>` + `<meta>` tags); articles are complete, valid HTML documents. *(The "no fixed metadata standard" part is superseded by Q24)* |
| Q4 | Hosting? | **GitHub Pages** via GitHub Actions (see `constitution.md`) |

## 11. Deferred to Technical Planning

| # | Topic |
|---|---|
| Q3 | Tech stack: **Vue 3 + Nuxt 4** (static generation), decided; remaining details in `constitution.md` |
