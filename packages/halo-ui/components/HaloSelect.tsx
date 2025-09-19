"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export interface HaloSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface HaloSelectProps {
  options: HaloSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  variant?: 'glass' | 'elevated' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: boolean;
  label?: string;
  className?: string;
}

export const HaloSelect: React.FC<HaloSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  variant = 'glass',
  size = 'md',
  disabled = false,
  error = false,
  label,
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectId = React.useId();
  
  const selectedOption = options.find(option => option.value === value);
  
  const baseClasses = 'relative w-full rounded-lg border cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const variantClasses = {
    glass: 'bg-slate-900/20 backdrop-blur-sm border-slate-300/20 focus:border-cyan-500/50',
    elevated: 'bg-slate-900/40 border-slate-300/30 focus:border-cyan-500/60 shadow-sm',
    minimal: 'border-slate-300/30 focus:border-cyan-500/60 hover:border-slate-300/40'
  };

  const errorClasses = error ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/50' : '';

  return (
    <div className="relative">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-300 mb-1">
          {label}
        </label>
      )}
      
      <div
        id={selectId}
        className={clsx(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          errorClasses,
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center justify-between">
          <span className={clsx(
            selectedOption ? 'text-slate-200' : 'text-slate-400'
          )}>
            {selectedOption?.label || placeholder}
          </span>
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-slate-900/90 backdrop-blur-lg border border-slate-300/20 rounded-lg shadow-xl max-h-60 overflow-auto"
          >
            {options.map((option) => (
              <button
                key={option.value}
                className={clsx(
                  'w-full px-4 py-2 text-left text-sm transition-colors duration-150',
                  'hover:bg-slate-700/50 focus:bg-slate-700/50 focus:outline-none',
                  option.disabled && 'opacity-50 cursor-not-allowed',
                  option.value === value && 'bg-cyan-500/20 text-cyan-300'
                )}
                onClick={() => {
                  if (!option.disabled && onChange) {
                    onChange(option.value);
                    setIsOpen(false);
                  }
                }}
                disabled={option.disabled}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

HaloSelect.displayName = 'HaloSelect';