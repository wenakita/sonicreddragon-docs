/**
 * Mermaid Implementation Cleanup Script
 * 
 * This script helps clean up the deprecated Mermaid components and modules
 * after implementing the new unified approach.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files to be removed (deprecated components and modules)
const filesToRemove = [
  // Deprecated components
  'src/components/EnhancedMermaid.js',
  'src/components/ImmersiveMermaid.tsx',
  'src/components/ImmersiveMermaid.module.css',
  'src/components/MermaidDiagram.js',
  'src/components/MermaidWrapper.js',
  'src/components/StandardMermaid.js',
  'src/components/StandardMermaid.module.css',
  'src/components/ModernMermaid.tsx',
  'src/components/ModernMermaid.module.css',
  'src/components/MermaidRenderer.tsx',
  'src/components/MermaidComponents.js',
  'src/components/intro/MermaidDiagram.tsx',
  
  // Deprecated client modules
  'src/clientModules/unifiedMermaidModule.js',
  'src/clientModules/enhancedMermaidInit.js',
  'src/clientModules/mermaidFixModule.js',
  
  // Deprecated plugins
  'src/plugins/mermaid-plugin.js',
  
  // Deprecated utilities
  'src/utils/enhancedMermaidAnimations.ts',
];

// Files to keep (new implementation)
const filesToKeep = [
  'src/components/UnifiedMermaid.tsx',
  'src/components/UnifiedMermaid.module.css',
  'src/components/MermaidControls.tsx',
  'src/components/MermaidControls.module.css',
  'src/clientModules/reactMermaidModule.js',
  'docs/guide/mermaid-implementation.md',
  'src/components/intro/UnifiedMermaidDiagram.tsx',
];

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

// Function to remove a file if it exists
function removeFileIfExists(filePath) {
  if (fileExists(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Removed: ${filePath}`);
      return true;
    } catch (err) {
      console.error(`❌ Error removing ${filePath}: ${err.message}`);
      return false;
    }
  } else {
    console.log(`⚠️ File not found: ${filePath}`);
    return false;
  }
}

// Function to check if files to keep exist
function checkFilesToKeep() {
  const missing = [];
  
  for (const file of filesToKeep) {
    if (!fileExists(file)) {
      missing.push(file);
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ ERROR: The following required files are missing:');
    missing.forEach(file => console.error(`   - ${file}`));
    console.error('Please create these files before running the cleanup script.');
    return false;
  }
  
  return true;
}

// Main function
function main() {
  console.log('🧹 Starting Mermaid Implementation Cleanup');
  console.log('==========================================');
  
  // Check if new implementation files exist
  if (!checkFilesToKeep()) {
    process.exit(1);
  }
  
  console.log('\n📋 Removing deprecated files:');
  
  // Remove deprecated files
  let removedCount = 0;
  for (const file of filesToRemove) {
    if (removeFileIfExists(file)) {
      removedCount++;
    }
  }
  
  console.log(`\n🎉 Cleanup complete! Removed ${removedCount} deprecated files.`);
  
  // Suggest next steps
  console.log('\n📝 Next steps:');
  console.log('1. Run the build to ensure everything works correctly:');
  console.log('   npm run build');
  console.log('2. Test the documentation site to verify Mermaid diagrams render properly');
  console.log('3. Commit the changes:');
  console.log('   git add .');
  console.log('   git commit -m "Refactor: Consolidate Mermaid implementation"');
}

// Run the main function
main();
