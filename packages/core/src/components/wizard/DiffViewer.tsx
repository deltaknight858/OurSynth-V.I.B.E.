'use client';

import { useEffect, useState } from 'react';

type FileDiff = { path: string; status: 'add'|'modify'|'conflict'; };
type DiffResponse = { files: FileDiff[]; diff: string };

type Props = { runId: string };

export default function DiffViewer({ runId }: Props) {
  const [data, setData] = useState<DiffResponse | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/pathways/diff?runId=${encodeURIComponent(runId)}`);
        const json = await r.json();
        if (!r.ok) throw new Error(json.error || 'Failed to fetch diff');
        setData(json);
      } catch (e: any) { setErr(e.message); }
    })();
  }, [runId]);

  useEffect(() => {
    if (data && data.files.length && !active) setActive(data.files[0].path);
  }, [data, active]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-2xl border border-cyan-400/30 bg-[rgba(20,20,30,0.85)] p-3 backdrop-blur-xl text-white">
        <h4 className="text-cyan-300 font-semibold mb-2">Files</h4>
        <ul className="space-y-1 max-h-80 overflow-auto text-sm">
          {data?.files.map(f => (
            <li key={f.path}>
              <button
                onClick={()=>setActive(f.path)}
                className={`w-full text-left px-2 py-1 rounded ${
                  active===f.path ? 'bg-cyan-400/20 border border-cyan-400/40' : 'hover:bg-white/5'
                }`}
              >
                <span className="text-gray-300">{f.path}</span>
                <span className={`ml-2 text-xs ${
                  f.status === 'add' ? 'text-emerald-300' :
                  f.status === 'modify' ? 'text-cyan-300' : 'text-amber-300'
                }`}>[{f.status}]</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="md:col-span-2 rounded-2xl border border-cyan-400/30 bg-[rgba(10,12,20,0.85)] p-3 backdrop-blur-xl text-white">
        <h4 className="text-cyan-300 font-semibold mb-2">Diff</h4>
        {err && <p className="text-red-300 text-sm">{err}</p>}
        <pre className="text-xs leading-5 max-h-[32rem] overflow-auto whitespace-pre-wrap">
{data?.diff}
        </pre>
      </div>
    </div>
  );
}