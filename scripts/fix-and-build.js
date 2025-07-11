/**
 * Fix and Build Script
 * 
 * This script:
 * 1. Runs the fix-broken-links.js script to fix broken links
 * 2. Builds the documentation with increased memory allocation
 */

const { execSync } = require('child_process');
const path = require('path');

// Main function
async function fixAndBuild() {
  console.log('Starting fix and build process...');
  
  try {
    // Step 1: Fix broken links
    console.log('\n=== STEP 1: Fixing broken links ===\n');
    execSync('node scripts/fix-broken-links.js', { stdio: 'inherit' });
    
    // Step 2: Build documentation with increased memory
    console.log('\n=== STEP 2: Building documentation ===\n');
    execSync('NODE_OPTIONS=--max_old_space_size=4096 npm run build', { stdio: 'inherit' });
    
    console.log('\n=== SUCCESS: Documentation fixed and built successfully! ===\n');
  } catch (error) {
    console.error('\n=== ERROR: Fix and build process failed ===\n');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  fixAndBuild().catch(console.error);
}

module.exports = { fixAndBuild };
