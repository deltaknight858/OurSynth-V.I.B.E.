import type { GraphAPI, MemoryAPI, MemoryNode, MemoryEdge, MemoryNote, SemanticResult, SearchOptions } from '../types.js';

export interface EmbeddingsProvider {
  embed(text: string): Promise<number[]>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SelectResult<T> = { data: T[] | null; error: any };
// eslint-disable-next-line @typescript-eslint/no-explicit-any

type SupabaseTable<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  insert(values: Partial<T> | Partial<T>[]): SupabaseTable<T> & { select: (columns: string) => Promise<SelectResult<T>> };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete(): SupabaseTable<T> & { eq: (col: keyof T & string, value: any) => SupabaseTable<T> & { select: (columns: string) => Promise<SelectResult<T>> } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eq(col: keyof T & string, value: any): SupabaseTable<T> & { select: (columns: string) => Promise<SelectResult<T>> };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ['in'](col: keyof T & string, values: any[]): SupabaseTable<T> & { select: (columns: string) => Promise<SelectResult<T>> };
  select(columns: string): Promise<SelectResult<T>>;
};

type SupabaseClientLike = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from<T = any>(table: string): SupabaseTable<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rpc?<T = any>(fn: string, args: Record<string, any>): Promise<SelectResult<T>>;
};

// Database row shapes (can be refined to match your schema exactly)
type NodeRow = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachments: any[] | null;
  id: string;
  capsule_id: string | null;
  user_id?: string | null;
  title: string;
  content: string | null;
  summary?: string | null;
  tags: string[] | null;
  created_at: string;
  embedding?: number[] | null;
};

type EdgeRow = {
  id: string;
  source_id: string;
  target_id: string;
  reason: string | null;
  score: number | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toNode(row: NodeRow): MemoryNode {
  return {
    id: row.id,
    capsuleId: row.capsule_id ?? undefined,
    userId: row.user_id ?? undefined,
    title: row.title,
    content: row.content ?? undefined,
    summary: row.summary ?? undefined,
    tags: row.tags ?? undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attachments: (row.attachments as any[] | null) ?? undefined,
    createdAt: row.created_at,
    embedding: row.embedding ?? undefined,
  };
}

function toEdge(row: EdgeRow): MemoryEdge {
  return {
    id: row.id,
    sourceId: row.source_id,
    targetId: row.target_id,
    reason: row.reason ?? undefined,
    score: row.score ?? undefined,
  };
}

export function createSupabaseGraphAPI(client: SupabaseClientLike) {
  const graph: GraphAPI = {
    async createNode(input) {
      const created_at = (input.createdAt instanceof Date ? input.createdAt.toISOString() : input.createdAt) as string;
      const row: Partial<NodeRow> = {
  capsule_id: input.capsuleId ?? null,
  user_id: input.userId ?? null,
        title: input.title,
  content: input.content ?? null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  summary: (input as any).summary ?? null,
        tags: input.tags ?? null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachments: (input as any).attachments ?? null,
        created_at,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  embedding: (input as any).embedding ?? null,
      };
      const { data, error } = await client.from<NodeRow>('memory_nodes').insert(row).select('*');
      if (error) throw error;
      if (!data || !data[0]) throw new Error('Insert memory_nodes returned no data');
      return toNode(data[0]);
    },
    async createEdge(input) {
      const row: Partial<EdgeRow> = {
        source_id: input.sourceId,
        target_id: input.targetId,
        reason: input.reason ?? null,
        score: input.score ?? null,
      };
      const { data, error } = await client.from<EdgeRow>('memory_edges').insert(row).select('*');
      if (error) throw error;
      if (!data || !data[0]) throw new Error('Insert memory_edges returned no data');
      return toEdge(data[0]);
    },
    async getGraphContext(nodeId, depth = 2) {
      // BFS up to depth collecting edges and neighbor nodes
      const { data: nodeRows, error: nodeErr } = await client.from<NodeRow>('memory_nodes').eq('id', nodeId).select('*');
      if (nodeErr) throw nodeErr;
      if (!nodeRows || !nodeRows[0]) throw new Error('Node not found');
      const node = toNode(nodeRows[0]);

      const visited = new Set<string>([nodeId]);
      let frontier = [nodeId];
      const allEdgeRows: EdgeRow[] = [];

      for (let d = 0; d < Math.max(1, depth); d++) {
        if (frontier.length === 0) break;
        // edges where source in frontier OR target in frontier (two queries)
        const [srcRes, tgtRes] = await Promise.all([
          client.from<EdgeRow>('memory_edges')['in']('source_id', frontier).select('*'),
          client.from<EdgeRow>('memory_edges')['in']('target_id', frontier).select('*'),
        ]);
        if (srcRes.error) throw srcRes.error;
        if (tgtRes.error) throw tgtRes.error;
        const merged = [...(srcRes.data ?? []), ...(tgtRes.data ?? [])];
        allEdgeRows.push(...merged);

        // compute next frontier
        const neighborIds = new Set<string>();
        for (const e of merged) {
          if (!visited.has(e.source_id)) neighborIds.add(e.source_id);
          if (!visited.has(e.target_id)) neighborIds.add(e.target_id);
        }
        // exclude already visited and current frontier
        frontier = Array.from(neighborIds).filter((id: string) => !visited.has(id));
        frontier.forEach((id: string) => visited.add(id));
      }

      // unique edges
      const edgeSeen = new Set<string>();
      const edges = allEdgeRows
        .filter((r: EdgeRow) => (edgeSeen.has(r.id) ? false : (edgeSeen.add(r.id), true)))
        .map(toEdge);

      // neighbor nodes = visited minus root
      const neighborIds = Array.from(visited).filter((id) => id !== nodeId);
      let neighbors: MemoryNode[] = [];
      if (neighborIds.length) {
        const { data: nbRows, error: nbErr } = await client.from<NodeRow>('memory_nodes')['in']('id', neighborIds).select('*');
        if (nbErr) throw nbErr;
        neighbors = (nbRows ?? []).map((r: NodeRow) => toNode(r));
      }

      return { node, edges, neighbors };
    },
  };

  // Basic memory API without embeddings; see createSupabaseMemoryAPI for semantic support
  const memory: MemoryAPI = {
    async add(note) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const title = ((note as any).title ?? (note.content ?? '').slice(0, 40)) || 'Untitled';
      const row: Partial<NodeRow> = {
        capsule_id: note.capsuleId ?? null,
        title,
        content: note.content ?? null,
        tags: note.tags ?? null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
        attachments: (note as any).attachments ?? null,
        created_at: new Date().toISOString(),
      };
      const { data, error } = await client.from<NodeRow>('memory_nodes').insert(row).select('*');
      if (error) throw error;
      if (!data || !data[0]) throw new Error('Insert memory_nodes returned no data');
      const n = toNode(data[0]);
      return { id: n.id, capsuleId: n.capsuleId!, content: n.content ?? '', tags: n.tags, timestamp: String(n.createdAt) };
    },
    async list(capsuleId) {
      const { data, error } = await client.from<NodeRow>('memory_nodes').eq('capsule_id', capsuleId).select('*');
      if (error) throw error;
  return (data ?? []).map((r: NodeRow) => ({ id: r.id, capsuleId: (r.capsule_id ?? '') as string, content: r.content ?? '', tags: r.tags ?? undefined, timestamp: r.created_at }));
    },
    async remove(id) {
      const { error } = await client.from<NodeRow>('memory_nodes').delete().eq('id', id).select('*');
      if (error) throw error;
    },
  };

  return { graph, memory };
}

