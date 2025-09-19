# Nicepage Export Contributor Kit

(No DnD Panels — Scoped, Cinematic, Contributor‑Friendly)

## 1️⃣ One‑Pager Export Checklist
**Location:** `/docs/nicepage-export-checklist.md`  
**Purpose:** Full reference for contributors before starting any Nicepage → Next.js/Tailwind export.

### Pre‑Export Prep
- ✅ Brand tokens (colors, gradients, motion) locked
- ✅ SVG + PNG logos/icons in `/assets/brand`
- ✅ Sample content blocks (hero, CTA, onboarding copy) in place
- ✅ Breakpoints documented in `/docs/layout`
- ✅ Accessibility: contrast ratios, focus order, ARIA roles
- ✅ Animation timing/easing constants locked

### Nicepage Build Rules
- Use pre‑designed shells from `/docs/layout` — no freeform DnD
- Apply scoped CSS classes per block/component
- Follow `/docs/assets-naming.md`
- Match `/docs/theme` for fonts + theming
- Test responsive behavior before export

### Export Settings
- HTML + CSS + assets (no inline styles)
- SVG for vector, PNG (2×) for raster
- CSS → `/styles/scoped/`
- Assets → `/public/assets/` (preserve structure)
- Lottie JSON → `/public/animations/`

### Post‑Export Integration
- Shells → `/components/layout/`
- Import scoped CSS into matching components
- Replace sample content with dynamic/CMS data
- Test breakpoints + run accessibility audit
- Commit with template (see section 3)

---

## 2️⃣ In‑File Pocket Card
**Location:** Top of every exported layout/component file in VS Code  
**Purpose:** Keep Copilot and contributors in sync while editing.

```ts
/*
🌟 NICEPAGE EXPORT RULES — NO DnD PANELS 🌟

1️⃣ PREP
- Brand tokens ✅
- SVG/PNG logos/icons ✅
- Sample content blocks ✅
- Breakpoints ✅
- Accessibility ✅

2️⃣ BUILD
- Pre‑designed shells from /docs/layout
- Scoped CSS per block/component
- Asset naming from /docs/assets-naming.md
- Theme + font from /docs/theme
- Test responsive behavior

3️⃣ EXPORT
- HTML + CSS + assets (no inline)
- SVG for vector, PNG (2×) for raster
- CSS → /styles/scoped/
- Assets → /public/assets/
- Lottie JSON → /public/animations/

4️⃣ INTEGRATION
- Shells → /components/layout/
- Import scoped CSS
- Replace sample content
- Test + accessibility audit
- Commit: chore(layout): add [PageName] Nicepage export with scoped CSS + assets
*/
```

---

## 3️⃣ Commit Message Template + PR Checklist
**Commit template:** `/docs/contributing.md`  
**PR checklist:** `.github/PULL_REQUEST_TEMPLATE.md`

### Commit Message Template
```md
chore(layout): add [PageName] Nicepage export with scoped CSS + assets
```
- Prefix: `chore(layout):`
- Page name in PascalCase
- Mention scoped CSS + assets

### PR Checklist
```md
# Nicepage Export — PR Checklist

## Pre‑PR
- [ ] Brand tokens match `/docs/brand`
- [ ] SVG + PNG logos/icons in `/assets/brand`
- [ ] Sample content blocks in place
- [ ] Breakpoints match `/docs/layout`
- [ ] Accessibility confirmed
- [ ] Animation constants locked

## Export
- [ ] Used pre‑designed shells (no DnD)
- [ ] Scoped CSS applied
- [ ] Asset names follow `/docs/assets-naming.md`
- [ ] Theme + font match `/docs/theme`
- [ ] Responsive behavior tested

## Integration
- [ ] HTML + CSS + assets (no inline)
- [ ] SVG for vector, PNG (2×) for raster
- [ ] CSS in `/styles/scoped/`
- [ ] Assets in `/public/assets/`
- [ ] Lottie JSON in `/public/animations/`
- [ ] Shells in `/components/layout/`
- [ ] Scoped CSS imported
- [ ] Sample content replaced
- [ ] Breakpoints tested + accessibility audit passed

## Final
- [ ] Commit message follows template
- [ ] PR title matches commit
- [ ] Tagged `@design` + `@frontend` for review
```

---

**Placement Summary**
- One‑Pager Checklist → `/docs/nicepage-export-checklist.md` (full reference)
- In‑File Pocket Card → Top of every exported layout/component file in VS Code (keeps Copilot on‑track)
- Commit Template → `/docs/contributing.md`
- PR Checklist → `.github/PULL_REQUEST_TEMPLATE.md`
