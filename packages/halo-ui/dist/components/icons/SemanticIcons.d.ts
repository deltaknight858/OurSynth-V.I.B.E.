import React from 'react';
export interface SemanticIconProps {
    size?: number | string;
    className?: string;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}
export declare const CheckboxIcon: React.FC<SemanticIconProps & {
    checked?: boolean;
}>;
export declare const SettingsIcon: React.FC<SemanticIconProps>;
export declare const CloseIcon: React.FC<SemanticIconProps>;
export declare const LoadingIcon: React.FC<SemanticIconProps>;
export declare const ChevronIcon: React.FC<SemanticIconProps & {
    direction?: 'up' | 'down' | 'left' | 'right';
}>;
export declare const PlusIcon: React.FC<SemanticIconProps>;
