'use client';
import { useOAIEvents } from '../lib/useOAIEvents.js';
import { useMemo, useState } from 'react';
import type { OAIEvent } from '../lib/useOAIEvents.js';
type CapsuleData = { name?: string; appDir?: string; manifestPath?: string };
function isCapsuleData(x: unknown): x is CapsuleData {
  return !!x && typeof x === 'object';
}

export function TimeMachine() {
  const events = useOAIEvents();
  const [selected, setSelected] = useState<string | null>(null);

  const timeline = useMemo(() =>
    events.filter((e: OAIEvent) => /(run|edit|capsule)\./.test(e.type))
          .sort((a: OAIEvent, b: OAIEvent)=>a.ts-b.ts), [events]);

  async function promoteToDeploy(evtId: string) {
    const snap = timeline.find((e: OAIEvent) => e.id === evtId);
    if (!snap) return;
  const data = isCapsuleData(snap.data) ? snap.data : {};
  const out = `/tmp/${(data.name ?? 'app')}.${evtId}.caps`;
    await fetch('http://localhost:4311/oai/act', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ action: 'capsule.pack', params: {
  appDir: data.appDir ?? (process.env.NEXT_PUBLIC_APP_DIR ?? '.'),
  manifestPath: data.manifestPath ?? './capsule.json',
        outPath: out
      } })
    });
    await fetch('http://localhost:4311/oai/act', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ action: 'capsule.deploy', params: { filePath: out, env: 'staging' } })
    });
  }

  return (
    <div className="p-4 rounded-xl bg-[rgba(10,12,20,0.7)] backdrop-blur-lg border border-cyan-400/30">
      <h3 className="text-cyan-300 font-semibold mb-3">Time Machine</h3>
      <div className="flex gap-2 overflow-x-auto py-2">
        {timeline.map(e => (
          <button key={e.id} onClick={()=>setSelected(e.id)}
            className={`px-3 py-2 rounded-lg border ${selected===e.id ? 'border-cyan-400 text-cyan-200' : 'border-cyan-400/20 text-gray-300'}`}>
            <span className="text-xs">{new Date(e.ts).toLocaleTimeString()}</span>
            <div className="text-sm">{e.source} • {e.type.replace(/^.*\./,'')}</div>
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={()=>selected && promoteToDeploy(selected)}
          disabled={!selected}
          className="px-4 py-2 rounded-lg bg-cyan-400 text-black font-semibold shadow-[0_0_12px_#22d3ee]"
        >
          Promote selected → Deploy
        </button>
      </div>
    </div>
  );
}