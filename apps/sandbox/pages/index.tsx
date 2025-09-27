import React, { useEffect } from 'react';
import { applyLabsTheme } from '../theme';
import { HaloButton } from '../../memory/src/components/ui/HaloButton';
import { agentCatalog } from '../state/agentRegistry';
import '../primitives/_labs.css';

export default function LabsHome() {
  useEffect(()=>{ applyLabsTheme(); },[]);
  const quickActions = [
    'Analyze code structure',
    'Suggest refactor for selected file',
    'Generate tests for Panel primitive',
    'Optimize SVG assets',
    'Plan pathway for onboarding flow'
  ];
  return (
    <main className="labs-app-root">
      <h1 className="labs-heading-1">OurSynth Labs</h1>
      <p className="labs-paragraph">Experimental workspace. Theme + primitives + agent registry scaffold loaded. Interact using natural language – no drag & drop, just describe your intent.</p>
      <h2 className="labs-heading-2">Agents</h2>
      <ul className="labs-agent-grid">
        {agentCatalog.slice(0,8).map(a => (
          <li key={a.key} className="labs-agent-card">
            <strong>{a.name}</strong><span className="labs-agent-cat"> · {a.category}</span>
            <small>{a.description}</small>
          </li>
        ))}
      </ul>
      <h2 className="labs-heading-2">Try Asking</h2>
      <ul className="labs-action-list">
        {quickActions.map(a => <li key={a}>{a}</li>)}
      </ul>
  <HaloButton data-glow className="labs-cta-btn">Open Chat (Soon)</HaloButton>
    </main>
  );
}
