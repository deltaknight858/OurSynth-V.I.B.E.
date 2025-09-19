# Onboarding

Welcome to the OurSynth monorepo. This guide gets you productive quickly.

## Prerequisites

- Node LTS (>=18)
- pnpm
- Git LFS (for large assets)
- Optional: Vercel CLI

## Setup

```bash
pnpm install
pnpm dev        # run all dev processes in parallel (turbo)
```

Run a single app:

```bash
cd apps/studio && pnpm dev
```

## Repository tour

- apps/: studio, assist, connect, (aether), halo-ui-demo
- packages/: core, ui, agents, capsule, mesh, orchestrator, shared-types, storybook
- docs/: technical manual (start at docs/README.md)
- legacy/: archived Labs and captures

## Standards

- Always wrap pages with AppThemeProvider (packages/core)
- Use packages/ui for shared components; avoid app-local duplicates
- Keep React/Next versions aligned with root overrides

## Common scripts

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

See CI_CD.md for pipelines and caching.
