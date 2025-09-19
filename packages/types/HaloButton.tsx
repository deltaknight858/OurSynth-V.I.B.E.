import React from 'react';

interface HaloButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const HaloButton = ({ variant = 'primary', children, className = '', ...props }: HaloButtonProps) => {
  const baseClasses = 'px-4 py-2 rounded font-semibold transition-all duration-300';
  const variantClasses = {
    primary: 'bg-neonCyan text-deepSpace hover:bg-neonPurple hover:text-white shadow-md hover:shadow-lg hover:shadow-neonPurple/50',
    secondary: 'bg-slateGrey/20 text-white hover:bg-slateGrey/40 border border-glass-border',
    ghost: 'bg-transparent text-slateGrey hover:bg-slateGrey/20 hover:text-white',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};