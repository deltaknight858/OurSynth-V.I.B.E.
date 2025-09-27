// PROMOTED from import-staging/src/features/oai/CommandCenter.tsx on 2025-09-08T20:34:32.048Z
// TODO: Review for token + design lint compliance.
import React, { useEffect, useState } from 'react';
import styles from './CommandCenter.module.css';

import AgentChat from './AgentChat';
import AgentPushPanel from './AgentPushPanel';
const SharedCard: React.FC<{ title?: string; children?: React.ReactNode }> = ({ title, children }) => (
  <section className={styles.card}>
    {title && <h3 className={styles['card-title']}>{title}</h3>}
    <div>{children}</div>
  </section>
);

// Types for actions and invocations
interface Action {
  id: string;
  label: string;
  run: string;
  group?: string;
}

// Simplified demo omits invocation history for now

export default function CommandCenter() {
  const [actions, setActions] = useState<Action[]>([]);
  // const [invocations, setInvocations] = useState<Invocation[]>([]);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [commandInput, setCommandInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/actions/list')
      .then(res => res.json())
      .then(setActions);
  }, []);

  const handleRun = async (action: Action) => {
    setLoading(true);
    setSelectedAction(action);
    setCommandInput(action.run);
    setOutput('');
    try {
      const res = await fetch('/api/actions/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: action.run }),
      });
      const data = await res.json();
      setOutput(data.output || data.error || '');
  // (history omitted in demo)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setOutput(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AgentChat />
      <AgentPushPanel />
      <div className={styles.grid}>
        <SharedCard title="Available Actions">
          <ul className={styles.list}>
            {actions.map(action => (
              <li key={action.id} className={styles['list-item']}>
                <button className={selectedAction?.id === action.id ? `${styles.btn} ${styles['btn-primary']}` : `${styles.btn} ${styles['btn-outline']}`} onClick={() => handleRun(action)}>
                  {action.label}
                </button>
              </li>
            ))}
          </ul>
        </SharedCard>
        <SharedCard title="Action Runner & Output">
          <div className={styles.stack}>
            <label className={styles.label} htmlFor="cmd">Command</label>
            <textarea id="cmd" title="Command" className={styles.input} value={commandInput} onChange={e => setCommandInput(e.target.value)} readOnly rows={3} />
            <button className={`${styles.btn} ${styles['btn-primary']}`} disabled={!selectedAction || loading} onClick={() => handleRun(selectedAction!)}>
              {loading ? 'Running...' : 'Run Action'}
            </button>
            <div className={styles.output}>
              <div className={styles['output-title']}>Output:</div>
              <pre className={styles['output-content']}>{output || 'No output yet.'}</pre>
            </div>
          </div>
        </SharedCard>
      </div>
    </>
  );
}
