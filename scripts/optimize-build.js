/**
 * Optimize Build Script
 * 
 * This script optimizes the build process by:
 * 1. Clearing the Docusaurus cache
 * 2. Running the fix-missing-images script
 * 3. Running the fix-remaining-links script
 * 4. Building the documentation with optimized settings
 */

const { execSync } = require('child_process');

console.log('Starting optimized build process...');

// Clear Docusaurus cache
console.log('Clearing Docusaurus cache...');
try {
  execSync('npm run clear', { stdio: 'inherit' });
  console.log('Cache cleared successfully.');
} catch (error) {
  console.error('Error clearing cache:', error);
  process.exit(1);
}

// Run fix-missing-images script
console.log('Running fix-missing-images script...');
try {
  execSync('npm run fix-missing-images', { stdio: 'inherit' });
  console.log('Fixed missing images successfully.');
} catch (error) {
  console.error('Error fixing missing images:', error);
  process.exit(1);
}

// Run fix-remaining-links script
console.log('Running fix-remaining-links script...');
try {
  execSync('npm run fix-links', { stdio: 'inherit' });
  console.log('Fixed remaining links successfully.');
} catch (error) {
  console.error('Error fixing remaining links:', error);
  process.exit(1);
}

// Run fix-broken-links script
console.log('Running fix-broken-links script...');
try {
  execSync('npm run fix-broken-links', { stdio: 'inherit' });
  console.log('Fixed broken links successfully.');
} catch (error) {
  console.error('Error fixing broken links:', error);
  process.exit(1);
}

// Build documentation with optimized settings
console.log('Building documentation with optimized settings...');
try {
  // Set NODE_OPTIONS to increase memory limit and reduce worker threads
  process.env.NODE_OPTIONS = '--max-old-space-size=4096 --max-http-header-size=16384';
  process.env.DOCUSAURUS_WORKERS = '1'; // Reduce worker threads to minimize memory usage
  
  execSync('npx docusaurus build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('Build completed successfully.');
} catch (error) {
  console.error('Error building documentation:', error);
  process.exit(1);
}

console.log('Optimized build process completed.');
