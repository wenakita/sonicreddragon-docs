/**
 * Fix Sidebar and Navbar Issues
 * 
 * This script addresses issues with the sidebar on navigation pages
 * and consolidates the top navbar.
 */

const fs = require('fs');
const path = require('path');

/**
 * Create a CSS file to fix sidebar and navbar issues
 */
function createSidebarNavbarFixCss() {
  console.log('\n=== Creating sidebar-navbar-fix.css ===\n');
  
  const cssContent = `/**
 * Sidebar and Navbar Fix
 * 
 * This CSS fixes issues with the sidebar on navigation pages
 * and consolidates the top navbar.
 */

/* Fix for the sidebar container */
.docSidebarContainer_YfHR {
  height: 100% !important;
  position: sticky;
  top: var(--ifm-navbar-height);
  max-height: calc(100vh - var(--ifm-navbar-height));
  overflow-y: auto;
  z-index: 10;
}

/* Fix for the sidebar menu */
.menu {
  padding: 1rem 0.5rem;
  font-weight: var(--ifm-font-weight-normal);
  overflow-x: hidden;
}

/* Fix for the sidebar menu items */
.menu__list {
  margin: 0;
  list-style-type: none;
  padding-left: 0;
}

/* Fix for the sidebar menu item */
.menu__list-item {
  margin: 0.25rem 0;
}

/* Fix for the sidebar menu link */
.menu__link {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: var(--ifm-global-radius);
}

/* Fix for the navbar */
.navbar {
  z-index: 100;
  height: var(--ifm-navbar-height);
  padding: 0.5rem 1rem;
  width: 100%;
}

/* Fix for the navbar items */
.navbar__items {
  display: flex;
  align-items: center;
  flex: 1;
}

/* Fix for the navbar items on the right */
.navbar__items--right {
  justify-content: flex-end;
}

/* Fix for the navbar brand */
.navbar__brand {
  display: flex;
  align-items: center;
  margin-right: 1rem;
  min-width: 0;
}

/* Fix for the navbar logo */
.navbar__logo {
  height: 2rem;
  margin-right: 0.5rem;
}

/* Fix for the navbar title */
.navbar__title {
  font-size: 1.2rem;
  font-weight: var(--ifm-font-weight-bold);
  white-space: nowrap;
}

/* Fix for the navbar link */
.navbar__item {
  display: inline-block;
  padding: 0.5rem;
  margin: 0 0.2rem;
}

/* Fix for the navbar link active */
.navbar__link--active {
  font-weight: var(--ifm-font-weight-bold);
  color: var(--ifm-navbar-link-active-color);
}

/* Fix for the navbar toggle */
.navbar__toggle {
  display: none;
  margin-right: 1rem;
}

/* Fix for the navbar sidebar */
.navbar-sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transform: translate3d(-100%, 0, 0);
  transition: transform 0.3s ease;
  will-change: transform;
}

/* Fix for the navbar sidebar shown */
.navbar-sidebar--show {
  transform: translate3d(0, 0, 0);
}

/* Fix for the navbar sidebar backdrop */
.navbar-sidebar__backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: -1;
}

/* Fix for the navbar sidebar brand */
.navbar-sidebar__brand {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  height: var(--ifm-navbar-height);
}

/* Fix for the navbar sidebar items */
.navbar-sidebar__items {
  padding: 0.5rem;
  overflow-y: auto;
}

/* Fix for the navbar sidebar item */
.navbar-sidebar__item {
  padding: 0.5rem;
  margin: 0.2rem 0;
}

/* Fix for the navbar sidebar close button */
.navbar-sidebar__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.5rem;
}

/* Media query for mobile */
@media (max-width: 996px) {
  .navbar__toggle {
    display: block;
  }
  
  .navbar__items--right {
    display: none;
  }
  
  .navbar-sidebar__items .navbar__items {
    display: block;
  }
  
  .navbar-sidebar__items .navbar__item {
    display: block;
    padding: 0.5rem;
  }
}
`;
  
  const cssDir = path.resolve(process.cwd(), 'static/css');
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }
  
  const cssPath = path.resolve(cssDir, 'sidebar-navbar-fix.css');
  fs.writeFileSync(cssPath, cssContent, 'utf8');
  
  console.log(`✅ Created: ${cssPath}`);
  
  return true;
}

