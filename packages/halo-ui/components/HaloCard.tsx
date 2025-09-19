"use client";

import React from 'react';
import clsx from 'clsx';

export interface HaloCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'elevated' | 'minimal';
  glow?: 'primary' | 'secondary' | 'none';
  children: React.ReactNode;
}

export const HaloCard: React.FC<HaloCardProps> = ({
  variant = 'glass',
  glow = 'none',
  children,
  className,
  ...props
}) => {
  const baseClasses = 'relative rounded-lg transition-all duration-300 ease-out';
  
  const variantClasses = {
    glass: 'bg-slate-900/20 backdrop-blur-lg border border-slate-300/20 shadow-lg',
    elevated: 'bg-slate-900/40 border border-slate-300/10 shadow-xl',
    minimal: 'bg-transparent border border-slate-300/10'
  };

  const glowClasses = {
    primary: 'hover:shadow-cyan-500/20 hover:shadow-xl hover:border-cyan-500/30',
    secondary: 'hover:shadow-purple-500/20 hover:shadow-xl hover:border-purple-500/30',
    none: ''
  };

  return (
    <div
      className={clsx(baseClasses, variantClasses[variant], glowClasses[glow], className)}
      {...props}
    >
      {children}
    </div>
  );
};

HaloCard.displayName = 'HaloCard';