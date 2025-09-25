"use client";
import React from 'react';
import './ui.css';

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

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled,
  startIcon,
  className,
  style,
}: ButtonProps) {
  const classes = [
    'btn',
    size ? `btn--${size}` : 'btn--md',
    variant ? `btn--${variant}` : 'btn--primary',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
  className={classes}
  style={style}
    >
      {startIcon && <span aria-hidden>{startIcon}</span>}
      <span>{children}</span>
    </button>
  );
}

export default Button;
