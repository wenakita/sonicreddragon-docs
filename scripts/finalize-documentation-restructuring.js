/**
 * Documentation Restructuring Finalization Script
 * 
 * This script automates the process of:
 * 1. Renaming consolidated files to replace original files
 * 2. Updating references in all documentation files
 * 3. Generating a report of changes made
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// File mapping: consolidated file -> original file
const fileMapping = {
  'docs/concepts/token-system-consolidated.md': 'docs/concepts/token-system.md',
  'docs/concepts/fee-system-consolidated.md': 'docs/concepts/fee-system.md',
  'docs/concepts/jackpot-system-consolidated.md': 'docs/concepts/jackpot.md',
  'docs/concepts/cross-chain-consolidated.md': 'docs/concepts/cross-chain.md',
  'docs/concepts/randomness-consolidated.md': 'docs/concepts/randomness.md',
  'docs/concepts/security-model-consolidated.md': 'docs/concepts/security-model.md',
  'docs/guide/user-guide-consolidated.md': 'docs/guide/user-guide.mdx',
  'docs/guide/developer-guide-consolidated.md': 'docs/guide/developer-guide.mdx',
  'docs/resources/faq-consolidated.md': 'docs/resources/faq.md',
  'docs/resources/glossary-consolidated.md': 'docs/resources/glossary.md'
};

// Reference mapping: old reference -> new reference
const referenceMapping = {
  '../concepts/token-system-consolidated.md': '../concepts/token-system.md',
  '../concepts/fee-system-consolidated.md': '../concepts/fee-system.md',
  '../concepts/jackpot-system-consolidated.md': '../concepts/jackpot.md',
  '../concepts/cross-chain-consolidated.md': '../concepts/cross-chain.md',
  '../concepts/randomness-consolidated.md': '../concepts/randomness.md',
  '../concepts/security-model-consolidated.md': '../concepts/security-model.md',
  '../guide/user-guide-consolidated.md': '../guide/user-guide.mdx',
  '../guide/developer-guide-consolidated.md': '../guide/developer-guide.mdx',
  '../resources/faq-consolidated.md': '../resources/faq.md',
  '../resources/glossary-consolidated.md': '../resources/glossary.md',
  './token-system-consolidated.md': './token-system.md',
  './fee-system-consolidated.md': './fee-system.md',
  './jackpot-system-consolidated.md': './jackpot.md',
  './cross-chain-consolidated.md': './cross-chain.md',
  './randomness-consolidated.md': './randomness.md',
  './security-model-consolidated.md': './security-model.md',
  './user-guide-consolidated.md': './user-guide.mdx',
  './developer-guide-consolidated.md': './developer-guide.mdx',
  './faq-consolidated.md': './faq.md',
  './glossary-consolidated.md': './glossary.md'
};

// Stats for reporting
const stats = {
  filesRenamed: 0,
  referencesUpdated: 0,
  filesProcessed: 0,
  errors: []
};

/**
 * Rename consolidated files to replace original files
 */
function renameFiles() {
  console.log('=== Renaming Files ===');
  
  Object.entries(fileMapping).forEach(([consolidatedFile, originalFile]) => {
    try {
      // Check if consolidated file exists
      if (!fs.existsSync(consolidatedFile)) {
        throw new Error(`Consolidated file does not exist: ${consolidatedFile}`);
      }
      
      // Backup original file if it exists
      if (fs.existsSync(originalFile)) {
        const backupFile = `${originalFile}.backup`;
        fs.copyFileSync(originalFile, backupFile);
        console.log(`Backed up: ${originalFile} -> ${backupFile}`);
      }
      
      // Copy consolidated file to original file location
      fs.copyFileSync(consolidatedFile, originalFile);
      console.log(`Renamed: ${consolidatedFile} -> ${originalFile}`);
      
      stats.filesRenamed++;
    } catch (error) {
      console.error(`Error renaming ${consolidatedFile}:`, error.message);
      stats.errors.push(`Renaming ${consolidatedFile}: ${error.message}`);
    }
  });
  
  console.log(`Renamed ${stats.filesRenamed} files\n`);
}

/**
 * Update references in all documentation files
 */
function updateReferences() {
  console.log('=== Updating References ===');
  
  // Get all markdown files
  const files = glob.sync('docs/**/*.{md,mdx}');
  
  files.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let updated = false;
      
      // Update references
      Object.entries(referenceMapping).forEach(([oldRef, newRef]) => {
        if (content.includes(oldRef)) {
          const regex = new RegExp(oldRef.replace(/\./g, '\\.'), 'g');
          content = content.replace(regex, newRef);
          updated = true;
          stats.referencesUpdated++;
        }
      });
      
      // Save updated content
      if (updated) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated references in: ${file}`);
      }
      
      stats.filesProcessed++;
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
      stats.errors.push(`Processing ${file}: ${error.message}`);
    }
  });
  
  console.log(`Processed ${stats.filesProcessed} files`);
  console.log(`Updated ${stats.referencesUpdated} references\n`);
}

/**
 * Generate a report of changes made
 */
function generateReport() {
  console.log('=== Generating Report ===');
  
  const report = {
    timestamp: new Date().toISOString(),
    stats: {
      filesRenamed: stats.filesRenamed,
      referencesUpdated: stats.referencesUpdated,
      filesProcessed: stats.filesProcessed,
      errors: stats.errors.length
    },
    errors: stats.errors
  };
  
  const reportFile = 'docs/RESTRUCTURING_REPORT.md';
  const reportContent = `# Documentation Restructuring Report

Generated: ${new Date().toLocaleString()}

## Summary

- Files renamed: ${report.stats.filesRenamed}
- References updated: ${report.stats.referencesUpdated}
- Files processed: ${report.stats.filesProcessed}
- Errors encountered: ${report.stats.errors}

## File Mapping

${Object.entries(fileMapping).map(([consolidated, original]) => `- ${consolidated} -> ${original}`).join('\n')}

## Errors

${report.errors.length > 0 ? report.errors.map(error => `- ${error}`).join('\n') : 'No errors encountered.'}

## Next Steps

1. Review the renamed files to ensure content was properly transferred
2. Check for any broken links or references that were missed
3. Remove the consolidated files and backups once everything is verified
4. Update the sidebar configuration if needed
`;
  
  fs.writeFileSync(reportFile, reportContent, 'utf8');
  console.log(`Report generated: ${reportFile}\n`);
}

/**
 * Main function
 */
function main() {
  console.log('=== Documentation Restructuring Finalization ===\n');
  
  // Create backup directory
  const backupDir = 'docs/backup';
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }
  
  // Run the process
  renameFiles();
  updateReferences();
  generateReport();
  
  console.log('=== Process Complete ===');
  console.log(`Files renamed: ${stats.filesRenamed}`);
  console.log(`References updated: ${stats.referencesUpdated}`);
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Errors encountered: ${stats.errors.length}`);
  console.log('\nSee docs/RESTRUCTURING_REPORT.md for details');
}

// Run the script
main();
