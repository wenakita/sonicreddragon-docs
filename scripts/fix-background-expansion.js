/**
 * Fix Background Expansion
 * 
 * This script addresses the issue where the background doesn't expand properly
 * to accommodate all content, particularly Mermaid diagrams.
 */

const fs = require('fs');
const path = require('path');

/**
 * Update docusaurus.config.ts to include the background-fix.css
 */
function updateDocusaurusConfig() {
  console.log('\n=== Updating docusaurus.config.ts to include background fix CSS ===\n');
  
  const configPath = path.resolve(process.cwd(), 'docusaurus.config.ts');
  
  if (!fs.existsSync(configPath)) {
    console.error(`❌ Config file not found: ${configPath}`);
    return false;
  }
  
  try {
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Check if the stylesheets section exists
    if (configContent.includes('stylesheets:')) {
      // Check if our CSS is already included
      if (configContent.includes('background-fix.css')) {
        console.log('⚠️ background-fix.css is already included in docusaurus.config.ts');
        return true;
      }
      
      // Add our CSS to the stylesheets array
      const stylesheetsRegex = /(stylesheets:\s*\[)([^\]]*?)(\s*\])/s;
      const replacement = `$1$2,\n      { href: '/css/background-fix.css', type: 'text/css' }$3`;
      
      configContent = configContent.replace(stylesheetsRegex, replacement);
    } else {
      // If no stylesheets section exists, add it before the scripts section
      const scriptsRegex = /(scripts:\s*\[)/;
      const replacement = `stylesheets: [
    { href: '/css/background-fix.css', type: 'text/css' }
  ],\n\n  $1`;
      
      configContent = configContent.replace(scriptsRegex, replacement);
    }
    
    fs.writeFileSync(configPath, configContent, 'utf8');
    console.log('✅ Updated docusaurus.config.ts to include background-fix.css');
    
    return true;
  } catch (error) {
    console.error(`❌ Error updating docusaurus.config.ts: ${error.message}`);
    return false;
  }
}

/**
 * Ensure the static/css directory exists
 */
