import React from 'react';
import clsx from 'clsx';
import { colors } from '@vibe/core-tokens';

export interface HaloButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
  glowIntensity?: 'subtle' | 'medium' | 'intense';
}

export const HaloButton: React.FC<HaloButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  isLoading = false,
  glowIntensity = 'medium',
  disabled,
  ...props
}) => {
  const baseClasses = [
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-lg',
    'transition-all',
    'duration-300',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-offset-transparent',
    'backdrop-blur-sm',
    'border',
    'overflow-hidden',
  ];

  const sizeClasses = {
    sm: ['px-3', 'py-1.5', 'text-sm'],
    md: ['px-4', 'py-2', 'text-base'],
    lg: ['px-6', 'py-3', 'text-lg'],
  };

  const variantClasses = {
    primary: [
      'bg-gradient-to-r',
      'from-indigo-500/80',
      'to-purple-600/80',
      'text-white',
      'border-indigo-400/50',
      'hover:from-indigo-400/90',
      'hover:to-purple-500/90',
      'focus:ring-indigo-500/50',
      'shadow-lg',
      'shadow-indigo-500/25',
    ],
    secondary: [
      'bg-slate-700/80',
      'text-slate-100',
      'border-slate-600/50',
      'hover:bg-slate-600/90',
      'focus:ring-slate-500/50',
      'shadow-lg',
      'shadow-slate-900/25',
    ],
    ghost: [
      'bg-transparent',
      'text-slate-200',
      'border-slate-600/30',
      'hover:bg-slate-700/50',
      'focus:ring-slate-500/50',
    ],
    neon: [
      'bg-transparent',
      'text-cyan-400',
      'border-cyan-400/50',
      'hover:text-cyan-300',
      'hover:border-cyan-300/70',
      'focus:ring-cyan-400/50',
      'shadow-lg',
      'shadow-cyan-400/20',
      'hover:shadow-cyan-400/40',
    ],
  };

  const glowClasses = {
    subtle: 'hover:shadow-lg',
    medium: 'hover:shadow-xl hover:shadow-current/20',
    intense: 'hover:shadow-2xl hover:shadow-current/40',
  };

  const disabledClasses = [
    'opacity-50',
    'cursor-not-allowed',
    'pointer-events-none',
  ];

  const classes = clsx(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    glowClasses[glowIntensity],
    disabled && disabledClasses,
    className
  );

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </span>
      
      {/* Neon glow effect for neon variant */}
      {variant === 'neon' && (
        <div className="absolute inset-0 rounded-lg blur-sm bg-current opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
      )}
    </button>
  );
};