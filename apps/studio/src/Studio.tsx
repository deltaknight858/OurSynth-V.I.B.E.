import React, { useEffect } from "react";
import { useProvenance } from "../../packages/core/provenance";
import { useAgentSession } from "../../packages/core/agents";
import { useProjectIdentity } from "../../packages/core/project";
import { HaloCard, HaloButton } from "halo-ui";

export const Studio: React.FC = () => {
  const { logEdit, getTimeline } = useProvenance();
  const { session, pushAction } = useAgentSession();
  const { identity, setOrigin } = useProjectIdentity();

  useEffect(() => {
    setOrigin("studio");
    logEdit({ type: "open", user: session.userId, origin: identity.origin });
  }, [session.userId, identity.origin, setOrigin, logEdit]);

  return (
    <div className="studio-panel p-6">
      <h2 className="text-xl font-bold mb-4">Studio 🖌️ — Visual Builder</h2>
      <HaloCard className="mb-4">
        <div>
          <p>Project Origin: <strong>{identity.origin}</strong></p>
          <p>Current User: <strong>{session.userId}</strong></p>
        </div>
      </HaloCard>
      {/* Example: Drag-and-drop builder UI */}
      <HaloCard className="mb-4">
        <div>
          <h3 className="font-semibold mb-2">Builder Canvas</h3>
          <div className="canvas" style={{ height: 400, background: "#181c24", borderRadius: 8 }}>
            {/* ...actual drag/drop logic goes here... */}
            <p className="text-muted">[Canvas placeholder]</p>
          </div>
        </div>
      </HaloCard>
      <HaloButton size="md" onClick={() => pushAction({ type: "save", user: session.userId })}>
        Save & Log Provenance
      </HaloButton>
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

export default Studio;