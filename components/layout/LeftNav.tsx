'use client';

import React from 'react';
import Link from 'next/link';
import { WorkspaceFeature, FEATURE_CONFIG } from '../../types/workspace';

// Simple icon components (will be replaced with proper icons later)
const IconPlaceholder = ({ name }: { name: string }) => (
  <div className="w-5 h-5 bg-current rounded-sm opacity-70 flex items-center justify-center text-xs font-bold">
    {name.charAt(0).toUpperCase()}
  </div>
);

interface LeftNavProps {
  activeFeature: WorkspaceFeature;
  onFeatureChange: (feature: WorkspaceFeature) => void;
}

const features: WorkspaceFeature[] = [
  'vibe', 'wizard', 'analyzer', 'capsule', 'mesh-sim', 'cards', 'orchestrator', 'ambient'
];

export default function LeftNav({ activeFeature, onFeatureChange }: LeftNavProps) {
  return (
    <nav className="left-nav">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
          Features
        </h2>
      </div>
      
      <ul>
        {features.map((feature) => {
          const config = FEATURE_CONFIG[feature];
          return (
            <li key={feature} className={activeFeature === feature ? 'active' : ''}>
              <button
                onClick={() => onFeatureChange(feature)}
                aria-label={config.name}
                title={config.description}
                className="group"
              >
                <IconPlaceholder name={config.name} />
                <div>
                  <div className="font-medium">{config.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                    {config.description}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
        <Link 
          href="/command-center"
          className="flex items-center gap-3 p-3 text-sm text.slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <IconPlaceholder name="Command Center" />
          <span>Command Center</span>
        </Link>
      </div>
    </nav>
  );
}