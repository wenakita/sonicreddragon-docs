/**
 * Fix and Build Documentation Script
 * 
 * This script combines all the fixes and builds the documentation with optimized settings.
 * It fixes broken links, applies memory optimization fixes, and builds with increased memory.
 */

const { execSync } = require('child_process');

console.log('=== Starting Fix and Build Documentation Process ===');

try {
  // Step 1: Fix broken links
  console.log('\n=== Step 1: Fixing broken links ===');
  execSync('npm run fix-broken-links', { stdio: 'inherit' });

  // Step 2: Apply memory optimization fixes
  console.log('\n=== Step 2: Applying memory optimization fixes ===');
  execSync('npm run fix-build-memory-issues', { stdio: 'inherit' });

  // Step 3: Clear previous build
  console.log('\n=== Step 3: Clearing previous build ===');
  execSync('npm run clear', { stdio: 'inherit' });

  // Step 4: Build with increased memory
  console.log('\n=== Step 4: Building with increased memory ===');
  
  // Set environment variables to optimize the build process
  process.env.NODE_OPTIONS = '--max-old-space-size=8192 --max-http-header-size=16384';
  process.env.DOCUSAURUS_WORKERS = '1'; // Reduce worker threads to minimize memory usage
  
  // Run the build command with all the fixes
  execSync('npm run fix-missing-images && npm run fix-links && npm run fix-all-markdown-links && npm run fix-broken-links && npx docusaurus build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });

  console.log('\n=== Documentation built successfully! ===');
  console.log('You can serve the built documentation with:');
  console.log('npm run serve-build');

} catch (error) {
  console.error('Error building documentation:', error);
  process.exit(1);
}
