# Component Primitives

_Status: Living, authoritative_
_Last updated: September 24, 2025_

**See Also:**

- [Component Guidelines](./COMPONENT_GUIDELINES.md)
- [Brand Guidelines](../brand/BRAND_GUIDELINES.md)
- [Shell Layout](../architecture/SHELL_LAYOUT.md)
- [Glossary](../reference/GLOSSARY.md)
- [Engineering Standards](../reference/STANDARDS.md)

## Primitives

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| Surface | Base wrapper sets context | variant (base/raised/inset) |
| Panel | Structured container | header, footer, scroll, depth |
| NeonButton | Accent CTA | variant, glow, size |
| IconButton | Icon-only action | size, active |
| ScrollArea | Consistent scroll styling | orientation |

All primitives must be token-only and SSR-safe.
