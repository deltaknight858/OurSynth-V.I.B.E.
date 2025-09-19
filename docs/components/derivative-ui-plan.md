# Derivative UI Component Plan

This document outlines the strategy for analyzing external UI kits and deriving OurSynth-native components from them.

## Guiding Principles

1.  **No Direct Imports**: We will **never** directly import code or assets from external kits (`LanguageGUI`, `Neumorphic Components`). This is to maintain a clean codebase, avoid license contamination, and ensure 100% adherence to our design system.
2.  **Inspiration, Not Imitation**: These kits are used for conceptual inspiration only. We identify valuable UI patterns and then rebuild them from scratch.
3.  **Token-First Styling**: All derived components must be styled using the established design tokens in `docs/design-system/`. All visual effects must be **glassmorphism**, not neumorphism.
4.  **Pipeline for Assets**: Any SVG geometry that is recreated must be processed through the official `svg-pipeline` to ensure optimization and consistency.

---

## 0. Brand Identity

The primary brand logos have been rebuilt using the glass/neon primitive style.

| Asset | Source | Status | Notes |
| :--- | :--- | :---: | :--- |
| `logo.svg` | `assets/brand/logo.svg` | **STABLE** | Replaces placeholder. Token-driven. |
| `icon.svg` | `assets/brand/icon.svg` | **STABLE** | Replaces placeholder. Token-driven. |

---

## 1. LanguageGUI Kit Analysis

The `LanguageGUI` kits contain several valuable patterns for building conversational AI interfaces. We will rebuild these concepts as OurSynth-native components.

### Derivative Component Specs

| Inspiration (from LanguageGUI) | OurSynth Derivative | Core Functionality | Design System Mapping | Status |
| :--- | :--- | :--- | :--- | :---: |
| Chat Message / Bubble | `MessageCapsule` | Displays a single message from a user or agent. Supports author avatar, text content, and metadata. | `background: var(--glass-bg)`, `border-radius`, `box-shadow` | PLANNED |
| Chat Input / Prompt Bar | `PromptInput` | A rich text input field for user prompts with a send button and potential for slash commands. | `background: var(--slateGrey)/20`, `focus:ring-neonCyan` | PLANNED |
| Agent Response Panel | `AgentResponseStream` | A container that renders incoming `MessageCapsule` components, handling streaming text effects. | Uses `HaloScrollArea` styles. | PLANNED |
| Conversation History | `HistorySidebar` | A collapsible side panel listing previous conversations. | `background: var(--glass-bg)`, uses `top-nav-link` styles for items. | PLANNED |
| Status Indicator | `AgentStatusIndicator` | A small visual element (e.g., pulsing dot) indicating if an agent is thinking, typing, or idle. | `animation: pulse`, `background: var(--neonCyan)` | PLANNED |

---

## 2. Neumorphic Components Analysis

The `Neumorphic Components` kit demonstrates a specific visual style that is **not aligned** with OurSynth's `glassmorphism` aesthetic.

-   **Action**: Classify this entire kit as **ARCHIVE**.
-   **Rationale**: The core value is in observing component structure (e.g., how a card is laid out), but the visual implementation (soft shadows, extrusions) will be completely ignored. We will not derive any components directly from this kit. It serves as a reference for layout ideas only.

---

## 3. SVG Asset Triage (`SVG` directory)

The `SVG` directory contains a mix of assets. These must be triaged individually before being considered for the project.

### Triage Process

1.  **Review**: Each SVG will be visually inspected.
2.  **Classify**: Assign a status: `PROMOTE`, `REBUILD`, or `DROP`.
3.  **Execute**:
    *   `PROMOTE`: Copy the SVG to `assets/brand/` and run `npm run svg:all`.
    *   `REBUILD`: Re-draw the concept using the OurSynth style (monoline, 2px stroke, neon colors) and then `PROMOTE` the new version.
    *   `DROP`: Delete the file.

*(A detailed table will be generated once the contents of the SVG folder are inventoried by a script.)*

---

## Next Steps

1.  **Create Component Specs**: For each `PLANNED` derivative in the LanguageGUI table, create a detailed spec file (e.g., `docs/components/specs/MessageCapsule.md`).
2.  **Scaffold Components**: Begin building the React components for `PromptInput` and `MessageCapsule` as they are the highest priority.
3.  **Triage SVGs**: Run an inventory script on the `SVG` directory to begin the triage process.