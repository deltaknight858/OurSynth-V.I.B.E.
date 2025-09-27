// .storybook/main.ts

import { mergeConfig } from 'vite';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

// If you keep this file as ESM, add: export default config;
// If using TS + NodeNext, this typed object is fine.
const config: import('@storybook/react-vite').StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // Scan root stories and monorepo packages/apps
  stories: [
    '../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../apps/**/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],

  // Order essentials (actions/controls/docs) before interactions to satisfy SB’s expectations
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],

  // Optional, but keeps docs generation predictable in SB 9
  docs: { autodocs: true },

  viteFinal: async (baseConfig) => {
    return mergeConfig(baseConfig, {
      plugins: [
        tsconfigPaths(),
      ],
      resolve: {
        alias: {
          // Common alias; adjust/remove if you don’t use '@'
          '@': path.resolve(__dirname, '../'),
          '@ui': path.resolve(__dirname, '../packages/ui'),
          // allow imports like '@halo-ui/styles/glass.css'
          '@halo-ui/styles/': path.resolve(__dirname, '../packages/ui/src/styles/') + path.sep,
          '@halo-ui/': path.resolve(__dirname, '../packages/halo-ui/') + path.sep,
        },
      },

      // Critical: let Vite’s dependency scanner (esbuild) accept JSX inside .js files
      // This resolves “The JSX syntax extension is not currently enabled” for .js stories/components
      optimizeDeps: {
        esbuildOptions: {
          loader: {
            '.js': 'jsx',
            '.tsx': 'tsx',
          },
        },
      },

      // Use the automatic JSX runtime (plays well with React 17+)
      esbuild: {
        jsx: 'automatic',
      },
    });
  },
};

export default config;
