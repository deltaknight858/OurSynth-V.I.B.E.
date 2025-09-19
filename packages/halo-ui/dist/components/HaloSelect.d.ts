import React from 'react';
export interface HaloSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface HaloSelectProps {
    options: HaloSelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    variant?: 'glass' | 'elevated' | 'minimal';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    error?: boolean;
    label?: string;
    className?: string;
}
export declare const HaloSelect: React.FC<HaloSelectProps>;
