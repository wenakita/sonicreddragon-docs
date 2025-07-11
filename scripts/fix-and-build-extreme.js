/**
 * Fix and Build with Extreme Optimization Script
 * 
 * This script combines all the fixes and builds the documentation with extreme optimization settings.
 */

const { execSync } = require('child_process');

console.log('=== Starting Fix and Build with Extreme Optimization Process ===');

try {
  // Step 1: Fix broken links
  console.log('\n=== Step 1: Fixing broken links ===');
  execSync('npm run fix-broken-links', { stdio: 'inherit' });

  // Step 2: Apply memory optimization fixes
  console.log('\n=== Step 2: Applying memory optimization fixes ===');
  execSync('npm run fix-build-memory-issues', { stdio: 'inherit' });

  // Step 3: Apply Mermaid memory optimization fixes
  console.log('\n=== Step 3: Applying Mermaid memory optimization fixes ===');
  execSync('npm run fix-mermaid-memory-issues', { stdio: 'inherit' });

  // Step 4: Clear previous build
  console.log('\n=== Step 4: Clearing previous build ===');
  execSync('npm run clear', { stdio: 'inherit' });

  // Step 5: Build with extreme optimization
  console.log('\n=== Step 5: Building with extreme optimization ===');
  execSync('npm run build-with-extreme-optimization', { stdio: 'inherit' });

  console.log('\n=== Documentation built successfully! ===');
  console.log('You can serve the built documentation with:');
  console.log('npm run serve-build');

} catch (error) {
  console.error('Error building documentation:', error);
  process.exit(1);
}
