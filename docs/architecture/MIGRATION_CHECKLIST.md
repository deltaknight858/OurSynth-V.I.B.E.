# Documentation Migration Checklist

Source → Target mapping for consolidating docs into this monorepo.

## Sources

- OurSynth-Labs-1/.github/instructions/*.md
- OurSynth-Labs-2/.github/instructions/*.md
- OurSynth-Studio/.github/copilot-instructions.md
- OurSynth-Core/docs/*.md
- Capsule Wizard Suite/COPILOT_*.md and WIZARD_CAPSULE.md

## Targets

- Theme system → docs/THEME_SYSTEM.md
- Unified layout → docs/ECOSYSTEM_BLUEPRINT.md
- Copilot/Gemini rules → docs/STANDARDS.md (AI co-dev section)
- Branding and tokens → docs/BRANDING.md and brand/
- Agents/provenance → docs/AGENTS.md and docs/TIME_TRAVEL.md
- Storybook usage → packages/storybook/README.md and stories

## Steps

- Copy files preserving authorship in commit messages.
- Normalize headings and anchors; fix image paths or replace with placeholders.
- Cross-link between related docs.
- Remove legacy duplicates post-merge.

### De-MUI / De-Firebase Tasks

- Remove @mui/* dependencies from `package.json` and code imports. Replace with Halo UI primitives and CSS variables.
- Replace any `@mui/material` components in `components/**` with internal primitives.
- Update any docs that reference MUI to reference the custom theme provider.
- Remove `firebase` and `firebase-admin` dependencies and usages in Assist (auth, db, storage). Replace with server-side adapters (e.g., Supabase/Postgres, local dev mocks) as decided in architecture.
- Delete any Firebase service account files from `public/` and rotate any exposed keys.

## Status

- Staging placeholders created in `docs/imported/` for Capsule Wizard and Studio instructions. (done)
- Imported: Labs-1 unified blueprint → `docs/imported/labs-1/unified-blueprints.instructions.md` (done)
- Imported: Labs-2 unified blueprint → `docs/imported/labs-2/unified-blueprints.instructions.md` (done)
- Imported: Theme prompts from Labs-1/2 → `docs/imported/labs-1/copilot.themecreation.instructions.md`, `docs/imported/labs-2/copilot.themecreation.instructions.md` (done)
- Normalized: Capsule Wizard Copilot Instructions → `docs/imported/COPILOT_INSTRUCTIONS.md` (done)
- Normalized: Wizard Capsule Sample → `docs/imported/WIZARD_CAPSULE.md` (done)
- Normalized: Monetization Blueprints → `docs/imported/MONETIZATION_BLUEPRINTS.md` (done)

## When ready to import

1. Add source folders to the workspace or paste doc contents into placeholders.
2. Replace image paths with repo-local copies under `brand/static` or `docs/assets`.
3. Cross-link to canonical docs (e.g., STANDARDS, THEME_SYSTEM) and remove legacy duplicates.
