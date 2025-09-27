"use client";
import React, { useState } from 'react';
import { useAgentSession } from '@/state/agent/agentSessionStore';
import type { ChatMessage } from '@/state/agent/agentSessionStore';
import { HaloButton } from '@/components/system/HaloButton';
import { ScrollArea } from '@/packages/halo-ui/primitives/scroll-area';

export const AgentChatPanel: React.FC = () => {
  const { messages, send, status } = useAgentSession();
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const toSend = input;
    setInput('');
    await send(toSend);
  };

  return (
    <div className="agent-chat-panel space-y-3" aria-label="Agent Chat Panel">
      <div className="chat-log border border-neon p-3 rounded-md bg-black/40" role="log" aria-live="polite">
        <ScrollArea height={260}>
          {messages.length === 0 && (
            <p className="text-xs opacity-60">No messages yet. Start the conversation.</p>
          )}
          <ul className="space-y-2 text-sm">
            {messages.map((m: ChatMessage) => (
              <li key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={m.role === 'user' ? 'text-neon-secondary' : 'text-neon'}>
                  <b>{m.role === 'user' ? 'You' : 'Agent'}:</b> {m.content}
                </span>
              </li>
            ))}
            {status === 'thinking' && <li className="italic text-xs opacity-70">Agent thinking…</li>}
          </ul>
        </ScrollArea>
      </div>
      <form className="flex gap-2" onSubmit={e => { e.preventDefault(); handleSend(); }} aria-label="Send message">
        <input
          className="flex-1 bg-black/60 border border-neon-secondary rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-neon"
          value={input}
          placeholder="Type your message…"
          onChange={e => setInput(e.target.value)}
          disabled={status === 'thinking'}
        />
        <HaloButton size="sm" variant="primary" type="submit" disabled={status === 'thinking' || !input.trim()}>
          {status === 'thinking' ? '...' : 'Send'}
        </HaloButton>
      </form>
    </div>
  );
};
