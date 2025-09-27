import React from 'react';

export const AgentStatusIndicator: React.FC<{ status: 'idle' | 'thinking' }> = ({ status }) => {
  return (
    <span
      className={
        'inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border ' +
        (status === 'thinking'
          ? 'border-neon-secondary text-neon-secondary animate-pulse'
          : 'border-neon text-neon')
      }
      aria-live="polite"
    >
      <span className="w-2 h-2 rounded-full bg-current" />
      {status === 'thinking' ? 'Thinking' : 'Ready'}
    </span>
  );
};
