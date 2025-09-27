import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@oursynth/ui': '/packages/ui/src',
      '@oursynth/ui/components': '/packages/ui/src/components',
      '@ui': '/packages/ui',
      '@ui/components': '/packages/ui/components'
    }
  }
});
