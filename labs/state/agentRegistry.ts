export interface AgentSpec { key: string; name: string; category: string; status: string; description: string; }

export const agentCatalog: AgentSpec[] = [
  { key: 'chatAssist', name: 'Chat Assistant', category: 'interaction', status: 'MVP', description: 'Conversational interface & tool trigger proposals.' },
  { key: 'analyzer', name: 'Codebase Analyzer', category: 'intelligence', status: 'PLANNED', description: 'Builds structural graph & hotspots.' },
  { key: 'orchestrator', name: 'Orchestrator', category: 'workflow', status: 'PLANNED', description: 'Multi-step plan composition across agents.' },
  { key: 'capsule', name: 'Capsule Builder', category: 'packaging', status: 'PLANNED', description: 'Package components/pathways into distributable capsules.' },
  { key: 'pathwayPlanner', name: 'Pathway Planner', category: 'design', status: 'PLANNED', description: 'Interactive node graph authoring.' },
  { key: 'provenance', name: 'Provenance Tracker', category: 'observability', status: 'PLANNED', description: 'Track invocation timeline & diffs.' },
  { key: 'timeTravel', name: 'Time Travel Navigator', category: 'observability', status: 'PLANNED', description: 'Navigate snapshots & semantic diffs.' },
  { key: 'refactor', name: 'Refactor Agent', category: 'quality', status: 'PLANNED', description: 'Suggest structural improvements / patches.' },
  { key: 'lintFix', name: 'Lint & Style Agent', category: 'quality', status: 'PLANNED', description: 'Apply lint/style fixes.' },
  { key: 'testGen', name: 'Test Generation Agent', category: 'quality', status: 'PLANNED', description: 'Generate unit/integration test scaffolds.' },
  { key: 'uxAudit', name: 'UX Heuristic Auditor', category: 'design', status: 'PLANNED', description: 'Heuristic UX evaluation.' },
  { key: 'accessibility', name: 'Accessibility Auditor', category: 'compliance', status: 'PLANNED', description: 'WCAG & ARIA validation.' },
  { key: 'performance', name: 'Performance Profiler', category: 'performance', status: 'PLANNED', description: 'Route performance metrics & suggestions.' },
  { key: 'assetOptimizer', name: 'Asset Optimizer', category: 'assets', status: 'PLANNED', description: 'Optimize images/SVG & produce diff stats.' },
  { key: 'svgSprite', name: 'SVG Sprite Compiler', category: 'assets', status: 'MVP', description: 'Generate sprite & React registry.' },
  { key: 'tokenSync', name: 'Token Sync Agent', category: 'design', status: 'PLANNED', description: 'Diff & reconcile tokens.' },
  { key: 'brandPulse', name: 'Brand Consistency Agent', category: 'branding', status: 'PLANNED', description: 'Detect palette / logo drift.' },
  { key: 'releasePlanner', name: 'Release Planner', category: 'workflow', status: 'PLANNED', description: 'Change aggregation & version suggestion.' },
  { key: 'dependencyGuardian', name: 'Dependency Guardian', category: 'security', status: 'PLANNED', description: 'Vulnerability & update analysis.' },
  { key: 'monetizationScout', name: 'Monetization Scout', category: 'business', status: 'PLANNED', description: 'Identify monetizable assets.' },
  { key: 'marketplacePublisher', name: 'Marketplace Publisher', category: 'distribution', status: 'PLANNED', description: 'Prepare marketplace metadata.' }
];
