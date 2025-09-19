# Nicepage Sitemap & Layout Specs

This guide details the 5-page OurSynth Labs structure for Nicepage, mapping each page to the core workflow, and how to export/import for Next.js + Tailwind.


## 5-Page Labs Structure (Workflow-Aligned)

### 1. Home / Entry (User → OAI)
- Hero, onboarding, and first interaction with OAI (conversational AI)
- Quick start, “Begin Pathway” CTA, and brand intro

### 2. Workspace (Orchestrator + Agents)
- Main creative hub: Orchestrator panel, Analyzer, Capsule, Mesh, V.I.B.E.
- Tabs or side panels for Analyzer, Capsule, Mesh, V.I.B.E.
- All config, validation, and artifact packaging happens here

### 3. Preview & Actions (Preview Panel)
- Live preview of generated code/UI/config
- Action buttons: Explain, Save, Send, Deploy
- Theme/motion toggles, accessibility controls

### 4. Command Center
- Admin, deployment, domain management, environment settings
- Modal overlays for advanced settings, domain mapping, etc.

### 5. History & Provenance (Provenance/Time Travel)
- Timeline/history view, restore/replay, authorship tracking
- Modal or drawer for detailed provenance, signature, and audit info

---

**Secondary/about/contact/docs content can be handled as modals, popups, or overlays from any page.**

---

## What Needs Code/Storybook
- Live controls, dynamic previews
- Config-driven logic (card-config.json, useCinematicCue)
- Validator scripts, CI pipeline
- Theme switching, accessibility flags

## Export/Import Strategy
- Build each page in Nicepage
- Export HTML/CSS/assets to `/public/np/`
- Wrap in `.np-scope` in Next.js pages
- Use BrandMotion, ParticleField, CinematicFlow for motion

[Back to Index](./index.md)
