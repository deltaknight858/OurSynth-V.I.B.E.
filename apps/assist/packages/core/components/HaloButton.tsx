"use client";
import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import clsx from 'clsx';

export type HaloButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type HaloButtonSize = 'sm' | 'md' | 'lg';

export interface HaloButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: HaloButtonVariant;
  size?: HaloButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  label?: string;
}

const baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-200 gap-2 select-none disabled:opacity-50 disabled:cursor-not-allowed';
const sizeStyles: Record<HaloButtonSize,string> = { sm: 'text-xs px-2.5 py-1.5', md: 'text-sm px-3.5 py-2', lg: 'text-base px-5 py-3' };
const variantStyles: Record<HaloButtonVariant,string> = {
  primary: 'bg-black border border-neon text-neon shadow-sm hover:shadow-neon hover:brightness-110',
  secondary: 'bg-black border border-neon-secondary text-neon-secondary hover:shadow-neon hover:brightness-110',
  ghost: 'bg-transparent text-white hover:bg-glass-bg/60 backdrop-blur-sm',
  danger: 'bg-black border border-neon-error text-neon-error hover:shadow-neon hover:brightness-110'
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
  ...rest
}) => {
  const content = children ?? label;
  const motionProps: MotionProps = !disabled && !loading ? { whileTap: { scale: 0.97 } } : {};
  return (
    <motion.button
      {...motionProps}
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      data-variant={variant}
      data-size={size}
      data-accent={variant}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...(rest as any)}
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
