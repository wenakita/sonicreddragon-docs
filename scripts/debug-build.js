#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Set higher memory limit for Node
process.env.NODE_OPTIONS = '--max-old-space-size=8192';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

console.log(`${colors.blue}${colors.bold}=== Docusaurus Debug Build ====${colors.reset}`);

// Check environment
console.log(`\n${colors.yellow}Checking environment:${colors.reset}`);
try {
  const nodeVersion = execSync('node --version').toString().trim();
  console.log(`- Node.js version: ${nodeVersion}`);
  
  const npmVersion = execSync('npm --version').toString().trim();
  console.log(`- npm version: ${npmVersion}`);
  
  console.log(`- Current directory: ${process.cwd()}`);
} catch (error) {
  console.error(`${colors.red}Failed to check environment: ${error.message}${colors.reset}`);
}

// Check package.json
console.log(`\n${colors.yellow}Checking package.json:${colors.reset}`);
try {
  const packageJson = require('../package.json');
  console.log(`- Name: ${packageJson.name}`);
  console.log(`- Docusaurus version: ${packageJson.dependencies['@docusaurus/core']}`);
  console.log(`- React version: ${packageJson.dependencies.react}`);
  
  // Check for critical dependencies
  const criticalDeps = ['@docusaurus/core', '@docusaurus/preset-classic', 'react', 'react-dom'];
  const missingDeps = criticalDeps.filter(dep => !packageJson.dependencies[dep]);
  
  if (missingDeps.length > 0) {
    console.error(`${colors.red}Missing critical dependencies: ${missingDeps.join(', ')}${colors.reset}`);
  } else {
    console.log(`${colors.green}- All critical dependencies present${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}Failed to check package.json: ${error.message}${colors.reset}`);
}

// Check for common config errors
console.log(`\n${colors.yellow}Checking for common config errors:${colors.reset}`);
try {
  // Check if docusaurus.config.js/ts exists
  const configFiles = ['docusaurus.config.js', 'docusaurus.config.ts']
    .filter(file => fs.existsSync(path.join(process.cwd(), '..', file)));
  
  if (configFiles.length === 0) {
    console.error(`${colors.red}No docusaurus.config.js or docusaurus.config.ts found${colors.reset}`);
  } else {
    console.log(`${colors.green}- Found config file: ${configFiles[0]}${colors.reset}`);
  }
  
  // Check if sidebars.js/ts exists
  const sidebarFiles = ['sidebars.js', 'sidebars.ts']
    .filter(file => fs.existsSync(path.join(process.cwd(), '..', file)));
  
  if (sidebarFiles.length === 0) {
    console.warn(`${colors.yellow}Warning: No sidebars.js or sidebars.ts found${colors.reset}`);
  } else {
    console.log(`${colors.green}- Found sidebar file: ${sidebarFiles[0]}${colors.reset}`);
  }
  
  // Check for /docs directory
  if (!fs.existsSync(path.join(process.cwd(), '..', 'docs'))) {
    console.error(`${colors.red}No /docs directory found${colors.reset}`);
  } else {
    console.log(`${colors.green}- Found /docs directory${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}Failed during config check: ${error.message}${colors.reset}`);
}

// Try to run a build with verbose output
console.log(`\n${colors.yellow}Running Docusaurus build with debugging:${colors.reset}`);
try {
  console.log('Building... (this may take a while)');
  execSync('npx docusaurus build --out-dir=debug-build', { 
    stdio: 'inherit',
    env: { ...process.env, DEBUG: 'docusaurus:*' }
  });
  console.log(`${colors.green}Build completed successfully!${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}Build failed with error:${colors.reset}`);
  console.error(error.message);
  
  // Provide troubleshooting advice
  console.log(`\n${colors.yellow}Troubleshooting suggestions:${colors.reset}`);
  console.log(`1. Try clearing the cache: ${colors.bold}npm run clear${colors.reset}`);
  console.log(`2. Check your import statements for typos`);
  console.log(`3. Verify all plugin configurations in docusaurus.config.js`);
  console.log(`4. Check for MDX syntax errors in your documentation files`);
  
  process.exit(1);
}

console.log(`\n${colors.green}${colors.bold}Debug build completed successfully!${colors.reset}`); 