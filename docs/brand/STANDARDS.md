# Engineering Standards & AI Co‑Developer Rules

This document codifies coding conventions, code generation rules, and expectations for AI code collaborators (Copilot, Gemini).

## Language & framework

- TypeScript strict everywhere
- Next.js App Router preferred; Pages Router allowed during migration
- ESM-first; packages define proper exports and types

## Code style

- ESLint + Prettier at root; no per-app divergences unless approved
- Import order enforced; no default exports for components unless necessary
- Tests colocated under __tests__ or *.test.ts(x)

## Theming & accessibility

- AppThemeProvider from packages/core wraps all apps
- Respect prefers-color-scheme and prefers-reduced-motion
- Components meet WCAG AA; all interactive elements accessible via keyboard

## AI co‑developer rules

- Copilot/Gemini may generate code but must:
  - Follow this repository’s conventions and directory layout
  - Prefer existing primitives in packages/ui over creating new ones
  - Add or update minimal tests for changed public behavior
  - Avoid introducing new dependencies without justification
  - Keep changes scoped; no mass refactors without an issue/plan
- For new features, include a small contract in PR description:
  - Inputs/outputs, data shapes, error modes
  - Edge cases considered

## Testing

- Unit tests for core logic; component tests for UI
- Visual regression for theme light/dark (Storybook integration)
- E2E for key flows (Studio V.I.B.E switching, Capsule packaging)

## Security

- No secrets in repo; use env vars and GitHub secrets
- Validate inputs in API routes; avoid eval/dynamic requires

## Documentation

- Update docs for any new public surface
- Keep READMEs in packages/apps current
