/**
 * Rebuild With Mermaid Fix Script
 * 
 * This script rebuilds the documentation with the Mermaid fix applied.
 * It runs the fix-mermaid-rendering.js script and then rebuilds the documentation.
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('=== Rebuilding Documentation with Mermaid Fix ===');

try {
  // Step 1: Fix missing images
  console.log('\n=== Step 1: Fixing missing images ===');
  execSync('node ./scripts/fix-missing-images.js', { stdio: 'inherit' });

  // Step 2: Fix broken links
  console.log('\n=== Step 2: Fixing broken links ===');
  execSync('node ./scripts/fix-remaining-links.js', { stdio: 'inherit' });

  // Step 3: Fix all markdown links
  console.log('\n=== Step 3: Fixing all markdown links ===');
  execSync('node ./scripts/fix-all-markdown-links.js', { stdio: 'inherit' });

  // Step 3.5: Fix broken links
  console.log('\n=== Step 3.5: Fixing broken links ===');
  execSync('node ./scripts/fix-broken-links.js', { stdio: 'inherit' });

  // Step 4: Fix Mermaid diagrams
  console.log('\n=== Step 4: Fixing Mermaid diagrams ===');
  execSync('node ./scripts/fix-mermaid-diagrams.js', { stdio: 'inherit' });

  // Step 5: Enhance Mermaid with interactive features
  console.log('\n=== Step 5: Enhancing Mermaid diagrams with interactive features ===');
  execSync('node ./scripts/enhance-mermaid-interactive.js', { stdio: 'inherit' });

  // Step 6: Clear previous build
  console.log('\n=== Step 6: Clearing previous build ===');
  execSync('npm run clear', { stdio: 'inherit' });

  // Step 7: Build with optimized settings
  console.log('\n=== Step 7: Building with optimized settings ===');
  execSync('node ./scripts/optimize-build.js', { stdio: 'inherit' });

  // Step 8: Serve the built documentation
  console.log('\n=== Step 8: Serving the built documentation ===');
  console.log('Starting server...');
  console.log('You can view the documentation at http://localhost:3000');
  execSync('npm run serve-build', { stdio: 'inherit' });

} catch (error) {
  console.error('Error rebuilding documentation:', error);
  process.exit(1);
}
