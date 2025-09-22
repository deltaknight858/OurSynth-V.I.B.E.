import React from "react";
import { useOrchestrator } from "../../packages/core/orchestrator";
import { useAgentSession } from "../../packages/core/agents";
import { HaloCard, HaloButton } from "halo-ui";

export const CommandCenter: React.FC = () => {
  const { jobs, runJob } = useOrchestrator();
  const { session, pushAction } = useAgentSession();

  return (
    <div className="command-center-panel p-6">
      <h2 className="text-xl font-bold mb-4">Command Center 🎛️ — Unified Control</h2>
      <HaloCard className="mb-4">
        <h4 className="font-semibold mb-2">Orchestrator Jobs</h4>
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <HaloButton size="sm" onClick={() => runJob(job.id)}>
                Run: {job.label}
              </HaloButton>
            </li>
          ))}
        </ul>
      </HaloCard>
      <HaloCard className="mb-4">
        <h4 className="font-semibold mb-2">Agent Actions</h4>
        <ul>
          <li>
            <HaloButton size="sm" onClick={() => pushAction({ type: "ping", user: session.userId })}>
              Ping Agent
            </HaloButton>
          </li>
        </ul>
      </HaloCard>
    </div>
  );
};

export default CommandCenter;