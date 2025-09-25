# Branding Guide – OurSynth Core

## Color Palette

- **Background:** #0A0A0F
- **Primary Neon:** #00FFE0
- **Text:** #EAEAEA (primary), #A0A0A0 (muted)
- **Error/Warning:** #FF4571, #FFD800

## Typography

- **Font:** Inter (`font-family: 'Inter', sans-serif;`)
- **Font Weights:** 400, 600, 700, 900

## Glassmorphism

- **Glass Background:** `var(--glass-background, rgba(255,255,255,0.05))`
- **Glass Border:** `var(--glass-border, rgba(255,255,255,0.15))`
- **Blur:** `backdrop-filter: blur(12px);`

## Iconography

- **SVG only** (no PNG/JPG for UI)
- Neon/monoline style for all icons
- See [ICON-CHECKLIST.md](./ICON-CHECKLIST.md)

## Usage

- All main pages and modules must follow this guide.
- All new components should use design tokens via CSS vars.
- Reference the [landing page guide](./COPILOT_LANDING_PAGE_GUIDE.md) for examples.