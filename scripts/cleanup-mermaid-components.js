/**
 * Cleanup Mermaid Components
 * 
 * This script marks all deprecated Mermaid components with a deprecation notice
 * and creates a new index file that exports only the recommended components.
 */

const fs = require('fs');
const path = require('path');

// Components to be marked as deprecated
const componentsToMark = [
  'src/components/MermaidDiagram.js',
  'src/components/MermaidWrapper.js',
  'src/components/EnhancedMermaid.js',
  'src/components/StandardMermaid.js',
  'src/components/ModernMermaid.tsx',
];

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
 * Please use the unified Mermaid module with <div data-immersive> approach instead.
 * See docs/guide/mermaid-implementation.md for details.
 */
`;
        
        // Check if file already has deprecation notice
        if (!content.includes('@deprecated')) {
          // For JavaScript/TypeScript files
          if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
            // Find the first import statement or the beginning of the file
            const importRegex = /^import/m;
            const match = content.match(importRegex);
            
            if (match) {
              // Insert before the first import
              content = deprecationNotice + content;
            } else {
              // Insert at the beginning of the file
              content = deprecationNotice + content;
            }
          }
          
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

// Create a new index file for Mermaid components
function createMermaidIndex() {
  const indexPath = path.resolve(process.cwd(), 'src/components/MermaidComponents.js');
  
  const indexContent = `/**
 * Mermaid Components
 * 
 * This file exports the recommended Mermaid components.
 * For new diagrams, use the <div data-immersive> approach with standard Mermaid syntax.
 * See docs/guide/mermaid-implementation.md for details.
 */

import ImmersiveMermaid from './ImmersiveMermaid';

// Legacy components (deprecated)
import MermaidDiagram from './MermaidDiagram';
import MermaidWrapper from './MermaidWrapper';
import StandardMermaid from './StandardMermaid';

// Export recommended components
export { ImmersiveMermaid };

// Export legacy components (deprecated)
export { MermaidDiagram, MermaidWrapper, StandardMermaid };

// Default export
export default ImmersiveMermaid;
`;
  
  try {
    fs.writeFileSync(indexPath, indexContent);
    console.log(`✅ Created Mermaid components index: ${indexPath}`);
  } catch (error) {
    console.error(`❌ Error creating Mermaid components index:`, error);
  }
}

// Main function
function main() {
  console.log('🧹 Cleaning up Mermaid components...');
  
  // Mark components as deprecated
  markComponentsAsDeprecated();
  
  // Create Mermaid index
  createMermaidIndex();
  
  console.log('✨ Cleanup complete!');
}

// Run the script
main();
