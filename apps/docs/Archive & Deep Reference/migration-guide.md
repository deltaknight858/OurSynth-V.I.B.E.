# 🗂️ OurSynth V.I.B.E. Monorepo Migration & Command Wheel Blueprint

1. Migration Plan (Eco → V.I.B.E.)
📁 Folder‑by‑Folder Analysis & Placement
assets → V.I.B.E/assets/brand and V.I.B.E/assets/ (icons, images, components). Deduplicate.

brand → V.I.B.E/brand/ with docs/ subfolder. Deduplicate logos/icons.

components → V.I.B.E/components/ with subfolders (agents/, capsules/, icons/, etc.). Merge with halo-ui/core-tokens.

lib → V.I.B.E/lib/ (auth/, integrations/, utils/).

packages → V.I.B.E/packages/ (agents, orchestrator, mesh, ui, core, storybook). Skip already‑migrated.

pages → V.I.B.E/pages/, wrapped in ShellApp for consistent chrome (wheel, agent ball, provenance bar).

scripts → V.I.B.E/tools/ (assets/, build/, migration/).

state → V.I.B.E/state/ (agent stores). Align with types/.

styles → V.I.B.E/styles/ (global, scoped/).

tokens → V.I.B.E/tokens/ (design tokens JSON).

types → V.I.B.E/types/ (agent/, ui/, logs/).

configs → V.I.B.E/configs/ (build/, lint/, ci/).

🧹 Deduplication & Cleanliness
Merge overlapping UI primitives into packages/ui/.

Keep components/ for app‑level layouts/panels.

Align state/ + types/.

Consolidate docs into docs/, leave README stubs pointing back.

🧭 Migration Order
packages/

components/ + ui/

assets/brand/

state/ + types/

pages/ (wrap in ShellApp)

scripts → tools/

styles/ + tokens/

configs/

2.Command Wheel Reference
📂 File Structure
File Location Purpose
RadialCommandCenter.tsx apps/shell/ Core wheel component
RadialCommandCenter.css apps/shell/ Styling (glass, neon)
Wheel.tsx apps/shell/ Hydrates wheel from actions.json + registry.json
actions.json apps/shell/Declarative list of actions
registry.json packages/orchestrator/Registry of active agents
DeveloperConsole.tsx apps/shell/Hidden spoke for advanced users
AgentBallDemo.tsx apps/shell/Animated agent avatar
CommandCenter.tsx apps/shell/Unified console (chat, push, runner)
AgentChat.tsx apps/shell/Conversational interface
AgentPushPanel.tsx apps/shell/Raw JSON push panel
🌐 Invocation Channels Spectrum
🎡 Radial Command Center → cinematic

💬 AgentChat → conversational

🧠 CommandCenter → structured console

🛠️ AgentPushPanel → raw JSON push

🧩 DeveloperConsole → hidden spoke

All route through the Orchestrator.

⚙️ Dynamic Hydration
tsx
useEffect(() => {
  fetchRegistry().then(registry => {
    const filtered = actions.filter(a => registry.includes(a.id));
    setAvailableActions(filtered);
  });
}, []);
🔮 Agent Ball Integration
Floating avatar

Status indicator (color/glow)

Interactive assistant

🔗 Invocation Channels Diagram
mermaid
flowchart TD
  Wheel[🎡 Radial Command Center]:::wheel --> Orchestrator[🧠 Orchestrator]
  Chat[💬 AgentChat]:::chat --> Orchestrator
  Console[🧩 DeveloperConsole]:::console --> Orchestrator
  Push[🛠️ AgentPushPanel]:::push --> Orchestrator
  Center[🧠 CommandCenter]:::center --> Chat
  Center --> Push
  Center --> Console

  classDef wheel fill:#0ea5e9,stroke:#fff,color:#fff
  classDef chat fill:#34d399,stroke:#000,color:#000
  classDef console fill:#facc15,stroke:#000,color:#000
  classDef push fill:#60a5fa,stroke:#000,color:#000
  classDef center fill:#a78bfa,stroke:#000,color:#000
3. Contributors’ Guide
✅ Workflow Checklist
Fork & branch

Add action → actions.json

Register agent → registry.json

Implement agent → packages/agents/

Connect orchestrator

Test in wheel

Document in docs/agents/

✨ Treat each spoke like a new organism: alive, reproducible, observable.

⚡ Quickstart Example: HelloWorldAgent
json
// actions.json
{
  "id": "hello-world",
  "label": "Hello World",
  "run": "orchestrator.invoke('HelloWorldAgent')",
  "group": "Demo"
}
json
// registry.json
{
  "agents": ["AssistAgent", "MemoryAgent", "HelloWorldAgent"]
}
ts
// packages/agents/hello-world/index.ts
export async function HelloWorldAgent(input: any) {
  return { message: "👋 Hello, world! Your agent is alive.", input };
}
ts
// orchestrator
import { HelloWorldAgent } from "packages/agents/hello-world";
const registry = { HelloWorldAgent };
export function invoke(agentId: string, input: any) {
  return registry[agentId](input);
}
4. Future Extensions
🔮 Agent Ball Dev Mode (glow in developer mode)

🧪 Sandbox Spoke (experiments)

⏪ Provenance Replay

🎨 Wheel Customization

📜 Registry Viewer

🌈 Wheel Themes

🗺️ Future Extensions Diagram
mermaid
flowchart TD
  Wheel[🎡 Radial Command Center]:::wheel --> Orchestrator[🧠 Orchestrator]

  subgraph CurrentSpokes
    Chat[💬 AgentChat]:::chat
    Console[🧩 DeveloperConsole]:::console
    Push[🛠️ AgentPushPanel]:::push
    Center[🧠 CommandCenter]:::center
  end

  subgraph FutureSpokes
    BallDev[🔮 Agent Ball Dev Mode]:::future
    Sandbox[🧪 Sandbox Spoke]:::future
    Replay[⏪ Provenance Replay]:::future
    Custom[🎨 Wheel Customization]:::future
    Registry[📜 Registry Viewer]:::future
    Themes[🌈 Wheel Themes]:::future
  end

  Wheel --> Chat
  Wheel --> Console
  Wheel --> Push
  Wheel --> Center

  Wheel -. roadmap .-> BallDev
  Wheel -. roadmap .-> Sandbox
  Wheel -. roadmap .-> Replay
  Wheel -. roadmap .-> Custom
  Wheel -. roadmap .-> Registry
  Wheel -. roadmap .-> Themes

  classDef wheel fill:#0ea5e9,stroke:#fff,color:#fff
  classDef chat fill:#34d399,stroke:#000,color:#000
  classDef console fill:#facc15,stroke:#000,color:#000
  classDef push fill:#60a5fa,stroke:#000,color:#000
  classDef center fill:#a78bfa,stroke:#000,color:#000
  classDef future fill:#f472b6,stroke:#000,color:#000
✨ Golden Thought: Migration + Wheel = stage + spotlight. ShellApp is the stage, the Command Wheel is the spotlight, agents are the actors, and docs are the script. Contributors step into a coherent world, not a pile of folders.
