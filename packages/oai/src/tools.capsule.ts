import { z } from 'zod';
import type { Tool, ToolResult } from './types.js';
import { publish } from './bus.js';
import { execFile } from 'child_process';
import { promisify } from 'util';
const run = promisify(execFile);

export const capsuleTools: [
  Tool<{ appDir: string; manifestPath: string; outPath: string }>,
  Tool<{ filePath: string; env: 'dev'|'staging'|'prod' }>
] = [
  {
    name: 'capsule.pack',
    description: 'Pack current app into a signed Capsule',
    input: z.object({
      appDir: z.string(),
      manifestPath: z.string(),
      outPath: z.string()
    }),
  async run(p): Promise<ToolResult> {
      publish('oai', 'capsule.pack.started', { appDir: p.appDir });
      try {
        const { stdout } = await run('capsule', ['pack', p.appDir, '--manifest', p.manifestPath, '--out', p.outPath], {
          env: { ...process.env }
        });
        publish('oai', 'capsule.pack.completed', JSON.parse(stdout));
        return { ok: true, data: JSON.parse(stdout) };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        publish('oai', 'capsule.pack.failed', { error: msg });
        return { ok: false, error: msg };
      }
    }
  },
  {
    name: 'capsule.deploy',
    description: 'Deploy a Capsule file to a target env',
    input: z.object({
      filePath: z.string(),
      env: z.enum(['dev','staging','prod']).default('staging')
    }),
  async run(p): Promise<ToolResult> {
      publish('deploy', 'capsule.deploy.started', { env: p.env });
      try {
        // delegate to your existing Deploy API with the filePath
        const res = await fetch(`${process.env.DEPLOY_URL}/api/deploy/capsule`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(p)
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        publish('deploy', 'capsule.deploy.accepted', data);
        return { ok: true, data };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        publish('deploy', 'capsule.deploy.failed', { error: msg });
        return { ok: false, error: msg };
      }
    }
  }
];