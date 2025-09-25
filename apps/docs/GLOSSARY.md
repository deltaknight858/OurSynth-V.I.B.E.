
# Oursynth Glossary

_Status: Living, authoritative_
_Last updated: September 24, 2025_

**See Also:**

- [Brand Guidelines](./brand/BRAND_GUIDELINES.md)
- [Shell Layout](./architecture/SHELL_LAYOUT.md)
- [Component Guidelines](./components/COMPONENT_GUIDELINES.md)
- [User Flow](./workflows/user-flow.md)
- [Engineering Standards](./STANDARDS.md)

This glossary standardizes terminology across the Oursynth ecosystem. It is a living document — new terms can be added as modules, concepts, and design patterns evolve.

## Core Shell Concepts

- **Shell Viewport**: The persistent frame that holds the app: sidebar, topbar, rightbar, and dynamic content area. The “container” that never reloads.
- **Capsules**: Self-contained modules or views that load into the Shell Viewport (e.g., Patch Editor, Library, Dashboard).
- **Agents**: Context-aware controls or processes that adapt based on the active capsule. Example: sidebar icons that change when switching from Library → Synth.
- **Assembly Choreography**: The step-by-step sequence for snapping the shell together like a Megazord. Ensures migration is predictable and ceremonial.

## Branding & Design Tokens

- **Branding Tokens**: CSS variables and design tokens that lock in colors, typography, and spacing.
- **Neon Purple**: The new primary accent (#7B00FF). Replaces legacy magenta values.
- **Accent Cyan**: Secondary accent (#00F5FF), often paired with purple in gradients.
- **Signal Orange**: Tertiary accent (#FF8C00), used for highlights and callouts.
- **Violet Haze**: Optional accent (#9B5CFF), used for depth and gradient transitions.
- **Theme System**: Dark/light mode and gradient sweeps controlled by tokens.

## Layout & Components

- **Sidebar**: Vertical stack of icon-only buttons. Default Neon Purple, hover glow Cyan. Context-aware.
- **Topbar**: Slim bar spanning the top of the viewport. Contains logo, context title, and utilities.
- **Main Content Area**: Dynamic view loader (SPA pattern). Smooth fade/slide transitions between capsules.
- **Rightbar**: Optional contextual panel. Collapsible, translucent, with Orange highlights for key actions.

## Interaction & Motion

- **Microinteractions**: Small animations and feedback loops: hover glows, active state scaling, gradient sweeps.
- **Hover State**: Neon glow ring (Purple → Cyan).
- **Active State**: Slight scale-up + intensified glow.
- **Theme Toggle**: Animated gradient sweep when switching modes.
- **Sound Design (Optional)**: Synth “ping” or “whoosh” for context changes.

## Process & Provenance

- **Provenance**: The record of where assets, tokens, or modules originated. Important for migration clarity.
- **Promotion Pipeline**: The process of moving components from staging → production.
- **Moodboard**: A curated set of swatches, typography, and UI elements to visualize the Oursynth vibe.

## Future Concepts

- **Experimental Labs**: Retro browser simulator, gamified shell, interactive portfolio.
- **Pages Integration**: Shell as a workspace for writing, code, or creative projects.
- **Cinematic Assembly Script**: Motion design spec for Megazord-style transformation.

---
This glossary is meant to be linked from the README and referenced in /docs/brand-system.md. It should grow as new modules and ideas are introduced.
