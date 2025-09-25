import React from 'react';
import { cx } from '../util/cx';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'raised' | 'inset';
  glow?: boolean;
}

export const Surface: React.FC<SurfaceProps> = ({ variant='base', glow=false, className, ...rest }) => {
  return (
    <div
      data-surface={variant}
      data-glow={glow || undefined}
      className={cx('labs-surface', className)}
      {...rest}
    />
  );
};
