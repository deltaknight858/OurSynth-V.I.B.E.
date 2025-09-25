# OurSynth Ecosystem Blueprint: A Unified Architecture

This document defines the "Grand Unifying Architecture" for all OurSynth projects: **Synth Assist**, **Aether**, **Halo UI**, **V.I.B.E.**, and **Connect**. It ensures every experience, component, and workflow is built on a shared foundation of principles, design, and code.

---

## 1. Core Principles

* **Layered Orchestration:**  
  - **V.I.B.E. (Domains):** The simulation/orchestration layer. Hosts domains—isolated workspaces for building, simulating, and auditing multi-agent workflows (“Capsules”).
  - **Connect (Deploy):** The delivery/integration layer. Deploys validated capsules into real-world environments and logs provenance.
* **Agent-Driven Everything:**  
  - All automation and transformation—composition, validation, packaging, deployment—are performed by specialized, composable _agents_. (See: `docs/agents/agents-overview.md`)
* **Capsule-Based Artifacts:**  
  - The “Capsule” is the atomic, versioned, and verifiable unit that flows from initial design (V.I.B.E.), through simulation, to deployment (Connect).
* **Token-First, Brand-Consistent UI:**  
  - Every UI uses the **Halo UI** design system, powered by a single source of truth for color, spacing, and radii (`tokens.md`, `branding.md`).
* **Core Governance:**  
  - All code, rules, and patterns are sourced from a single, canonical repository: **OurSynth-Core**.
  - Guardrails: enforced by `.eslintrc.json` (bans legacy colors, enforces promotion discipline), `tsconfig.json` (path consistency), and CI scripts.

---

## 2. Application Roles

**OurSynth-Core (Foundation)**  
- Houses Halo UI, agent/state patterns, core configs, and all architectural guardrails.
- All other projects import from here—never fork or redefine.

**Synth Assist (Conversational IDE)**  
- The user’s cockpit: chat-driven orchestration, agent control, and deployment management.
- Consumes Halo UI for all interface elements.
- Implements `agentSessionStore` (see: `docs/state/agent/agentSessionStore.ts`).

**Aether (Visual Composer)**  
- The visual builder for agent workflows—maps 1:1 to a V.I.B.E. Domain.
- Uses Halo UI for nodes, dialogs, and controls.
- Reads from `agentRegistry`, outputs Capsule manifests (JSON/YAML).

**V.I.B.E. (Orchestration Engine)**  
- Headless backend: executes agent workflows, simulates, validates, and finalizes capsules.
- Accepts manifest from Aether or Synth Assist, returns versioned, signed Capsule.

**Connect (Deployment Engine)**  
- Headless backend: packages and deploys capsules, runs post-deploy checks, logs provenance.
- Notifies Synth Assist/Aether of deploy status.

---

## 3. Capsule Lifecycle (End-to-End Flow)

1. **Compose**  
   - User (in Synth Assist) requests a build or uses Aether to visually design a workflow.
   - Builder/Composer agents assemble assets (Halo UI, templates, code).
2. **Simulate & Validate**  
   - Validator/Simulation agents check types, accessibility, and run dry runs in V.I.B.E.
   - Provenance agents log every step.
3. **Finalize**  
   - Capsule is sealed (metadata, version, provenance) and handed to Connect.
4. **Deploy**  
   - Packager/Transport agents bundle and push capsule to targets (web, cloud, NPM, etc).
   - Verifier/Notifier agents check deploy success and alert stakeholders.
5. **Trace**  
   - All actions and changes are logged for replayability and audit (provenance).

---

## 4. Patterns & Rules

* **Design System:**  
  - All UIs use Halo UI and canonical tokens (`tokens.md`).
  - No hardcoded colors, spacing—use CSS variables or token utilities.
* **Component Structure:**  
  - Components live under `/components/{domain}/` (e.g., `/components/marketing/sections/`, `/components/chat/`).
  - State lives under `/state/{domain}/` (e.g., `/state/agent/`).
* **Promotion Discipline:**  
  - No importing from `/import-staging/` or legacy folders—promote or rebuild with new patterns.
* **Testing & CI:**  
  - Scripts in `package.json` enforce color, icon, and token linting.
  - Each feature must have at least one integration/smoke test.
* **Monorepo Workflow:**  
  - All apps and packages live in a single monorepo (pnpm workspaces or Turborepo).
  - Each app/package `extends` configs from OurSynth-Core.

---

## 5. Example: Building a New Experience

- Designer creates new section in Halo UI → Capsule of type “Halo UI” is built and validated in a V.I.B.E. domain.
- Synth Assist requests a new feature → triggers an agent workflow, optionally visualized in Aether.
- Capsule is simulated, passes validation, and is deployed via Connect.
- All provenance, build, and deploy info is logged and accessible across the ecosystem.

---

## 6. Making the Puzzle Fit

1. **Always start from OurSynth-Core** for any new code, UI, or state.
2. Build features as Capsules—composable, agent-powered, and token-driven.
3. Use Aether for visual workflows; Synth Assist for conversational orchestration.
4. Simulate and validate in V.I.B.E. before deploying with Connect.
5. Enforce all rules via shared configs and CI.

---

## 7. Reference: Gold Standard Files

- `docs/workflows/domains-and-connect.md` — master lifecycle doc
- `docs/ARCHITECTURE.md`, `docs/agent-architecture.md` — role definitions
- `docs/agents/agents-overview.md` — agent contract roster
- `docs/design-system/tokens.md`, `docs/design-system/branding.md` — UI source of truth
- `components/marketing/sections/AdvancedOrganizationSection.tsx` — component example
- `state/agent/agentSessionStore.ts` — state example
- `system/FocusRing.module.css` — token-driven styling
- `.eslintrc.json`, `tsconfig.json`, `package.json` — guardrails

---

By following this blueprint, every part of the OurSynth ecosystem—whether chat, visual, UI, or deployment—will fit together seamlessly, scale gracefully, and deliver a truly unified, inevitable developer experience.