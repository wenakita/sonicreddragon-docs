/**
 * Fix Client Modules Script
 * 
 * This script ensures all client modules properly check for browser environment
 * before using browser-specific APIs like 'document' or 'window'.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Main function to execute the script
async function fixClientModules() {
  console.log('Starting to fix client modules...');
  
  // Find all client module files
  const clientModulesDir = path.join(process.cwd(), 'src/clientModules');
  const clientModuleFiles = glob.sync(path.join(clientModulesDir, '**/*.js'));
  
  console.log(`Found ${clientModuleFiles.length} client module files to process.`);
  
  // Process each file
  for (const file of clientModuleFiles) {
    console.log(`Processing ${file}...`);
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if the file already has ExecutionEnvironment import
    if (!content.includes('ExecutionEnvironment')) {
      // Add ExecutionEnvironment import
      content = `// ExecutionEnvironment is not needed in Node.js scripts
// const ExecutionEnvironment = require('@docusaurus/ExecutionEnvironment');\n\n${content}`;
    }
    
    // Check if the file already has browser environment check
    if (!content.includes('ExecutionEnvironment.canUseDOM')) {
      // Wrap the entire content in a browser environment check
      const lines = content.split('\n');
      
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
      
      content = wrappedCode.join('\n');
    }
    
    // Save the updated content
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
  
  console.log('Client modules fixed successfully!');
}

// Execute the script
if (require.main === module) {
  fixClientModules().catch(console.error);
}

module.exports = { fixClientModules };
