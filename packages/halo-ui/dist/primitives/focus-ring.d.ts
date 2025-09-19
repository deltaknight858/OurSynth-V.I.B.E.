import React from 'react';
export interface FocusRingProps extends React.HTMLAttributes<HTMLDivElement> {
    inset?: boolean;
    radius?: number;
}
export declare const FocusRing: React.FC<FocusRingProps>;
