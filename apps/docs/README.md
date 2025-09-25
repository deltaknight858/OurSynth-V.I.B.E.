# OurSynth-Eco Documentation Index

Welcome to the single source of truth for the OurSynth ecosystem. All canonical docs are organized by domain below. Each section links to related documents for easy navigation and cross-referencing.

---

## Brand System

- [Brand Guidelines](./brand/BRAND_GUIDELINES.md)
- [Theme System](./brand/THEME_SYSTEM.md)
- [Brand System Overview](./brand/brand-system.md)
- [Visual Token Sheet](./brand/VISUAL_TOKEN_SHEET.md)

## Architecture

- [Shell Layout](./architecture/SHELL_LAYOUT.md)
- [Migration Guide](./architecture/migration-guide.md)
- [Architecture Overview](./architecture/README.md)

## Components

- [Component Guidelines](./components/COMPONENT_GUIDELINES.md)
- [Primitives](./components/primitives.md)

## Workflows

- [User Flow](./workflows/user-flow.md)
- [User Flow Navigation](./workflows/user-flow-navigation.md)
- [Promotion Pipeline](./workflows/promotion-pipeline.md)

## Reference

- [Glossary](./reference/GLOSSARY.md)
- [Engineering Standards](./reference/STANDARDS.md)
- [Command Wheel Reference](./reference/command-wheel-reference.md)

---

### How to Use

- Start with the Glossary for terminology.
- Use Brand and Architecture docs for design and system rules.
- Reference Component and Workflow docs for implementation and user journeys.
- All docs are cross-linked and updated regularly. See "See Also" sections in each file for related topics.

_Last updated: September 24, 2025_
_Status: Living, authoritative_

- [Primitives](./components/primitives.md)
- [Promotion Guidelines](./components/promotion-guidelines.md)
- Agents
  - [Overview](./agents/agents-overview.md)
Architecture
  - [Overview](./architecture/overview.md)
  - [Tech Stack](./architecture/tech-stack.md)

Assets
-[Asset Strategy](./assets/asset-strategy.md)
-[SVG Pipeline](./assets/svg-pipeline.md)
-[Asset Component Mapping](./ASSET_COMPONENT_MAPPING.md)
-[Brand Migration](./BRAND_MIGRATION.md)

Blueprints
-[Unified Blueprint](./blueprint/UnifiedBlueprint.md)
-[Ecosystem Blueprint](./ECOSYSTEM_BLUEPRINT.md)
-[Oursynth Ecosystem Blueprint](./oursynth-ecosystem-blueprint.md)

Capsules
-[Capsules Guide](./CAPSULES.md)
0- [Capsules Folder](./capsules/README.md)

CI/CD & Standards
-[CI/CD Pipeline](./CI_CD.md)
-[Engineering Standards](./STANDARDS.md)
-[Copilot Guide](./COPILOT_GUIDE.md)
-[Gemini Guide](./GEMINI_GUIDE.md)

Commerce & Monetization
-[Commerce Hub](./COMMERCE_HUB.md)

Design System
-[Tokens](./design-system/tokens.md)
-[Branding](./design-system/branding.md)
-[Design System Folder](./design-system/)

Docs & Internal
-[Core Overview](./CORE_OVERVIEW.md)
-[Migration Checklist](./MIGRATION_CHECKLIST.md)
-[Migration Notes](./MIGRATION_NOTES.md)
-[Import Staging Audit](./import-staging-audit.md)
-[Onboarding](./ONBOARDING.md)
-[Sections Overview](./SECTIONS.md)

Generated
-[Generated Folder](./generated/)

Imported
-[Imported Folder](./imported/)

Oursynth Shell
-[Oursynth Shell Folder](./oursynth-shell/)

Reproduction
-[Full Rebuild Steps](./reproduction/rebuild-steps.md)

Roadmap
-[Phase 2 Plan](./roadmap/PHASE2_PLAN.md)

Workflows
-[User Flow](./workflows/user-flow.md)
-[Promotion Pipeline](./workflows/promotion-pipeline.md)
-[Domains and Connect](./workflows/domains-and-connect.md)

Other Key Docs
-[Theme System](./THEME_SYSTEM.md)
-[Time Travel](./TIME_TRAVEL.md)
-[User Flows](./USER_FLOWS.md)

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
