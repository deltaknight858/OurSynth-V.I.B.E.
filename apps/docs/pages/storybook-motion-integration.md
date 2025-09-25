# Storybook & Motion Integration for OurSynth (Next.js + Tailwind + Nicepage)

## Overview
This section documents how to preview, test, and contribute to OurSynth’s brand motion and UI assets using Storybook, with a focus on the Nicepage + Tailwind + Next.js + Supabase stack. All asset naming and folder structure is unique to avoid conflicts.

---

## Storybook Stories

- **BrandMotion.stories.js**: Demos each Lottie asset (e.g., `pathways-hero`, `wizard-reveal`, `particles-bg`, `glow-pulse-hover`).
- **CinematicFlow.stories.js**: Full Pathways → Wizard sequence with live controls for cinematic cues.
- **ThemeSwitcher.stories.js**: Toggle between light/dark themes, previewing brand cards and motion assets.
- **ReducedMotionToggle.stories.js**: Simulate reduced motion for accessibility testing.
- **AmbientLoop.stories.js**: Persistent background loops (particles-bg, ai-face-morph).
- **OnboardingPulse.stories.js**: Onboarding walkthroughs with wizard-reveal and glow-pulse-hover.
- **IdentityMorph.stories.js**: Brand identity morphs (ai-avatar, ai-face-morph).

Each story includes usage notes, accessibility flags, and contributor tips at the top of the file.

---

## Brand Asset Structure

- **/brand/motion/**: Lottie JSONs and video assets (e.g., `pathways-hero.json`, `wizard-reveal.json`, `ai-face-morph.webm`).
- **/brand/static/**: SVG/PNG fallbacks for low-motion or static previews.
- **/brand/cards/**: Brand card SVGs (e.g., `ai-card-light.svg`, `ai-card-dark.svg`).
- **/brand/identity/**: Persistent identity assets (e.g., `ai-avatar.webm`).
- **/brand/brand-manifest.json**: Maps assets to usage zones and accessibility flags.
- **/brand/card-config.json**: Theme/layout config for cards.

---

## Asset Validation & CI

- Use `brand-manifest.json` to map all assets and their usage.
- Run the provided validator script (`validate-assets.js`) to check for missing assets and unmapped usage zones.
- Add the validator to your CI pipeline to ensure all referenced assets are present before merging.

---

## Contributor Onboarding (Motion & Storybook)

1. **Clone & Install**
   ```sh
   git clone https://github.com/oursynth/oursynth.git
   cd oursynth
   npm install
   ```
2. **Run Storybook**
   ```sh
   npm run storybook
   ```
3. **Explore Stories**
   - BrandMotion, CinematicFlow, ThemeSwitcher, ReducedMotionToggle, AmbientLoop, OnboardingPulse, IdentityMorph
4. **Review Brand Assets**
   - Check `/brand` for motion files, cards, and config JSONs.
5. **Validate Assets**
   - Run `node validate-assets.js` to ensure all assets are present.
6. **Contribute**
   - Follow usage notes in each story file. Submit PRs with clear descriptions and reference the story name.

---

## Modular CSS for Feature Panels

- Each panel uses a unique CSS module in `/components/panels/styles/` (e.g., `VibePanel.module.css`).
- Semantic class names: `.container`, `.header`, `.motionCue`, `.themeVariant`, `.accessibilityWrap`.
- Built-in motion hooks: `@media (prefers-reduced-motion)` and `.motion-active` classes sync with `useCinematicCue`.
- Theme-aware variables: Panels inherit from `:root` theme tokens (e.g., `--panel-bg`, `--panel-glow`).
- Contributor comments at the top of each module document usage, theme, and accessibility.

---

## Tech Stack Reference
- **Framework:** Next.js
- **Styling:** Tailwind CSS, CSS Modules (for panels), Nicepage static shells
- **Motion:** Lottie (JSON), webm/mp4 for video, SVG/PNG for fallbacks
- **State/Backend:** Supabase
- **Font:** Satoshi (UI), JetBrains Mono (code)

---

For more, see the [Brand System](./brand-system.md), [Nicepage Integration](./nicepage-integration.md), and [Contributor Playbook](./contributor-playbook.md).