/**
 * Update docusaurus.config.ts to include the sidebar-navbar-fix.css
 */
function updateDocusaurusConfig() {
  console.log('\n=== Updating docusaurus.config.ts to include sidebar-navbar-fix.css ===\n');
  
  const configPath = path.resolve(process.cwd(), 'docusaurus.config.ts');
  
  if (!fs.existsSync(configPath)) {
    console.error(`❌ Config file not found: ${configPath}`);
    return false;
  }
  
  try {
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Check if our CSS is already included
    if (configContent.includes('sidebar-navbar-fix.css')) {
      console.log('⚠️ sidebar-navbar-fix.css is already included in docusaurus.config.ts');
      return true;
    }
    
    // Add our CSS to the stylesheets array
    const stylesheetsRegex = /(stylesheets:\s*\[)([^\]]*?)(\s*\])/s;
    const replacement = `$1$2,\n      { href: '/css/sidebar-navbar-fix.css', type: 'text/css' }$3`;
    
    configContent = configContent.replace(stylesheetsRegex, replacement);
    
    fs.writeFileSync(configPath, configContent, 'utf8');
    console.log('✅ Updated docusaurus.config.ts to include sidebar-navbar-fix.css');
    
    return true;
  } catch (error) {
    console.error(`❌ Error updating docusaurus.config.ts: ${error.message}`);
    return false;
  }
}

/**
 * Update the master-cleanup.js script to include this fix
 */
function updateMasterCleanupScript() {
  console.log('\n=== Updating master-cleanup.js to include sidebar and navbar fix script ===\n');
  
  const masterCleanupPath = path.resolve(process.cwd(), 'scripts/master-cleanup.js');
  
  if (!fs.existsSync(masterCleanupPath)) {
    console.error(`❌ Master cleanup script not found: ${masterCleanupPath}`);
    return false;
  }
  
  try {
    let masterCleanupContent = fs.readFileSync(masterCleanupPath, 'utf8');
    
    // Check if our script is already included
    if (masterCleanupContent.includes('fix-sidebar-and-navbar.js')) {
      console.log('⚠️ fix-sidebar-and-navbar.js is already included in master-cleanup.js');
      return true;
    }
    
    // Add our script to the CLEANUP_SCRIPTS array
    const scriptsArrayRegex = /(const CLEANUP_SCRIPTS = \[[\s\S]*?)(\];)/;
    const replacement = `$1  'fix-sidebar-and-navbar.js',\n$2`;
    
    masterCleanupContent = masterCleanupContent.replace(scriptsArrayRegex, replacement);
    
    // Add our fix to the summary section
    const summaryRegex = /(8\. Background Expansion Issues:[\s\S]*?The codebase is now more maintainable)/;
    const summaryReplacement = `$1

9. Sidebar and Navbar Issues:
   - Fixed sidebar issues on navigation pages
   - Consolidated the top navbar
   - Improved mobile responsiveness

The codebase is now more maintainable`;
    
    masterCleanupContent = masterCleanupContent.replace(summaryRegex, summaryReplacement);
    
    fs.writeFileSync(masterCleanupPath, masterCleanupContent, 'utf8');
    console.log('✅ Updated master-cleanup.js to include fix-sidebar-and-navbar.js');
    
    return true;
  } catch (error) {
    console.error(`❌ Error updating master-cleanup.js: ${error.message}`);
    return false;
  }
}

/**
 * Update the README.md to include information about the sidebar and navbar fix
 */
