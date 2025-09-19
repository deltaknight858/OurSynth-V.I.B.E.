# Copilot Instructions – OurSynth Labs

- Copilot handles code, UI, and refactor tasks.
- Always use design tokens and branding guide.
- Use only SVGs from `/assets/brand`.
- No legacy imports from `/import-staging`.
- Use prompt templates in this file for audits, component scaffolds, and bloat cleanup.

## Example Prompts

1. **Component Audit**

```text
/* List all React components and SVG icons actually used in code vs. those that are unused. Output a markdown checklist. */
```

1. **Landing Page Change**

```text
/* Add a new "Testimonials" section below the features grid using glassmorphism and Inter font. */
```

1. **Remove Bloat**

```text
/* Scan /assets/brand for SVGs not imported anywhere in the codebase and list for deletion. */
```

1. **Refactor for Design Tokens**

```text
/* Find all hardcoded colors and replace with CSS vars from branding guide. */
```
