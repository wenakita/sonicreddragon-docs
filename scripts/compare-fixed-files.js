#!/usr/bin/env node

/**
 * Compare Fixed Files
 * 
 * This script compares the original documentation files with their fixed versions
 * to identify what changes were made.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 COMPARING FIXED FILES');
console.log('=======================\n');

// Configuration
const config = {
  fixedDir: 'fixed',
  outputDir: 'comparison-reports',
  docsDirectories: ['docs', 'docs-new']
};

// Get the original path from the fixed file name
function getOriginalPath(fixedFileName) {
  // Special case for ARCHITECTURE_DIAGRAM
  if (fixedFileName === 'fixed/core_chain-registry_fixed.md') {
    return 'docs/reference/contracts/core/chain-registry.md';
  }
  
  // Remove the _fixed suffix
  const baseName = fixedFileName.replace('_fixed.md', '.md');
  
  // Replace underscores with slashes to reconstruct the path
  const parts = baseName.split('_');
  
  // The first part should be the base directory (docs or docs-new)
  const baseDir = parts[0];
  
  // The rest of the parts form the path
  const pathParts = parts.slice(1);
  
  // Try the standard path first
  const standardPath = path.join(baseDir, ...pathParts);
  if (fs.existsSync(standardPath)) {
    return standardPath;
  }
  
  // If the standard path doesn't exist, try to find the file
  for (const dir of config.docsDirectories) {
    const result = findFile(dir, path.basename(standardPath));
    if (result) {
      return result;
    }
  }
  
  // If we can't find the file, return the standard path
  return standardPath;
}

// Find a file by name in a directory recursively
function findFile(dir, fileName) {
  if (!fs.existsSync(dir)) {
    return null;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      const result = findFile(fullPath, fileName);
      if (result) {
        return result;
      }
    } else if (entry.name === fileName) {
      return fullPath;
    }
  }
  
  return null;
}

// Compare two files and generate a diff
function compareFiles(originalPath, fixedPath) {
  console.log(`Comparing ${originalPath} with ${fixedPath}...`);
  
  // Check if the original file exists
  if (!fs.existsSync(originalPath)) {
    console.log(`  ⚠️ Original file not found: ${originalPath}`);
    return {
      originalExists: false,
      fixedExists: true,
      diff: null,
      summary: `Original file not found: ${originalPath}`
    };
  }
  
  // Check if the fixed file exists
  if (!fs.existsSync(fixedPath)) {
    console.log(`  ⚠️ Fixed file not found: ${fixedPath}`);
    return {
      originalExists: true,
      fixedExists: false,
      diff: null,
      summary: `Fixed file not found: ${fixedPath}`
    };
  }
  
  // Read the files
  const originalContent = fs.readFileSync(originalPath, 'utf8');
  const fixedContent = fs.readFileSync(fixedPath, 'utf8');
  
  // If the files are identical, return early
  if (originalContent === fixedContent) {
    console.log('  ℹ️ Files are identical');
    return {
      originalExists: true,
      fixedExists: true,
      diff: '',
      summary: 'No changes were made to this file.'
    };
  }
  
  // Generate a diff
  let diff;
  try {
    diff = execSync(`diff -u "${originalPath}" "${fixedPath}"`, { encoding: 'utf8' });
  } catch (error) {
    // diff returns a non-zero exit code if files are different, which causes execSync to throw
    diff = error.stdout;
  }
  
  // Analyze the changes
  const addedLines = (diff.match(/^\+[^+]/gm) || []).length;
  const removedLines = (diff.match(/^-[^-]/gm) || []).length;
  
  console.log(`  ✅ Generated diff: ${addedLines} lines added, ${removedLines} lines removed`);
  
  // Generate a summary of changes
  let summary = `Changes made to this file:\n`;
  summary += `- ${addedLines} lines added\n`;
  summary += `- ${removedLines} lines removed\n\n`;
  
  // Check for specific types of changes
  if (diff.includes('```mermaid')) {
    summary += '- Mermaid diagram syntax was modified\n';
  }
  
  if (diff.includes('title:') || diff.includes('description:')) {
    summary += '- Frontmatter metadata was updated\n';
  }
  
  if (diff.includes('](') && diff.includes(')')) {
    summary += '- Links were updated\n';
  }
  
  return {
    originalExists: true,
    fixedExists: true,
    diff,
    summary
  };
}

// Create a comparison report
function createComparisonReport(fixedFile, result) {
  console.log(`Creating comparison report for ${fixedFile}...`);
  
  // Create the output directory if it doesn't exist
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
  
  // Generate a report file name
  const reportFileName = path.basename(fixedFile).replace('.md', '-comparison.md');
  const reportPath = path.join(config.outputDir, reportFileName);
  
  // Create the report content
  let reportContent = `# Comparison Report: ${path.basename(fixedFile)}\n\n`;
  
  if (!result.originalExists) {
    reportContent += `⚠️ **Warning**: Original file not found.\n\n`;
  }
  
  if (!result.fixedExists) {
    reportContent += `⚠️ **Warning**: Fixed file not found.\n\n`;
  }
  
  if (result.originalExists && result.fixedExists) {
    reportContent += `## Summary of Changes\n\n${result.summary}\n\n`;
    
    if (result.diff && result.diff.trim() !== '') {
      reportContent += `## Detailed Diff\n\n\`\`\`diff\n${result.diff}\n\`\`\`\n`;
    } else {
      reportContent += `No differences found between the files.\n`;
    }
  }
  
  // Write the report
  fs.writeFileSync(reportPath, reportContent);
  
  console.log(`  ✅ Created comparison report: ${reportPath}`);
  
  return reportPath;
}

// Main function
function main() {
  console.log('Starting to compare fixed files...\n');
  
  // Check if the fixed directory exists
  if (!fs.existsSync(config.fixedDir)) {
    console.error(`❌ Fixed directory not found: ${config.fixedDir}`);
    return;
  }
  
  // Get all fixed files
  const fixedFiles = fs.readdirSync(config.fixedDir)
    .filter(file => file.endsWith('_fixed.md'))
    .map(file => path.join(config.fixedDir, file));
  
  if (fixedFiles.length === 0) {
    console.log(`⚠️ No fixed files found in ${config.fixedDir}`);
    return;
  }
  
  console.log(`Found ${fixedFiles.length} fixed files:\n`);
  fixedFiles.forEach(file => console.log(`- ${file}`));
  console.log('');
  
  // Compare each fixed file with its original
  const reports = [];
  
  for (const fixedFile of fixedFiles) {
    const originalPath = getOriginalPath(path.basename(fixedFile));
    
    // Compare the files
    const result = compareFiles(originalPath, fixedFile);
    
    // Create a comparison report
    const reportPath = createComparisonReport(fixedFile, result);
    
    reports.push({
      fixedFile,
      originalPath,
      reportPath
    });
    
    console.log(''); // Add a blank line between files
  }
  
  // Print a summary
  console.log('\n📊 Summary:');
  console.log(`  ✅ Compared ${fixedFiles.length} files`);
  console.log(`  ✅ Created ${reports.length} comparison reports in ${config.outputDir}`);
  
  console.log('\nTo view the comparison reports, open the files in the comparison-reports directory.');
}

// Run the main function
main();
