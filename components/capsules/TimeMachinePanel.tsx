// PROMOTED from import-staging/apps/app/capsule/TimeMachinePanel.tsx on 2025-09-08T20:34:32.039Z
// De-MUI'd and aligned with OurSynth UI primitives + CSS utilities.
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import '../ui/ui.css';

// Mock Capsule history data
const mockHistory = [
  {
    id: '1',
    label: 'Initial Build',
    timestamp: '2025-08-10T12:00:00Z',
    manifest: { version: '1.0.0', description: 'Initial release' },
    provenance: 'Created',
    signature: 'sig1',
    attestation: 'att1',
  },
  {
    id: '2',
    label: 'Bugfix',
    timestamp: '2025-08-12T15:30:00Z',
    manifest: { version: '1.0.1', description: 'Bugfix' },
    provenance: 'Patched',
    signature: 'sig2',
    attestation: 'att2',
  },
  {
    id: '3',
    label: 'Feature Add',
    timestamp: '2025-08-15T09:45:00Z',
    manifest: { version: '1.1.0', description: 'Added feature X' },
    provenance: 'Feature',
    signature: 'sig3',
    attestation: 'att3',
  },
];

export const TimeMachinePanel: React.FC = () => {
  const [index, setIndex] = useState(mockHistory.length - 1);
  const current = mockHistory[index];
  const prev = index > 0 ? mockHistory[index - 1] : null;

  return (
    <section className="sharedCard" aria-label="Capsule Time Machine">
      <header className="flex items-center justify-between mb-2">
        <h2>Capsule Time Machine</h2>
      </header>
      <p className="textMutedSmall mb-3">
        Scrub through Capsule history, view diffs, branch, promote, replay, and deploy.
      </p>

      <div className="mb-3">
        <input
          type="range"
          min={0}
          max={mockHistory.length - 1}
          step={1}
          value={index}
          aria-label="History index"
          onChange={(e) => setIndex(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex wrap mt-1" aria-hidden>
          {mockHistory.map((h, i) => (
            <span key={h.id} className={`chip ${i === index ? 'active' : ''}`}>{h.label}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Button variant="outline" size="sm" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled={index === mockHistory.length - 1} onClick={() => setIndex(index + 1)}>
          Next
        </Button>
        <Button variant="primary" size="sm">Promote to Deploy</Button>
        <Button variant="secondary" size="sm">Replay</Button>
        <Button variant="outline" size="sm">Branch</Button>
      </div>

      <hr className="mb-2" />

      <h3 className="mb-1">Current State</h3>
      <div className="mb-2">
        <pre className="codeBlock">
          {JSON.stringify(current, null, 2)}
        </pre>
      </div>

      {prev && (
        <div className="mb-2">
          <h4 className="mb-1">Diff with Previous</h4>
          <pre className="codeBlock codeBlock--muted">
            {JSON.stringify({
              version: `${prev.manifest.version} → ${current.manifest.version}`,
              description: `${prev.manifest.description} → ${current.manifest.description}`,
            }, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
};
