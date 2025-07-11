/**
 * Cleanup Mermaid Modules
 * 
 * This script removes the old Mermaid initialization files that have been
 * consolidated into the unified Mermaid module.
 */

const fs = require('fs');
const path = require('path');

// Files to be removed
const filesToRemove = [
  'src/clientModules/mermaidInit.js',
  'src/clientModules/mermaidFixModule.js',
  'src/clientModules/enhancedMermaidInit.js',
];

// Components to be marked as deprecated
const componentsToMark = [
  'src/components/MermaidDiagram.js',
  'src/components/MermaidWrapper.js',
  'src/components/EnhancedMermaid.js',
  'src/components/StandardMermaid.js',
];

// Function to remove files
function removeFiles() {
  filesToRemove.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`✅ Removed: ${file}`);
      } catch (error) {
        console.error(`❌ Error removing ${file}:`, error);
      }
    } else {
      console.log(`⚠️ File not found: ${file}`);
    }
  });
}

// Function to mark components as deprecated
function markComponentsAsDeprecated() {
  componentsToMark.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    
    if (fs.existsSync(filePath)) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add deprecation notice
        const deprecationNotice = `/**
 * @deprecated This component is deprecated and will be removed in a future version.
 * Please use the unified Mermaid module instead.
 */
`;
        
        // Check if file already has deprecation notice
        if (!content.includes('@deprecated')) {
          content = deprecationNotice + content;
          fs.writeFileSync(filePath, content);
          console.log(`✅ Marked as deprecated: ${file}`);
        } else {
          console.log(`⚠️ Already marked as deprecated: ${file}`);
        }
      } catch (error) {
        console.error(`❌ Error marking ${file} as deprecated:`, error);
      }
    } else {
      console.log(`⚠️ File not found: ${file}`);
    }
  });
}

// Main function
function main() {
  console.log('🧹 Cleaning up Mermaid modules...');
  
  // Remove files
  removeFiles();
  
  // Mark components as deprecated
  markComponentsAsDeprecated();
  
  console.log('✨ Cleanup complete!');
}

// Run the script
main();
