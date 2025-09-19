import React from 'react';
export interface HaloInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    variant?: 'glass' | 'elevated' | 'minimal';
    size?: 'sm' | 'md' | 'lg';
    error?: boolean;
    label?: string;
}
export declare const HaloInput: React.ForwardRefExoticComponent<HaloInputProps & React.RefAttributes<HTMLInputElement>>;