// Advanced memory with embeddings + semantic search
export function createSupabaseMemoryAPI(
  client: SupabaseClientLike,
  embeddings: EmbeddingsProvider,
) {
  const memory: MemoryAPI = {
    async add(note: Omit<MemoryNote, 'id' | 'timestamp'> & { title?: string; userId?: string; capsuleId?: string; summary?: string }) {
      const title = (note['title'] ?? (note.content ?? '').slice(0, 40)) || 'Untitled';
      const body = [title, note.content ?? '', (note.tags ?? []).join(' '), note['summary'] ?? ''].filter(Boolean).join('\n');
      let vector: number[] | null = null;
      try {
        vector = await embeddings.embed(body);
      } catch {
        // proceed without embedding
      }
      const row: Partial<NodeRow> = {
        capsule_id: note.capsuleId ?? null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user_id: (note as any).userId ?? null,
        title,
        content: note.content ?? null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        summary: (note as any).summary ?? null,
        tags: note.tags ?? null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
        attachments: (note as any).attachments ?? null,
        created_at: new Date().toISOString(),
        embedding: vector ?? null,
      };
      const { data, error } = await client.from<NodeRow>('memory_nodes').insert(row).select('*');
      if (error) throw error;
      if (!data || !data[0]) throw new Error('Insert memory_nodes returned no data');
      const n = toNode(data[0]);
      return { id: n.id, capsuleId: n.capsuleId!, content: n.content ?? '', tags: n.tags, timestamp: String(n.createdAt) };
    },
    async list(capsuleId: string) {
      const { data, error } = await client.from<NodeRow>('memory_nodes').eq('capsule_id', capsuleId).select('*');
      if (error) throw error;
      return (data ?? []).map((r: NodeRow) => ({ id: r.id, capsuleId: (r.capsule_id ?? '') as string, content: r.content ?? '', tags: r.tags ?? undefined, timestamp: r.created_at }));
    },
    async remove(id: string) {
      const { error } = await client.from<NodeRow>('memory_nodes').delete().eq('id', id).select('*');
      if (error) throw error;
    },
    async search(query: string, options?: SearchOptions): Promise<SemanticResult[]> {
      const topK = options?.topK ?? 10;
      const minScore = options?.minScore ?? 0;
      let vector: number[] | null = null;
      try {
        vector = await embeddings.embed(query);
      } catch {
        // embeddings not available; fallback below
      }
      // Try RPC first if available
      if (vector && typeof client.rpc === 'function') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const args: Record<string, any> = {
          query_embedding: vector,
          match_count: topK,
          min_score: minScore,
          metric: options?.metric ?? 'cosine',
        };
        if (options?.userId) args.user_id = options.userId;
        if (options?.capsuleId) args.capsule_id = options.capsuleId;
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data, error } = await client.rpc<any>('memory_nodes_semantic_search', args);
          if (error) throw error;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rows = (data ?? []) as Array<NodeRow & { score: number }>;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return rows.map((r) => ({ node: toNode(r), score: (r as any).score ?? 0 }));
        } catch {
          // fall through to client-side fallback
        }
      }
      // Fallback: naive text search by title/content and tags
      const { data, error } = await client.from<NodeRow>('memory_nodes').select('*');
      if (error) throw error;
      const all = (data ?? []).map((r: NodeRow) => toNode(r));
      const q = query.toLowerCase();
      const filtered = all.filter((n: MemoryNode) =>
        (options?.capsuleId ? n.capsuleId === options.capsuleId : true) &&
        (options?.userId ? n.userId === options.userId : true) &&
        ((n.title?.toLowerCase().includes(q)) || (n.content?.toLowerCase().includes(q)) || (n.tags ?? []).some((t: string) => t.toLowerCase().includes(q)))
      );
      return filtered.slice(0, topK).map((n: MemoryNode) => ({ node: n, score: 0.5 }));
    },
  };

  return memory;
}
