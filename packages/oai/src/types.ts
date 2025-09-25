export type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
export type ToolParam = Record<string, Json>;
export type ToolResult = { ok: true; data?: Json } | { ok: false; error: string };
export type Tool<I extends Record<string, unknown> = Record<string, unknown>> = {
  name: string;
  description: string;
  input: unknown; // zod schema
  run: (params: I) => Promise<ToolResult>;
};
