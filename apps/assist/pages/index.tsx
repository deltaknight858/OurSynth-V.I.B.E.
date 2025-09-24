import React from 'react';
import { HaloButton, useAgentSession } from '@oursynth/core';

export default function AssistHome() {
  const { messages, send, status } = useAgentSession();
  const [input, setInput] = React.useState('');
  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Assist</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Say something"
          style={{ flex: 1, padding: 8 }}
        />
        <HaloButton onClick={() => { if (input) { send(input); setInput(''); } }} loading={status==='thinking'}>
          Send
        </HaloButton>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {messages.map(m => (
          <li key={m.id} style={{ background: '#111', padding: 8, borderRadius: 4 }}>
            <strong>{m.role}:</strong> {m.content}
          </li>
        ))}
      </ul>
    </main>
  );
}
