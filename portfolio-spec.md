# Portfolio Site — Specification

> Refined from `Ideas for a portfolio.md` through clarifying Q&A.
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

### 4.7 Custom 404
- A styled "page not found" page

### 4.8 Global (every page)
- Navigation to all main pages
- Contact is **links only** (no contact form): LinkedIn, GitHub, Email
- Light/dark mode toggle

## 5. Content Authoring

- Articles are written as **Markdown/MDX files in the site's repository**
- Publishing workflow: commit and push
- Project cards are hand-curated content maintained in the repository

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
| F-19 | Markdown/MDX authoring in repo | Authoring |
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
| Domain | Custom domain, **to be purchased** |
| Site repository | Private; the portfolio is **not** listed as a project |
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
| Q2 | Article authoring? | **Markdown/MDX in repo**, commit and push to publish |
| Q5 | Is the portfolio a showcase project? | **No**: private repo, not listed |
| Q6 | Visual direction? | **Minimal / clean** |
| Q7 | Design gallery? | **Dropped**: the site's own design is the showcase |
| Q8 | Featured projects on Home? | **Removed**: no featured projects section |
| Q9 | Search scope? | **Titles, tags, and summaries** |

## 11. Deferred to Technical Planning

| # | Topic |
|---|---|
| Q3 | Tech stack |
| Q4 | Hosting provider and budget |
