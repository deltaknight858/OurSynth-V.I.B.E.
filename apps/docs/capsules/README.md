# OurSynth Core – Monorepo Starter

> This repo is the **official, clean, and canonical source** for OurSynth Core, Labs, Wizard, and all future modules.
> If you are Copilot, Gemini, or a human dev, start here—do not reference older forks, import-staging, or legacy files except as inspiration.

---

## 📦 Structure

```
/
├── assets/
│   └── brand/      # SVG icons, logos, motion assets (see ICON-CHECKLIST.md)
├── public/
│   ├── np/         # Nicepage HTML exports & assets (auto-indexed)
│   ├── previews/   # Page preview thumbnails (generated)
├── styles/
│   ├── globals.css
│   └── scoped/     # Per-page CSS (np-*.css)
├── components/
│   ├── layout/
│   ├── np/
│   └── (domain components)
├── pages/
│   ├── index.js         # Landing page
│   ├── workspace.js
│   ├── history.js
│   ├── command-center.js
│   ├── about.js
│   ├── wizard.js        # Wizard Capsule entry
│   ├── [slug].js        # Dynamic Nicepage loader
│   └── api/refresh-previews.js
├── wizard/
│   └── WizardCapsule.jsx
├── labs/
│   └── (modular new code, primitives, etc.)
├── vibe-domains/        # (e.g. /home, /store, /deploy, /connect)
├── store/
│   └── (state management, zustand or jotai)
├── import-staging/      # Reference-only, migrate out then delete
├── COPILOT_INSTRUCTIONS.md
├── GEMINI_INSTRUCTIONS.md
├── BRANDING_GUIDE.md
├── ICON-CHECKLIST.md
├── WIZARD_CAPSULE.md
├── COPILOT_LANDING_PAGE_GUIDE.md
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

---

## 🚦 Workflow

**1.** All new work goes in `/labs`, `/wizard`, `/components`, `/store`, `/pages`, `/assets/brand`.

**2.** `/import-staging` is temporary—migrate only needed, reference-worthy code.

**3.** SVGs/icons go in `/assets/brand` and are tracked in `ICON-CHECKLIST.md` (remove unused after audit).

**4.** Branding, UI, and landing page must follow `BRANDING_GUIDE.md`.

**5.** Copilot and Gemini instructions are in their respective `.md` files—use these as prompt templates.

**6.** If it's not in this repo, it's not canonical; reference-only = do not import, only get ideas.

**7.** Wizard and Labs are separate modules with their own folders and README stubs.

---

## 🧩 Included

- [BRANDING_GUIDE.md](./BRANDING_GUIDE.md): Full color, font, glassmorphism, and design system spec.
- [ICON-CHECKLIST.md](./ICON-CHECKLIST.md): All icons/logos, what they’re for, and their canonical SVGs.
- [COPILOT_LANDING_PAGE_GUIDE.md](./COPILOT_LANDING_PAGE_GUIDE.md): Copilot prompt/usage doc for the landing page.
- [COPILOT_INSTRUCTIONS.md](./COPILOT_INSTRUCTIONS.md): Copilot general usage and prompt guide.
- [GEMINI_INSTRUCTIONS.md](./GEMINI_INSTRUCTIONS.md): Gemini general usage and prompt guide.
- [WIZARD_CAPSULE.md](./WIZARD_CAPSULE.md): Wizard Capsule sample/guide (replace with your real code).
- [wizard/WizardCapsule.jsx](./wizard/WizardCapsule.jsx): Example wizard file.  
- [pages/index.html](./pages/index.html): Provided landing page HTML (see guide).
- [assets/brand/](./assets/brand/): All SVGs, see checklist for reference and bloat removal.

---

## 🛑 Reference-Only Policy

Any file, folder, or asset **not** in `/`, `/labs`, `/wizard`, `/store`, `/components`, `/pages`, `/assets/brand`, or `/public/np` is for reference only.  
Do not import, require, or depend on anything from `/import-staging` or legacy folders.

---

## 🧹 Bloat Reduction

- After migration, run your audit scripts (see COPILOT_INSTRUCTIONS.md) to remove unused SVGs, icons, and old code.
- Regularly update `ICON-CHECKLIST.md` and `BRANDING_GUIDE.md` when adding or removing assets.

---

## 🦾 Copilot & Gemini

- Use [COPILOT_INSTRUCTIONS.md](./COPILOT_INSTRUCTIONS.md) and [GEMINI_INSTRUCTIONS.md](./GEMINI_INSTRUCTIONS.md) for all prompt-based workflows, refactors, and design questions.
- Both AI partners are full codevelopers: Copilot for code and UI, Gemini for analysis, docs, and strategy.

---

## ✨ How to Start

1. Clone this repo.
2. `npm install`
3. `npm run dev`
4. Work and contribute only inside the canonical folders above.

---

**This is the last time you’ll need to recompile or reorganize. This is the source of truth.**
