"use client";

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export type HaloButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type HaloButtonSize = 'sm' | 'md' | 'lg';

export interface HaloButtonProps {
  variant?: HaloButtonVariant;
  size?: HaloButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  label?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-200 gap-2 select-none disabled:opacity-50 disabled:cursor-not-allowed';

const sizeStyles: Record<HaloButtonSize, string> = {
  sm: 'text-xs px-2.5 py-1.5',
  md: 'text-sm px-3.5 py-2',
  lg: 'text-base px-5 py-3'
};

const variantStyles: Record<HaloButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30',
  secondary: 'bg-slate-200/20 backdrop-blur-sm border border-slate-300/30 text-slate-200 hover:bg-slate-200/30 hover:shadow-lg',
  ghost: 'bg-transparent text-slate-200 hover:bg-slate-200/10 backdrop-blur-sm',
  danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/20 hover:shadow-red-500/30'
};

export const HaloButton: React.FC<HaloButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  label,
  className,
  disabled,
  onClick,
  type = 'button'
}) => {
  const content = children ?? label;
  
  return (
    <motion.button
      whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      data-variant={variant}
      data-size={size}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
    >
      {loading ? (
        <span className="animate-pulse">Loading...</span>
      ) : (
        <>
          {leftIcon && <span className="inline-flex items-center" aria-hidden>{leftIcon}</span>}
          {content && <span>{content}</span>}
          {rightIcon && <span className="inline-flex items-center" aria-hidden>{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};

HaloButton.displayName = 'HaloButton';