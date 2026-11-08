---
name: review-frontend
description: Review the portfolio's HTML, CSS and accessibility and return prioritized recommendations. Runs only when the owner types /review-frontend, optionally followed by a page, component or file to focus on.
disable-model-invocation: true
argument-hint: "[page, component or path; default: changes since the last review]"
---

# Frontend review

The owner asked for a review of their HTML/CSS work. Your job is to **recommend, not change**: do not edit files unless the owner asks afterwards.

Focus: $ARGUMENTS

## 1. Work out the scope

- If a focus was given above, review that page, component or path (and the CSS it depends on).
- Otherwise, review what changed since the last review:
  - Run `git rev-parse --verify --quiet review/last`. If that tag exists, the scope is `git diff review/last` (committed and uncommitted changes) plus untracked files from `git status --short`, limited to `app/`, `content/`, `public/` and article HTML.
  - If the tag doesn't exist, this is the first review: cover the home page (`app/pages/index.vue` and the components it uses), the layout, and the global CSS in `app/assets/css/`.
- Tell the owner the scope in one line before going further.

## 2. Read the code

Read every file in scope in full, plus the tokens (`app/assets/css/tokens.css`) and anything a file in scope relies on. Review against `constitution.md` Principles I, II and IV:

- **Semantic HTML:** landmarks, one `<h1>` per page and a logical heading order, lists for lists, buttons vs links, native elements before ARIA, `alt` text.
- **Accessibility (WCAG 2.2 AA):** keyboard access and focus visibility, contrast of any new colors (in both themes), target size, reduced motion, text that makes sense out of context (e.g. link names).
- **CSS:** design tokens instead of hard-coded values, mobile-first `min-width` queries at 40rem / 64rem, no `max-width` layout queries, scoped component styles, no layout that breaks at 320px or at 400% zoom, selector specificity, duplicated or dead rules, simpler modern CSS where it would help (e.g. `gap`, logical properties, `clamp()`).
- **Static-first:** content readable without JavaScript; browser-only code kept in `onMounted` or client-only components.
- **Vue/Nuxt structure:** small components with one job, props rather than reaching into globals, `NuxtLink`/`assetUrl()` rather than hard-coded root paths, new pages added to `prerenderRoutes`.

## 3. Run the automated checks

Run each one separately so one failure doesn't hide the others, and keep going if one fails:

1. `pnpm typecheck`
2. `pnpm lint`
3. `pnpm validate:html`
4. `pnpm generate:fixtures` (builds with the test articles)
5. `pnpm check:links`
6. `pnpm check:a11y` (axe, light and dark). If Chromium is missing, say that `pnpm exec playwright install chromium` fixes it and move on.

If the build fails, skip 5 and 6 and report the build error as the top finding.

## 4. Report

Start with a one-line summary, such as "3 things to fix, 4 suggestions, all checks pass". Then group the findings:

1. **Fix:** broken behavior, WCAG AA failures (axe or found by reading), build/type/lint errors.
2. **Should change:** departures from the constitution's SHOULDs, fragile CSS, likely problems on small screens or in one theme.
3. **Consider:** simplifications, cleaner patterns, design polish.

For each finding: `file:line`, what's wrong in one sentence, why it matters, and a concrete suggested change (a short snippet when it helps). Merge findings that share a cause. Don't pad the list: a clean area gets one line saying so. End with the check results (pass or fail per check).

Then mention that a manual keyboard and screen reader pass is still worth doing before a milestone that matters, if the change touched navigation, interactive elements or page structure.

## 5. Mark the review

After reporting, move the review marker so the next review starts from here: `git tag -f review/last HEAD`. It's a local tag; don't push it. Tell the owner you moved it, and that uncommitted changes in this review will show up again next time if they're still uncommitted.
