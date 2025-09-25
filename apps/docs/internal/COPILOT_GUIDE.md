# Copilot Guide – OurSynth Labs

> **Canonical location:** `/docs/COPILOT_GUIDE.md`

_Last updated: 2025-09_

This file provides guidelines for using GitHub Copilot and Copilot Chat effectively in this project.  
**All contributors (human or AI) must follow these rules for code, UI, and documentation.**

---

## General Guidelines

- Use Copilot for:
  - Generating React components (with glassmorphism and consistent brand style)
  - Writing CSS-in-JS or SCSS for glassmorphic effects (`backdrop-filter`, transparency, blur, etc.)
  - Creating utility functions, hooks, and helpers
  - Boilerplate code for routing, state management, and data fetching
  - Writing Markdown docs, checklists, and component API documentation
  - Generating test cases and fixtures

- Prefer Copilot suggestions that:
  - Use SVG icons from `/assets/brand/`
  - Reference design tokens, theme variables, or CSS custom properties for colors/effects
  - Are accessible (ARIA labels, keyboard navigation, etc.)
  - Follow project naming conventions and folder structure (see `/components/`, `/pages/`, `/styles/`)

---

## Glassmorphism Style

- Use CSS properties like:
  - `backdrop-filter: blur(12px) brightness(1.1);`
  - `background: rgba(255,255,255,0.13);`
  - Subtle box-shadows and border-radius
- Always reference the glassmorphism UI kit assets when building components
- Ensure dark and light mode compatibility

---

## Component Guidelines

- Each component should:
  - Accept `className` and `style` props for customization
  - Support children and composability
  - Be unit-tested (Copilot can generate tests)
  - Use TypeScript types/interfaces where possible

---

## Good Prompts for Copilot

- "Create a glassmorphic card component using SCSS and React."
- "Generate a responsive sidebar navigation with SVG icons and glassmorphism."
- "Write a hook to manage theme switching between light, dark, and glassmorphic modes."
- "Document the props and usage of the `Workspace` component in Markdown."
- "Write unit tests for the `CommandCenter` reducer using Jest."

---

## What NOT to Use Copilot For

- Generating proprietary or paid asset files (use licensed Adobe Stock assets)
- Final production SVG/PNG logo generation (use provided assets)
- Writing legal, licensing, or security documentation

---

## How to Get the Most from Copilot

- Review and edit suggestions for security, accessibility, and brand consistency
- Use Copilot Chat for quick code explanations and refactoring help
- Regularly update this file with new best practices as the project evolves

---