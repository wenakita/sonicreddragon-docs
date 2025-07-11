#!/usr/bin/env node

/**
 * Create Documentation Package
 * 
 * This script creates a zip file containing all the relevant documentation files
 * and scripts created for fixing Mermaid diagrams and broken links.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 CREATING DOCUMENTATION PACKAGE');
console.log('================================\n');

// Configuration
const config = {
  outputDir: '.',
  outputFile: 'documentation-package.zip',
  files: [
    // Gemini prompt files
    'SOLUTION_PRESENTATION.md',
    'SYSTEM_INFORMATION.md',
    'GEMINI_APP_PROMPT.md',
    'GEMINI_WEB_APP_PROMPT.md',
    'COMPLETE_GEMINI_GUIDE.md',
    
    // Documentation and guides
    'MERMAID_FIX_REQUIREMENTS.md',
    'MERMAID_FIX_USAGE_GUIDE.md',
    'ANIME_JS_INTEGRATION_GUIDE.md',
    
    // Scripts
    'scripts/fix-broken-links.js',
    'scripts/mermaid-diagram-fixer.js',
    'scripts/update-mermaid-config.js',
    'scripts/fix-all-docs-issues.js',
    
    // Client modules
    'src/clientModules/optimizedMermaidInit.js',
    'src/clientModules/mermaidAnimations.js',
    'src/clientModules/mermaidAnimeIntegration.js',
    
    // CSS
    'src/css/mermaid-animations.css',
    
    // Example documentation files
    'docs-new/concepts/overview.md',
    'docs-new/concepts/architecture.md',
    'docs-new/concepts/randomness.md'
  ]
};

// Check if files exist
function checkFiles() {
  console.log('Checking files...');
  
  const missingFiles = [];
  
  for (const file of config.files) {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    }
  }
  
  if (missingFiles.length > 0) {
    console.log('\n⚠️ The following files are missing:');
    missingFiles.forEach(file => console.log(`  - ${file}`));
    console.log('\nThese files will be excluded from the package.');
  } else {
    console.log('  ✅ All files exist');
  }
  
  // Filter out missing files
  return config.files.filter(file => !missingFiles.includes(file));
}

// Create a temporary directory for the files
function createTempDir() {
  console.log('\nCreating temporary directory...');
  
  const tempDir = path.join(config.outputDir, 'temp-package');
  
  // Remove the directory if it exists
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  
  // Create the directory
  fs.mkdirSync(tempDir, { recursive: true });
  
  console.log(`  ✅ Created temporary directory: ${tempDir}`);
  
  return tempDir;
}

// Copy files to the temporary directory
function copyFiles(files, tempDir) {
  console.log('\nCopying files to temporary directory...');
  
  for (const file of files) {
    // Create the directory structure
    const targetDir = path.join(tempDir, path.dirname(file));
    fs.mkdirSync(targetDir, { recursive: true });
    
    // Copy the file
    const targetFile = path.join(tempDir, file);
    fs.copyFileSync(file, targetFile);
    
    console.log(`  ✅ Copied ${file}`);
  }
}

// Create a zip file
function createZipFile(tempDir) {
  console.log('\nCreating zip file...');
  
  const outputFile = path.join(config.outputDir, config.outputFile);
  
  // Remove the zip file if it exists
  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
  }
  
  try {
    // Create the zip file
    execSync(`cd ${tempDir} && zip -r ${path.join('..', config.outputFile)} .`, { stdio: 'inherit' });
    console.log(`  ✅ Created zip file: ${outputFile}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error creating zip file: ${error.message}`);
    
    // Try using a different zip command if available
    try {
      console.log('  ⚠️ Trying alternative zip method...');
      execSync(`cd ${tempDir} && find . -type f | xargs zip ${path.join('..', config.outputFile)}`, { stdio: 'inherit' });
      console.log(`  ✅ Created zip file: ${outputFile}`);
      return true;
    } catch (error) {
      console.error(`  ❌ Error creating zip file: ${error.message}`);
      return false;
    }
  }
}

// Clean up the temporary directory
function cleanUp(tempDir) {
  console.log('\nCleaning up...');
  
  fs.rmSync(tempDir, { recursive: true, force: true });
  
  console.log(`  ✅ Removed temporary directory: ${tempDir}`);
}

// Create a manifest file
function createManifest(files, tempDir) {
  console.log('\nCreating manifest file...');
  
  const manifestFile = path.join(tempDir, 'MANIFEST.md');
  
  const content = `# Documentation Package Manifest

This package contains the following files:

${files.map(file => `- \`${file}\``).join('\n')}

## File Categories

### Gemini Prompt Files
- \`SOLUTION_PRESENTATION.md\`: Overview of the problem and solution
- \`SYSTEM_INFORMATION.md\`: Details about the environment
- \`GEMINI_APP_PROMPT.md\`: Prompt for building a general-purpose application
- \`GEMINI_WEB_APP_PROMPT.md\`: Prompt for building a web application
- \`COMPLETE_GEMINI_GUIDE.md\`: Step-by-step guide for working with Gemini

### Documentation and Guides
- \`MERMAID_FIX_REQUIREMENTS.md\`: Requirements for fixing Mermaid diagrams
- \`MERMAID_FIX_USAGE_GUIDE.md\`: Guide for using the Mermaid fix components
- \`ANIME_JS_INTEGRATION_GUIDE.md\`: Guide for using anime.js with Mermaid diagrams

### Scripts
- \`scripts/fix-broken-links.js\`: Script for fixing broken links
- \`scripts/mermaid-diagram-fixer.js\`: Script for fixing Mermaid diagrams
- \`scripts/update-mermaid-config.js\`: Script for updating Docusaurus configuration
- \`scripts/fix-all-docs-issues.js\`: Script for fixing all documentation issues

### Client Modules
- \`src/clientModules/optimizedMermaidInit.js\`: Optimized Mermaid initialization
- \`src/clientModules/mermaidAnimations.js\`: CSS-based animations for Mermaid diagrams
- \`src/clientModules/mermaidAnimeIntegration.js\`: Anime.js integration for Mermaid diagrams

### CSS
- \`src/css/mermaid-animations.css\`: CSS for Mermaid animations

### Example Documentation Files
- \`docs-new/concepts/overview.md\`: Example documentation file
- \`docs-new/concepts/architecture.md\`: Example documentation file
- \`docs-new/concepts/randomness.md\`: Example documentation file

## Usage

1. Extract the zip file
2. Follow the instructions in \`COMPLETE_GEMINI_GUIDE.md\` to use Gemini to build your application
3. Use the scripts in the \`scripts\` directory to fix documentation issues

## Created On

${new Date().toLocaleString()}
`;
  
  fs.writeFileSync(manifestFile, content);
  
  console.log(`  ✅ Created manifest file: ${manifestFile}`);
  
  // Add the manifest file to the list of files
  return [...files, 'MANIFEST.md'];
}

// Main function
function main() {
  console.log('Starting to create documentation package...\n');
  
  // Check if files exist
  const files = checkFiles();
  
  // Create a temporary directory
  const tempDir = createTempDir();
  
  // Create a manifest file
  const allFiles = createManifest(files, tempDir);
  
  // Copy files to the temporary directory
  copyFiles(files, tempDir);
  
  // Create a zip file
  const success = createZipFile(tempDir);
  
  // Clean up the temporary directory
  cleanUp(tempDir);
  
  if (success) {
    console.log('\n🎉 Documentation package created successfully!');
    console.log(`\nThe package is available at: ${path.join(config.outputDir, config.outputFile)}`);
    console.log('\nTo download the package, use one of the following methods:');
    console.log('\n1. Use the download button in your editor');
    console.log('2. Use scp to copy the file to your local machine:');
    console.log(`   scp user@server:${path.join(process.cwd(), config.outputFile)} /local/path/`);
    console.log('3. Use a file transfer tool like FileZilla or WinSCP');
  } else {
    console.log('\n❌ Failed to create documentation package.');
    console.log('\nPlease try one of the following methods to download the files:');
    console.log('\n1. Download each file individually using your editor');
    console.log('2. Use scp to copy the files to your local machine:');
    console.log('   scp -r user@server:/path/to/files /local/path/');
    console.log('3. Use a file transfer tool like FileZilla or WinSCP');
  }
}

// Run the main function
main();
