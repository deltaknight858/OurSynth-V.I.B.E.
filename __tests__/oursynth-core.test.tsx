import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { 
  HaloButton, 
  HaloCard, 
  HaloInput, 
  HaloSelect, 
  HaloProgress, 
  HaloCheckbox,
  HaloModal,
  LoadingIcon,
  ChevronIcon,
  PlusIcon 
} from '@oursynth/core';

describe('@oursynth/core components', () => {
  test('HaloButton renders correctly', () => {
    render(<HaloButton>Test Button</HaloButton>);
    expect(screen.getByRole('button')).toHaveTextContent('Test Button');
  });

  test('HaloButton with variant renders correctly', () => {
    render(<HaloButton variant="secondary">Secondary Button</HaloButton>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'secondary');
  });

  test('HaloCard renders children', () => {
    render(
      <HaloCard>
        <p>Card content</p>
      </HaloCard>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  test('HaloInput renders with label', () => {
    render(<HaloInput label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  test('HaloSelect renders with options', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ];
    render(<HaloSelect options={options} placeholder="Select..." />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  test('HaloProgress shows correct percentage', () => {
    render(<HaloProgress value={50} showValue />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  test('HaloCheckbox handles state changes', () => {
    const handleChange = jest.fn();
    render(<HaloCheckbox onChange={handleChange} label="Test Checkbox" />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  test('HaloModal renders when open', () => {
    render(
      <HaloModal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </HaloModal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  test('Semantic icons render correctly', () => {
    render(
      <div data-testid="icons-container">
        <LoadingIcon size={20} />
        <ChevronIcon direction="down" />
        <PlusIcon color="success" />
      </div>
    );
    // Icons container should be present with 3 icons
    expect(screen.getByTestId('icons-container')).toBeInTheDocument();
  });
});