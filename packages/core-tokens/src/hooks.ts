// OurSynth-Eco Core Hooks: Provenance, Agents, Capsule, MeshSim, Orchestrator, Project Identity
// Additive, cross-wired for all flows. Can be split later as needed.

import { useState } from "react";

/** --- Provenance --- **/
export function useProvenance() {
  const [timeline, setTimeline] = useState<any[]>([]);
  function logEdit(event: any) {
    setTimeline((prev) => [...prev, { ...event, timestamp: Date.now() }]);
  }
  function getTimeline() {
    return timeline;
  }
  return { logEdit, getTimeline };
}

/** --- Agent Registry/Session --- **/
const defaultAgents = [
  { id: "agent1", name: "Scribe" },
  { id: "agent2", name: "Builder" },
  { id: "agent3", name: "Orchestrator" },
];

export function useAgentRegistry() {
  const [registry] = useState(defaultAgents);
  return { registry };
}

export function useAgentSession() {
  const [session] = useState({ userId: "user_eco", activeAgent: "agent1", actions: [] as any[] });
  function pushAction(action: any) {
    session.actions.push({ ...action, timestamp: Date.now() });
  }
  return { session, pushAction };
}

/** --- Capsule --- **/
const dummyManifest = { name: "Demo Capsule", version: "1.0.0", created: Date.now() };
export function useCapsule() {
  function exportCapsule() {
    return { manifest: dummyManifest, signed: true, sbom: { deps: ["core", "halo-ui"] }, provenance: Date.now() };
  }
  function replay() {
    // Simulate replay logic
    return true;
  }
  function diff() {
    // Simulate diff logic
    return [{ change: "Initial commit" }, { change: "Edit on panel" }];
  }
  return { manifest: dummyManifest, exportCapsule, replay, diff };
}

/** --- MeshSim --- **/
export function useMeshSim() {
  function runSim({ nodes, chaos }: { nodes: number; chaos: boolean }) {
    return {
      nodes,
      chaosInjected: chaos,
      latencyMs: chaos ? Math.random() * 100 : 10,
      artifact: { id: "mesh123", signed: true },
    };
  }
  function getResult() {
    return {};
  }
  return { runSim, getResult };
}

/** --- Orchestrator --- **/
const defaultJobs = [
  { id: "build_capsule", label: "Build Capsule" },
  { id: "run_mesh_sim", label: "Run Mesh Simulation" },
  { id: "export_provenance", label: "Export Provenance" },
];

export function useOrchestrator() {
  const [jobs] = useState(defaultJobs);
  const [history, setHistory] = useState<any[]>([]);
  function runJob(jobId: string) {
    setHistory((prev) => [...prev, { job: jobId, time: Date.now() }]);
  }
  function getHistory() {
    return history;
  }
  return { jobs, runJob, getHistory };
}

/** --- Project Identity --- **/
export function useProjectIdentity() {
  const [identity, setIdentity] = useState({ origin: "unknown" });
  function setOrigin(origin: string) {
    setIdentity({ origin });
  }
  return { identity, setOrigin };
}
