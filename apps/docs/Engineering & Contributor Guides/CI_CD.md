# CI/CD Pipeline

This doc describes CI for a pnpm + Turbo monorepo.

## CI (per PR/main)

- Install pnpm, restore pnpm store cache
- turbo run lint typecheck build test (affected graph)
- Build Storybook once (packages/storybook)
- Config guard: ensure standard configs match

## Deploys

- Per-app deploys (Studio, Assist, Connect) gated on successful build
- Preview on PR branches; Production on main/tags
- Vercel/Netlify Actions as appropriate

## Releases (optional)

- Use Changesets or manual publish
- NPM_TOKEN required for publishing public packages

## Caching

- Turbo remote cache recommended
- Cache .next, dist outputs per pipeline definition
