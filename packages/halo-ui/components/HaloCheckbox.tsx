"use client";

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export interface HaloCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'switch';
  className?: string;
  id?: string;
}

export const HaloCheckbox: React.FC<HaloCheckboxProps> = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  size = 'md',
  variant = 'default',
  className,
  id
}) => {
  const checkboxId = id || React.useId();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const switchSizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-10 h-5',
    lg: 'w-12 h-6'
  };

  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (variant === 'switch') {
    return (
      <div className={clsx('flex items-center gap-2', className)}>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => !disabled && onChange?.(!checked)}
          disabled={disabled}
          className={clsx(
            'relative rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
            switchSizeClasses[size],
            checked 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
              : 'bg-slate-600',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <motion.div
            animate={{
              x: checked ? 
                (size === 'sm' ? 16 : size === 'md' ? 20 : 24) : 
                (size === 'sm' ? 2 : size === 'md' ? 2 : 2)
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={clsx(
              'absolute top-0.5 bg-white rounded-full shadow-sm',
              thumbSizeClasses[size]
            )}
          />
        </button>
        {label && (
          <label 
            htmlFor={checkboxId}
            className={clsx(
              'text-sm text-slate-200 cursor-pointer',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <motion.button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => !disabled && onChange?.(!checked)}
        disabled={disabled}
        whileTap={!disabled ? { scale: 0.95 } : undefined}
        className={clsx(
          'relative rounded border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
          sizeClasses[size],
          checked 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-500' 
            : 'bg-transparent border-slate-400 hover:border-slate-300',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {checked && (
          <motion.svg
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full h-full text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </motion.button>
      {label && (
        <label 
          htmlFor={checkboxId}
          className={clsx(
            'text-sm text-slate-200 cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};

HaloCheckbox.displayName = 'HaloCheckbox';