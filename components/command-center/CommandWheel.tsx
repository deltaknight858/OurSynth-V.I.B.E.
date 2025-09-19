"use client";
import React from 'react';
import { HaloButton } from '@/components/system/HaloButton';

export interface CommandWheelAction { id: string; label: string; }

interface CommandWheelProps {
  actions: CommandWheelAction[];
  onInvoke: (id: string) => void;
}

export const CommandWheel: React.FC<CommandWheelProps> = ({ actions, onInvoke }) => {
  return (
    <div className="command-wheel grid grid-cols-3 gap-2 p-3 border border-neon rounded-full bg-black/40 max-w-[260px] mx-auto" aria-label="Command Wheel">
      {actions.map(a => (
        <HaloButton key={a.id} size="sm" variant="ghost" onClick={() => onInvoke(a.id)} className="text-xs px-2 py-1">
          {a.label}
        </HaloButton>
      ))}
    </div>
  );
};
