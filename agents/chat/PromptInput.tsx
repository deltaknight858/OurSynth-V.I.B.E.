"use client";
import React, { useState } from 'react';
import { HaloButton } from '@/components/system/HaloButton';

interface PromptInputProps { onSubmit: (value: string) => void; disabled?: boolean; }

export const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, disabled }) => {
  const [value, setValue] = useState('');
  return (
    <form className="flex gap-2" onSubmit={e => { e.preventDefault(); if (!value.trim()) return; onSubmit(value); setValue(''); }} aria-label="Prompt Input">
      <input
        className="flex-1 bg-black/60 border border-neon-secondary rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-neon"
        placeholder="Type your message…"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
      />
      <HaloButton size="sm" type="submit" variant="primary" disabled={disabled || !value.trim()}>Send</HaloButton>
    </form>
  );
};
