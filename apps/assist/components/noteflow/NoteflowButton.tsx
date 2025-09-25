'use client';
import React from 'react';
import styles from './NoteflowButton.module.css';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  startIcon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function NoteflowButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled,
  startIcon,
  className = '',
  style,
}: ButtonProps) {
  const baseClasses = [
    styles.button,
    styles[`button--${size}`],
    styles[`button--${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      style={style}
    >
      {startIcon && <span className={styles.icon} aria-hidden>{startIcon}</span>}
      <span>{children}</span>
    </button>
  );
}