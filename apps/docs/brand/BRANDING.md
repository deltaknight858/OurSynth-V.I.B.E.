# Branding System & Rules

This document defines naming, identity, and section branding across the monorepo.

## Sections and identities

- Studio: OurSynth Labs experience (canonical workspace)
- Assist: Conversational co‑pilot
- Connect: Deployments & environments hub
- Aether: Visual workflow builder (rebuilt)

## Assets

- Brand manifest lives under brand/brand-manifest.json
- Identity, motion, and static assets under brand/{identity,motion,static}

## Rules

- Use tokens from packages/core for colors, spacing, typography
- Do not hardcode colors in apps; reference theme tokens
- Animations must provide reduced‑motion fallbacks

## Storybook

- ThemeTokens story must display colors/typography/spacing with labels
- Motion stories demonstrate prefersReducedMotion behavior

## Naming & voice

- Product names capitalized as proper nouns (Memory, Assist, Aether)
- Avoid internal codenames in user-facing copy
