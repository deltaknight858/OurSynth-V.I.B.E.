import { ChatMessage } from "@/types/chat";
import { processMessage } from "./ai";

// Simple in-memory chat store to replace Firebase for now.
const sessions: Record<string, { userId: string; messages: ChatMessage[]; startedAt: number; lastMessageAt: number }> = {};
const listeners: Record<string, Set<(messages: ChatMessage[]) => void>> = {};

function notify(sessionId: string) {
  const msgs = sessions[sessionId]?.messages ?? [];
  listeners[sessionId]?.forEach((cb) => cb([...msgs]));
}

export async function sendMessage(sessionId: string, message: ChatMessage) {
  if (!sessionId || !message?.content || !message?.sender) {
    throw new Error("Invalid message data");
  }
  if (!sessions[sessionId]) {
    throw new Error("Unknown session");
  }
  const processed = await processMessage(message);
  const msg: ChatMessage = {
    ...processed,
    id: processed.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    content: processed.content.trim().slice(0, 1000),
    timestamp: Date.now(),
  };
  sessions[sessionId].messages.push(msg);
  sessions[sessionId].lastMessageAt = msg.timestamp;
  notify(sessionId);
}

export async function createChatSession(userId: string): Promise<string> {
  if (!userId) throw new Error("User ID is required");
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = Date.now();
  sessions[id] = { userId, messages: [], startedAt: now, lastMessageAt: now };
  listeners[id] = new Set();
  return id;
}

export function subscribeToMessages(sessionId: string, callback: (messages: ChatMessage[]) => void) {
  if (!sessionId) throw new Error("Session ID is required");
  if (!listeners[sessionId]) listeners[sessionId] = new Set();
  listeners[sessionId].add(callback);
  // Initial emit
  callback([...(sessions[sessionId]?.messages ?? [])]);
  return () => {
    listeners[sessionId].delete(callback);
  };
}
