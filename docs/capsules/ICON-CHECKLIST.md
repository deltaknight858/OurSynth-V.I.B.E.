# Icon & Logo Checklist – OurSynth Labs

## Main Logos
- `/assets/brand/logo.svg` – Robot mascot + "OurSynth" wordmark
- `/assets/brand/logo.png` – (exported fallback)
- `/assets/brand/icon.svg` – Robot head (mascot)
- `/assets/brand/icon.png` – (exported fallback)
- `/assets/brand/wordmark.svg` – "OurSynth" text
- `/assets/brand/wordmark.png` – (exported fallback)

## Section Icons
- `/assets/brand/home-icon.svg` – Neon house/spark
- `/assets/brand/workspace-icon.svg` – Neon grid/sandbox
- `/assets/brand/preview-icon.svg` – Neon eye/monitor
- `/assets/brand/command-center-icon.svg` – Neon dashboard
- `/assets/brand/history-icon.svg` – Neon timeline/clock
- `/assets/brand/docs-icon.svg` – Neon book/document
- `/assets/brand/contributors-icon.svg` – Neon handshake/group

## Utility Icons
- `/assets/brand/search-icon.svg`
- `/assets/brand/settings-icon.svg`
- `/assets/brand/notification-icon.svg`
- `/assets/brand/user-icon.svg`
- `/assets/brand/success-icon.svg`
- `/assets/brand/error-icon.svg`
- `/assets/brand/warning-icon.svg`
- `/assets/brand/external-link-icon.svg`

> Purge unused SVGs after migration!  
> All SVGs must inherit color via CSS and be simple/monoline style.

---

## Audit & Bloat Tips

- Run audit scripts (see COPILOT_INSTRUCTIONS.md) to find unused SVGs.
- Remove any asset not referenced in UI/components after migration.