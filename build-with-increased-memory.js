/**
 * Build with Increased Memory Script
 * 
 * This script builds the documentation with increased memory limit and reduced worker threads.
 */

const { execSync } = require('child_process');

console.log('Starting build with increased memory...');

try {
  // Set environment variables to optimize the build process
  process.env.NODE_OPTIONS = '--max-old-space-size=8192 --max-http-header-size=16384';
  process.env.DOCUSAURUS_WORKERS = '1'; // Reduce worker threads to minimize memory usage
  
  // Run the build command
  execSync('npx docusaurus build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('Build completed successfully.');
} catch (error) {
  console.error('Error building documentation:', error);
  process.exit(1);
}
