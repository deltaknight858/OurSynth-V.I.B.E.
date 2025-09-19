import React from 'react';
export interface HaloCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'glass' | 'elevated' | 'minimal';
    glow?: 'primary' | 'secondary' | 'none';
    children: React.ReactNode;
}
export declare const HaloCard: React.FC<HaloCardProps>;
