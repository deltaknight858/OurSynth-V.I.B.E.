// ESM re-exports for tool registry
export { capsuleTools as toolsCapsule } from './tools.capsule.js';
import { capsuleTools } from './tools.capsule.js';
export const tools = [
  // ...existing tools
  ...capsuleTools
];