# CLAUDE.md

Personal portfolio site: Vue 3 + Nuxt 4, statically generated and hosted on GitHub Pages at `https://moreno-m2698.github.io/` (repo `moreno-m2698/moreno-m2698.github.io`, base URL `/`).

## Source documents

- [`constitution.md`](constitution.md): the principles (accessibility, static-first, content rules, styling, privacy, hosting). They are **goals checked at review time**, not gates.
- [`portfolio-spec.md`](portfolio-spec.md): what to build (site map, page requirements, features in scope and removed for now, decisions log).
- [`docs/plans/milestone-1.md`](docs/plans/milestone-1.md): history of the first build. Read only when you need the background on how something was built.

## How we work (spec Q37–Q45)

- **The owner leads.** They write most of the HTML, CSS and content. Help when asked, working directly in the main session. Don't delegate to a subagent pipeline, and don't add process the owner didn't ask for.
- **Speed over ceremony.** Don't run checks after every change, and don't block work on failed checks. Only a failed build stops a deploy.
- **Work on `main`.** Pushing to `main` deploys if the build succeeds. Use a short-lived branch only for risky changes (a redesign, build or CI changes). Commit or push only when the owner asks.
- **Reviews only on request**, through `/review-frontend` (`.claude/skills/review-frontend/`). Don't offer unprompted CSS/HTML reviews after small changes.
- **Scope:** if a request touches a feature in the spec's "Removed for now" list, mention it and, if the owner confirms, move it back into scope in the spec. Write a plan document only for large changes.
- **Decisions:** when the owner makes a decision about scope or principles, record it in the spec's decisions log (and bump the constitution's version and date if a principle changes). Ask clarifying questions one at a time.
- If a change would clearly work against a constitution principle (e.g. a third-party script, or breaking keyboard access), say so briefly, then do what the owner decides.

## Current status

- **Priority: the home page** (spec Q45). Its content is fully open; the current hero, latest articles and contact links are placeholders. Other pages wait until Home is in a good state.
- About and Projects will exist, but their design isn't decided (spec Q44). Don't let them block Home.
- The site is live with placeholder content: `content/site.ts`, `content/projects.ts`, the About page and `public/resume.pdf` (replace under the same name; no address or phone number).
- The manual keyboard and screen reader pass hasn't been done yet. It's due before a milestone that matters, like sharing the site with recruiters.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server, with test fixture articles included |
| `pnpm generate` | Production build to `.output/public` (adds the CSP) |
| `pnpm preview` | Serve the built output at `http://localhost:4173/` |
| `pnpm check` | All checks: typecheck, lint, article HTML, build with fixtures, links, axe (light and dark) |
| `pnpm typecheck` / `pnpm lint` / `pnpm lint:fix` / `pnpm validate:html` / `pnpm check:links` / `pnpm check:a11y` | Individual checks (`check:links` and `check:a11y` need a build first) |

## Technical notes

- **Prerender routes are explicit** (`nuxt.config.ts`): a new page must be added to `prerenderRoutes` (the crawler is off because of a Nitro bug, nitrojs/nitro#4441; revisit when PR #4688 ships).
- **Base URL** comes from `deploy.config.json`. Don't hard-code root paths; use `NuxtLink` or `assetUrl()`.
- **Toolchain:** Node **24 LTS** (nvm-windows), **pnpm 12** (Corepack), TypeScript **6.x** (pinned until typescript-eslint supports 7).
- pnpm settings live in `pnpm-workspace.yaml` (camelCase, e.g. `shellEmulator`, `allowBuilds`); pnpm 12 ignores them in `.npmrc` and in the `package.json` `"pnpm"` field.
- If pnpm shows a Corepack download prompt in a non-interactive shell, set `COREPACK_ENABLE_DOWNLOAD_PROMPT=0`.
