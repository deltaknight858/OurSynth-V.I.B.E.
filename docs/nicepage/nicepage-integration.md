# Nicepage → Next.js Integration Blueprint

## Overview
Use Nicepage Premium to build static, cinematic shells for all OurSynth pages, export as HTML/CSS, and integrate into Next.js with Tailwind. Styles are scoped to avoid bleed.

## Per-Page Layout Instructions
- **Landing:** Hero, features row, carousel, CTA strip
- **Labs:** Section header, card grid, quick actions, status strip
- **Pathways:** Step cards, prompt input, progress bar
- **Orchestrator:** Job queue, log panel, action dock
- **Analyzer:** Findings list, explain panel, fix chips
- **V.I.B.E.:** Data table, sidebar filters, row actions
- **Connect:** Pipeline steps, env cards, deploys list
- **History:** Tabbed modal, timeline, capsule cards, provenance chain
- **About/Mission:** Brand story, team grid, a11y statement
- **Contact:** Contact form, FAQ accordion

## Export → Import Flow
1. Build in Nicepage, export as HTML/CSS
2. Place in `/public/np/` in Next.js repo
3. Wrap in `<div className="np-scope">` in React pages
4. Import `np-scope.css` globally
5. Add `<BottomNav />` to each page

## Repo Tree Example
```
oursynth-site/
  public/np/landing.html
  public/np/landing.css
  ...
  components/BottomNav.js
  pages/index.js
  ...
  styles/np-scope.css
```

[Back to Index](./index.md)
