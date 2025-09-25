# @oursynth/wizard-capsule

Supabase-backed memory/graph primitives for the Wizard Capsule.

## Setup (Supabase + pgvector)

1. Enable pgvector

```sql
create extension if not exists vector;
```

1. Table schema (simplified)

```sql
create table if not exists memory_nodes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  capsule_id text null,
  title text not null,
  content text null,
  summary text null,
  tags text[] null,
  attachments jsonb null,
  created_at timestamptz not null default now(),
  embedding vector(1536) null
);

create table if not exists memory_edges (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references memory_nodes(id) on delete cascade,
  target_id uuid not null references memory_nodes(id) on delete cascade,
  reason text null,
  score float8 null,
  type text null,
  weight float8 null
);
```

1. Indexes

```sql
create index if not exists idx_memory_nodes_capsule on memory_nodes(capsule_id);
create index if not exists idx_memory_nodes_user on memory_nodes(user_id);
create index if not exists idx_memory_nodes_created on memory_nodes(created_at desc);
create index if not exists idx_memory_nodes_tags on memory_nodes using gin(tags);
create index if not exists idx_memory_nodes_embedding on memory_nodes using ivfflat (embedding vector_cosine_ops);
```

1. Optional RPC for semantic search

```sql
create or replace function memory_nodes_semantic_search(
  query_embedding vector,
  match_count int default 10,
  min_score float8 default 0,
  capsule_id text default null,
  user_id uuid default null,
  metric text default 'cosine'
)
returns table(id uuid, title text, content text, summary text, tags text[], attachments jsonb, created_at timestamptz, capsule_id text, user_id uuid, embedding vector, score float8)
language plpgsql as $$
begin
  if metric = 'cosine' then
    return query
    select m.id, m.title, m.content, m.summary, m.tags, m.attachments, m.created_at, m.capsule_id, m.user_id, m.embedding,
           1 - (m.embedding <=> query_embedding) as score
    from memory_nodes m
    where (capsule_id is null or m.capsule_id = capsule_id)
      and (user_id is null or m.user_id = user_id)
    order by m.embedding <=> query_embedding
    limit match_count;
  else
    return query
    select m.id, m.title, m.content, m.summary, m.tags, m.attachments, m.created_at, m.capsule_id, m.user_id, m.embedding,
           1 - (m.embedding <=> query_embedding) as score
    from memory_nodes m
    where (capsule_id is null or m.capsule_id = capsule_id)
      and (user_id is null or m.user_id = user_id)
    order by m.embedding <=> query_embedding
    limit match_count;
  end if;
end;
$$;
```

## Usage

- Basic graph API:

```ts
import { createSupabaseGraphAPI } from '@oursynth/wizard-capsule';
```

- Memory API with embeddings:

```ts
import { createSupabaseMemoryAPI, OpenAIEmbeddingsProvider } from '@oursynth/wizard-capsule';
// const supabase = createClient(url, key)
// const openai = new OpenAI({ apiKey })
const embeddings = new OpenAIEmbeddingsProvider(openai);
const memory = createSupabaseMemoryAPI(supabase, embeddings);
```

- Search:

```ts
const results = await memory.search?.('orchestrate ambient vibe', { capsuleId, topK: 8 });
```

### Switching backends

- Local dev: use the in-memory API exported as `memory` from `src/memory`.
- Staging/Prod: construct via `createSupabaseMemoryAPI(supabase, embeddings)`.
- Inject the chosen API into UI components (e.g., `WizardCapsulePanel`) via props.
