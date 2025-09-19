import { z } from 'zod';
export const CapsuleManifest = z.object({
    id: z.string(), // urn:oursynth:app:slug@semver
    name: z.string(),
    version: z.string(),
    createdAt: z.number(),
    createdBy: z.object({ name: z.string(), keyId: z.string() }),
    app: z.object({
        framework: z.literal('nextjs'),
        node: z.string().default('20.x'),
        env: z.record(z.string()).default({})
    }),
    services: z.array(z.object({
        name: z.string(), // e.g., 'db','realtime'
        type: z.enum(['postgres', 'edge', 'worker', 'kv']),
        config: z.record(z.any()).default({})
    })).default([]),
    build: z.object({
        steps: z.array(z.string()), // e.g., ['pnpm i','pnpm build']
        outDir: z.string().default('.next')
    }),
    seeds: z.array(z.object({
        name: z.string(),
        type: z.enum(['sql', 'crdt', 'files']),
        path: z.string()
    })).default([]),
    attestations: z.array(z.object({
        type: z.string(), // 'sbom','diff','provenance'
        sha256: z.string(),
        meta: z.record(z.any()).default({})
    })).default([]),
    rights: z.object({
        license: z.string().default('OSL-3.0-or-compatible'),
        resaleAllowed: z.boolean().default(true),
        attribution: z.boolean().default(true)
    }).default({ license: 'OSL-3.0-or-compatible', resaleAllowed: true, attribution: true })
});
