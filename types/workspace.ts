export type WorkspaceFeature = 
  | 'vibe'
  | 'wizard'
  | 'analyzer'
  | 'capsule'
  | 'mesh-sim'
  | 'cards'
  | 'orchestrator'
  | 'ambient';

export const DEFAULT_FEATURE: WorkspaceFeature = 'vibe';

export const FEATURE_CONFIG = {
  vibe: {
    name: 'Vibe',
    description: 'Create atmospheric and mood-based musical elements',
    path: '/studio?feature=vibe'
  },
  wizard: {
    name: 'Wizard',
    description: 'Guided music creation assistant',
    path: '/studio?feature=wizard'
  },
  analyzer: {
    name: 'Analyzer',
    description: 'Analyze and process audio content',
    path: '/studio?feature=analyzer'
  },
  capsule: {
    name: 'Capsule',
    description: 'Package and deploy music components',
    path: '/studio?feature=capsule'
  },
  'mesh-sim': {
    name: 'Mesh Sim',
    description: 'Simulate complex audio mesh networks',
    path: '/studio?feature=mesh-sim'
  },
  cards: {
    name: 'Cards',
    description: 'Card-based music composition interface',
    path: '/studio?feature=cards'
  },
  orchestrator: {
    name: 'Orchestrator',
    description: 'Coordinate multiple music generation agents',
    path: '/studio?feature=orchestrator'
  },
  ambient: {
    name: 'Ambient',
    description: 'Generate ambient and atmospheric soundscapes',
    path: '/studio?feature=ambient'
  }
} as const;