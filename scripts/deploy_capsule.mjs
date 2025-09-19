#!/usr/bin/env node
// Stub deploy script. Accepts args: <filePath> <env>
const [, , filePath, env] = process.argv;
if (!filePath || !env) {
  console.error('Usage: pnpm deploy:capsule <filePath> <env>');
  process.exit(2);
}
console.log(`[deploy_capsule] Received capsule ${filePath} -> env=${env}`);
// TODO: Unpack, run manifest steps, and promote. For now, succeed.
process.exit(0);
