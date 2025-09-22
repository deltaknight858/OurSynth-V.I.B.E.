# OurSynth-Eco Gold Master Draft

## Overview
OurSynth-Eco is a modular, provenance-driven app builder and orchestrator.  
This Gold Master Draft preserves **all pre-existing apps** (e.g., Taskflow, Noteflow) and cross-wires them with new modules:
- Studio (visual builder)
- Pathways (wizard)
- Provenance (audit timeline)
- Agents (registry/session)
- Capsule (export/time machine)
- Command Center (unified control)
- Orchestrator (job manager)
- MeshSim (simulation)

All integrations are **additive**—no overwrites, only new features and wiring.

## Structure

- `apps/shell/`: Main shell, sidebar, routing, layout
- `apps/studio/`, `apps/pathways/`, ...: Each major app panel, cross-wired to provenance and agents
- `packages/halo-ui/`: UI primitives and theme
- `packages/core/`: Shared hooks for provenance, agents, capsule, mesh, orchestrator, project identity
- `supabase/`: DB schema, RLS, env config for backend
- `styles/`: Theming and panel CSS

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up Supabase:**
   - Copy `.env.example` to `.env` and fill in your keys
   - Deploy `schema.sql` and `rls.sql` in your Supabase project

3. **Run locally:**
   ```bash
   npm run dev
   ```

## Theming

Global theme is in `packages/halo-ui/theme.css`, with a JS/TS `ThemeProvider` for dark/light mode.

Panel-specific CSS in each app (see `apps/studio/src/styles/studio-panel.css`, etc.).

## Provenance & Agents

Every panel logs provenance events, supports agent sessions, and links to the canonical timeline.

## Backend

Supabase provides secure, RLS-protected storage for projects created via wizard/upload, with full audit trails.

## Existing Apps

Taskflow and Noteflow are preserved in full.  
They are listed in the sidebar, cross-linked to provenance and agent logic, and appear in user-flow docs.

## Docs

See [`user-flow.md`](./user-flow.md) and [`user-flow-navigation.md`](./user-flow-navigation.md) for canonical navigation and integration diagrams.

## Tests

Stub test suite provided (see `/tests/`).

## Deploy

Supports Docker, Vercel, and Netlify out of the box (see deploy configs).

---

## Contribution

- PRs must preserve all existing app flows.
- All new features should be additive and forward-compatible.
- Docs and navigation should always reflect integration points.