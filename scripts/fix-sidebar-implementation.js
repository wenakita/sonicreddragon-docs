/**
 * Fix Sidebar Implementation
 * 
 * This script addresses the "Sidebar Implementation Deviation" issue identified
 * in the frontend audit by:
 * 1. Removing the unused CustomSidebar component
 * 2. Removing the problematic contextualSidebarModule.js client module
 * 3. Removing the contextual-sidebar-plugin.js plugin
 * 4. Updating docusaurus.config.ts to use the standard Docusaurus sidebar
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files to be removed
const filesToRemove = [
  'src/components/CustomSidebar/index.tsx',
  'src/components/CustomSidebar/styles.css',
  'src/clientModules/contextualSidebarModule.js',
  'src/plugins/contextual-sidebar-plugin.js',
];

/**
 * Remove unused sidebar files
 */
function removeUnusedFiles() {
  console.log('\n=== Removing unused sidebar files ===\n');
  
  let removedCount = 0;
  
  filesToRemove.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`✅ Removed: ${file}`);
        removedCount++;
      } catch (error) {
        console.error(`❌ Error removing ${file}: ${error.message}`);
      }
    } else {
      console.log(`⚠️ File not found: ${file}`);
    }
  });
  
  // Remove the CustomSidebar directory if it's empty
  const customSidebarDir = path.resolve(process.cwd(), 'src/components/CustomSidebar');
  if (fs.existsSync(customSidebarDir)) {
    try {
      fs.rmdirSync(customSidebarDir);
      console.log(`✅ Removed directory: src/components/CustomSidebar`);
    } catch (error) {
      console.error(`❌ Error removing directory src/components/CustomSidebar: ${error.message}`);
    }
  }
  
  console.log(`\nRemoved ${removedCount} unused sidebar files\n`);
  
  return removedCount;
}

/**
 * Update docusaurus.config.ts to remove references to the sidebar client module
 */
function updateDocusaurusConfig() {
  console.log('\n=== Updating docusaurus.config.ts ===\n');
  
  const configPath = path.resolve(process.cwd(), 'docusaurus.config.ts');
  
  if (!fs.existsSync(configPath)) {
    console.error(`❌ Config file not found: ${configPath}`);
    return false;
  }
  
  try {
    let configContent = fs.readFileSync(configPath, 'utf8');
    let modified = false;
    
    // Remove reference to contextualSidebarModule.js
    const clientModuleRegex = /\s*require\.resolve\(['"]\.\/src\/clientModules\/contextualSidebarModule['"]\),?/g;
    if (clientModuleRegex.test(configContent)) {
      configContent = configContent.replace(clientModuleRegex, '');
      console.log(`✅ Removed reference to contextualSidebarModule.js from docusaurus.config.ts`);
      modified = true;
    }
    
    // Remove reference to contextual-sidebar-plugin.js if it exists
    const pluginRegex = /\s*\[?['"]\.\/src\/plugins\/contextual-sidebar-plugin['"]\]?,?/g;
    if (pluginRegex.test(configContent)) {
      configContent = configContent.replace(pluginRegex, '');
      console.log(`✅ Removed reference to contextual-sidebar-plugin.js from docusaurus.config.ts`);
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(configPath, configContent, 'utf8');
      console.log('✅ Updated docusaurus.config.ts');
    } else {
      console.log('⚠️ No changes needed in docusaurus.config.ts');
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error updating docusaurus.config.ts: ${error.message}`);
    return false;
  }
}

/**
 * Update the Layout component to remove references to CustomSidebar
 */
function updateLayoutComponent() {
  console.log('\n=== Updating Layout component ===\n');
  
  const layoutPath = path.resolve(process.cwd(), 'src/theme/Layout/index.tsx');
  
  if (!fs.existsSync(layoutPath)) {
    console.log('⚠️ Layout component not found, no changes needed');
    return false;
  }
  
  try {
    let layoutContent = fs.readFileSync(layoutPath, 'utf8');
    let modified = false;
    
    // Remove import of CustomSidebar
    const importRegex = /import\s+CustomSidebar\s+from\s+['"]\.\.\/\.\.\/components\/CustomSidebar['"];?\n/g;
    if (importRegex.test(layoutContent)) {
      layoutContent = layoutContent.replace(importRegex, '');
      console.log(`✅ Removed import of CustomSidebar from Layout component`);
      modified = true;
    }
    
    // Remove any commented out references to CustomSidebar
    const commentedUsageRegex = /\/\/\s*<CustomSidebar\s*\/>\n/g;
    if (commentedUsageRegex.test(layoutContent)) {
      layoutContent = layoutContent.replace(commentedUsageRegex, '');
      console.log(`✅ Removed commented out references to CustomSidebar from Layout component`);
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(layoutPath, layoutContent, 'utf8');
      console.log('✅ Updated Layout component');
    } else {
      console.log('⚠️ No changes needed in Layout component');
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error updating Layout component: ${error.message}`);
    return false;
  }
}

/**
 * Main function
 */
function main() {
  console.log('Starting sidebar implementation fix...');
  
  // Remove unused files
  const removedCount = removeUnusedFiles();
  
  // Update docusaurus.config.ts
  const configUpdated = updateDocusaurusConfig();
  
  // Update Layout component
  const layoutUpdated = updateLayoutComponent();
  
  // Summary
  console.log('\n=== Summary ===\n');
  console.log(`Removed ${removedCount} unused sidebar files`);
  console.log(`Config updated: ${configUpdated ? 'Yes' : 'No'}`);
  console.log(`Layout component updated: ${layoutUpdated ? 'Yes' : 'No'}`);
  
  console.log('\nSidebar implementation fix completed!');
  console.log('\nThe site now uses the standard Docusaurus sidebar configured in sidebars.ts.');
  console.log('This follows Docusaurus best practices and eliminates the problematic DOM manipulation approach.');
}

// Run the main function
main();
