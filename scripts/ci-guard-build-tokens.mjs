#!/usr/bin/env node
/**
 * ci-guard-build-tokens.mjs
 * CI guard for build_tokens.mjs output diff.
 * Ensures token build output is consistent and up-to-date.
 */
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const ROOT = process.cwd();
const BUILD_OUTPUT = path.join(ROOT, 'docs', 'generated', 'tokens-build.json');

async function checkTokenBuildDiff() {
  console.log('🔍 Checking build_tokens.mjs output diff...');
  
  // First, ensure the build output exists
  if (!fs.existsSync(BUILD_OUTPUT)) {
    console.log('❌ Token build output not found. Running build_tokens.mjs...');
    try {
      await execAsync('node scripts/build_tokens.mjs');
      console.log('✅ Token build completed. Please commit the generated file.');
      process.exit(1); // Exit with error to require commit
    } catch (error) {
      console.error('❌ Failed to build tokens:', error.message);
      process.exit(1);
    }
  }

  // Check if current state matches build output
  try {
    const beforeBuild = fs.readFileSync(BUILD_OUTPUT, 'utf8');
    await execAsync('node scripts/build_tokens.mjs');
    const afterBuild = fs.readFileSync(BUILD_OUTPUT, 'utf8');
    
    // Parse and compare structure, ignoring timestamp
    const before = JSON.parse(beforeBuild);
    const after = JSON.parse(afterBuild);
    
    // Remove timestamps for comparison
    delete before.generated;
    delete after.generated;
    
    if (JSON.stringify(before) !== JSON.stringify(after)) {
      console.log('❌ Token build output has changed!');
      console.log('This indicates that tokens have been modified but build output is not up-to-date.');
      console.log('Please run: npm run labs:tokens');
      console.log('Then commit the updated tokens-build.json file.');
      process.exit(1);
    }
    
    console.log('✅ Token build output is up-to-date');
  } catch (error) {
    console.error('❌ Error checking token build diff:', error.message);
    process.exit(1);
  }
}

checkTokenBuildDiff();