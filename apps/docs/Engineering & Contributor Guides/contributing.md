# 🤝 Contributing Guide

Welcome! This project uses a **modular workflow** so that each app, package, or fix is developed in isolation and merged cleanly into `main`. Please follow these guidelines when contributing.

---

## 🌿 Branch Naming Convention

Use the following prefixes to keep branches organized:

- **feature/** → new apps, packages, or functionality  
  - Example: `feature/add-memory-app`
- **fix/** → bug fixes  
  - Example: `fix/login-auth-bug`
- **chore/** → maintenance tasks (docs, configs, refactors)  
  - Example: `chore/update-dependencies`
- **hotfix/** → urgent fixes directly to `main`  
  - Example: `hotfix/patch-security-issue`

---

## 🔄 Workflow

1. **Start from `main`**

   ```bash
   git checkout main
   git pull origin main


## ✅ Contributor Workflow Checklist

A quick guide for adding a new spoke to the Command Wheel:

1. **Fork & Branch** → Create a feature branch for your spoke.
2. **Add Action** → Define it in `actions.json` (unique `id`, label, run command).
3. **Register Agent** → Add to `registry.json` so the wheel hydrates dynamically.
4. **Implement Agent** → Create the agent in `packages/agents/` with inputs/outputs.
5. **Connect Orchestrator** → Ensure the orchestrator can route the new agent.
6. **Test in Wheel** → Run the app, confirm the spoke appears and works.
7. **Document** → Add a short entry in `docs/agents/` with purpose and usage.

✨ **Golden Thought**: Treat each spoke like a new “organism” in the ecosystem — it should be alive, reproducible, and observable by others.
Contributors’ Guide: Adding a Spoke

The Command Wheel is designed to be extensible. Contributors can add new spokes (actions, agents, or tools) by following these steps:

1. Define the Action

Add a new entry in actions.json:

{
  "id": "myNewAgent",
  "label": "My New Agent",
  "run": "orchestrator.invoke('MyNewAgent')",
  "group": "Core"
}

Keep id unique and consistent with the agent’s registry name.

2.Register the Agent

Ensure the agent is listed in registry.json under packages/orchestrator/.

This allows the wheel to hydrate dynamically and only show available actions.

3.Implement the Agent Logic

Place the agent in packages/agents/ with a spec file (e.g., myNewAgent.spec.ts).

Define inputs, outputs, and provenance hooks.

4.Connect to the Orchestrator

Confirm the orchestrator can route myNewAgent requests.

Add any middleware (auth, provenance, logging) if required.

5.Test in the Wheel

Run the app and open the Command Wheel.

Verify the spoke appears only when the agent is active in the registry.

Check that clicking the spoke triggers the correct agent behavior.

6.Document the Spoke

Add a short entry in docs/agents/ describing:

Purpose

Inputs/outputs

Example usage

Cross‑link back to the Command Wheel reference.

🔑 Best Practices

Keep it clean: Don’t hard‑code actions in the wheel; always use actions.json + registry.json.

Think context‑aware: Spokes should only appear when relevant (e.g., Deploy only in deployable contexts).

Provenance first: Ensure every action emits provenance events for replay and transparency.

Contributors matter: Write docs and examples so new collaborators can use your spoke immediately.

✨ Golden Thought: Adding a spoke isn’t just adding a button — it’s adding a voice to the system. Each spoke should feel like a natural extension of the Command Wheel’s personality: cinematic, helpful, and alive.

⚡ Quickstart Example: HelloWorldAgent

Here’s a minimal example of adding a new spoke to the Command Wheel.

1. Define the Action

Add to actions.json:

{
  "id": "hello-world",
  "label": "Hello World",
  "run": "orchestrator.invoke('HelloWorldAgent')",
  "group": "Demo"
}

2.Register the Agent

In packages/orchestrator/registry.json:

{
  "agents": [
    "AssistAgent",
    "MemoryAgent",
    "HelloWorldAgent"
  ]
}

3.Implement the Agent

Create packages/agents/hello-world/index.ts:

export async function HelloWorldAgent(input: any) {
  return {
    message: "👋 Hello, world! Your agent is alive.",
    input
  };
}

4.Connect to the Orchestrator

Ensure the orchestrator can route HelloWorldAgent:

import { HelloWorldAgent } from "packages/agents/hello-world";

const registry = {
  HelloWorldAgent,
  // ...other agents
};

export function invoke(agentId: string, input: any) {
  return registry[agentId](input);
}

5.Test in the Wheel

Run the app, open the Command Wheel.

You should see a new spoke: Hello World.

Clicking it invokes the agent and returns the message.

✨ Golden Thought: This “Hello World” spoke is more than a demo — it’s a template. Contributors can fork it, rename it, and instantly prototype new agents without touching the wheel’s core logic.
