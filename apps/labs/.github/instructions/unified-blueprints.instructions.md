---
applyTo: '**'
---
# OurSynth Labs - Unified Layout Implementation Blueprint

## Overview

This document provides a detailed implementation guide for unifying the OurSynth Labs UI experience. The goal is to transform our current collection of disconnected pages into a cohesive, intuitive workspace that minimizes navigation and maximizes creative flow.

## Current State Assessment

- Multiple isolated feature directories in `apps/studio/app/` (vibe, wizard, marketplace, etc.)
- Each feature has its own page.tsx with minimal shared navigation
- Global layout.tsx exists but doesn't provide enough connective tissue
- Users must navigate between pages frequently, breaking immersion

## Target Architecture

### Core Pages (3-4 total)

1. **Studio Workspace** (`/studio` or `/`)
   - Primary creative hub with persistent layout
   - Features accessible as panels/tabs rather than separate pages
   - URL-driven state for deep linking (`/studio?feature=vibe`)

2. **Onboarding** (`/onboarding`)
   - First-run experience
   - Direct path to Workspace upon completion

3. **Command Center** (`/command-center`)
   - Admin/operations with own layout
   - Configuration and system management

4. **Marketplace** (`/marketplace` or modal overlay)
   - Asset browsing and acquisition
   - Accessible within Workspace as overlay and standalone for deep linking

## Implementation Roadmap

### Phase 1: WorkspaceShell Foundation

#### 1.1 Create WorkspaceShell Component

```tsx
// apps/studio/components/workspace/WorkspaceShell.tsx

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Header from '../layout/Header';
import LeftNav from '../layout/LeftNav';
import RightInspector from '../layout/RightInspector';

type WorkspaceFeature = 'vibe' | 'wizard' | 'capsule' | 'analyzer' | 'mesh-sim' | 'cards' | 'orchestrator' | 'ambient';

interface WorkspaceShellProps {
  children?: React.ReactNode;
  defaultFeature?: WorkspaceFeature;
}

export default function WorkspaceShell({ children, defaultFeature = 'vibe' }: WorkspaceShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get current feature from URL or use default
  const [activeFeature, setActiveFeature] = useState<WorkspaceFeature>(
    (searchParams.get('feature') as WorkspaceFeature) || defaultFeature
  );
  
  // Sync URL with active feature
  useEffect(() => {
    const currentFeature = searchParams.get('feature');
    if (activeFeature && activeFeature !== currentFeature) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('feature', activeFeature);
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [activeFeature, pathname, router, searchParams]);
  
  // Handle feature change
  const handleFeatureChange = (feature: WorkspaceFeature) => {
    setActiveFeature(feature);
  };
  
  return (
    <div className="workspace-shell">
      <Header />
      <div className="workspace-content">
        <LeftNav activeFeature={activeFeature} onFeatureChange={handleFeatureChange} />
        <main className="workspace-canvas">
          {children}
        </main>
        <RightInspector feature={activeFeature} />
      </div>
    </div>
  );
}
```

#### 1.2 Update Root Layout

```tsx
// apps/studio/app/layout.tsx

import { AppThemeProvider } from '../components/theme/AppThemeProvider';
import WorkspaceShell from '../components/workspace/WorkspaceShell';
import CinematicFlow from '../components/visual/CinematicFlow';
import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>
          <CinematicFlow />
          <WorkspaceShell>
            {children}
          </WorkspaceShell>
        </AppThemeProvider>
      </body>
    </html>
  );
}
```

#### 1.3 Create Feature Panel System

