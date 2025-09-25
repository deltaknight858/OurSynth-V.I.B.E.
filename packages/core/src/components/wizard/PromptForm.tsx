'use client';

import { useState } from 'react';
import WizardStream from './WizardStream.js';

type Props = {
  defaultProductSlug?: string;
  defaultType?: 'component' | 'page' | 'feature' | 'app';
};

export function PromptForm({ defaultProductSlug = '', defaultType = 'component' }: Props) {
  const [name, setName] = useState(defaultProductSlug);
  const [goal, setGoal] = useState('');
  const [type, setType] = useState<Props['defaultType']>(defaultType);
  const [runId, setRunId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const r = await fetch('/api/pathways/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: name,
          version: 'latest',
          wizardConfig: { targetApp: 'web', goal, type }
        })
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json.error || 'Failed');
      setRunId(json.runId);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-cyan-400/30 bg-[rgba(20,20,30,0.85)] p-4 text-white backdrop-blur-xl">
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label htmlFor="pf-name" className="block text-sm text-cyan-200 mb-1">Template or slug</label>
          <input
            id="pf-name"
            className="w-full rounded-lg bg-black/30 border border-cyan-400/30 px-3 py-2 outline-none focus:border-cyan-300"
            value={name} onChange={(e)=>setName(e.target.value)} placeholder="login-page" required
          />
        </div>
        <div>
          <label htmlFor="pf-goal" className="block text-sm text-cyan-200 mb-1">Goal / description</label>
          <textarea
            id="pf-goal"
            className="w-full rounded-lg bg-black/30 border border-cyan-400/30 px-3 py-2 outline-none focus:border-cyan-300"
            value={goal} onChange={(e)=>setGoal(e.target.value)} rows={3} placeholder="Add a responsive login page with OAuth"
          />
        </div>
        <div>
          <label htmlFor="pf-type" className="block text-sm text-cyan-200 mb-1">Type</label>
          <select
            id="pf-type"
            className="w-full rounded-lg bg-black/30 border border-cyan-400/30 px-3 py-2 outline-none focus:border-cyan-300"
            value={type} onChange={(e)=>setType(e.target.value as Props['defaultType'])}
          >
            <option value="component">Component</option>
            <option value="page">Page</option>
            <option value="feature">Feature</option>
            <option value="app">App</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2 rounded-lg bg-cyan-400 text-black font-semibold hover:brightness-110 transition disabled:opacity-60"
        >
          {busy ? 'Starting…' : 'Start generation'}
        </button>
        {err && <p className="text-red-300 text-sm">{err}</p>}
      </form>

      {runId && (
        <div className="mt-4">
          <WizardStream runId={runId} />
        </div>
      )}
    </div>
  );
}