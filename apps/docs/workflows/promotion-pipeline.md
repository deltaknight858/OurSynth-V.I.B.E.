## Promotion Pipeline

| Stage | Location | Action |
|-------|----------|--------|
| Raw | import-staging | Initial drop-in |
| Review | import-staging + doc issue | Evaluate reuse |
| Transform | script output | Tokenize, optimize |
| Promote | labs/modules/* | Registered, documented |
| Stable | labs + tests | Part of releases |

### Automation Hooks (Planned)
- Pre-promotion lint rule
- SVG naming validator
- Token usage detector
