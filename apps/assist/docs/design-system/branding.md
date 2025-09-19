# Brand System

## Brand Palette

- Glass White: `#F5F7FA`
- Neon Cyan: `#00F5FF`
- Neon Purple (replaces prior Neon Magenta): `#7B00FF`
- Deep Space: `#0A0F1C`
- Slate Grey: `#2B2F3A`
- Signal Yellow: `#FFD600`

> Migration: Former references to `Neon Magenta` (`#FF00F5`, `#FF00FF`, `#FF2DA8`, `#ff00c8`) are now aliased to Neon Purple `#7B00FF`. See `color-migration-purple.md`.

## Logo (SVG)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="oursynth-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F5FF"/>
      <stop offset="100%" stop-color="#7B00FF"/>
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="240" fill="#0A0F1C" stroke="url(#oursynth-gradient)" stroke-width="16"/>
  <path d="M128 320 L256 128 L384 320 Z" fill="url(#oursynth-gradient)"/>
  <circle cx="256" cy="256" r="40" fill="#FFD600"/>
</svg>
```

## Typography

- Display: Sora/Orbitron, 700, -1% tracking
- Body: Inter/Roboto, 400–500

## Effects

- Radii: 14px
- Blur: 18px
- Inner stroke: rgba(255,255,255,0.12)