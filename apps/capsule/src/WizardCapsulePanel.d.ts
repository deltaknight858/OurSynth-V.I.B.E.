import type { FC } from 'react';
import type { MemoryAPI } from '@/packages/wizard-capsule/src/types.js';

declare const WizardCapsulePanel: FC<{
  capsuleId: string;
  title?: string;
  memoryApi?: MemoryAPI;
  onViewMindmap?: (nodeId: string) => void;
}>;

export default WizardCapsulePanel;
