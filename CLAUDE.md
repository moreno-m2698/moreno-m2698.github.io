# CLAUDE.md

Personal portfolio site: Vue 3 + Nuxt 4, statically generated and hosted on GitHub Pages.

## Source documents

Read these before planning or implementing anything:

- [`constitution.md`](constitution.md): the governing principles (accessibility, static-first, content rules, styling, performance, privacy, quality gates, hosting). **It takes precedence** over the spec, plans and code.
- [`portfolio-spec.md`](portfolio-spec.md): what to build (site map, page requirements, feature IDs F-01 to F-25, decisions log).

Rules:
- Every feature MUST trace back to a feature ID in the spec. If a request isn't in the spec, raise it as a spec proposal before building it.
- If work would break a constitution principle, stop and say so. Don't work around it quietly.
- When a decision is made, update the relevant document (the constitution's version and date, and the spec's decisions log) in the same change.

## Current status

- **Milestone 1** (scaffold, layout, skeleton pages, checks, deploy): plan in [`docs/plans/milestone-1.md`](docs/plans/milestone-1.md), approved 2026-10-20. Work is on the `milestone-1` branch. **All batches (A–D) are done and verified.** Before merging to `main`: the user's manual keyboard and screen reader pass, the GitHub Pages source setting, and CI on a pull request (see the plan's Status).
- **Prerender routes are explicit** (`nuxt.config.ts`): a new page must be added to `prerenderRoutes` (the crawler is off because of a Nitro bug, nitrojs/nitro#4441). Start with the plan's **Status** section.
- **Toolchain:** Node **24 LTS** (v24.22.0, managed with nvm-windows), **pnpm 12** (via Corepack), TypeScript **6.x** (pinned; see the constitution's Technical Baseline).
- If pnpm shows a Corepack download prompt in a non-interactive shell, set `COREPACK_ENABLE_DOWNLOAD_PROMPT=0`.

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

## Working conventions

- Package manager: **pnpm 12** (lockfile committed). pnpm settings live in `pnpm-workspace.yaml` (camelCase, e.g. `shellEmulator`, `allowBuilds`); pnpm 12 ignores them in `.npmrc` and in the `package.json` `"pnpm"` field.
- Work on a branch. Merge to `main` only after the Phase 1 quality gates pass (constitution, Principle VIII).
- Commit or push only when the user asks.
