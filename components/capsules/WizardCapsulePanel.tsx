"use client";
import React, { useEffect, useMemo, useState } from 'react';
import type { MemoryAPI, SemanticResult } from '@/packages/wizard-capsule/src/types' with { "resolution-mode": "import" };
const inMemoryPromise = import('@/packages/wizard-capsule/src/memory').then(mod => mod.memory);
import type { MemoryAPI, SemanticResult } from '@/packages/wizard-capsule/src/types';
import { memory as inMemory } from '@/packages/wizard-capsule/src/memory';
import '../ui/ui.css';

type Props = { capsuleId: string; title?: string; memoryApi?: MemoryAPI; onViewMindmap?: (nodeId: string) => void };

export default function WizardCapsulePanel({ capsuleId, title = 'Wizard Capsule', memoryApi, onViewMindmap }: Props) {
  const api = useMemo(() => memoryApi ?? inMemory, [memoryApi]);
  const [notes, setNotes] = useState<Array<{ id: string; content: string; tags?: string[]; timestamp: string }>>([]);
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SemanticResult[] | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    api.list(capsuleId).then(setNotes);
  }, [capsuleId, api]);

  async function addNote() {
    if (!draft.trim()) return;
    const created = await api.add({ capsuleId, content: draft.trim() });
    setNotes(prev => [...prev, created]);
    setDraft('');
  }

  async function removeNote(id: string) {
    await api.remove(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  }

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!api.search || !query.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const r = await api.search(query.trim(), { capsuleId, topK: 10 });
      setResults(r);
    } finally {
      setSearching(false);
    }
  }

  return (
    <section className="sharedCard">
      <h2 className="sharedCardTitle">{title}</h2>

      <div className="mb-3">
        <label className="fieldLabel" htmlFor="mem">Memory note</label>
        <textarea id="mem" className="input" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Write a memory note…" />
      </div>
      <div className="flex items-center gap-2">
        <button className="btn btn--primary" onClick={addNote}>Add Note</button>
      </div>

      <ul className="mt-4">
        {notes.map(n => (
          <li key={n.id} className="mb-2 flex items-center justify-between">
            <span>{n.content}</span>
            <button className="btn btn--outline btn--sm" onClick={() => removeNote(n.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <hr className="my-4" />
      <form onSubmit={runSearch} className="mb-3">
        <label className="fieldLabel" htmlFor="search">Semantic search</label>
        <div className="flex items-center gap-2">
          <input id="search" className="input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search memories…" />
          <button type="submit" className="btn btn--secondary" disabled={searching}>{searching ? 'Searching…' : 'Search'}</button>
        </div>
      </form>
      {results && (
        <div>
          <h3 className="text-sm opacity-80 mb-2">Results</h3>
          {results.length === 0 && <div className="text-sm opacity-70">No results</div>}
          <ul>
            {results.map(r => (
              <li key={r.node.id} className="mb-2">
                <div className="font-medium">{r.node.title ?? r.node.content ?? 'Untitled'}</div>
                {r.node.summary && <div className="text-sm opacity-80">{r.node.summary}</div>}
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-60">score: {r.score.toFixed(3)}</span>
                  <button
                    className="btn btn--sm btn--outline"
                    onClick={() => onViewMindmap ? onViewMindmap(r.node.id) : console.log('TODO: open mindmap at', r.node.id)}
                  >
                    View in Mindmap
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
