# OurSynth Ecosystem Documentation

Welcome to the OurSynth technical manual. Start here to understand the unified monorepo, key concepts, and how all pieces fit together.

- Ecosystem blueprint: ./ECOSYSTEM_BLUEPRINT.md
- Onboarding: ./ONBOARDING.md
- CI/CD pipeline: ./CI_CD.md
- Standards and AI co-developer rules: ./STANDARDS.md
- Branding system and rules: ./BRANDING.md
- Theme system: ./THEME_SYSTEM.md
- Agents architecture: ./AGENTS.md
- Capsules (manifests, packaging, signing): ./CAPSULES.md
- Time Travel (provenance & simulation): ./TIME_TRAVEL.md
- User flows: ./USER_FLOWS.md
- Commerce & monetization hub: ./COMMERCE_HUB.md
- Sections overview (apps & packages): ./SECTIONS.md


If you’re new, read Onboarding, then Ecosystem Blueprint, then Standards.

# OurSynth Docs (Single Source of Truth)

Authoritative reference for architecture, modules, design system, agents, assets, workflows, and rebuild instructions.

## Table of Contents
- [Blueprint](./blueprint/UnifiedBlueprint.md)
- Architecture
  - [Overview](./architecture/overview.md)
  - [Tech Stack](./architecture/tech-stack.md)
- Design System
  - [Tokens](./design-system/tokens.md)
  - [Branding](./design-system/branding.md)
- Components
  - [Primitives](./components/primitives.md)
  - [Promotion Guidelines](./components/promotion-guidelines.md)
- Agents
  - [Overview](./agents/agents-overview.md)
Architecture
  - [Overview](./architecture/overview.md)
  - [Tech Stack](./architecture/tech-stack.md)

Assets
  - [Asset Strategy](./assets/asset-strategy.md)
  - [SVG Pipeline](./assets/svg-pipeline.md)
  - [Asset Component Mapping](./ASSET_COMPONENT_MAPPING.md)
  - [Brand Migration](./BRAND_MIGRATION.md)

Blueprints
  - [Unified Blueprint](./blueprint/UnifiedBlueprint.md)
  - [Ecosystem Blueprint](./ECOSYSTEM_BLUEPRINT.md)
  - [Oursynth Ecosystem Blueprint](./oursynth-ecosystem-blueprint.md)

Capsules
  - [Capsules Guide](./CAPSULES.md)
  - [Capsules Folder](./capsules/README.md)

CI/CD & Standards
  - [CI/CD Pipeline](./CI_CD.md)
  - [Engineering Standards](./STANDARDS.md)
  - [Copilot Guide](./COPILOT_GUIDE.md)
  - [Gemini Guide](./GEMINI_GUIDE.md)

Commerce & Monetization
  - [Commerce Hub](./COMMERCE_HUB.md)

Design System
  - [Tokens](./design-system/tokens.md)
  - [Branding](./design-system/branding.md)
  - [Design System Folder](./design-system/)

Docs & Internal
  - [Core Overview](./CORE_OVERVIEW.md)
  - [Migration Checklist](./MIGRATION_CHECKLIST.md)
  - [Migration Notes](./MIGRATION_NOTES.md)
  - [Import Staging Audit](./import-staging-audit.md)
  - [Onboarding](./ONBOARDING.md)
  - [Sections Overview](./SECTIONS.md)

Generated
  - [Generated Folder](./generated/)

Imported
  - [Imported Folder](./imported/)

Oursynth Shell
  - [Oursynth Shell Folder](./oursynth-shell/)

Reproduction
  - [Full Rebuild Steps](./reproduction/rebuild-steps.md)

Roadmap
  - [Phase 2 Plan](./roadmap/PHASE2_PLAN.md)

Workflows
  - [User Flow](./workflows/user-flow.md)
  - [Promotion Pipeline](./workflows/promotion-pipeline.md)
  - [Domains and Connect](./workflows/domains-and-connect.md)

Other Key Docs
  - [Theme System](./THEME_SYSTEM.md)
  - [Time Travel](./TIME_TRAVEL.md)
  - [User Flows](./USER_FLOWS.md)

> For additional docs, see the `docs/` folder and subfolders for more granular guides and references.

## Canonical Rules

1. Nothing enters `labs/` without a promotion script run.
2. No hard-coded design values: only tokens.
3. SVGs must be optimized & registered.
4. Agents interactions must log provenance events.
5. All new primitives documented here first.

## Status Tags

`PLANNED` · `IN-PROGRESS` · `MVP` · `STABLE` · `DEPRECATED`

## Quick Start (Developer)

1. Read the [Blueprint](./blueprint/UnifiedBlueprint.md)
2. Run environment bootstrap (see root README)
3. Run `npm run staging:inventory` before large promotions.
4. Implement feature in staging → promote via script (planned: `scripts/promote.mjs`).
5. Update docs before merging.

## Imported legacy docs

These source documents were imported for historical context and migration. Prefer the canonical docs above.

- Labs-1: Unified Layout Implementation Blueprint → `./imported/labs-1/unified-blueprints.instructions.md` (imported)
- Labs-2: Unified Layout Implementation Blueprint → `./imported/labs-2/unified-blueprints.instructions.md` (imported)
- Theme prompts → `./imported/labs-1/copilot.themecreation.instructions.md` and `./imported/labs-2/copilot.themecreation.instructions.md` (imported)
- Capsule Wizard: Copilot Instructions → `./imported/COPILOT_INSTRUCTIONS.md` (normalized)
- Capsule Wizard: Wizard Capsule Sample → `./imported/WIZARD_CAPSULE.md` (normalized)
- Commerce & Monetization Hub → `./imported/MONETIZATION_BLUEPRINTS.md` (normalized)
