import { z } from 'zod';
export declare const CapsuleManifest: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    version: z.ZodString;
    createdAt: z.ZodNumber;
    createdBy: z.ZodObject<{
        name: z.ZodString;
        keyId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        keyId: string;
    }, {
        name: string;
        keyId: string;
    }>;
    app: z.ZodObject<{
        framework: z.ZodLiteral<"nextjs">;
        node: z.ZodDefault<z.ZodString>;
        env: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        framework: "nextjs";
        node: string;
        env: Record<string, string>;
    }, {
        framework: "nextjs";
        node?: string | undefined;
        env?: Record<string, string> | undefined;
    }>;
    services: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<["postgres", "edge", "worker", "kv"]>;
        config: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: "postgres" | "edge" | "worker" | "kv";
        config: Record<string, any>;
    }, {
        name: string;
        type: "postgres" | "edge" | "worker" | "kv";
        config?: Record<string, any> | undefined;
    }>, "many">>;
    build: z.ZodObject<{
        steps: z.ZodArray<z.ZodString, "many">;
        outDir: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        steps: string[];
        outDir: string;
    }, {
        steps: string[];
        outDir?: string | undefined;
    }>;
    seeds: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<["sql", "crdt", "files"]>;
        path: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        path: string;
        type: "sql" | "crdt" | "files";
    }, {
        name: string;
        path: string;
        type: "sql" | "crdt" | "files";
    }>, "many">>;
    attestations: z.ZodDefault<z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        sha256: z.ZodString;
        meta: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        sha256: string;
        meta: Record<string, any>;
    }, {
        type: string;
        sha256: string;
        meta?: Record<string, any> | undefined;
    }>, "many">>;
    rights: z.ZodDefault<z.ZodObject<{
        license: z.ZodDefault<z.ZodString>;
        resaleAllowed: z.ZodDefault<z.ZodBoolean>;
        attribution: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        license: string;
        resaleAllowed: boolean;
        attribution: boolean;
    }, {
        license?: string | undefined;
        resaleAllowed?: boolean | undefined;
        attribution?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    version: string;
    createdAt: number;
    createdBy: {
        name: string;
        keyId: string;
    };
    app: {
        framework: "nextjs";
        node: string;
        env: Record<string, string>;
    };
    services: {
        name: string;
        type: "postgres" | "edge" | "worker" | "kv";
        config: Record<string, any>;
    }[];
    build: {
        steps: string[];
        outDir: string;
    };
    seeds: {
        name: string;
        path: string;
        type: "sql" | "crdt" | "files";
    }[];
    attestations: {
        type: string;
        sha256: string;
        meta: Record<string, any>;
    }[];
    rights: {
        license: string;
        resaleAllowed: boolean;
        attribution: boolean;
    };
}, {
    id: string;
    name: string;
    version: string;
    createdAt: number;
    createdBy: {
        name: string;
        keyId: string;
    };
    app: {
        framework: "nextjs";
        node?: string | undefined;
        env?: Record<string, string> | undefined;
    };
    build: {
        steps: string[];
        outDir?: string | undefined;
    };
    services?: {
        name: string;
        type: "postgres" | "edge" | "worker" | "kv";
        config?: Record<string, any> | undefined;
    }[] | undefined;
    seeds?: {
        name: string;
        path: string;
        type: "sql" | "crdt" | "files";
    }[] | undefined;
    attestations?: {
        type: string;
        sha256: string;
        meta?: Record<string, any> | undefined;
    }[] | undefined;
    rights?: {
        license?: string | undefined;
        resaleAllowed?: boolean | undefined;
        attribution?: boolean | undefined;
    } | undefined;
}>;
export type CapsuleManifest = z.infer<typeof CapsuleManifest>;
