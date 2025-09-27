import React from 'react';
import { ChatMessage } from '@/state/agent/agentSessionStore';

export const MessageCapsule: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={
      'rounded-md px-3 py-2 text-xs font-medium max-w-[80%] ' +
      (isUser
        ? 'ml-auto bg-black/60 border border-neon-secondary text-neon-secondary'
        : 'mr-auto bg-black/50 border border-neon text-neon')
    }>
      {msg.content}
    </div>
  );
};