```tsx
// apps/studio/components/workspace/FeaturePanel.tsx

import React, { Suspense } from 'react';
import { lazy } from 'react';

// Lazy load feature components
const VibePanel = lazy(() => import('../features/vibe/VibePanel'));
const WizardPanel = lazy(() => import('../features/wizard/WizardPanel'));
const AnalyzerPanel = lazy(() => import('../features/analyzer/AnalyzerPanel'));
const CapsulePanel = lazy(() => import('../features/capsule/CapsulePanel'));
const MeshSimPanel = lazy(() => import('../features/mesh-sim/MeshSimPanel'));
const CardsPanel = lazy(() => import('../features/cards/CardsPanel'));
const OrchestratorPanel = lazy(() => import('../features/orchestrator/OrchestratorPanel'));
const AmbientPanel = lazy(() => import('../features/ambient/AmbientPanel'));

interface FeaturePanelProps {
  feature: string;
}

export default function FeaturePanel({ feature }: FeaturePanelProps) {
  // Render appropriate panel based on feature
  const renderPanel = () => {
    switch (feature) {
      case 'vibe':
        return <VibePanel />;
      case 'wizard':
        return <WizardPanel />;
      case 'analyzer':
        return <AnalyzerPanel />;
      case 'capsule':
        return <CapsulePanel />;
      case 'mesh-sim':
        return <MeshSimPanel />;
      case 'cards':
        return <CardsPanel />;
      case 'orchestrator':
        return <OrchestratorPanel />;
      case 'ambient':
        return <AmbientPanel />;
      default:
        return <div>Select a feature to begin</div>;
    }
  };

  return (
    <div className="feature-panel">
      <Suspense fallback={<div>Loading feature...</div>}>
        {renderPanel()}
      </Suspense>
    </div>
  );
}
```

### Phase 2: Feature Migration

#### 2.1 Convert Existing Pages to Panels

For each feature directory (e.g., vibe, wizard, etc.):

1. Create a panel component that encapsulates the feature's functionality
2. Extract core functionality from page.tsx into the panel
3. Keep the original page.tsx as a fallback for deep linking

Example for Vibe feature:

```tsx
// apps/studio/components/features/vibe/VibePanel.tsx

import React from 'react';
// Import core functionality from the existing vibe page
import { VibeControls, VibePreview } from '../../../app/vibe/components';
import { useVibeState } from '../../../app/vibe/hooks/useVibeState';

export default function VibePanel() {
  const vibeState = useVibeState();
  
  return (
    <div className="vibe-panel">
      <h2>Vibe Creator</h2>
      <div className="vibe-content">
        <VibeControls state={vibeState} />
        <VibePreview state={vibeState} />
      </div>
    </div>
  );
}
```

Update the existing page to use the panel:

```tsx
// apps/studio/app/vibe/page.tsx

import VibePanel from '../../components/features/vibe/VibePanel';

export default function VibePage() {
  return <VibePanel />;
}
```

#### 2.2 Update Main Studio Page

```tsx
// apps/studio/app/page.tsx

import { Suspense } from 'react';
import FeaturePanel from '../components/workspace/FeaturePanel';

export default function StudioPage({ searchParams }: { searchParams: { feature?: string } }) {
  const feature = searchParams.feature || 'vibe';
  
  return (
    <Suspense fallback={<div>Loading studio...</div>}>
      <FeaturePanel feature={feature} />
    </Suspense>
  );
}
```

#### 2.3 Implement Left Navigation

```tsx
// apps/studio/components/layout/LeftNav.tsx

import React from 'react';
import Link from 'next/link';
import { IconVibe, IconWizard, IconAnalyzer, IconCapsule, IconMeshSim, IconCards, IconOrchestrator, IconAmbient } from '../icons';

interface LeftNavProps {
  activeFeature: string;
  onFeatureChange: (feature: string) => void;
}

const features = [
  { id: 'vibe', name: 'Vibe', icon: IconVibe },
  { id: 'wizard', name: 'Wizard', icon: IconWizard },
  { id: 'analyzer', name: 'Analyzer', icon: IconAnalyzer },
  { id: 'capsule', name: 'Capsule', icon: IconCapsule },
  { id: 'mesh-sim', name: 'Mesh Sim', icon: IconMeshSim },
  { id: 'cards', name: 'Cards', icon: IconCards },
  { id: 'orchestrator', name: 'Orchestrator', icon: IconOrchestrator },
  { id: 'ambient', name: 'Ambient', icon: IconAmbient },
];

export default function LeftNav({ activeFeature, onFeatureChange }: LeftNavProps) {
  return (
    <nav className="left-nav">
      <ul>
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <li key={feature.id} className={activeFeature === feature.id ? 'active' : ''}>
              <button
                onClick={() => onFeatureChange(feature.id)}
                aria-label={feature.name}
                title={feature.name}
              >
                <Icon />
                <span>{feature.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
      
      <div className="nav-footer">
        <Link href="/command-center">Command Center</Link>
      </div>
    </nav>
  );
}
```

