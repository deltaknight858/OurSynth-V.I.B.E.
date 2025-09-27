import type { Preview } from '@storybook/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../packages/ui/theme';
// global halo-ui utilities (ensure path alias in main.ts or fallback to relative path)
import '../packages/ui/src/styles/glass.css';
import '../packages/ui/src/styles/neon.css';
import '../packages/ui/src/styles/motion.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
