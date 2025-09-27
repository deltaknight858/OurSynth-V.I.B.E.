import React, { useState } from "react";
import { useCapsule } from "../../packages/core/capsule";
import { useProvenance } from "../../packages/core/provenance";
import { HaloCard, HaloButton } from "halo-ui";

export const Capsule: React.FC = () => {
  const { manifest, exportCapsule, replay, diff } = useCapsule();
  const { logEdit } = useProvenance();
  const [exported, setExported] = useState<any>(null);

  const handleExport = () => {
    const exportResult = exportCapsule();
    setExported(exportResult);
    logEdit({ type: "capsule-export", manifest: manifest });
  };

  return (
    <div className="capsule-panel p-6">
      <h2 className="text-xl font-bold mb-4">Capsule 📦 — Export & Time Machine</h2>
      <HaloCard className="mb-4">
        <div>
          <h4 className="font-bold mb-2">Capsule Manifest</h4>
          <pre>{JSON.stringify(manifest, null, 2)}</pre>
        </div>
        <HaloButton size="md" onClick={handleExport}>
          Export Capsule (+ Provenance + SBOM)
        </HaloButton>
        {exported && (
          <div className="mt-4">
            <h4 className="font-bold">Exported Artifact</h4>
            <pre>{JSON.stringify(exported, null, 2)}</pre>
          </div>
        )}
      </HaloCard>
      <HaloCard className="mb-4">
        <h4 className="font-bold mb-2">Time Machine/Diffs</h4>
        <pre>{JSON.stringify(diff(), null, 2)}</pre>
        <HaloButton size="sm" onClick={() => replay()}>
          Replay Capsule
        </HaloButton>
      </HaloCard>
    </div>
  );
};

export default Capsule;