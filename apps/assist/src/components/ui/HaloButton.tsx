"use client";
import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import Link from 'next/link';
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
  href?: string;
}

const baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-200 gap-2 select-none disabled:opacity-50 disabled:cursor-not-allowed glass neon-glow';

const sizeStyles: Record<HaloButtonSize, string> = {
  sm: 'text-xs px-2.5 py-1.5',
  md: 'text-sm px-3.5 py-2',
  lg: 'text-base px-5 py-3'
};

const variantStyles: Record<HaloButtonVariant, string> = {
  primary: 'border-primary/50 text-primary hover:border-primary hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)] hover:text-primary/90',
  secondary: 'border-secondary/50 text-secondary hover:border-secondary hover:shadow-[0_0_20px_hsl(var(--secondary)/0.5)] hover:text-secondary/90',
  ghost: 'border-transparent text-foreground hover:border-primary/30 hover:bg-primary/5',
  danger: 'border-destructive/50 text-destructive hover:border-destructive hover:shadow-[0_0_20px_hsl(var(--destructive)/0.5)] hover:text-destructive/90'
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
  href,
  ...rest
}) => {
  const content = children ?? label;
  const motionProps: MotionProps = !disabled && !loading ? { 
    whileTap: { scale: 0.97 },
    whileHover: { scale: 1.02 }
  } : {};

  const buttonContent = (
    <>
      {loading ? (
        <span className="animate-pulse-vibe">Loading...</span>
      ) : (
        <>
          {leftIcon && <span className="inline-flex items-center" aria-hidden>{leftIcon}</span>}
          {content && <span>{content}</span>}
          {rightIcon && <span className="inline-flex items-center" aria-hidden>{rightIcon}</span>}
        </>
      )}
    </>
  );

  const buttonClass = clsx(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={buttonClass}>
        <motion.div
          {...motionProps}
          className="flex items-center justify-center gap-2 w-full h-full"
        >
          {buttonContent}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      {...motionProps}
      className={buttonClass}
      data-variant={variant}
      data-size={size}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...(rest as any)}
    >
      {buttonContent}
    </motion.button>
  );
};

HaloButton.displayName = 'HaloButton';