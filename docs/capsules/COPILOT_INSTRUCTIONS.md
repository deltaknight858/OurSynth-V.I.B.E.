# Copilot Instructions – OurSynth Labs

- Copilot handles code, UI, and refactor tasks.
- Always use design tokens and branding guide.
- Use only SVGs from `/assets/brand`.
- No legacy imports from `/import-staging`.
- Use prompt templates in this file for audits, component scaffolds, and bloat cleanup.

## Example Prompts

1. **Component Audit**
   ```
   /* List all React components and SVG icons actually used in code vs. those that are unused. Output a markdown checklist. */
   ```
2. **Landing Page Change**
   ```
   /* Add a new "Testimonials" section below the features grid using glassmorphism and Inter font. */
   ```
3. **Remove Bloat**
   ```
   /* Scan /assets/brand for SVGs not imported anywhere in the codebase and list for deletion. */
   ```
4. **Refactor for Design Tokens**
   ```
   /* Find all hardcoded colors and replace with CSS vars from branding guide. */
   ```