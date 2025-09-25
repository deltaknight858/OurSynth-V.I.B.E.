
# Oursynth Visual Token Sheet

_Status: Living, authoritative_
_Last updated: September 24, 2025_

**See Also:**

- [Brand Guidelines](./brand/BRAND_GUIDELINES.md)
- [Theme System](./brand/THEME_SYSTEM.md)
- [Brand System Overview](./brand-system.md)
- [Glossary](./reference/GLOSSARY.md)
- [Engineering Standards](./reference/STANDARDS.md)


This sheet provides a quick visual reference for brand tokens: colors, typography, and gradients. All values are standardized and should be pulled from the design token system.

## 🌈 Color Palette

| Token                  | Swatch | Hex Value | Usage                       |
|------------------------|--------|-----------|-----------------------------|
| --color-bg-dark        | ■      | #0B0B0F   | Primary background          |
| --color-accent-purple  | ■      | #7B00FF   | Primary accent (Neon Purple)|
| --neonMagenta (alias)  | ■      | #FF00F5   | Legacy magenta, aliased     |
| --color-accent-cyan    | ■      | #00F5FF   | Secondary accent            |
| --color-accent-orange  | ■      | #FF8C00   | Tertiary accent / highlights|
| --color-accent-violet  | ■      | #9B5CFF   | Optional accent (Violet Haze)|

## 🌀 Gradients

| Token              | Preview | CSS                                 |
|--------------------|---------|-------------------------------------|
| --gradient-accent  |         | linear-gradient(90deg,#00F5FF,#7B00FF)|
| --gradient-callout |         | linear-gradient(90deg,#7B00FF,#FF8C00)|

## 🔠 Typography

| Token         | Preview         | Notes                        |
|---------------|-----------------|------------------------------|
| --font-primary| Oursynth        | Sleek, geometric sans-serif  |
| Weight Play   | Light / Bold    | Light for labels, Bold for headers|
| Letter Spacing| SPACED FUTURE   | Slightly expanded for futuristic feel|

## ✨ Microinteraction Tokens

- Hover Glow: Purple → Cyan edge glow
- Active State: Scale-up + intensified glow
- Theme Toggle: Gradient sweep animation (Cyan → Purple)
- Optional Sound: Synth “ping” or “whoosh”

## 📋 Usage Notes

- Always pull from tokens (var(--color-accent-purple)) rather than hardcoding hex values.
- Legacy magenta values remain aliased until codemod cleanup.
- Gradients should be used sparingly for emphasis (active states, callouts).
- Orange is reserved for alerts, highlights, or key actions.

---
With this sheet, you now have a visual quick reference to pair with the glossary. It’s the “at a glance” brand identity guide for Oursynth.
