import { create } from 'zustand';

export interface ChatMessage { id: string; role: 'user' | 'assistant' | 'system'; content: string; createdAt: number; }
export interface AgentSessionState {
  messages: ChatMessage[];
  status: 'idle' | 'thinking';
  send: (content: string) => Promise<void>;
  mockExecute: (input: ChatMessage[]) => Promise<ChatMessage>;
}

export const useAgentSession = create<AgentSessionState>((set, get) => ({
  messages: [],
  status: 'idle',
  mockExecute: async (history) => {
    await new Promise(r => setTimeout(r, 650));
    const last = history[history.length - 1];
    return { id: crypto.randomUUID(), role: 'assistant', content: `Echo: ${last.content}` , createdAt: Date.now() };
  },
  send: async (content: string) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content, createdAt: Date.now() };
    set(s => ({ messages: [...s.messages, userMsg], status: 'thinking' }));
    const reply = await get().mockExecute([...get().messages, userMsg]);
    set(s => ({ messages: [...s.messages, reply], status: 'idle' }));
  }
}));
