# Sections Overview (Apps & Packages)

This document explains what each section does and how they interact.

## Apps

- Studio: Unified workspace shell with LeftNav, FeaturePanel, RightInspector; hosts V.I.B.E and other panels
- Assist: Conversational app for commands/orchestration; can open Studio/Aether links
- Connect: Deployment & environment manager
- Aether: Visual workflow builder (rebuilt)
- Halo UI Demo: Optional showcase of packages/ui

## Packages

- core: tokens, theme provider, types and contracts
- ui: Halo + shadcn primitives; shared components used by apps
- agents: agent factories and utilities
- capsule: manifest schema, packaging, signing
- mesh: provenance and mesh utilities
- orchestrator: orchestration layer for composing agents
- shared-types: common TypeScript types
- storybook: centralized Storybook with theme/token/motion stories
- aliases: optional alias tooling

## Interaction

- Apps depend on packages/ui and packages/core
- Agents and orchestrator power Aether and Studio features
- Capsules are produced/consumed across apps; marketplace integration optional
