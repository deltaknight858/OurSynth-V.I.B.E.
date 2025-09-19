import React from 'react';
import { cx } from '../util/cx';

export interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  glow?: boolean;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  glow=true,
  variant='primary',
  size='md',
  className,
  ...rest
}) => (
  <button
    data-variant={variant}
    data-size={size}
    data-glow={glow || undefined}
    className={cx('labs-neon-btn', className)}
    {...rest}
  />
);
