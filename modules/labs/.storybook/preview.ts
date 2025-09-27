// Global preview file for Storybook: load shared styles used by many stories
import '../packages/ui/src/styles/glass.css';
import '../packages/ui/src/styles/neon.css';
import '../packages/ui/src/styles/motion.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: { expanded: true },
};
