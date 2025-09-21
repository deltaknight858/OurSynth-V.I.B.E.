"use client";
import React, { useEffect, useMemo, useState } from 'react';
import WizardCapsulePanel from '@/components/capsules/WizardCapsulePanel';
import { MindmapViewForceZoom } from '@/packages/wizard-capsule/src/components/MindmapViewForceZoom';
import { inMemoryBackend, supabaseBackend, makeLoadContext } from '../../memoryBackends';

export default function MemoryTestPage() {
  const [useSupabase, setUseSupabase] = useState<boolean>(
    typeof window === 'undefined'
      ? (process.env.NEXT_PUBLIC_USE_SUPABASE === 'true')
      : (localStorage.getItem('NEXT_PUBLIC_USE_SUPABASE') ?? process.env.NEXT_PUBLIC_USE_SUPABASE) === 'true'
  );

  useEffect(() => {
    // Sync from localStorage on mount (client-only)
    if (typeof window !== 'undefined') {
      const ls = localStorage.getItem('NEXT_PUBLIC_USE_SUPABASE');
      if (ls != null) setUseSupabase(ls === 'true');
    }
  }, []);

  const memoryApi = useMemo(() => (useSupabase ? supabaseBackend() : inMemoryBackend), [useSupabase]);

  const toggleBackend = () => {
    const next = !useSupabase;
    setUseSupabase(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('NEXT_PUBLIC_USE_SUPABASE', String(next));
      window.location.reload();
    }
  };

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  return (
    <div className="p-5">
      <h1>Memory API Test</h1>
      <p>Backend: <strong>{useSupabase ? 'Supabase + pgvector' : 'In-memory'}</strong></p>
      <button className="btn btn--secondary" onClick={toggleBackend}>
        Switch to {useSupabase ? 'In-Memory' : 'Supabase'} Backend
      </button>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <WizardCapsulePanel
            capsuleId="test-capsule"
            memoryApi={memoryApi}
            onViewMindmap={(id: string) => setSelectedNodeId(id)}
          />
        </div>
        <div>
          {selectedNodeId && (
            <MindmapViewForceZoom
              loadContext={makeLoadContext(useSupabase)}
              rootNodeId={selectedNodeId}
              depth={2}
              width={800}
              height={600}
            />
          )}
        </div>
      </div>
    </div>
  );
}
