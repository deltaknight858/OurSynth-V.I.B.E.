# OAI operating contract

- Always refresh the registry before actions:
  pwsh ./tools/discover-registry.ps1

- Prefer Wizard delegation first. If artifacts are incomplete or stalled >5m, switch to Observe then Act.

- Use the bridge CLI for all interactions:
  - List actions: pwsh ./tools/oai-wizard.ps1 actions
  - Invoke: pwsh ./tools/oai-wizard.ps1 invoke -ActionId `<id>` -Input @{...}
  - Await + Harvest: pwsh ./tools/oai-wizard.ps1 await/harvest
  - Apply + PR: pwsh ./tools/oai-wizard.ps1 apply/pr

- Never hard-code paths. Resolve services from .studio/registry.json.

- Record every step to .studio/journal.ndjson. Include inputsHash and contentHash in commit bodies.
It’s built so OAI can trigger it end‑to‑end, with every step observable and harvestable.

🛠 Job runner upgrade

1. Extend your in‑memory runner
ts
// src/jobs/runner.ts
import { spawn } from 'node:child_process';
import path from 'node:path';
import { recordArtifact, updateJobStatus } from './store';

export async function runJob(job) {
  updateJobStatus(job.id, 'running');

  // Map action → command(s)
  const commands = {
    'scaffold-component': [
      'pnpm',
      ['workspace', 'ui-components', 'gen', job.payload.name]
    ],
    'add-route': [
      'pnpm',
      ['workspace', 'web-app', 'gen-route', job.payload.route]
    ],
  };

  const [cmd, args] = commands[job.action] || [];
  if (!cmd) throw new Error(`Unknown action: ${job.action}`);

  const child = spawn(cmd, args, { cwd: path.resolve(process.cwd()) });

  let output = '';
  child.stdout.on('data', chunk => output += chunk);
  child.stderr.on('data', chunk => output += chunk);

  child.on('close', code => {
    recordArtifact(job.id, {
      type: 'log',
      content: output,
      exitCode: code
    });
    updateJobStatus(job.id, code === 0 ? 'completed' : 'failed');
  });
}
2. Auto‑register these actions in Wizard
Make your /actions endpoint pull from a local registry.json so OAI knows exactly what’s available — that list stays in sync with your actual generator scripts.

json
// .studio/registry.json
[
  {
    "id": "scaffold-component",
    "description": "Generate a new UI component in ui-components workspace",
    "params": ["name"]
  },
  {
    "id": "add-route",
    "description": "Add a new route to the web-app",
    "params": ["route"]
  }
]
3. Wire to VS Code task
jsonc
// .vscode/tasks.json
{
  "label": "Wizard: scaffold-component",
  "type": "shell",
  "command": "oai",
  "args": ["invoke", "scaffold-component", "--name", "${input:componentName}"],
  "problemMatcher": []
}
4. Provenance & harvest
When the runner logs a completed job, attach:

Artifact hash (Capsule signing)

Git branch name where changes landed

Diff summary for OAI to sanity‑check before PR

With that in place, you can tell OAI:

Invoke scaffold-component with Button …and watch it run the gen script, sign the artifact, commit on a feature branch, and drop a PR link back into the conversation.
