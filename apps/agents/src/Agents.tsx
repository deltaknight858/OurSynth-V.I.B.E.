import React from "react";
import { useAgentRegistry, useAgentSession } from "../../packages/core/agents";
import { HaloCard, HaloButton } from "halo-ui";

export const Agents: React.FC = () => {
  const { registry } = useAgentRegistry();
  const { session, pushAction } = useAgentSession();

  return (
    <div className="agents-panel p-6">
      <h2 className="text-xl font-bold mb-4">Agents 🤖 — Registry & Session</h2>
      <HaloCard className="mb-4">
        <h4 className="font-semibold mb-2">Registered Agents</h4>
        <ul>
          {registry.map((agent) => (
            <li key={agent.id}>
              <span>{agent.name}</span>
              <HaloButton size="sm" onClick={() => pushAction({ type: "interact", agent: agent.id })}>
                Interact
              </HaloButton>
            </li>
          ))}
        </ul>
      </HaloCard>
      <HaloCard className="mb-4">
        <h4 className="font-semibold mb-2">Session State</h4>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </HaloCard>
    </div>
  );
};

export default Agents;