function updateReadme() {
  console.log('\n=== Updating README.md to include information about the sidebar and navbar fix ===\n');
  
  const readmePath = path.resolve(process.cwd(), 'scripts/README.md');
  
  if (!fs.existsSync(readmePath)) {
    console.error(`❌ README.md not found: ${readmePath}`);
    return false;
  }
  
  try {
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Check if our script is already mentioned
    if (readmeContent.includes('fix-sidebar-and-navbar.js')) {
      console.log('⚠️ fix-sidebar-and-navbar.js is already mentioned in README.md');
      return true;
    }
    
    // Find the position to insert our script information
    const insertPosition = readmeContent.indexOf('## Running the Scripts');
    
    if (insertPosition === -1) {
      console.error('❌ Could not find insertion point in README.md');
      return false;
    }
    
    // Create the content to insert
    const contentToInsert = `#### 7. Sidebar and Navbar Fix

\`\`\`bash
node scripts/fix-sidebar-and-navbar.js
\`\`\`

This script:
- Creates a CSS file to fix sidebar issues on navigation pages
- Consolidates the top navbar for better usability
- Improves mobile responsiveness
- Updates docusaurus.config.ts to include the CSS file

`;
    
    // Insert the content
    readmeContent = readmeContent.slice(0, insertPosition) + contentToInsert + readmeContent.slice(insertPosition);
    
    fs.writeFileSync(readmePath, readmeContent, 'utf8');
    console.log('✅ Updated README.md to include information about fix-sidebar-and-navbar.js');
    
    return true;
  } catch (error) {
    console.error(`❌ Error updating README.md: ${error.message}`);
    return false;
  }
}

/**
 * Update the FRONTEND_AUDIT_FIXES.md to include information about the sidebar and navbar fix
 */
function updateAuditFixesDoc() {
  console.log('\n=== Updating FRONTEND_AUDIT_FIXES.md to include information about the sidebar and navbar fix ===\n');
  
  const auditFixesPath = path.resolve(process.cwd(), 'docs/052525updates/FRONTEND_AUDIT_FIXES.md');
  
  if (!fs.existsSync(auditFixesPath)) {
    console.error(`❌ FRONTEND_AUDIT_FIXES.md not found: ${auditFixesPath}`);
    return false;
  }
  
  try {
    let auditFixesContent = fs.readFileSync(auditFixesPath, 'utf8');
    
    // Check if sidebar and navbar fix is already mentioned
    if (auditFixesContent.includes('Sidebar and Navbar Issues')) {
      console.log('⚠️ Sidebar and Navbar fix is already mentioned in FRONTEND_AUDIT_FIXES.md');
      return true;
    }
    
    // Find the position to insert our information
    const insertPosition = auditFixesContent.indexOf('## Next Steps');
    
    if (insertPosition === -1) {
      console.error('❌ Could not find insertion point in FRONTEND_AUDIT_FIXES.md');
      return false;
    }
    
    // Create the content to insert
    const contentToInsert = `### 9. Sidebar and Navbar Issues

**Problem:** Sidebar is buggy on navigation pages and the top navbar needs consolidation.

**Solution:**
- Created a CSS file with fixes for sidebar issues
- Consolidated the top navbar for better usability
- Improved mobile responsiveness
- Updated docusaurus.config.ts to include the CSS fixes

`;
    
    // Insert the content
    auditFixesContent = auditFixesContent.slice(0, insertPosition) + contentToInsert + auditFixesContent.slice(insertPosition);
    
    fs.writeFileSync(auditFixesPath, auditFixesContent, 'utf8');
    console.log('✅ Updated FRONTEND_AUDIT_FIXES.md to include information about the sidebar and navbar fix');
    
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
  console.log('Starting sidebar and navbar fix...');
  
  // Create the CSS file
  const cssCreated = createSidebarNavbarFixCss();
  if (!cssCreated) {
    console.error('❌ Failed to create sidebar-navbar-fix.css');
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
  console.log(`CSS file created: ${cssCreated ? 'Yes' : 'No'}`);
  console.log(`Config updated: ${configUpdated ? 'Yes' : 'No'}`);
  console.log(`Master cleanup script updated: ${masterCleanupUpdated ? 'Yes' : 'No'}`);
  console.log(`README.md updated: ${readmeUpdated ? 'Yes' : 'No'}`);
  console.log(`FRONTEND_AUDIT_FIXES.md updated: ${auditFixesUpdated ? 'Yes' : 'No'}`);
  
  console.log('\nSidebar and navbar fix completed!');
  console.log('\nThe site now has proper CSS to fix sidebar issues and consolidate the top navbar.');
}

// Run the main function
main();
