"use client";
import React from 'react';
import { AgentChatPanel } from '@/components/chat/AgentChatPanel';
import { AgentPushPanel } from '@/components/chat/AgentPushPanel';
import { ScrollArea } from '@/packages/halo-ui/primitives/scroll-area';
import { HaloButton } from '@/components/system/HaloButton';

interface Action { id: string; label: string; group?: string; run: string; }
interface Invocation { id: string; actionId: string; status: string; output?: string; }

export const CommandCenterShell: React.FC = () => {
  const [actions, setActions] = React.useState<Action[]>([]);
  const [invocations, setInvocations] = React.useState<Invocation[]>([]);
  const [selected, setSelected] = React.useState<Action | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [output, setOutput] = React.useState('');

  React.useEffect(() => {
    // Placeholder load; replace with real API call later
    setActions([
      { id: 'analyze', label: 'Analyze Code', run: 'agent analyze --path src/', group: 'quality' },
      { id: 'refactor', label: 'Refactor Module', run: 'agent refactor --target components/', group: 'quality' },
      { id: 'testgen', label: 'Generate Tests', run: 'agent testgen --scope unit', group: 'quality' }
    ]);
  }, []);

  const runAction = async (a: Action) => {
    setSelected(a); setLoading(true); setOutput('');
    try {
      await new Promise(r => setTimeout(r, 700));
      const synthetic = `Ran: ${a.run}\nResult: success`;
      setOutput(synthetic);
      setInvocations(list => [
        { id: crypto.randomUUID(), actionId: a.id, status: 'completed', output: synthetic },
        ...list
      ]);
    } finally { setLoading(false);}  
  };

  return (
    <div className="command-center-shell grid gap-6 md:grid-cols-5" aria-label="Command Center">
      <div className="md:col-span-2 space-y-4">
        <AgentChatPanel />
        <AgentPushPanel />
        <div className="actions-panel border border-neon rounded-md p-3 bg-black/40" aria-label="Actions">
          <h3 className="text-sm font-semibold text-neon mb-2">Available Actions</h3>
          <ScrollArea height={180}>
            <ul className="space-y-2 text-sm">
              {actions.map(a => (
                <li key={a.id}>
                  <HaloButton
                    variant={selected?.id === a.id ? 'secondary' : 'ghost'}
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => runAction(a)}
                    disabled={loading}
                  >
                    <span>{a.label}</span>
                    <span className="opacity-60 text-xs">{a.group}</span>
                  </HaloButton>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </div>
      <div className="md:col-span-3 space-y-4">
        <div className="runner-panel border border-neon rounded-md p-4 bg-black/40" aria-label="Action Runner Output">
          <h3 className="text-sm font-semibold text-neon mb-2">Action Runner & Output</h3>
          <div className="mb-2 text-xs opacity-70 font-mono break-all whitespace-pre-wrap min-h-[120px] p-2 rounded bg-black/60 border border-neon-secondary">
            {output || 'No output yet.'}
          </div>
          <HaloButton
            onClick={() => selected && runAction(selected)}
            disabled={!selected || loading}
            variant="primary"
            size="sm"
          >
            {loading ? 'Running…' : selected ? 'Run Action' : 'Select Action'}
          </HaloButton>
        </div>
        <div className="history-panel border border-neon rounded-md p-4 bg-black/40" aria-label="Invocation History">
          <h3 className="text-sm font-semibold text-neon mb-2">Invocation History</h3>
          <ScrollArea height={200}>
            <ul className="space-y-2 text-xs font-mono">
              {invocations.length === 0 && <li className="opacity-60">No invocations yet.</li>}
              {invocations.map(inv => (
                <li key={inv.id} className="border border-neon-secondary rounded p-2 bg-black/60">
                  <div className="flex justify-between mb-1">
                    <span>{actions.find(a => a.id === inv.actionId)?.label || inv.actionId}</span>
                    <span className={inv.status === 'completed' ? 'text-neon-secondary' : 'text-neon-error'}>{inv.status}</span>
                  </div>
                  <pre className="text-[10px] whitespace-pre-wrap break-all opacity-80">{inv.output}</pre>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
