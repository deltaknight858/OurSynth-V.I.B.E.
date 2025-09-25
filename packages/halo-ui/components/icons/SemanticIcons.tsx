"use client";

import React from 'react';
import clsx from 'clsx';

export interface SemanticIconProps {
  size?: number | string;
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export const CheckboxIcon: React.FC<SemanticIconProps & { checked?: boolean }> = ({ 
  size = 20, 
  className, 
  color = 'primary',
  checked = false 
}) => {
  const colorClasses = {
    primary: 'border-cyan-500 bg-cyan-500/20',
    secondary: 'border-purple-500 bg-purple-500/20',
    success: 'border-green-500 bg-green-500/20',
    warning: 'border-yellow-500 bg-yellow-500/20',
    error: 'border-red-500 bg-red-500/20'
  };

  return (
    <div 
      className={clsx(
        'inline-flex items-center justify-center rounded border-2 transition-all duration-200',
        checked ? colorClasses[color] : 'border-slate-400 bg-transparent',
        className
      )}
      style={{ width: size, height: size }}
    >
      {checked && (
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      )}
    </div>
  );
};

export const SettingsIcon: React.FC<SemanticIconProps> = ({ size = 24, className, color = 'primary' }) => {
  const colorClasses = {
    primary: 'text-cyan-400',
    secondary: 'text-purple-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400'
  };

  return (
    <div 
      className={clsx('inline-flex items-center justify-center', colorClasses[color], className)}
      style={{ width: size, height: size }}
    >
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
      </svg>
    </div>
  );
};

export const CloseIcon: React.FC<SemanticIconProps> = ({ size = 24, className, color = 'primary' }) => {
  const colorClasses = {
    primary: 'text-cyan-400',
    secondary: 'text-purple-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400'
  };

  return (
    <div 
      className={clsx('inline-flex items-center justify-center', colorClasses[color], className)}
      style={{ width: size, height: size }}
    >
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </div>
  );
};

export const LoadingIcon: React.FC<SemanticIconProps> = ({ size = 24, className, color = 'primary' }) => {
  const colorClasses = {
    primary: 'text-cyan-400',
    secondary: 'text-purple-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400'
  };

  return (
    <div 
      className={clsx('inline-flex items-center justify-center animate-spin', colorClasses[color], className)}
      style={{ width: size, height: size }}
    >
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
    </div>
  );
};

export const ChevronIcon: React.FC<SemanticIconProps & { direction?: 'up' | 'down' | 'left' | 'right' }> = ({ 
  size = 24, 
  className, 
  color = 'primary',
  direction = 'right'
}) => {
  const colorClasses = {
    primary: 'text-cyan-400',
    secondary: 'text-purple-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400'
  };

  const rotationClasses = {
    up: 'rotate-[-90deg]',
    down: 'rotate-90',
    left: 'rotate-180',
    right: 'rotate-0'
  };

  return (
    <div 
      className={clsx('inline-flex items-center justify-center', colorClasses[color], rotationClasses[direction], className)}
      style={{ width: size, height: size }}
    >
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9,18 15,12 9,6"/>
      </svg>
    </div>
  );
};

export const PlusIcon: React.FC<SemanticIconProps> = ({ size = 24, className, color = 'primary' }) => {
  const colorClasses = {
    primary: 'text-cyan-400',
    secondary: 'text-purple-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400'
  };

  return (
    <div 
      className={clsx('inline-flex items-center justify-center', colorClasses[color], className)}
      style={{ width: size, height: size }}
    >
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </div>
  );
};