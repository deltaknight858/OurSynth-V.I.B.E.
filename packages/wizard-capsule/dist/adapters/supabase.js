// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toNode(row) {
    return {
        id: row.id,
        capsuleId: row.capsule_id ?? undefined,
        userId: row.user_id ?? undefined,
        title: row.title,
        content: row.content ?? undefined,
        summary: row.summary ?? undefined,
        tags: row.tags ?? undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        attachments: row.attachments ?? undefined,
        createdAt: row.created_at,
        embedding: row.embedding ?? undefined,
    };
}
function toEdge(row) {
    return {
        id: row.id,
        sourceId: row.source_id,
        targetId: row.target_id,
        reason: row.reason ?? undefined,
        score: row.score ?? undefined,
    };
}
export function createSupabaseGraphAPI(client) {
    const graph = {
        async createNode(input) {
            const created_at = (input.createdAt instanceof Date ? input.createdAt.toISOString() : input.createdAt);
            const row = {
                capsule_id: input.capsuleId ?? null,
                user_id: input.userId ?? null,
                title: input.title,
                content: input.content ?? null,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                summary: input.summary ?? null,
                tags: input.tags ?? null,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                attachments: input.attachments ?? null,
                created_at,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                embedding: input.embedding ?? null,
            };
            const { data, error } = await client.from('memory_nodes').insert(row).select('*');
            if (error)
                throw error;
            if (!data || !data[0])
                throw new Error('Insert memory_nodes returned no data');
            return toNode(data[0]);
        },
        async createEdge(input) {
            const row = {
                source_id: input.sourceId,
                target_id: input.targetId,
                reason: input.reason ?? null,
                score: input.score ?? null,
            };
            const { data, error } = await client.from('memory_edges').insert(row).select('*');
            if (error)
                throw error;
            if (!data || !data[0])
                throw new Error('Insert memory_edges returned no data');
            return toEdge(data[0]);
        },
        async getGraphContext(nodeId, depth = 2) {
            // BFS up to depth collecting edges and neighbor nodes
            const { data: nodeRows, error: nodeErr } = await client.from('memory_nodes').eq('id', nodeId).select('*');
            if (nodeErr)
                throw nodeErr;
            if (!nodeRows || !nodeRows[0])
                throw new Error('Node not found');
            const node = toNode(nodeRows[0]);
            const visited = new Set([nodeId]);
            let frontier = [nodeId];
            const allEdgeRows = [];
            for (let d = 0; d < Math.max(1, depth); d++) {
                if (frontier.length === 0)
                    break;
                // edges where source in frontier OR target in frontier (two queries)
                const [srcRes, tgtRes] = await Promise.all([
                    client.from('memory_edges')['in']('source_id', frontier).select('*'),
                    client.from('memory_edges')['in']('target_id', frontier).select('*'),
                ]);
                if (srcRes.error)
                    throw srcRes.error;
                if (tgtRes.error)
                    throw tgtRes.error;
                const merged = [...(srcRes.data ?? []), ...(tgtRes.data ?? [])];
                allEdgeRows.push(...merged);
                // compute next frontier
                const neighborIds = new Set();
                for (const e of merged) {
                    if (!visited.has(e.source_id))
                        neighborIds.add(e.source_id);
                    if (!visited.has(e.target_id))
                        neighborIds.add(e.target_id);
                }
                // exclude already visited and current frontier
                frontier = Array.from(neighborIds).filter((id) => !visited.has(id));
                frontier.forEach((id) => visited.add(id));
            }
            // unique edges
            const edgeSeen = new Set();
            const edges = allEdgeRows
                .filter((r) => (edgeSeen.has(r.id) ? false : (edgeSeen.add(r.id), true)))
                .map(toEdge);
            // neighbor nodes = visited minus root
            const neighborIds = Array.from(visited).filter((id) => id !== nodeId);
            let neighbors = [];
            if (neighborIds.length) {
                const { data: nbRows, error: nbErr } = await client.from('memory_nodes')['in']('id', neighborIds).select('*');
                if (nbErr)
                    throw nbErr;
                neighbors = (nbRows ?? []).map((r) => toNode(r));
            }
            return { node, edges, neighbors };
        },
    };
    // Basic memory API without embeddings; see createSupabaseMemoryAPI for semantic support
    const memory = {
        async add(note) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const title = (note.title ?? (note.content ?? '').slice(0, 40)) || 'Untitled';
            const row = {
                capsule_id: note.capsuleId ?? null,
                title,
                content: note.content ?? null,
                tags: note.tags ?? null,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                attachments: note.attachments ?? null,
                created_at: new Date().toISOString(),
            };
            const { data, error } = await client.from('memory_nodes').insert(row).select('*');
            if (error)
                throw error;
            if (!data || !data[0])
                throw new Error('Insert memory_nodes returned no data');
            const n = toNode(data[0]);
            return { id: n.id, capsuleId: n.capsuleId, content: n.content ?? '', tags: n.tags, timestamp: String(n.createdAt) };
        },
        async list(capsuleId) {
            const { data, error } = await client.from('memory_nodes').eq('capsule_id', capsuleId).select('*');
            if (error)
                throw error;
            return (data ?? []).map((r) => ({ id: r.id, capsuleId: (r.capsule_id ?? ''), content: r.content ?? '', tags: r.tags ?? undefined, timestamp: r.created_at }));
        },
        async remove(id) {
            const { error } = await client.from('memory_nodes').delete().eq('id', id).select('*');
            if (error)
                throw error;
        },
    };
    return { graph, memory };
}
// Advanced memory with embeddings + semantic search
export function createSupabaseMemoryAPI(client, embeddings) {
    const memory = {
        async add(note) {
            const title = (note['title'] ?? (note.content ?? '').slice(0, 40)) || 'Untitled';
            const body = [title, note.content ?? '', (note.tags ?? []).join(' '), note['summary'] ?? ''].filter(Boolean).join('\n');
            let vector = null;
            try {
                vector = await embeddings.embed(body);
            }
            catch {
                // proceed without embedding
            }
            const row = {
                capsule_id: note.capsuleId ?? null,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                user_id: note.userId ?? null,
                title,
                content: note.content ?? null,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                summary: note.summary ?? null,
                tags: note.tags ?? null,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                attachments: note.attachments ?? null,
                created_at: new Date().toISOString(),
                embedding: vector ?? null,
            };
            const { data, error } = await client.from('memory_nodes').insert(row).select('*');
            if (error)
                throw error;
            if (!data || !data[0])
                throw new Error('Insert memory_nodes returned no data');
            const n = toNode(data[0]);
            return { id: n.id, capsuleId: n.capsuleId, content: n.content ?? '', tags: n.tags, timestamp: String(n.createdAt) };
        },
        async list(capsuleId) {
            const { data, error } = await client.from('memory_nodes').eq('capsule_id', capsuleId).select('*');
            if (error)
                throw error;
            return (data ?? []).map((r) => ({ id: r.id, capsuleId: (r.capsule_id ?? ''), content: r.content ?? '', tags: r.tags ?? undefined, timestamp: r.created_at }));
        },
        async remove(id) {
            const { error } = await client.from('memory_nodes').delete().eq('id', id).select('*');
            if (error)
                throw error;
        },
        async search(query, options) {
            const topK = options?.topK ?? 10;
            const minScore = options?.minScore ?? 0;
            let vector = null;
            try {
                vector = await embeddings.embed(query);
            }
            catch {
                // embeddings not available; fallback below
            }
            // Try RPC first if available
            if (vector && typeof client.rpc === 'function') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const args = {
                    query_embedding: vector,
                    match_count: topK,
                    min_score: minScore,
                    metric: options?.metric ?? 'cosine',
                };
                if (options?.userId)
                    args.user_id = options.userId;
                if (options?.capsuleId)
                    args.capsule_id = options.capsuleId;
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const { data, error } = await client.rpc('memory_nodes_semantic_search', args);
                    if (error)
                        throw error;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const rows = (data ?? []);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return rows.map((r) => ({ node: toNode(r), score: r.score ?? 0 }));
                }
                catch {
                    // fall through to client-side fallback
                }
            }
            // Fallback: naive text search by title/content and tags
            const { data, error } = await client.from('memory_nodes').select('*');
            if (error)
                throw error;
            const all = (data ?? []).map((r) => toNode(r));
            const q = query.toLowerCase();
            const filtered = all.filter((n) => (options?.capsuleId ? n.capsuleId === options.capsuleId : true) &&
                (options?.userId ? n.userId === options.userId : true) &&
                ((n.title?.toLowerCase().includes(q)) || (n.content?.toLowerCase().includes(q)) || (n.tags ?? []).some((t) => t.toLowerCase().includes(q))));
            return filtered.slice(0, topK).map((n) => ({ node: n, score: 0.5 }));
        },
    };
    return memory;
}
