"use client";

import React from 'react';
import clsx from 'clsx';

export interface HaloInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'glass' | 'elevated' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  label?: string;
}

export const HaloInput = React.forwardRef<HTMLInputElement, HaloInputProps>(
  ({ variant = 'glass', size = 'md', error = false, label, className, ...props }, ref) => {
    const inputId = React.useId();
    const baseClasses = 'w-full rounded-lg border bg-transparent text-slate-200 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const variantClasses = {
      glass: 'bg-slate-900/20 backdrop-blur-sm border-slate-300/20 focus:border-cyan-500/50 focus:shadow-lg focus:shadow-cyan-500/10',
      elevated: 'bg-slate-900/40 border-slate-300/30 focus:border-cyan-500/60 shadow-sm',
      minimal: 'border-slate-300/30 focus:border-cyan-500/60 hover:border-slate-300/40'
    };

    const errorClasses = error ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/50' : '';

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">{label}</label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={clsx(baseClasses, sizeClasses[size], variantClasses[variant], errorClasses, className)}
          {...props}
        />
      </div>
    );
  }
);

HaloInput.displayName = 'HaloInput';