/**
 * Fix Script Imports
 * 
 * This script fixes the import statements in script files that were modified
 * to use ExecutionEnvironment but are using ES module syntax in CommonJS modules.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Main function to execute the script
async function fixScriptImports() {
  console.log('Starting to fix script imports...');
  
  // Find all JavaScript files in the scripts directory
  const scriptFiles = glob.sync(path.join(process.cwd(), 'scripts/**/*.js'));
  
  console.log(`Found ${scriptFiles.length} script files to scan.`);
  
  const fixedFiles = [];
  
  // Process each file
  for (const file of scriptFiles) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check if the file has ES module import for ExecutionEnvironment
    if (content.includes('import ExecutionEnvironment from')) {
      console.log(`Found problematic file: ${file}`);
      
      // Replace ES module import with CommonJS require
      let updatedContent = content.replace(
        /import\s+ExecutionEnvironment\s+from\s+['"]@docusaurus\/ExecutionEnvironment['"];?/g,
        "// ExecutionEnvironment is not needed in Node.js scripts\n// const ExecutionEnvironment = require('@docusaurus/ExecutionEnvironment');"
      );
      
      // Remove the ExecutionEnvironment check since it's not needed in Node.js scripts
      updatedContent = updatedContent.replace(
        /\/\/ Only execute in browser environment\s*if\s*\(ExecutionEnvironment\.canUseDOM\)\s*{/g,
        "// Node.js script - no browser environment check needed"
    );
    
    // Remove the closing brace and default export
    updatedContent = updatedContent.replace(
      /}\s*\/\/ Export empty module for SSR\s*export default function\(\) \{\};/g,
        "// No need for browser environment check in Node.js scripts"
      );
      
      // Fix indentation (remove extra indentation added by the previous script)
      const lines = updatedContent.split('\n');
      const fixedLines = [];
      let inBrowserCheck = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.includes('// Node.js script - no browser environment check needed')) {
        inBrowserCheck = true;
        fixedLines.push(line);
        } else if (line.includes('// No need for browser environment check in Node.js scripts')) {
          inBrowserCheck = false;
          fixedLines.push(line);
        } else if (inBrowserCheck && line.startsWith('  ')) {
          // Remove the extra indentation
          fixedLines.push(line.substring(2));
        } else {
          fixedLines.push(line);
        }
      }
      
      updatedContent = fixedLines.join('\n');
      
      // Save the updated content
      fs.writeFileSync(file, updatedContent);
      console.log(`Fixed ${file}`);
      
      fixedFiles.push(file);
    }
  }
  
  console.log(`Fixed ${fixedFiles.length} files.`);
  
  return fixedFiles;
}

// Execute the script
if (require.main === module) {
  fixScriptImports().catch(console.error);
}

module.exports = { fixScriptImports };
