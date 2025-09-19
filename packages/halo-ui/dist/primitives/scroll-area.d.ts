import React, { PropsWithChildren } from 'react';
export interface ScrollAreaProps extends PropsWithChildren<{
    height?: number | string;
}> {
}
export declare const ScrollArea: React.FC<ScrollAreaProps>;
