import React from 'react';
export interface HaloProgressProps {
    value: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'linear' | 'circular';
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    showValue?: boolean;
    className?: string;
}
export declare const HaloProgress: React.FC<HaloProgressProps>;
