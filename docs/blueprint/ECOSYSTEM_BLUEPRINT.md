# OurSynth Eco Monorepo Blueprint

This blueprint defines the unified structure, boundaries, and migration path for the OurSynth ecosystem.

## Goals

- Single source of truth for apps, packages, and docs
- Consistent standards for theme, branding, storybook, and testing
- Scalable CI/CD with workspace-aware builds and caching

## Repository layout

```text
/ (repo root)
  apps/
    studio/        # Primary workspace UI (Labs → Studio). V.I.B.E lives here as a feature panel.
    assist/        # Conversational orchestration
    connect/       # Env/deploy manager
    halo-ui-demo/  # Optional demo app showcasing packages/ui
    aether/        # Rebuild (visual workflow builder)
  packages/
    core/          # Tokens, AppThemeProvider/useAppTheme, types, contracts
    ui/            # Halo + shadcn primitives; app-agnostic components
    agents/        # Composable, pluggable agent logic
    capsule/       # Capsule manifests, packaging & signing
    mesh/          # Provenance utilities & mesh services
    orchestrator/  # Orchestration layer
    shared-types/  # Cross-package type definitions
    storybook/     # Centralized Storybook config & stories
    aliases/       # Optional alias tooling, if needed
  docs/            # This manual and sub-guides
  legacy/          # Archives: Labs v1/v2, Aether captures, experiments
```

## Key decisions

- V.I.B.E is implemented as a Studio feature panel; deep-link route optional for standalone view.
- “Labs” UX becomes the canonical Studio experience.
- Aether is rebuilt as a net-new app using agents + capsules + provenance.

## Inputs and references

- Unified layout: see .github/instructions/unified-blueprints.instructions.md (if present)
- Theme system prompts: see .github/instructions/copilot.themecreation.instructions.md (if present)

## Migration sequence

1. Stand up packages/core and packages/ui; move tokens, theme provider, and shared components
2. Consolidate agents/capsule/mesh/orchestrator from Labs sources (prefer latest)
3. Compose apps/studio from Labs + OurSynth-Studio features; add V.I.B.E panel
4. Migrate Assist and Connect; refactor shared components to packages/ui; wrap with AppThemeProvider
5. Scaffold apps/aether (rebuilt) and move Desktop captures to legacy/
6. Centralize Storybook under packages/storybook; add theme/token/animation stories
7. Wire root CI/CD and standard-configs guard

## Success criteria

- All apps build and run using packages/*
- Theme provider wraps each app; Storybook demonstrates tokens and reduced motion
- CI only runs affected graph; config guard passes