### Phase 3: Right Inspector Implementation

#### 3.1 Create Contextual Inspector

```tsx
// apps/studio/components/layout/RightInspector.tsx

import React from 'react';
import { lazy, Suspense } from 'react';

// Lazy load inspectors
const VibeInspector = lazy(() => import('../features/vibe/VibeInspector'));
const WizardInspector = lazy(() => import('../features/wizard/WizardInspector'));
// ... other inspectors

interface RightInspectorProps {
  feature: string;
}

export default function RightInspector({ feature }: RightInspectorProps) {
  const renderInspector = () => {
    switch (feature) {
      case 'vibe':
        return <VibeInspector />;
      case 'wizard':
        return <WizardInspector />;
      // ... other cases
      default:
        return <div>Select a feature to view tools</div>;
    }
  };

  return (
    <aside className="right-inspector">
      <div className="inspector-header">
        <h3>Tools & Properties</h3>
        <button className="toggle-inspector">⋮</button>
      </div>
      
      <div className="inspector-content">
        <Suspense fallback={<div>Loading tools...</div>}>
          {renderInspector()}
        </Suspense>
      </div>
    </aside>
  );
}
```

### Phase 4: Marketplace Modal Integration

#### 4.1 Create Marketplace Modal

```tsx
// apps/studio/components/marketplace/MarketplaceModal.tsx

import React from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from '../ui/Dialog';
import MarketplaceContent from '../../app/marketplace/components/MarketplaceContent';

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MarketplaceModal({ isOpen, onClose }: MarketplaceModalProps) {
  const router = useRouter();
  
  const handleOpenFullMarketplace = () => {
    router.push('/marketplace');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose} className="marketplace-modal">
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Marketplace</Dialog.Title>
          <Dialog.Description>
            Discover assets for your creations
          </Dialog.Description>
          <button onClick={handleOpenFullMarketplace}>Open full marketplace</button>
        </Dialog.Header>
        
        <div className="marketplace-modal-content">
          <MarketplaceContent isModal={true} />
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
```

#### 4.2 Add Marketplace Button to Header

```tsx
// apps/studio/components/layout/Header.tsx

import React, { useState } from 'react';
import Link from 'next/link';
import MarketplaceModal from '../marketplace/MarketplaceModal';

export default function Header() {
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  
  return (
    <header className="app-header">
      <div className="logo">
        <Link href="/">OurSynth Labs</Link>
      </div>
      
      <nav className="header-nav">
        <button onClick={() => setIsMarketplaceOpen(true)}>Marketplace</button>
        <Link href="/onboarding">Learn</Link>
      </nav>
      
      <div className="user-profile">
        <Link href="/account">Profile</Link>
      </div>
      
      <MarketplaceModal 
        isOpen={isMarketplaceOpen} 
        onClose={() => setIsMarketplaceOpen(false)} 
      />
    </header>
  );
}
```

### Phase 5: Command Center Integration

#### 5.1 Keep Command Center Separate with Shared Components

```tsx
// apps/studio/app/command-center/layout.tsx

import { AppThemeProvider } from '../../components/theme/AppThemeProvider';
import CinematicFlow from '../../components/visual/CinematicFlow';
import Header from '../../components/layout/Header';
import '../../styles/globals.css';

export default function CommandCenterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="command-center-layout">
      <AppThemeProvider>
        <CinematicFlow />
        <Header />
        <main className="command-center-content">
          {children}
        </main>
      </AppThemeProvider>
    </div>
  );
}
```

### Phase 6: Progressive Disclosure & Context Awareness

#### 6.1 Create Feature Context Provider

