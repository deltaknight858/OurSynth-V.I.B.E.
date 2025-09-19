#!/usr/bin/env node
/**
 * ci-guard-svg-checklist.mjs
 * CI guard for svg:checklist coverage.
 * Ensures icon checklist is up-to-date and comprehensive.
 */
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const ROOT = process.cwd();
const CHECKLIST_FILE = path.join(ROOT, 'docs', 'assets', 'ICON_CHECKLIST.md');
const ICONS_DIR = path.join(ROOT, 'components', 'icons');

async function checkSvgChecklistCoverage() {
  console.log('🔍 Checking svg:checklist coverage...');
  
  // Check if icons directory exists
  if (!fs.existsSync(ICONS_DIR)) {
    console.log('✅ No icons directory found - checklist not required');
    return;
  }

  // Get current icon files
  const iconFiles = fs.readdirSync(ICONS_DIR).filter(f => f.endsWith('.tsx'));
  
  if (iconFiles.length === 0) {
    console.log('✅ No icon files found - checklist coverage OK');
    return;
  }

  // Ensure checklist exists
  if (!fs.existsSync(CHECKLIST_FILE)) {
    console.log('❌ Icon checklist not found. Generating...');
    try {
      await execAsync('npm run svg:checklist');
      console.log('✅ Icon checklist generated. Please commit the generated file.');
      process.exit(1); // Exit with error to require commit
    } catch (error) {
      console.error('❌ Failed to generate icon checklist:', error.message);
      process.exit(1);
    }
  }

  // Check if checklist is up-to-date
  try {
    const beforeGenerate = fs.readFileSync(CHECKLIST_FILE, 'utf8');
    await execAsync('npm run svg:checklist');
    const afterGenerate = fs.readFileSync(CHECKLIST_FILE, 'utf8');
    
    if (beforeGenerate !== afterGenerate) {
      console.log('❌ Icon checklist is out-of-date!');
      console.log('This indicates that icon components have been modified but checklist is stale.');
      console.log('Please run: npm run svg:checklist');
      console.log('Then commit the updated ICON_CHECKLIST.md file.');
      process.exit(1);
    }
    
    // Check coverage - ensure all icon files are in checklist
    const checklistContent = fs.readFileSync(CHECKLIST_FILE, 'utf8');
    const missingIcons = iconFiles.filter(file => !checklistContent.includes(file));
    
    if (missingIcons.length > 0) {
      console.log('❌ Icon checklist missing coverage for:', missingIcons);
      console.log('Please run: npm run svg:checklist');
      process.exit(1);
    }
    
    console.log(`✅ Icon checklist is up-to-date and covers all ${iconFiles.length} icon(s)`);
  } catch (error) {
    console.error('❌ Error checking icon checklist:', error.message);
    process.exit(1);
  }
}

checkSvgChecklistCoverage();