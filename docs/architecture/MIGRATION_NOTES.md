> **DEPRECATED:** This document is retained for historical reference only. See README.md for current guidance.

# Migration Notes

External folders in the workspace are source material. They are not part of the monorepo unless explicitly copied:

- capsule-wizard-landing-studio-store-web/ – used to migrate Wizard components and docs into @oursynth/core and apps/assist.
- OurSynth-Core/ – legacy static site; brand assets and docs referenced.
- Neumorphic Components/ and LanguageGUI kits – design inspiration only.

What to do next

- Keep external folders unchanged; treat them as read-only.
- Promote assets/components via scripts and PRs into packages/ and apps/.
- Record each promotion in docs/import-staging-audit.md.
