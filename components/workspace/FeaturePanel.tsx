import React, { Suspense } from 'react';
import { WorkspaceFeature, FEATURE_CONFIG } from '../../types/workspace';

// Import panel components (these will be simple placeholder implementations for now)
import VibePanel from '../features/vibe/VibePanel';
import WizardPanel from '../features/wizard/WizardPanel';
import AnalyzerPanel from '../features/analyzer/AnalyzerPanel';
import CapsulePanel from '../features/capsule/CapsulePanel';
import MeshSimPanel from '../features/mesh-sim/MeshSimPanel';
import CardsPanel from '../features/cards/CardsPanel';
import OrchestratorPanel from '../features/orchestrator/OrchestratorPanel';
import AmbientPanel from '../features/ambient/AmbientPanel';

interface FeaturePanelProps {
  feature: WorkspaceFeature;
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
        return (
          <div className="panel-container">
            <div className="text-center py-12">
              <h2 className="text-xl font-medium text-slate-600 dark:text-slate-400 mb-2">
                Select a feature to begin
              </h2>
              <p className="text-slate-500 dark:text-slate-500">
                Choose a tool from the navigation to start creating.
              </p>
            </div>
          </div>
        );
    }
  };

  const config = FEATURE_CONFIG[feature];

  return (
    <div className="feature-panel">
      <Suspense 
        fallback={
          <div className="panel-container">
            <div className="animate-pulse">
              <div className="panel-header">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-96"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        }
      >
        {renderPanel()}
      </Suspense>
    </div>
  );
}