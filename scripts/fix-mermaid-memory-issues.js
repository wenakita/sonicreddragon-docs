/**
 * Fix Mermaid Memory Issues Script
 * 
 * This script addresses memory issues during the build process by:
 * 1. Temporarily disabling interactive Mermaid diagrams
 * 2. Simplifying problematic Mermaid files
 * 3. Creating a build script with extreme memory optimization
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting to fix Mermaid memory issues...');

// Create backup directory if it doesn't exist
const backupDir = path.join(__dirname, '..', 'backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`Created backup directory: ${backupDir}`);
}

// 1. Backup and temporarily disable mermaidInteractiveModule.js
const mermaidInteractiveModulePath = path.join(__dirname, '..', 'src', 'clientModules', 'mermaidInteractiveModule.js');
const mermaidInteractiveModuleBackupPath = path.join(backupDir, 'mermaidInteractiveModule.js.backup');

console.log('Backing up and temporarily disabling mermaidInteractiveModule.js...');
fs.copyFileSync(mermaidInteractiveModulePath, mermaidInteractiveModuleBackupPath);

// Create a simplified version that doesn't do anything
const simplifiedMermaidInteractiveModule = `/**
 * Temporarily Disabled Mermaid Interactive Module
 * 
 * This module is temporarily disabled to reduce memory usage during the build process.
 */

// ExecutionEnvironment is not needed in Node.js scripts
// const ExecutionEnvironment = require('@docusaurus/ExecutionEnvironment');

// Node.js script - no browser environment check needed
// Do nothing during build
console.log('Mermaid interactive features temporarily disabled for build');
}

export function onRouteDidUpdate({ location, previousLocation }) {
// Do nothing
}
`;

fs.writeFileSync(mermaidInteractiveModulePath, simplifiedMermaidInteractiveModule);
console.log('Temporarily disabled mermaidInteractiveModule.js');

// 2. Backup and simplify problematic Mermaid files
const problematicFiles = [
{
  path: path.join(__dirname, '..', 'docs', 'MERMAID_INTERACTIVE_ENHANCEMENT_REPORT.md'),
  backupPath: path.join(backupDir, 'MERMAID_INTERACTIVE_ENHANCEMENT_REPORT.md.backup')
},
{
  path: path.join(__dirname, '..', 'docs', 'test-interactive-mermaid.md'),
  backupPath: path.join(backupDir, 'test-interactive-mermaid.md.backup')
}
];

console.log('Backing up and simplifying problematic Mermaid files...');
problematicFiles.forEach(file => {
if (fs.existsSync(file.path)) {
  // Backup the file
  fs.copyFileSync(file.path, file.backupPath);
  
  // Read the file content
  let content = fs.readFileSync(file.path, 'utf8');
  
  // Simplify the file by removing Mermaid diagrams
  content = content.replace(/```mermaid[\s\S]*?```/g, '```\nMermaid diagram temporarily removed for build\n```');
  
  // Remove immersive diagrams
  content = content.replace(/<div data-immersive>[\s\S]*?<\/div>/g, '<div>Immersive diagram temporarily removed for build</div>');
  
  // Write the simplified content
  fs.writeFileSync(file.path, content);
  
  console.log(`Simplified ${file.path}`);
}
});

// 3. Create an extreme memory optimization build script
console.log('Creating extreme memory optimization build script...');

const extremeBuildScriptPath = path.join(__dirname, '..', 'build-with-extreme-optimization.js');
const extremeBuildScriptContent = `/**
 * Build with Extreme Memory Optimization Script
 * 
 * This script builds the documentation with extreme memory optimization settings.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build with extreme memory optimization...');

try {
// Set environment variables to optimize the build process
process.env.NODE_OPTIONS = '--max-old-space-size=12288 --max-http-header-size=16384 --no-warnings --expose-gc';
process.env.DOCUSAURUS_WORKERS = '1'; // Reduce worker threads to minimize memory usage
process.env.DOCUSAURUS_PREFETCH_PAGES = 'false'; // Disable prefetching

// Disable certain features to reduce memory usage
process.env.DISABLE_MERMAID_INTERACTIVE = 'true';

// Run the build command with minimal features
execSync('npx docusaurus build --no-minify', { 
  stdio: 'inherit',
  env: { ...process.env }
});

console.log('Build completed successfully.');

// Restore the original files
console.log('Restoring original files...');

// Restore mermaidInteractiveModule.js
const mermaidInteractiveModulePath = path.join(__dirname, '..', 'src', 'clientModules', 'mermaidInteractiveModule.js');
const mermaidInteractiveModuleBackupPath = path.join(__dirname, '..', 'backup', 'mermaidInteractiveModule.js.backup');

if (fs.existsSync(mermaidInteractiveModuleBackupPath)) {
  fs.copyFileSync(mermaidInteractiveModuleBackupPath, mermaidInteractiveModulePath);
  console.log('Restored mermaidInteractiveModule.js');
}

// Restore problematic Mermaid files
const problematicFiles = [
  {
    path: path.join(__dirname, '..', 'docs', 'MERMAID_INTERACTIVE_ENHANCEMENT_REPORT.md'),
    backupPath: path.join(__dirname, '..', 'backup', 'MERMAID_INTERACTIVE_ENHANCEMENT_REPORT.md.backup')
  },
  {
    path: path.join(__dirname, '..', 'docs', 'test-interactive-mermaid.md'),
    backupPath: path.join(__dirname, '..', 'backup', 'test-interactive-mermaid.md.backup')
  }
];

problematicFiles.forEach(file => {
  if (fs.existsSync(file.backupPath)) {
    fs.copyFileSync(file.backupPath, file.path);
    console.log(\`Restored \${file.path}\`);
  }
});

console.log('All original files restored.');

} catch (error) {
console.error('Error building documentation:', error);

// Restore the original files even if the build fails
console.log('Restoring original files after build failure...');

// Restore mermaidInteractiveModule.js
const mermaidInteractiveModulePath = path.join(__dirname, '..', 'src', 'clientModules', 'mermaidInteractiveModule.js');
const mermaidInteractiveModuleBackupPath = path.join(__dirname, '..', 'backup', 'mermaidInteractiveModule.js.backup');

if (fs.existsSync(mermaidInteractiveModuleBackupPath)) {
  fs.copyFileSync(mermaidInteractiveModuleBackupPath, mermaidInteractiveModulePath);
  console.log('Restored mermaidInteractiveModule.js');
}

// Restore problematic Mermaid files
const problematicFiles = [
  {
    path: path.join(__dirname, '..', 'docs', 'MERMAID_INTERACTIVE_ENHANCEMENT_REPORT.md'),
    backupPath: path.join(__dirname, '..', 'backup', 'MERMAID_INTERACTIVE_ENHANCEMENT_REPORT.md.backup')
  },
  {
    path: path.join(__dirname, '..', 'docs', 'test-interactive-mermaid.md'),
    backupPath: path.join(__dirname, '..', 'backup', 'test-interactive-mermaid.md.backup')
  }
];

problematicFiles.forEach(file => {
  if (fs.existsSync(file.backupPath)) {
    fs.copyFileSync(file.backupPath, file.path);
    console.log(\`Restored \${file.path}\`);
  }
});

console.log('All original files restored.');

process.exit(1);
}
`;

fs.writeFileSync(extremeBuildScriptPath, extremeBuildScriptContent);
console.log(`Created extreme memory optimization build script at: ${extremeBuildScriptPath}`);

// 4. Update package.json to include the extreme build script
console.log('Updating package.json to include the extreme build script...');

// Read the current package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add the extreme build script if it doesn't exist
if (!packageJson.scripts['build-with-extreme-optimization']) {
packageJson.scripts['build-with-extreme-optimization'] = 'node ./build-with-extreme-optimization.js';

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('Updated package.json to include the extreme build script');
}

// 5. Create a combined fix and extreme build script
console.log('Creating combined fix and extreme build script...');

const combinedScriptPath = path.join(__dirname, '..', 'scripts', 'fix-and-build-extreme.js');
const combinedScriptContent = `/**
 * Fix and Build with Extreme Optimization Script
 * 
 * This script combines all the fixes and builds the documentation with extreme optimization settings.
 */

