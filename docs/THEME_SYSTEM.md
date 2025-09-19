# OurSynth Theme System

## Theme Architecture
- Dark/light mode switching
- Brand styles applied via CSS tokens
- Animated gradient sweeps for theme transitions

## Implementation
- Use CSS variables for all brand tokens
- Theme toggle triggers gradient sweep animation (Cyan → Purple)
- All components reference tokens for colors, spacing, and typography

## Example CSS
```css
:root {
  --color-bg-dark: #0B0B0F;
  --color-accent-purple: #7B00FF;
  --color-accent-cyan: #00F5FF;
  --color-accent-orange: #FF8C00;
  --color-accent-violet: #9B5CFF;
  --font-primary: 'Orbitron', 'Eurostile', sans-serif;
  --font-secondary: 'Inter', sans-serif;
}
```

## Usage Notes
- Theme system is SPA-friendly and SSR-safe
- All theme changes are animated for smooth UX
- No direct hex values in components—always use tokens
