## Architecture Overview

The system is a Next.js application with a modular Labs domain containing all evolving feature code. Legacy or imported artifacts live in `import-staging/` until promoted.

### Layers
1. Presentation (labs/primitives + modules UI)
2. State (labs/state/* per domain store)
3. Services (agent runtime bridges, API fetch)
4. Assets (brand, svg registry)
5. Automation (scripts for promotion & build)

### Separation Rules
- Pages perform minimal orchestration → delegate to modules.
- Modules never import from other modules' internals: use public surface (index/barrel).
- Assets accessed only via registry utilities.
