#!/usr/bin/env node

/**
 * Pre-deployment checker script
 * Runs several checks to ensure the site will deploy correctly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colorful output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

console.log(`${colors.blue}${colors.bold}===== Docusaurus Pre-Deployment Check =====${colors.reset}\n`);

// Track if we encounter any errors
let hasErrors = false;
let warnings = 0;

// Helper function to check if file exists
function fileExists(filepath) {
  try {
    return fs.existsSync(filepath);
  } catch (err) {
    return false;
  }
}

// Check config file
console.log(`${colors.cyan}Checking configuration files...${colors.reset}`);
const configPath = path.join(__dirname, '..', 'docusaurus.config.ts');
const sidebarPath = path.join(__dirname, '..', 'sidebars.ts');

if (!fileExists(configPath)) {
  console.error(`${colors.red}ERROR: docusaurus.config.ts not found${colors.reset}`);
  hasErrors = true;
} else {
  console.log(`${colors.green}✓ docusaurus.config.ts found${colors.reset}`);
}

if (!fileExists(sidebarPath)) {
  console.warn(`${colors.yellow}WARNING: sidebars.ts not found${colors.reset}`);
  warnings++;
} else {
  console.log(`${colors.green}✓ sidebars.ts found${colors.reset}`);
}

// Check for required directories
console.log(`\n${colors.cyan}Checking required directories...${colors.reset}`);
const docsDir = path.join(__dirname, '..', 'docs');
const srcDir = path.join(__dirname, '..', 'src');
const staticDir = path.join(__dirname, '..', 'static');

if (!fileExists(docsDir)) {
  console.error(`${colors.red}ERROR: docs directory not found${colors.reset}`);
  hasErrors = true;
} else {
  console.log(`${colors.green}✓ docs directory found${colors.reset}`);
}

if (!fileExists(srcDir)) {
  console.error(`${colors.red}ERROR: src directory not found${colors.reset}`);
  hasErrors = true;
} else {
  console.log(`${colors.green}✓ src directory found${colors.reset}`);
}

// Check for custom components that might cause issues
console.log(`\n${colors.cyan}Checking custom components...${colors.reset}`);
const mermaidComponents = [
  path.join(__dirname, '..', 'src/components/StandardMermaid.jsx'),
  path.join(__dirname, '..', 'src/components/StandardMermaid.tsx'),
  path.join(__dirname, '..', 'src/components/EnhancedMermaid.jsx'),
  path.join(__dirname, '..', 'src/components/EnhancedMermaid.tsx')
];

let foundMermaid = false;
for (const file of mermaidComponents) {
  if (fileExists(file)) {
    console.log(`${colors.green}✓ Found Mermaid component: ${path.basename(file)}${colors.reset}`);
    foundMermaid = true;
  }
}

// Check custom clientModules
console.log(`\n${colors.cyan}Checking client modules...${colors.reset}`);
const clientModules = [
  path.join(__dirname, '..', 'src/clientModules/mermaidInit.js'),
  path.join(__dirname, '..', 'src/clientModules/animeInitializer.js')
];

for (const module of clientModules) {
  if (fileExists(module)) {
    console.log(`${colors.green}✓ Found client module: ${path.basename(module)}${colors.reset}`);
  } else {
    console.warn(`${colors.yellow}WARNING: Missing client module: ${path.basename(module)}${colors.reset}`);
    warnings++;
  }
}

// Check for images in static directory
console.log(`\n${colors.cyan}Checking static assets...${colors.reset}`);
if (fileExists(staticDir)) {
  const imgDir = path.join(staticDir, 'img');
  if (fileExists(imgDir)) {
    const imgFiles = fs.readdirSync(imgDir);
    console.log(`${colors.green}✓ Found ${imgFiles.length} files in static/img directory${colors.reset}`);
  } else {
    console.warn(`${colors.yellow}WARNING: No img directory in static folder${colors.reset}`);
    warnings++;
  }
  
  // Check for favicon
  const faviconPath = path.join(imgDir, 'favicon-32x32.png');
  if (!fileExists(faviconPath)) {
    console.warn(`${colors.yellow}WARNING: favicon-32x32.png not found in static/img${colors.reset}`);
    warnings++;
  } else {
    console.log(`${colors.green}✓ favicon found${colors.reset}`);
  }
} else {
  console.warn(`${colors.yellow}WARNING: static directory not found${colors.reset}`);
  warnings++;
}

// Try TypeScript compilation check
console.log(`\n${colors.cyan}Running TypeScript check...${colors.reset}`);
try {
  execSync('npm run typecheck', { stdio: 'pipe', cwd: path.join(__dirname, '..') });
  console.log(`${colors.green}✓ TypeScript check passed${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}ERROR: TypeScript check failed${colors.reset}`);
  console.error(error.stdout?.toString() || error.message);
  hasErrors = true;
}

// Summary
console.log(`\n${colors.blue}${colors.bold}===== Check Summary =====${colors.reset}`);
if (hasErrors) {
  console.error(`${colors.red}${colors.bold}✗ Critical errors found that will prevent successful deployment${colors.reset}`);
  process.exit(1);
} else if (warnings > 0) {
  console.log(`${colors.yellow}⚠ ${warnings} warnings found - deployment might have issues${colors.reset}`);
  process.exit(0);
} else {
  console.log(`${colors.green}${colors.bold}✓ All checks passed! Ready for deployment.${colors.reset}`);
  process.exit(0);
} 