const { execSync } = require('child_process');

console.log('=== Starting Fix and Build with Extreme Optimization Process ===');

try {
// Step 1: Fix broken links
console.log('\\n=== Step 1: Fixing broken links ===');
execSync('npm run fix-broken-links', { stdio: 'inherit' });

// Step 2: Apply memory optimization fixes
console.log('\\n=== Step 2: Applying memory optimization fixes ===');
execSync('npm run fix-build-memory-issues', { stdio: 'inherit' });

// Step 3: Apply Mermaid memory optimization fixes
console.log('\\n=== Step 3: Applying Mermaid memory optimization fixes ===');
execSync('npm run fix-mermaid-memory-issues', { stdio: 'inherit' });

// Step 4: Clear previous build
console.log('\\n=== Step 4: Clearing previous build ===');
execSync('npm run clear', { stdio: 'inherit' });

// Step 5: Build with extreme optimization
console.log('\\n=== Step 5: Building with extreme optimization ===');
execSync('npm run build-with-extreme-optimization', { stdio: 'inherit' });

console.log('\\n=== Documentation built successfully! ===');
console.log('You can serve the built documentation with:');
console.log('npm run serve-build');

} catch (error) {
console.error('Error building documentation:', error);
process.exit(1);
}
`;

fs.writeFileSync(combinedScriptPath, combinedScriptContent);
console.log(`Created combined fix and extreme build script at: ${combinedScriptPath}`);

// 6. Update package.json to include the combined script
console.log('Updating package.json to include the combined script...');

// Read the current package.json again (it might have been updated)
const updatedPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add the combined script if it doesn't exist
if (!updatedPackageJson.scripts['fix-and-build-extreme']) {
updatedPackageJson.scripts['fix-and-build-extreme'] = 'node ./scripts/fix-and-build-extreme.js';
updatedPackageJson.scripts['fix-mermaid-memory-issues'] = 'node ./scripts/fix-mermaid-memory-issues.js';

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(updatedPackageJson, null, 2));
console.log('Updated package.json to include the combined script');
}

console.log('Finished fixing Mermaid memory issues.');
console.log('');
console.log('To build the documentation with extreme optimization, run:');
console.log('npm run fix-and-build-extreme');
