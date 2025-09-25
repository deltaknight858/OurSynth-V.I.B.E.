import React, { useEffect, useState } from "react";
import { useProvenance } from "../../packages/core/provenance";
import { useProjectIdentity } from "../../packages/core/project";
import { HaloCard, HaloButton } from "halo-ui";

export const Pathways: React.FC = () => {
  const { logEdit, getTimeline } = useProvenance();
  const { identity, setOrigin } = useProjectIdentity();
  const [step, setStep] = useState(0);

  useEffect(() => {
    setOrigin("wizard");
    logEdit({ type: "open", user: "wizard", origin: "wizard" });
  }, [setOrigin, logEdit]);

  return (
    <div className="pathways-panel p-6">
      <h2 className="text-xl font-bold mb-4">Pathways 🪄 — Wizard & Generator</h2>
      <HaloCard className="mb-4">
        <div>
          <p>Origin: <strong>{identity.origin}</strong></p>
          <p>Step: {step + 1} / 3</p>
        </div>
        {/* Step-by-step wizard */}
        <div>
          {step === 0 && <p>Step 1: Describe your app.</p>}
          {step === 1 && <p>Step 2: Select features.</p>}
          {step === 2 && <p>Step 3: Review & export capsule.</p>}
        </div>
        <HaloButton size="md" onClick={() => setStep(Math.min(step + 1, 2))}>
          Next
        </HaloButton>
      </HaloCard>
      <div className="mt-6">
        <h4 className="font-bold">Provenance Timeline</h4>
        <ul>
          {getTimeline().map((event, i) => (
            <li key={i} className="text-xs text-muted">{JSON.stringify(event)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Pathways;