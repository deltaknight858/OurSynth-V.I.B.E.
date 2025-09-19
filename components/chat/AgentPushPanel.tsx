"use client";
import React, { useState } from 'react';
import { HaloButton } from '@/components/system/HaloButton';

export const AgentPushPanel: React.FC = () => {
  const [action, setAction] = useState('');
  const [params, setParams] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePush = async () => {
    setLoading(true); setResult('');
    try {
      const parsed = params ? JSON.parse(params) : {};
      // Mocked push (replace with API route later)
      await new Promise(r => setTimeout(r, 500));
      setResult('Pushed action ' + action + ' with ' + Object.keys(parsed).length + ' param(s).');
    } catch (e: any) {
      setResult('Error: ' + e.message);
    } finally { setLoading(false);}  
  };

  return (
    <div className="agent-push-panel border border-neon rounded-md p-3 bg-black/40 space-y-3" aria-label="Agent Push Panel">
      <h3 className="text-sm font-semibold text-neon">Push Action</h3>
      <div className="space-y-2">
        <input
          className="w-full bg-black/60 border border-neon-secondary rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-neon"
          placeholder="Action name"
          value={action}
          onChange={e => setAction(e.target.value)}
          disabled={loading}
        />
        <textarea
          className="w-full bg-black/60 border border-neon-secondary rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-neon min-h-[60px]"
          placeholder="Params (JSON)"
          value={params}
          onChange={e => setParams(e.target.value)}
          disabled={loading}
        />
        <HaloButton size="sm" onClick={handlePush} disabled={!action.trim() || loading}>
          {loading ? 'Pushing…' : 'Push'}
        </HaloButton>
        {result && <p className="text-xs text-neon-secondary whitespace-pre-wrap">{result}</p>}
      </div>
    </div>
  );
};
