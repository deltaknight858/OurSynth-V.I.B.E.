import { styled, createTheme } from '@mui/material/styles';

// Define expectType function for type checking
const expectType = <T>(value: T): T => value;

describe('createTypography', () => {
  it('should handle variant properties that can be unset', () => {
    // properties of the variants can be "unset"
    const theme = createTheme({
      typography: {
        allVariants: {
          fontStyle: undefined,
        },
      },
    });

    const maybeFontStyle = theme.typography.body1.fontStyle;
    expectType<
      | '-moz-initial'
      | 'inherit'
      | 'initial'
      | 'revert'
      | 'revert-layer'
      | 'unset'
      | 'italic'
      | 'normal'
      | 'oblique'
      | (string & {})
      | undefined,
      typeof maybeFontStyle
    >(maybeFontStyle);

    expect(theme.typography.body1).toBeDefined();
  });

  it('should work with styled components', () => {
    const StyledComponents = styled('span')(({ theme }) => ({
      ...theme.typography.body1,
    }));
    
    expect(StyledComponents).toBeDefined();
  });
});
