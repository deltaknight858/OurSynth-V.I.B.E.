import React from 'react';
export interface HaloCheckboxProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'switch';
    className?: string;
    id?: string;
}
export declare const HaloCheckbox: React.FC<HaloCheckboxProps>;
