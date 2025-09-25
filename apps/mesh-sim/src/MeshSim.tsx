import React, { useState } from "react";
import { useMeshSim } from "../../packages/core/mesh";
import { useProvenance } from "../../packages/core/provenance";
import { HaloCard, HaloButton } from "halo-ui";

export const MeshSim: React.FC = () => {
  const { runSim, getResult } = useMeshSim();
  const { logEdit } = useProvenance();
  const [result, setResult] = useState<any>(null);

  const handleSim = () => {
    const simResult = runSim({ nodes: 5, chaos: true });
    setResult(simResult);
    logEdit({ type: "mesh-sim", result: simResult });
  };

  return (
    <div className="meshsim-panel p-6">
      <h2 className="text-xl font-bold mb-4">MeshSim 🌐 — Capsule Simulation</h2>
      <HaloCard className="mb-4">
        <HaloButton size="md" onClick={handleSim}>
          Run Mesh Simulation
        </HaloButton>
        {result && (
          <div className="mt-4">
            <h4 className="font-bold">Result (Provenance Artifact)</h4>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </HaloCard>
    </div>
  );
};

export default MeshSim;