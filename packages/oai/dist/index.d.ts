type Json = string | number | boolean | null | Json[] | {
    [k: string]: Json;
};
type ToolResult = {
    ok: true;
    data?: Json;
} | {
    ok: false;
    error: string;
};
type Tool<I extends Record<string, unknown> = Record<string, unknown>> = {
    name: string;
    description: string;
    input: unknown;
    run: (params: I) => Promise<ToolResult>;
};

declare const capsuleTools: [
    Tool<{
        appDir: string;
        manifestPath: string;
        outPath: string;
    }>,
    Tool<{
        filePath: string;
        env: 'dev' | 'staging' | 'prod';
    }>
];

declare const tools: (Tool<{
    appDir: string;
    manifestPath: string;
    outPath: string;
}> | Tool<{
    filePath: string;
    env: "dev" | "staging" | "prod";
}>)[];

export { capsuleTools, tools, capsuleTools as toolsCapsule };
