import React, { useState } from "react";
import { useOrchestrator } from "../../packages/core/orchestrator";
import { useProvenance } from "../../packages/core/provenance";
import { HaloCard, HaloButton } from "halo-ui";

export const Orchestrator: React.FC = () => {
  const { jobs, runJob, getHistory } = useOrchestrator();
  const { logEdit } = useProvenance();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  return (
    <div className="orchestrator-panel p-6">
      <h2 className="text-xl font-bold mb-4">Orchestrator ⚙️ — Job Manager</h2>
      <HaloCard className="mb-4">
        <h4 className="font-semibold mb-2">Available Jobs</h4>
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <HaloButton size="sm" onClick={() => { runJob(job.id); setSelectedJob(job.id); logEdit({ type: "job-run", job: job.id }); }}>
                Run: {job.label}
              </HaloButton>
            </li>
          ))}
        </ul>
      </HaloCard>
      <div className="mt-6">
        <h4 className="font-bold">Job History</h4>
        <ul>
          {getHistory().map((event, i) => (
            <li key={i} className="text-xs text-muted">{JSON.stringify(event)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Orchestrator;