import React from 'react';
import { Surface, SurfaceProps } from './Surface';
import { cx } from '../util/cx';

export interface PanelProps extends SurfaceProps {
  title?: string;
  footer?: React.ReactNode;
  scroll?: boolean;
}

export const Panel: React.FC<PanelProps> = ({
  title,
  footer,
  scroll=true,
  children,
  className,
  ...rest
}) => {
  return (
    <Surface {...rest} className={cx('labs-panel', className)}>
      {title && <div className="labs-panel__header">{title}</div>}
      <div className={cx('labs-panel__body', scroll && 'is-scroll')}>{children}</div>
      {footer && <div className="labs-panel__footer">{footer}</div>}
    </Surface>
  );
};
