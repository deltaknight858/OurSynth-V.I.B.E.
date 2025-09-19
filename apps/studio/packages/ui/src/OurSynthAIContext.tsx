"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp?: number;
}

interface OurSynthAIContextType {
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  generateComponent: (prompt: string) => Promise<{ code: string; explanation: string }>;
  explainCode: (code: string) => Promise<string>;
}

const OurSynthAIContext = createContext<OurSynthAIContextType | undefined>(undefined);

export const useOurSynthAI = () => {
  const context = useContext(OurSynthAIContext);
  if (!context) throw new Error('useOurSynthAI must be used within OurSynthAIProvider');
  return context;
};

interface ProviderProps {
  children: ReactNode;
  rasaEndpoint?: string;
}

export const OurSynthAIProvider: React.FC<ProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const AZURE_AI_ENDPOINT = process.env.NEXT_PUBLIC_AZURE_AI_ENDPOINT || '/api/ai';

  // Send message to Rasa via Azure Function
  const sendMessage = async (text: string) => {
    const userMsg: Message = { sender: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    try {
      const res = await fetch(AZURE_AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', message: text }),
      });
      const data = await res.json();
      const botMsg: Message = { sender: 'bot', text: data.reply || 'No response', timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
      // Optionally add explanation as a message
      if (data.explanation) {
        setMessages(prev => [...prev, { sender: 'bot', text: `[Explanation] ${data.explanation}`, timestamp: Date.now() }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error contacting AI backend.', timestamp: Date.now() }]);
    }
  };

  // Generate component via Pathways Generator
  const generateComponent = async (prompt: string) => {
    const res = await fetch(AZURE_AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate', prompt }),
    });
    const data = await res.json();
    return { code: data.code, explanation: data.explanation };
  };

  // Explain code via AI backend
  const explainCode = async (code: string) => {
    const res = await fetch(AZURE_AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'explain_code', code }),
    });
    const data = await res.json();
    return data.explanation;
  };

  return (
    <OurSynthAIContext.Provider value={{ messages, sendMessage, generateComponent, explainCode }}>
      {children}
    </OurSynthAIContext.Provider>
  );
};
