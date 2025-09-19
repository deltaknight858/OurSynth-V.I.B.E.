import React from 'react';
export type HaloButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type HaloButtonSize = 'sm' | 'md' | 'lg';
export interface HaloButtonProps {
    variant?: HaloButtonVariant;
    size?: HaloButtonSize;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children?: React.ReactNode;
    label?: string;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
}
export declare const HaloButton: React.FC<HaloButtonProps>;
