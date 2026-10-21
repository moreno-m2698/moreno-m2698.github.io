# CLAUDE.md

Personal portfolio site: Vue 3 + Nuxt 4, statically generated and hosted on GitHub Pages at `https://moreno-m2698.github.io/` (repo `moreno-m2698/moreno-m2698.github.io`, base URL `/`).

## Source documents

Read these before planning or implementing anything:

- [`constitution.md`](constitution.md): the governing principles (accessibility, static-first, content rules, styling, performance, privacy, quality gates, hosting). **It takes precedence** over the spec, plans and code.
- [`portfolio-spec.md`](portfolio-spec.md): what to build (site map, page requirements, feature IDs F-01 to F-25, decisions log).

Rules:
- Every feature MUST trace back to a feature ID in the spec. If a request isn't in the spec, raise it as a spec proposal before building it.
- If work would break a constitution principle, stop and say so. Don't work around it quietly.
- When a decision is made, update the relevant document (the constitution's version and date, and the spec's decisions log) in the same change.

## Current status

- **Milestone 1** (scaffold, layout, skeleton pages, checks, deploy): plan in [`docs/plans/milestone-1.md`](docs/plans/milestone-1.md), approved 2026-10-20. **Done and merged to `main`** (PR #1). The manual keyboard and screen reader pass is not recorded as done yet.
- **Hosting:** Pages source is GitHub Actions. On 2026-10-21 the repo was renamed from `portfolio` to `moreno-m2698.github.io` and the base URL changed to `/` (spec Q36).
- **Prerender routes are explicit** (`nuxt.config.ts`): a new page must be added to `prerenderRoutes` (the crawler is off because of a Nitro bug, nitrojs/nitro#4441).
- **Toolchain:** Node **24 LTS** (v24.22.0, managed with nvm-windows), **pnpm 12** (via Corepack), TypeScript **6.x** (pinned; see the constitution's Technical Baseline).
- If pnpm shows a Corepack download prompt in a non-interactive shell, set `COREPACK_ENABLE_DOWNLOAD_PROMPT=0`.

## Next up

Open items after Milestone 1, roughly in priority order. Plan each one through the feature workflow below.
1. **Manual keyboard and screen reader pass** over every page in both themes (constitution I and VIII). Required, not yet done.
2. **Real content** (the site is live with placeholders): `content/site.ts` (name, tagline, LinkedIn, email), `content/projects.ts`, About page text (F-04 to F-07; the photo is still to come), and `public/resume.pdf`, replaced under the same name with no address or phone number.
3. **Phase 2 quality gates.** They SHOULD be in place within the first iteration after launch (constitution VIII): Vitest unit tests (metadata parsing and fallbacks, tags, reading time) and Playwright end-to-end tests (navigation, theme toggle, later search).
4. **Remaining MVP features:** F-11 (tag filter; `tagMatches` already exists in `shared/utils/article-meta.ts`), F-12 (search), F-13 (series links), F-16 (Shiki highlighting), F-17/F-18 (article images and diagrams), F-23 (motion), F-24 (sitemap), F-25 (share image).
5. **Confirm the performance budget** after a real build (constitution, Open Questions).
6. **Revisit later:** turn the prerender crawler back on when nitrojs/nitro PR #4688 ships; TypeScript 7 once typescript-eslint supports it.

## Model usage

Work is delegated to the project subagents in `.claude/agents/`, each of which has its model set:

| Work | Agent | Model |
|---|---|---|
| Planning: implementation plans, architecture, breaking features down | `planner` | **Opus** |
| Finding requirement gaps before and during a feature | `requirements-checker` | **Haiku** |
| Writing code | `implementer` | **Haiku** |
| Running tests and quality gates | `test-runner` | **Haiku** |
| Running CLI commands (pnpm, nuxt, git, gh) | `cli-runner` | **Haiku** |
| Web research (docs, library versions, APIs) | `researcher` | **Haiku** |

Feature workflow:
1. `requirements-checker` returns clarifying questions. Subagents can't talk to the user, so the main session asks them **one question at a time** and records each answer in the spec or constitution.
2. `planner` produces the plan, and the user approves it.
3. `implementer` writes the code. Give it a self-contained brief: the feature ID, the approved plan, the relevant constitution principles, the files involved, and what "done" means.
4. `test-runner` runs the quality gates. Failures go back to `implementer`.
5. If new requirement questions come up mid-feature, go back to step 1 for those questions before continuing.
- The main session reviews subagent output against the constitution's quality gates before anything is committed.
- The agents in `.claude/agents/` load at session start. If one isn't found (for example, it was added mid-session), run a general-purpose agent with the same model and tell it to read and follow that agent's file.

## Working conventions

- Package manager: **pnpm 12** (lockfile committed). pnpm settings live in `pnpm-workspace.yaml` (camelCase, e.g. `shellEmulator`, `allowBuilds`); pnpm 12 ignores them in `.npmrc` and in the `package.json` `"pnpm"` field.
- Work on a branch. Merge to `main` only after the Phase 1 quality gates pass (constitution, Principle VIII).
- Commit or push only when the user asks.
