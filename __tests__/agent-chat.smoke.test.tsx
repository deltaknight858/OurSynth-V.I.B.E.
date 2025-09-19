import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AgentChatPanel } from '@/components/chat/AgentChatPanel';
import { useAgentSession } from '@/state/agent/agentSessionStore';

// Simple mock for crypto.randomUUID in test env
if (!(global as any).crypto) {
  (global as any).crypto = { randomUUID: () => Math.random().toString(36).slice(2) } as any;
}

describe('AgentChatPanel smoke', () => {
  it('sends and receives a synthetic reply', async () => {
    render(<AgentChatPanel />);
    const input = screen.getByPlaceholderText(/Type your message/i);
    fireEvent.change(input, { target: { value: 'Hello agent' } });
    await act(async () => {
      fireEvent.submit(input.closest('form')!);
      // allow mockExecute delay (~650ms)
      await new Promise(r => setTimeout(r, 800));
    });
    const reply = screen.getByText(/Echo: Hello agent/);
    expect(reply).toBeInTheDocument();
    const store = useAgentSession.getState();
    expect(store.messages.length).toBeGreaterThanOrEqual(2);
  });
});
