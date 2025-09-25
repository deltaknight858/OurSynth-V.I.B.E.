"use client";

import React from 'react';
import clsx from 'clsx';

export interface HaloLayoutProps {
  children: React.ReactNode;
  variant?: 'centered' | 'sidebar' | 'split' | 'grid';
  className?: string;
}

export const HaloLayout: React.FC<HaloLayoutProps> = ({
  children,
  variant = 'centered',
  className
}) => {
  const variantClasses = {
    centered: 'flex items-center justify-center min-h-screen p-4',
    sidebar: 'flex min-h-screen',
    split: 'grid grid-cols-1 md:grid-cols-2 min-h-screen',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6'
  };

  return (
    <div className={clsx(variantClasses[variant], className)}>
      {children}
    </div>
  );
};

export interface HaloContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const HaloContainer: React.FC<HaloContainerProps> = ({
  children,
  size = 'lg',
  className
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full'
  };

  return (
    <div className={clsx('mx-auto w-full px-4', sizeClasses[size], className)}>
      {children}
    </div>
  );
};

export interface HaloSectionProps {
  children: React.ReactNode;
  background?: 'transparent' | 'glass' | 'solid';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

export const HaloSection: React.FC<HaloSectionProps> = ({
  children,
  background = 'transparent',
  spacing = 'normal',
  className
}) => {
  const backgroundClasses = {
    transparent: 'bg-transparent',
    glass: 'bg-slate-900/20 backdrop-blur-lg border border-slate-300/20 rounded-lg',
    solid: 'bg-slate-900/40 rounded-lg'
  };

  const spacingClasses = {
    tight: 'py-4',
    normal: 'py-8',
    loose: 'py-16'
  };

  return (
    <section className={clsx(backgroundClasses[background], spacingClasses[spacing], className)}>
      {children}
    </section>
  );
};