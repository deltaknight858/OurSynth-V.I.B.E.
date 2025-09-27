import React from "react";
import { useProvenance } from "../../packages/core/provenance";
import { HaloCard } from "halo-ui";

export const Provenance: React.FC = () => {
  const { getTimeline } = useProvenance();

  return (
    <div className="provenance-panel p-6">
      <h2 className="text-xl font-bold mb-4">Provenance 📜 — Audit Timeline</h2>
      <HaloCard className="mb-4">
        <h4 className="font-bold">Timeline Events</h4>
        <ul>
          {getTimeline().map((event, i) => (
            <li key={i} className="text-xs text-muted">{JSON.stringify(event)}</li>
          ))}
        </ul>
      </HaloCard>
    </div>
  );
};

export default Provenance;