```tsx
// apps/studio/components/context/FeatureContext.tsx

import React, { createContext, useContext, useState, useCallback } from 'react';

type FeatureContextType = {
  activeFeature: string;
  featureHistory: string[];
  setActiveFeature: (feature: string) => void;
  showRelatedFeatures: (feature: string) => string[];
};

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export function FeatureProvider({ children }: { children: React.ReactNode }) {
  const [activeFeature, setActiveFeature] = useState<string>('vibe');
  const [featureHistory, setFeatureHistory] = useState<string[]>([]);
  
  const handleSetActiveFeature = useCallback((feature: string) => {
    setFeatureHistory((prev) => [...prev, activeFeature]);
    setActiveFeature(feature);
  }, [activeFeature]);
  
  // Determine related features based on current feature
  const showRelatedFeatures = useCallback((feature: string) => {
    const relatedMap: Record<string, string[]> = {
      'vibe': ['wizard', 'orchestrator'],
      'wizard': ['vibe', 'capsule'],
      'analyzer': ['mesh-sim', 'ambient'],
      // Add more relationships
    };
    
    return relatedMap[feature] || [];
  }, []);
  
  return (
    <FeatureContext.Provider value={{
      activeFeature,
      featureHistory,
      setActiveFeature: handleSetActiveFeature,
      showRelatedFeatures,
    }}>
      {children}
    </FeatureContext.Provider>
  );
}

export function useFeature() {
  const context = useContext(FeatureContext);
  if (context === undefined) {
    throw new Error('useFeature must be used within a FeatureProvider');
  }
  return context;
}
```

#### 6.2 Enhance LeftNav with Progressive Disclosure

```tsx
// Updated apps/studio/components/layout/LeftNav.tsx

import React from 'react';
import { useFeature } from '../context/FeatureContext';
// ... other imports

export default function LeftNav() {
  const { activeFeature, setActiveFeature, showRelatedFeatures } = useFeature();
  const relatedFeatures = showRelatedFeatures(activeFeature);
  
  return (
    <nav className="left-nav">
      <ul>
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;
          const isRelated = relatedFeatures.includes(feature.id);
          
          // Highlight related features to encourage discovery
          return (
            <li 
              key={feature.id} 
              className={`
                ${isActive ? 'active' : ''} 
                ${isRelated ? 'related' : ''}
              `}
            >
              <button
                onClick={() => setActiveFeature(feature.id)}
                aria-label={feature.name}
                title={feature.name}
              >
                <Icon />
                <span>{feature.name}</span>
                {isRelated && <span className="related-badge">✨</span>}
              </button>
            </li>
          );
        })}
      </ul>
      
      {/* Rest of component */}
    </nav>
  );
}
```

## Testing & Quality Assurance

### Key Test Cases

1. Feature switching preserves state
2. URL deep linking works correctly
3. Back/forward navigation functions as expected
4. Marketplace modal integrates with main workspace
5. Command Center maintains separate navigation structure
6. Progressive disclosure highlights related features

### Performance Metrics

1. Time to interactive < 2s for main workspace
2. Feature switch time < 200ms
3. Initial load < 3s for critical components

## Migration Strategy for Existing Pages

1. Start with highest-traffic features
2. Implement the shell and navigation first
3. Migrate one feature at a time to panel structure
4. Keep original routes functioning during transition
5. Add A/B testing to validate improvements

## Implementation Timeline

- Week 1: WorkspaceShell foundation and LeftNav
- Week 2: Feature Panel system and first feature migration (Vibe)
- Week 3: Right Inspector and additional feature migrations
- Week 4: Marketplace Modal and Command Center integration
- Week 5: Progressive disclosure and refinements
- Week 6: Testing, performance optimization, and launch

## Technical Considerations

- Use React.lazy and Suspense for code splitting
- Maintain URL state for bookmarking and sharing
- Ensure keyboard navigation throughout the workspace
- Implement analytics to track navigation patterns
- Support theming via AppThemeProvider
- Maintain motion continuity with CinematicFlow

---

This blueprint provides a comprehensive guide for implementing a unified layout experience in OurSynth Labs. By following this approach, we'll create a more cohesive, intuitive UI that minimizes navigation overhead while maximizing creative flow