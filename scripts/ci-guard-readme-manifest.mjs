#!/usr/bin/env node
/**
 * ci-guard-readme-manifest.mjs
 * CI guard for README presence and manifest sync.
 * Ensures READMEs exist where required and package manifests are in sync.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

// Directories that should have READMEs
const README_REQUIRED_DIRS = [
  'packages',
  'docs',
  'components',
  'import-staging'
];

// Package.json fields that should be consistent
const MANIFEST_FIELDS_TO_CHECK = [
  'author',
  'license',
  'repository',
  'bugs',
  'homepage'
];

function findDirectories(dir, acc = []) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  
  for (const e of entries) {
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
      const full = path.join(dir, e.name);
      acc.push(full);
      findDirectories(full, acc);
    }
  }
  return acc;
}

function checkReadmePresence() {
  const issues = [];
  
  for (const requiredDir of README_REQUIRED_DIRS) {
    const fullPath = path.join(ROOT, requiredDir);
    if (!fs.existsSync(fullPath)) continue;
    
    // Check if main directory has README
    const readmeFiles = ['README.md', 'README.txt', 'readme.md', 'readme.txt'];
    const hasReadme = readmeFiles.some(readme => fs.existsSync(path.join(fullPath, readme)));
    
    if (!hasReadme) {
      issues.push({
        type: 'missing-readme',
        path: requiredDir,
        message: `Missing README in required directory: ${requiredDir}`,
        fix: 'Add a README.md file with documentation'
      });
    }
    
    // Check subdirectories for packages
    if (requiredDir === 'packages') {
      const subdirs = fs.readdirSync(fullPath, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
      
      for (const subdir of subdirs) {
        const subdirPath = path.join(fullPath, subdir);
        const hasSubReadme = readmeFiles.some(readme => fs.existsSync(path.join(subdirPath, readme)));
        
        if (!hasSubReadme) {
          issues.push({
            type: 'missing-package-readme',
            path: `${requiredDir}/${subdir}`,
            message: `Missing README in package: ${requiredDir}/${subdir}`,
            fix: 'Add a README.md file documenting the package'
          });
        }
      }
    }
  }
  
  return issues;
}

function findPackageJsonFiles() {
  const packageFiles = [];
  
  function search(dir) {
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isFile() && e.name === 'package.json') {
        packageFiles.push(full);
      } else if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
        search(full);
      }
    }
  }
  
  search(ROOT);
  return packageFiles;
}

function checkManifestSync() {
  const issues = [];
  const packageFiles = findPackageJsonFiles();
  
  if (packageFiles.length === 0) {
    return issues;
  }
  
  // Read root package.json as reference
  const rootPackagePath = path.join(ROOT, 'package.json');
  if (!fs.existsSync(rootPackagePath)) {
    issues.push({
      type: 'missing-root-package',
      path: 'package.json',
      message: 'Root package.json not found',
      fix: 'Create a root package.json file'
    });
    return issues;
  }
  
  const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
  
  // Check each package manifest
  for (const packagePath of packageFiles) {
    if (packagePath === rootPackagePath) continue;
    
    try {
      const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const relativePath = path.relative(ROOT, packagePath);
      
      // Check for required fields
      const missingFields = MANIFEST_FIELDS_TO_CHECK.filter(field => {
        return rootPackage[field] && !packageData[field];
      });
      
      if (missingFields.length > 0) {
        issues.push({
          type: 'missing-manifest-fields',
          path: relativePath,
          message: `Missing fields in ${relativePath}: ${missingFields.join(', ')}`,
          fix: 'Sync with root package.json fields'
        });
      }
      
      // Check for field consistency where they exist
      for (const field of MANIFEST_FIELDS_TO_CHECK) {
        if (rootPackage[field] && packageData[field] && packageData[field] !== rootPackage[field]) {
          // Allow different repository URLs for packages in monorepos
          if (field === 'repository' && typeof packageData[field] === 'object') {
            continue;
          }
          
          issues.push({
            type: 'inconsistent-manifest-field',
            path: relativePath,
            message: `Inconsistent ${field} in ${relativePath}`,
            fix: `Should match root package.json: ${rootPackage[field]}`
          });
        }
      }
      
      // Check for package-specific requirements
      if (packageData.private === false || packageData.publishConfig) {
        // Public packages should have additional fields
        const requiredPublicFields = ['description', 'version', 'main'];
        const missingPublicFields = requiredPublicFields.filter(field => !packageData[field]);
        
        if (missingPublicFields.length > 0) {
          issues.push({
            type: 'missing-public-package-fields',
            path: relativePath,
            message: `Public package missing fields: ${missingPublicFields.join(', ')}`,
            fix: 'Add required fields for public packages'
          });
        }
      }
      
    } catch (error) {
      issues.push({
        type: 'invalid-package-json',
        path: path.relative(ROOT, packagePath),
        message: `Invalid package.json: ${error.message}`,
        fix: 'Fix JSON syntax errors'
      });
    }
  }
  
  return issues;
}

function checkReadmeManifestCompliance() {
  console.log('🔍 Checking README presence and manifest sync...');
  
  const readmeIssues = checkReadmePresence();
  const manifestIssues = checkManifestSync();
  const allIssues = [...readmeIssues, ...manifestIssues];
  
  if (allIssues.length > 0) {
    console.log('❌ README and manifest issues found:');
    
    const issuesByType = {};
    allIssues.forEach(issue => {
      if (!issuesByType[issue.type]) {
        issuesByType[issue.type] = [];
      }
      issuesByType[issue.type].push(issue);
    });
    
    // Report README issues
    const readmeTypes = ['missing-readme', 'missing-package-readme'];
    readmeTypes.forEach(type => {
      if (issuesByType[type]) {
        console.log(`\n📚 README Issues:`);
        issuesByType[type].forEach(issue => {
          console.log(`  • ${issue.message}`);
          console.log(`    Fix: ${issue.fix}`);
        });
      }
    });
    
    // Report manifest issues
    const manifestTypes = ['missing-root-package', 'missing-manifest-fields', 'inconsistent-manifest-field', 'missing-public-package-fields', 'invalid-package-json'];
    manifestTypes.forEach(type => {
      if (issuesByType[type]) {
        console.log(`\n📦 Manifest Issues:`);
        issuesByType[type].forEach(issue => {
          console.log(`  • ${issue.message}`);
          console.log(`    Fix: ${issue.fix}`);
        });
      }
    });
    
    console.log(`\nTotal issues: ${allIssues.length}`);
    console.log('\nRecommendations:');
    console.log('• Add README.md files to all packages and major directories');
    console.log('• Ensure package.json files have consistent metadata');
    console.log('• Use proper semantic versioning for packages');
    console.log('• Document APIs and usage in README files');
    
    process.exit(1);
  }
  
  const packageCount = findPackageJsonFiles().length;
  console.log(`✅ README and manifest compliance verified (${packageCount} packages checked)`);
}

checkReadmeManifestCompliance();