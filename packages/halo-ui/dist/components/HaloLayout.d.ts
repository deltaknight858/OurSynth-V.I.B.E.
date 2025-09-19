import React from 'react';
export interface HaloLayoutProps {
    children: React.ReactNode;
    variant?: 'centered' | 'sidebar' | 'split' | 'grid';
    className?: string;
}
export declare const HaloLayout: React.FC<HaloLayoutProps>;
export interface HaloContainerProps {
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
}
export declare const HaloContainer: React.FC<HaloContainerProps>;
export interface HaloSectionProps {
    children: React.ReactNode;
    background?: 'transparent' | 'glass' | 'solid';
    spacing?: 'tight' | 'normal' | 'loose';
    className?: string;
}
export declare const HaloSection: React.FC<HaloSectionProps>;
