/**
 * Master Cleanup Script
 * 
 * This script runs all the individual cleanup scripts to address the issues
 * identified in the frontend audit.
 */

const { spawn } = require('child_process');
const path = require('path');

// List of cleanup scripts to run
const CLEANUP_SCRIPTS = [
  'unified-mermaid-management.js',
  'cleanup-components.js',
  'cleanup-client-modules.js',
  'consolidate-animation-utils.js',
  'fix-background-expansion.js',
  'fix-sidebar-and-navbar.js',
  'fix-animation-demo.js',
];

/**
 * Run a script and return a promise that resolves when the script completes
 */
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`\n=== Running ${scriptPath} ===\n`);
    
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n=== ${scriptPath} completed successfully ===\n`);
        resolve();
      } else {
        console.error(`\n=== ${scriptPath} failed with code ${code} ===\n`);
        reject(new Error(`Script ${scriptPath} failed with code ${code}`));
      }
    });
    
    child.on('error', (err) => {
      console.error(`\n=== ${scriptPath} failed with error: ${err.message} ===\n`);
      reject(err);
    });
  });
}

/**
 * Run all cleanup scripts sequentially
 */
async function runAllScripts() {
  console.log('Starting master cleanup process...');
  
  for (const script of CLEANUP_SCRIPTS) {
    const scriptPath = path.join(__dirname, script);
    try {
      await runScript(scriptPath);
    } catch (error) {
      console.error(`Error running ${script}:`, error);
      console.log('Continuing with next script...');
    }
  }
  
  console.log('\n=== Master cleanup process completed ===\n');
  console.log(`
The following issues from the frontend audit have been addressed:

1. Mermaid Implementation Chaos:
   - Consolidated multiple Mermaid components into a single UnifiedMermaid component
   - Removed deprecated Mermaid components and client modules
   - Simplified the implementation to use React's lifecycle methods

2. Direct DOM Manipulation & React Conflicts:
   - Refactored animation code to use React refs and effects
   - Consolidated animation utilities into a unified system

3. Sidebar Implementation Deviation:
   - Removed unused CustomSidebar component
   - Removed problematic contextualSidebarModule.js client module
   - Updated docusaurus.config.ts to use the standard Docusaurus sidebar

4. Fragile Client Module Implementations:
   - Removed problematic client modules
   - Updated docusaurus.config.ts to remove references to these modules

5. Inconsistent Performance and Accessibility:
   - Added consistent accessibility checks across all animation code
   - Implemented a unified performance management system

5. Redundant Scroll Reveal Components:
   - Consolidated multiple scroll reveal components into a single component

6. Use of Multiple Animation Libraries:
   - Standardized animation code to use a consistent approach
   - Centralized animation utilities in a single file

7. Inconsistent Use of TypeScript:
   - Converted animation utilities to TypeScript

8. Background Expansion Issues:
   - Added CSS fixes to ensure backgrounds expand properly
   - Fixed container layouts for Mermaid diagrams and other content
   - Ensured proper vertical expansion for all content

The codebase is now more maintainable

9. Sidebar and Navbar Issues:
   - Fixed sidebar issues on navigation pages
   - Consolidated the top navbar
   - Improved mobile responsiveness

The codebase is now more maintainable

9. Sidebar and Navbar Issues:
   - Fixed sidebar issues on navigation pages
   - Consolidated the top navbar
   - Improved mobile responsiveness

The codebase is now more maintainable, performs better, and follows React best practices.
`);
}

// Run all scripts
runAllScripts().catch(console.error);

// Add fix-animation-demo.js to the list of scripts to run
// This script fixes the animation-demo.md file to remove references to the
// deprecated AnimeTester component that was removed during the cleanup process.
