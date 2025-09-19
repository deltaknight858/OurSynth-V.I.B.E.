import * as React from 'react';
import React__default, { PropsWithChildren } from 'react';
import { HTMLMotionProps } from 'framer-motion';
import * as zustand from 'zustand';

type HaloButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type HaloButtonSize = 'sm' | 'md' | 'lg';
type HaloButtonBase = Omit<HTMLMotionProps<'button'>, 'ref' | 'children'>;
interface HaloButtonProps extends HaloButtonBase {
    variant?: HaloButtonVariant;
    size?: HaloButtonSize;
    loading?: boolean;
    leftIcon?: React__default.ReactNode;
    rightIcon?: React__default.ReactNode;
    children?: React__default.ReactNode;
    label?: string;
}
declare const HaloButton: React__default.ForwardRefExoticComponent<HaloButtonProps & React__default.RefAttributes<HTMLButtonElement>>;

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: number;
}
interface AgentSessionState {
    messages: ChatMessage[];
    status: 'idle' | 'thinking';
    send: (content: string) => Promise<void>;
    mockExecute: (input: ChatMessage[]) => Promise<ChatMessage>;
}
declare const useAgentSession: zustand.UseBoundStore<zustand.StoreApi<AgentSessionState>>;

interface FocusRingProps extends React__default.HTMLAttributes<HTMLDivElement> {
    inset?: boolean;
    radius?: number;
}
declare const FocusRing: React__default.FC<FocusRingProps>;

interface ScrollAreaProps extends PropsWithChildren<{
    height?: number | string;
}> {
}
declare const ScrollArea: React__default.FC<ScrollAreaProps>;

declare function MeshCapsules(): React.JSX.Element;

declare function TimeMachine(): React.JSX.Element;

type Props$2 = {
    product: {
        slug: string;
        title: string;
        version: string;
        isPremium: boolean;
        templateMeta?: {
            route?: string;
            options?: Record<string, unknown>;
        };
    };
    isEntitled: boolean;
};
declare function GenerateWithPathways({ product, isEntitled }: Props$2): React.JSX.Element | null;

type Props$1 = {
    defaultProductSlug?: string;
    defaultType?: 'component' | 'page' | 'feature' | 'app';
};
declare function PromptForm({ defaultProductSlug, defaultType }: Props$1): React.JSX.Element;

type Props = {
    runId: string;
};
declare function WizardStream({ runId }: Props): React.JSX.Element;

export { type AgentSessionState, type ChatMessage, FocusRing, type FocusRingProps, GenerateWithPathways, HaloButton, type HaloButtonProps, type HaloButtonSize, type HaloButtonVariant, MeshCapsules, PromptForm, ScrollArea, type ScrollAreaProps, TimeMachine, WizardStream, useAgentSession };
