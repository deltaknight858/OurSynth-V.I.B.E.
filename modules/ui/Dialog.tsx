"use client";
import React, { useEffect, useRef } from 'react';
import './ui.css';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  ariaLabel?: string;
};

function useEscape(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
}

export function Dialog({ open, onClose, children, maxWidth = 'md', fullWidth, ariaLabel }: DialogProps) {
  useEscape(onClose);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => previouslyFocused?.focus?.();
  }, [open]);

  if (!open) return null;

  const widths: Record<NonNullable<DialogProps['maxWidth']>, number> = { sm: 480, md: 720, lg: 960 };

  const panelClass = [
    'dialogPanel',
    fullWidth ? '' : `dialogPanel--${maxWidth}`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div role="dialog" aria-modal="true" aria-label={ariaLabel} onClick={onClose} className="dialogBackdrop">
      <div ref={dialogRef} tabIndex={-1} onClick={(e) => e.stopPropagation()} className={panelClass}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="dialogHeader">{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="dialogTitle">{children}</h3>;
}

export function DialogBody({ children }: { children: React.ReactNode }) {
  return <div className="dialogBody">{children}</div>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="dialogFooter">{children}</div>;
}

export default Dialog;