function ensureCssDirectory() {
  const cssDir = path.resolve(process.cwd(), 'static/css');
  
  if (!fs.existsSync(cssDir)) {
    try {
      fs.mkdirSync(cssDir, { recursive: true });
      console.log('✅ Created static/css directory');
    } catch (error) {
      console.error(`❌ Error creating static/css directory: ${error.message}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Update the master-cleanup.js script to include this fix
 */
function updateMasterCleanupScript() {
  console.log('\n=== Updating master-cleanup.js to include background fix script ===\n');
  
  const masterCleanupPath = path.resolve(process.cwd(), 'scripts/master-cleanup.js');
  
  if (!fs.existsSync(masterCleanupPath)) {
    console.error(`❌ Master cleanup script not found: ${masterCleanupPath}`);
    return false;
  }
  
  try {
    let masterCleanupContent = fs.readFileSync(masterCleanupPath, 'utf8');
    
    // Check if our script is already included
    if (masterCleanupContent.includes('fix-background-expansion.js')) {
      console.log('⚠️ fix-background-expansion.js is already included in master-cleanup.js');
      return true;
    }
    
    // Add our script to the CLEANUP_SCRIPTS array
    const scriptsArrayRegex = /(const CLEANUP_SCRIPTS = \[[\s\S]*?)(\];)/;
    const replacement = `$1  'fix-background-expansion.js',\n$2`;
    
    masterCleanupContent = masterCleanupContent.replace(scriptsArrayRegex, replacement);
    
    fs.writeFileSync(masterCleanupPath, masterCleanupContent, 'utf8');
    console.log('✅ Updated master-cleanup.js to include fix-background-expansion.js');
    
    return true;
  } catch (error) {
    console.error(`❌ Error updating master-cleanup.js: ${error.message}`);
    return false;
  }
}

/**
 * Update the README.md to include information about the background fix
 */
function updateReadme() {
  console.log('\n=== Updating README.md to include information about the background fix ===\n');
  
  const readmePath = path.resolve(process.cwd(), 'scripts/README.md');
  
  if (!fs.existsSync(readmePath)) {
    console.error(`❌ README.md not found: ${readmePath}`);
    return false;
  }
  
  try {
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Check if our script is already mentioned
    if (readmeContent.includes('fix-background-expansion.js')) {
      console.log('⚠️ fix-background-expansion.js is already mentioned in README.md');
      return true;
    }
    
    // Find the position to insert our script information
    const insertPosition = readmeContent.indexOf('## Running the Scripts');
    
    if (insertPosition === -1) {
      console.error('❌ Could not find insertion point in README.md');
      return false;
    }
    
    // Create the content to insert
    const contentToInsert = `#### 6. Background Expansion Fix

\`\`\`bash
node scripts/fix-background-expansion.js
\`\`\`

This script:
- Creates a CSS file to fix background expansion issues
- Ensures the background expands properly to accommodate all content, including Mermaid diagrams
- Updates docusaurus.config.ts to include the CSS file

`;
    
    // Insert the content
    readmeContent = readmeContent.slice(0, insertPosition) + contentToInsert + readmeContent.slice(insertPosition);
    
    fs.writeFileSync(readmePath, readmeContent, 'utf8');
    console.log('✅ Updated README.md to include information about fix-background-expansion.js');
    
    return true;
  } catch (error) {
    console.error(`❌ Error updating README.md: ${error.message}`);
    return false;
  }
}

/**
 * Update the FRONTEND_AUDIT_FIXES.md to include information about the background fix
 */
function updateAuditFixesDoc() {
  console.log('\n=== Updating FRONTEND_AUDIT_FIXES.md to include information about the background fix ===\n');
  
  const auditFixesPath = path.resolve(process.cwd(), 'docs/052525updates/FRONTEND_AUDIT_FIXES.md');
  
  if (!fs.existsSync(auditFixesPath)) {
    console.error(`❌ FRONTEND_AUDIT_FIXES.md not found: ${auditFixesPath}`);
    return false;
  }
  
  try {
    let auditFixesContent = fs.readFileSync(auditFixesPath, 'utf8');
    
    // Check if background fix is already mentioned
    if (auditFixesContent.includes('Background Expansion')) {
      console.log('⚠️ Background Expansion fix is already mentioned in FRONTEND_AUDIT_FIXES.md');
      return true;
    }
    
    // Find the position to insert our information
    const insertPosition = auditFixesContent.indexOf('## Next Steps');
    
    if (insertPosition === -1) {
      console.error('❌ Could not find insertion point in FRONTEND_AUDIT_FIXES.md');
      return false;
    }
    
    // Create the content to insert
    const contentToInsert = `### 8. Background Expansion Issues

**Problem:** Background containers not expanding properly to accommodate all content, particularly Mermaid diagrams, leading to visual inconsistencies and potentially cut-off content.

**Solution:**
- Created a CSS file with fixes for container expansion
- Ensured all content containers use proper flex layout
- Fixed Mermaid diagram containers to display properly
- Updated docusaurus.config.ts to include the CSS fixes

`;
    
    // Insert the content
    auditFixesContent = auditFixesContent.slice(0, insertPosition) + contentToInsert + auditFixesContent.slice(insertPosition);
    
    fs.writeFileSync(auditFixesPath, auditFixesContent, 'utf8');
    console.log('✅ Updated FRONTEND_AUDIT_FIXES.md to include information about the background fix');
    
    return true;
  } catch (error) {
    console.error(`❌ Error updating FRONTEND_AUDIT_FIXES.md: ${error.message}`);
    return false;
  }
}

/**
 * Main function
 */
function main() {
  console.log('Starting background expansion fix...');
  
  // Ensure the CSS directory exists
  const cssDirectoryExists = ensureCssDirectory();
  if (!cssDirectoryExists) {
    console.error('❌ Failed to ensure CSS directory exists');
    return;
  }
  
  // Update docusaurus.config.ts
  const configUpdated = updateDocusaurusConfig();
  
  // Update master-cleanup.js
  const masterCleanupUpdated = updateMasterCleanupScript();
  
  // Update README.md
  const readmeUpdated = updateReadme();
  
  // Update FRONTEND_AUDIT_FIXES.md
  const auditFixesUpdated = updateAuditFixesDoc();
  
  // Summary
  console.log('\n=== Summary ===\n');
  console.log(`CSS directory exists: ${cssDirectoryExists ? 'Yes' : 'No'}`);
  console.log(`Config updated: ${configUpdated ? 'Yes' : 'No'}`);
  console.log(`Master cleanup script updated: ${masterCleanupUpdated ? 'Yes' : 'No'}`);
  console.log(`README.md updated: ${readmeUpdated ? 'Yes' : 'No'}`);
  console.log(`FRONTEND_AUDIT_FIXES.md updated: ${auditFixesUpdated ? 'Yes' : 'No'}`);
  
  console.log('\nBackground expansion fix completed!');
  console.log('\nThe site now has proper CSS to ensure backgrounds expand to accommodate all content.');
  console.log('This addresses the issue where Mermaid diagrams and other content might be cut off.');
}

// Run the main function
main();
