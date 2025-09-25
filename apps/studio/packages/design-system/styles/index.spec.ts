import { styled, createTheme } from '@mui/material/styles';

describe('styles index', () => {
  it('should support unstable_sx in styled utility', () => {
    // Can use the unstable_sx in the styled() utility
    const Test = styled('div')(({ theme }) =>
      theme.unstable_sx({
        color: 'primary.main',
        bgcolor: 'primary.light',
        m: 2,
      }),
    );

    expect(Test).toBeDefined();
  });

  it('should support unstable_sx in theme variants', () => {
    // Can use the unstable_sx in the theme's variants
    const customTheme = createTheme({
      components: {
        MuiButton: {
          variants: [
            {
              props: {},
              style: ({ theme }) =>
                theme.unstable_sx({
                  m: 2,
                  p: 1,
                }),
            },
          ],
        },
      },
    });

    expect(customTheme.components.MuiButton.variants).toBeDefined();
    expect(customTheme.components.MuiButton.variants).toHaveLength(1);
  });
});
