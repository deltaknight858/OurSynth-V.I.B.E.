import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

describe('experimental_extendTheme', () => {
  it('should provide getCssVar method', () => {
    const theme = extendTheme();

    expect(theme.getCssVar).toBeDefined();
    expect(typeof theme.getCssVar).toBe('function');
  });

  it('should work with valid CSS variable names', () => {
    const theme = extendTheme();

    expect(() => theme.getCssVar('palette-primary-main')).not.toThrow();
    expect(() => theme.getCssVar('palette-Alert-errorColor')).not.toThrow();
    expect(() => theme.getCssVar('opacity-inputPlaceholder')).not.toThrow();
    expect(() => theme.getCssVar('zIndex-appBar')).not.toThrow();
    expect(() => theme.getCssVar('shape-borderRadius')).not.toThrow();
    expect(() => theme.getCssVar('shadows-0')).not.toThrow();
    expect(() => theme.getCssVar('overlays-0')).not.toThrow();
  });

  // Note: TypeScript should catch invalid usage at compile time
  // The commented out @ts-expect-error tests are for compile-time type checking
});
