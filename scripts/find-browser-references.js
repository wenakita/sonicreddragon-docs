/**
 * Find Browser References Script
 * 
 * This script searches for direct references to browser-specific objects like 'document' or 'window'
 * that might not be properly guarded with ExecutionEnvironment checks.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Main function to execute the script
async function findBrowserReferences() {
  console.log('Starting to find browser references...');
  
  // Find all JavaScript files in the project
  const jsFiles = glob.sync(path.join(process.cwd(), '**/*.{js,jsx,ts,tsx}'), {
    ignore: ['**/node_modules/**', '**/build/**', '**/.docusaurus/**']
  });
  
  console.log(`Found ${jsFiles.length} JavaScript files to scan.`);
  
  const problematicFiles = [];
  
  // Process each file
  for (const file of jsFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for direct references to document or window
    const documentMatch = /\bdocument\b(?!\s*=)(?!\s*\.)(?!\s*\()/.test(content);
    const windowMatch = /\bwindow\b(?!\s*=)(?!\s*\.)(?!\s*\()/.test(content);
    
    // Check if the file has proper ExecutionEnvironment check
    const hasExecutionEnvironment = content.includes('ExecutionEnvironment.canUseDOM');
    
    // If the file has browser references but no ExecutionEnvironment check
    if ((documentMatch || windowMatch) && !hasExecutionEnvironment) {
      problematicFiles.push({
        file,
        hasDocument: documentMatch,
        hasWindow: windowMatch
      });
      
      console.log(`Found problematic file: ${file}`);
      console.log(`  - Has document references: ${documentMatch}`);
      console.log(`  - Has window references: ${windowMatch}`);
      console.log(`  - Has ExecutionEnvironment check: ${hasExecutionEnvironment}`);
      
      // Fix the file
      console.log(`  - Fixing file...`);
      
      // Add ExecutionEnvironment import if needed
      let updatedContent = content;
      if (!updatedContent.includes('ExecutionEnvironment')) {
        updatedContent = `// ExecutionEnvironment is not needed in Node.js scripts
// const ExecutionEnvironment = require('@docusaurus/ExecutionEnvironment');\n\n${updatedContent}`;
      }
      
      // Wrap the entire content in a browser environment check
      const lines = updatedContent.split('\n');
      
      // Find the import statements
      let lastImportLine = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ')) {
          lastImportLine = i;
        }
      }
      
      // Add an empty line after imports if needed
      if (lines[lastImportLine + 1].trim() !== '') {
        lines.splice(lastImportLine + 1, 0, '');
        lastImportLine++;
      }
      
      // Extract the code after imports
      const importLines = lines.slice(0, lastImportLine + 2);
      const codeLines = lines.slice(lastImportLine + 2);
      
      // Wrap the code in a browser environment check
      const wrappedCode = [
        ...importLines,
        '// Only execute in browser environment',
        'if (ExecutionEnvironment.canUseDOM) {',
        ...codeLines.map(line => `  ${line}`),
        '}',
        '',
        '// Export empty module for SSR',
        'export default function() {};'
      ];
      
      updatedContent = wrappedCode.join('\n');
      
      // Save the updated content
      fs.writeFileSync(file, updatedContent);
      console.log(`  - Fixed ${file}`);
    }
  }
  
  console.log(`Found ${problematicFiles.length} problematic files.`);
  
  if (problematicFiles.length === 0) {
    console.log('No problematic files found. The issue might be in a dependency or in a more complex pattern.');
  }
  
  return problematicFiles;
}

// Execute the script
if (require.main === module) {
  findBrowserReferences().catch(console.error);
}

module.exports = { findBrowserReferences };
