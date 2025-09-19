import React from "react";
import fs from "fs";
import path from "path";
import AppLayout from "../components/AppLayout";
import styles from "../components/Documentation.module.css";

// Helper to get docs list (static for now)
const docsList = [
  "BRAND_GUIDELINES.md",
  "COMPONENT_GUIDELINES.md",
  "SHELL_LAYOUT.md",
  "THEME_SYSTEM.md",
  "VISUAL_TOKEN_SHEET.md",
  "README.md",
  "agents/agents-overview.md"
];

export default function DocumentationPage() {
  return (
    <AppLayout title="Documentation">
      <div className={styles.container}>
        <div style={{ display: "flex", gap: "2rem" }}>
          <aside style={{ minWidth: 220 }}>
            <h2>Docs Index</h2>
            <ul>
              {docsList.map(doc => (
                <li key={doc}>
                  <a href={`/docs/${doc.replace(/\\/g, "/")}`} target="_blank" rel="noopener noreferrer">
                    {doc.replace(".md", "").replace("agents/", "Agents: ")}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
          <main style={{ flex: 1 }}>
            <h2>Agents Overview</h2>
            <div className={styles.agentsOverview}>
              {/* Render markdown preview here (static for now) */}
              <pre className={styles.preWrap}>
{`
## Agents Overview

Unified catalog of all proposed / planned OurSynth Labs agents. Each agent is a composable service surfaced via Chat, Command Palette, or contextual panel actions. All agents conform to a common lifecycle: plan → execute → emit events (provenance) → summarize.

---
### 1. Agent Index (Canonical Names)
| Key | Name | Category | Primary Output | MVP Status | Monetization Potential |
|-----|------|----------|----------------|-----------|------------------------|
| analyzer | Codebase Analyzer | Intelligence | Structural report + hotspots | PLANNED | Premium deep graph scans |
| orchestrator | Orchestrator | Workflow | Multi-step execution plan | PLANNED | Paid automation bundles |
| capsule | Capsule Builder | Packaging | Exported component/pathway bundle | PLANNED | Paid export formats / marketplace fee |
| pathwayPlanner | Pathway Planner | Design | Node graph & step flow | PLANNED | Template marketplace |
| provenance | Provenance Tracker | Observability | Timeline snapshots + diffs | PLANNED | Retention tiers |
| timeTravel | Time Travel Navigator | Observability | State rewind interface | PLANNED | Advanced diff tooling add-on |
| agentRegistry | Agent Registry | Meta | Registered agent manifest | PLANNED | Enterprise governance add-on |
| chatAssist | Chat Assistant | Interaction | Contextual response (LLM) | MVP | Token billing / subscription |
| refactor | Refactor Agent | Code Quality | Patch suggestions | PLANNED | Bulk refactor credits |
| lintFix | Lint & Style Agent | Code Quality | Auto-fix patch | PLANNED | Batch enforcement tier |
| testGen | Test Generation Agent | Quality | Unit/integration test scaffolds | PLANNED | Per-test credit |
| uxAudit | UX Heuristic Auditor | Design | Issue list + severity | PLANNED | Report credits |
| accessibility | Accessibility Auditor | Compliance | WCAG report + remediation steps | PLANNED | Compliance subscription |
| performance | Performance Profiler | Performance | Metrics + optimization hints | PLANNED | Advanced metrics tier |
| assetOptimizer | Asset Optimizer | Assets | Optimized SVG/IMG & diff stats | PLANNED | Bulk optimization credits |
| svgSprite | SVG Sprite Compiler | Assets | Generated sprite / React indices | MVP | FREE (upsell to pipeline bundle) |
| tokenSync | Token Sync Agent | Design System | Reconciled tokens diff | PLANNED | Multi-theme pack |
| brandPulse | Brand Consistency Agent | Branding | Deviation report | IMPLEMENTED | Brand enforcement add-on |
| releasePlanner | Release Planner | Workflow | Changelog + semantic version rec | IMPLEMENTED | Release automation tier |
| dependencyGuardian | Dependency Guardian | Security | Vulnerability & update plan | PLANNED | Security subscription |
| monetizationScout | Monetization Scout | Business | Productizable asset list | IMPLEMENTED | Revenue share / upsell |
| marketplacePublisher | Marketplace Publisher | Distribution | Packaged listing metadata | IMPLEMENTED | Listing fee / % rev |
| ... | ... | ... | ... | ... | ... |
`}
              </pre>
            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
