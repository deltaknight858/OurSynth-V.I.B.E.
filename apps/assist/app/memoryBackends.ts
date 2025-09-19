import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddingsProvider } from '@/packages/wizard-capsule/src/embeddings';
import { createSupabaseMemoryAPI, createSupabaseGraphAPI } from '@/packages/wizard-capsule/src/adapters/supabase';
import { memory as inMemory } from '@/packages/wizard-capsule/src/memory';
import type { GraphContext } from '@/packages/wizard-capsule/src/types';

// In-memory default (local dev)
export const inMemoryBackend = inMemory;

// Supabase + pgvector backend (staging/prod)
export function supabaseBackend() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const embeddings = new OpenAIEmbeddingsProvider(openai);
  const supabase = createClient(url, key);
  return createSupabaseMemoryAPI(supabase as unknown as any, embeddings);
}

// Graph context loader for mindmap
export function makeLoadContext(useSupabase: boolean) {
  if (useSupabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const supabase = createClient(url, key);
    const { graph } = createSupabaseGraphAPI(supabase as unknown as any);
    return (nodeId: string, depth = 2) => graph.getGraphContext(nodeId, depth);
  }
  // In-memory fallback: minimal single-node context
  return async (nodeId: string): Promise<GraphContext> => ({
    node: { id: nodeId, title: nodeId, createdAt: new Date() },
    edges: [],
    neighbors: [],
  });
}
