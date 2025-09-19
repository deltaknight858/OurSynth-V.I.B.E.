The OurSynth Onboarding Kit
You can think of this as the "DNA" of your ecosystem. By providing these files, you're not just sharing code; you're sharing the strategy, rules, and patterns that make the architecture work.

1. Core Strategy & Architecture (The "Why")
These documents explain the high-level vision and how all the pieces are designed to fit together. They are essential for understanding the roles of V.I.B.E. (Domains) and Connect (Deploy).

c:\Users\davos\Desktop\OurSynth\docs\workflows\domains-and-connect.md
Purpose: This is the most critical new document. It's the master blueprint that explains how V.I.B.E. (where Aether would live) and Connect work together. It defines the entire composition-to-deployment lifecycle that every project must follow.
c:\Users\davos\Desktop\OurSynth\docs\ARCHITECTURE.md
Purpose: Provides the high-level "four pillars" view of the ecosystem. It's a great starting point for anyone new to the project.
c:\Users\davos\OurSynth-Core\docs\agent-architecture.md
Purpose: This explains how agents are the functional units of the system. It's absolutely essential for Assist to understand how to integrate as the user-facing entry point for the agent ecosystem.
c:\Users\davos\Desktop\OurSynth\docs\agents\agents-overview.md
Purpose: This is the detailed "roster" of all agents. It provides the specific contracts, inputs, and outputs that Assist will need to orchestrate and that Aether will use to build workflows.
2. Code Quality & Guardrails (The "Rules")
These files automatically enforce the architectural rules. They are non-negotiable for any project that wants to be part of the ecosystem.

c:\Users\davos\Desktop\OurSynth\.eslintrc.json
Purpose: This is your automated rule-keeper. It prevents developers from using legacy colors and, most importantly, blocks any imports from import-staging. This forces everyone to follow the "Promote or Rebuild" discipline.
c:\Users\davos\Desktop\OurSynth\tsconfig.json
Purpose: Defines the project structure through its paths aliases (e.g., @/components/*, @/state/*). This ensures a consistent folder layout across all projects.
c:\Users\davos\Desktop\OurSynth\package.json
Purpose: The scripts section ("lint:colors", "ci:design", etc.) demonstrates the commitment to automated quality checks. Any new project should adopt or integrate with these CI/CD gates.
3. Component & State Patterns (The "How")
These files serve as concrete, "gold standard" examples of how to build new features and components.

c:\Users\davos\Desktop\OurSynth\components\marketing\sections\AdvancedOrganizationSection.tsx
Purpose: A perfect example of a "rebuilt" component. It shows how to use HaloButton, tokenized typography, internal icons, and the layout-edge class. This is the template for any new UI component in Halo UI, Assist, or Aether.
c:\Users\davos\Desktop\OurSynth\state\agent\agentSessionStore.ts
Purpose: The blueprint for application state. It shows the standard implementation of a zustand store, complete with actions, state, and mock execution logic. Assist should use this exact pattern for managing its chat sessions.
c:\Users\davos\Desktop\OurSynth\components\system\FocusRing.module.css
Purpose: A simple but powerful example of "Token-First Design." It shows how to use CSS variables for tokens (var(--radius-md), var(--color-accent-primary)) instead of hard-coded values. This is fundamental for Halo UI.
