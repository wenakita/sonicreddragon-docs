#!/usr/bin/env node

/**
 * Package Documentation Files
 * 
 * This script creates a zip file containing all the Markdown documentation files
 * from the docs and docs-new directories.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 PACKAGING DOCUMENTATION FILES');
console.log('===============================\n');

// Configuration
const config = {
  outputDir: '.',
  outputFile: 'docusaurus-documentation.zip',
  directories: [
    'docs'
  ],
  fileExtensions: ['.md', '.mdx']
};

// Find all Markdown files in a directory recursively
function findMarkdownFiles(dir) {
  console.log(`Searching for Markdown files in ${dir}...`);
  
  const files = [];
  
  function traverseDir(currentPath, relativePath = '') {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relativeFull = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        traverseDir(fullPath, relativeFull);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (config.fileExtensions.includes(ext)) {
          files.push({
            fullPath,
            relativePath: relativeFull
          });
        }
      }
    }
  }
  
  traverseDir(dir, path.basename(dir));
  
  console.log(`  ✅ Found ${files.length} Markdown files in ${dir}`);
  
  return files;
}

// Create a temporary directory for the files
function createTempDir() {
  console.log('\nCreating temporary directory...');
  
  const tempDir = path.join(config.outputDir, 'temp-docs-package');
  
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
    const targetDir = path.join(tempDir, path.dirname(file.relativePath));
    fs.mkdirSync(targetDir, { recursive: true });
    
    // Copy the file
    const targetFile = path.join(tempDir, file.relativePath);
    fs.copyFileSync(file.fullPath, targetFile);
  }
  
  console.log(`  ✅ Copied ${files.length} files`);
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
  
  const manifestFile = path.join(tempDir, 'DOCUMENTATION_MANIFEST.md');
  
  // Group files by directory
  const filesByDir = {};
  
  for (const file of files) {
    const dir = path.dirname(file.relativePath);
    
    if (!filesByDir[dir]) {
      filesByDir[dir] = [];
    }
    
    filesByDir[dir].push(file.relativePath);
  }
  
  // Create the manifest content
  let content = `# Docusaurus Documentation Manifest

This package contains ${files.length} Markdown documentation files from the following directories:

${config.directories.map(dir => `- \`${dir}\``).join('\n')}

## Files by Directory

`;

  // Add files by directory
  for (const dir in filesByDir) {
    content += `### ${dir}\n\n`;
    
    for (const file of filesByDir[dir]) {
      content += `- \`${file}\`\n`;
    }
    
    content += '\n';
  }
  
  content += `## Created On

${new Date().toLocaleString()}
`;
  
  fs.writeFileSync(manifestFile, content);
  
  console.log(`  ✅ Created manifest file: ${manifestFile}`);
  
  // Add the manifest file to the list of files
  files.push({
    fullPath: manifestFile,
    relativePath: 'DOCUMENTATION_MANIFEST.md'
  });
  
  return files;
}

// Main function
function main() {
  console.log('Starting to package documentation files...\n');
  
  // Find all Markdown files
  let allFiles = [];
  
  for (const dir of config.directories) {
    if (fs.existsSync(dir)) {
      const files = findMarkdownFiles(dir);
      allFiles = [...allFiles, ...files];
    } else {
      console.log(`  ⚠️ Directory not found: ${dir}`);
    }
  }
  
  if (allFiles.length === 0) {
    console.error('\n❌ No Markdown files found in the specified directories.');
    return;
  }
  
  // Create a temporary directory
  const tempDir = createTempDir();
  
  // Create a manifest file
  allFiles = createManifest(allFiles, tempDir);
  
  // Copy files to the temporary directory
  copyFiles(allFiles, tempDir);
  
  // Create a zip file
  const success = createZipFile(tempDir);
  
  // Clean up the temporary directory
  cleanUp(tempDir);
  
  if (success) {
    console.log('\n🎉 Documentation files packaged successfully!');
    console.log(`\nThe package is available at: ${path.join(config.outputDir, config.outputFile)}`);
    console.log(`\nTotal files packaged: ${allFiles.length - 1} documentation files + 1 manifest file`);
    console.log('\nTo download the package, use one of the following methods:');
    console.log('\n1. Use the download button in your editor');
    console.log('2. Use scp to copy the file to your local machine:');
    console.log(`   scp user@server:${path.join(process.cwd(), config.outputFile)} /local/path/`);
    console.log('3. Use a file transfer tool like FileZilla or WinSCP');
  } else {
    console.log('\n❌ Failed to package documentation files.');
    console.log('\nPlease try one of the following methods to download the files:');
    console.log('\n1. Download each file individually using your editor');
    console.log('2. Use scp to copy the files to your local machine:');
    console.log('   scp -r user@server:/path/to/files /local/path/');
    console.log('3. Use a file transfer tool like FileZilla or WinSCP');
  }
}

// Run the main function
main();
