# User Flows & Navigation

This document consolidates high-level user flows and navigation patterns for the OurSynth shell-first SPA architecture. It is designed to align with the persistent shell, modular viewport, and context-aware controls described in `SHELL_LAYOUT.md`.

## 1. Studio: V.I.B.E within Workspace
- **Entry:** User opens Studio.
- **Navigation:** LeftNav selects V.I.B.E.
- **Viewport:** FeaturePanel renders VIBE panel.
- **Context:** RightInspector shows contextual tools.
- **URL:** `/studio?feature=vibe` reflects current feature.

## 2. Assist → Aether
- **Trigger:** User prompts Assist.
- **Flow:** Assist suggests creating an Aether workflow.
- **Result:** Opens Aether with pre-scaffolded graph.

## 3. Capsules Lifecycle
- **Steps:** Create → Validate → Pack → Sign → Publish (optional) → Import → Execute.
- **Navigation:** Each step is accessible via shell navigation and contextual controls.

## 4. Provenance Review
- **After Execution:** User opens Time Travel view in Studio.
- **Inspection:** Inspects nodes, logs, artifacts.
- **Export:** User can export a provenance report.

---

## Navigation Principles
- **Persistent Shell:** Sidebar/topbar always visible; viewport swaps modules.
- **Context-Aware Controls:** Inspector and feature panels adapt to current module.
- **URL State:** Deep-linking for features, flows, and provenance.
- **Modular Integration:** New modules (Aether, Notes) plug into shell via defined entry points.

## Next Steps
- Integrate Aether and Notes modules into shell navigation.
- Update navigation and user flow docs as modules evolve.
- Ensure all flows are reflected in SPA routing and context logic.
