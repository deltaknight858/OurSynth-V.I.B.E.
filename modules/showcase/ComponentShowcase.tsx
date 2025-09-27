import React from 'react';
import { 
  HaloButton, 
  HaloCard, 
  HaloInput, 
  HaloSelect, 
  HaloProgress, 
  HaloCheckbox,
  HaloLayout,
  HaloContainer,
  HaloSection,
  LoadingIcon,
  ChevronIcon,
  PlusIcon,
  SettingsIcon
} from '@oursynth/core';

export function ComponentShowcase() {
  const [inputValue, setInputValue] = React.useState('');
  const [selectValue, setSelectValue] = React.useState('');
  const [checkboxValue, setCheckboxValue] = React.useState(false);
  const [progress, setProgress] = React.useState(45);

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  return (
    <HaloLayout variant="centered">
      <HaloContainer size="lg">
        <HaloSection background="glass" spacing="normal">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-200 mb-4">
                @oursynth/core Component Showcase
              </h1>
              <p className="text-slate-400">
                Modern glassmorphic UI components with semantic design tokens
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Buttons */}
              <HaloCard variant="glass" glow="primary">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">Buttons</h3>
                  <div className="space-y-3">
                    <HaloButton variant="primary">Primary Button</HaloButton>
                    <HaloButton variant="secondary">Secondary Button</HaloButton>
                    <HaloButton variant="ghost">Ghost Button</HaloButton>
                    <HaloButton variant="danger" size="sm">
                      <PlusIcon size={16} />
                      With Icon
                    </HaloButton>
                  </div>
                </div>
              </HaloCard>

              {/* Inputs */}
              <HaloCard variant="elevated">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">Form Controls</h3>
                  <div className="space-y-4">
                    <HaloInput
                      label="Text Input"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter text..."
                    />
                    <HaloSelect
                      label="Select Option"
                      options={selectOptions}
                      value={selectValue}
                      onChange={setSelectValue}
                      placeholder="Choose an option..."
                    />
                    <HaloCheckbox
                      checked={checkboxValue}
                      onChange={setCheckboxValue}
                      label="Enable notifications"
                    />
                  </div>
                </div>
              </HaloCard>

              {/* Progress & Icons */}
              <HaloCard variant="minimal">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">Progress & Icons</h3>
                  <div className="space-y-4">
                    <HaloProgress value={progress} showValue />
                    <div className="flex gap-4 items-center">
                      <LoadingIcon size={20} />
                      <ChevronIcon direction="right" />
                      <SettingsIcon color="secondary" />
                      <PlusIcon color="success" />
                    </div>
                    <div className="flex gap-2">
                      <HaloButton
                        size="sm"
                        variant="ghost"
                        onClick={() => setProgress(Math.max(0, progress - 10))}
                      >
                        <ChevronIcon direction="left" size={16} />
                      </HaloButton>
                      <HaloButton
                        size="sm"
                        variant="ghost"
                        onClick={() => setProgress(Math.min(100, progress + 10))}
                      >
                        <ChevronIcon direction="right" size={16} />
                      </HaloButton>
                    </div>
                  </div>
                </div>
              </HaloCard>

              {/* Layout Demo */}
              <HaloCard variant="glass" glow="secondary">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4">Features</h3>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <ChevronIcon direction="right" size={16} color="success" />
                      <span>Design token-based styling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronIcon direction="right" size={16} color="success" />
                      <span>Glassmorphic aesthetics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronIcon direction="right" size={16} color="success" />
                      <span>Framer Motion animations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronIcon direction="right" size={16} color="success" />
                      <span>TypeScript definitions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronIcon direction="right" size={16} color="success" />
                      <span>Accessibility support</span>
                    </div>
                  </div>
                </div>
              </HaloCard>
            </div>
          </div>
        </HaloSection>
      </HaloContainer>
    </HaloLayout>
  );
}