# Brand Migration Guide

This guide tracks moving brand assets from Labs/Labs-1/Labs-2 and Desktop captures into the monorepo.

## Sources

- OurSynth-Labs*/brand/*
- OurSynth-Labs*/branding/OurSynth/*
- Desktop/Aether (captures used for references)

## Steps

1. Copy brand-manifest.json → brand/brand-manifest.json (latest version wins)
2. Merge identity/ assets (logos, icons) → brand/identity/
3. Move motion references → brand/motion/
4. Move static images/exports → brand/static/
5. Copy cards/ design references → brand/cards/
6. Update docs/BRANDING.md if tokens or naming change

## Notes

- Prefer vector sources (SVG) when possible
- Large binaries should be tracked via Git LFS (see .gitattributes)
- Keep changelog entries for brand updates in PR descriptions
