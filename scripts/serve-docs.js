/**
 * Serve Documentation Script
 * 
 * This script serves the built documentation on a local server
 * so it can be verified in a browser.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting documentation server...');

// Check if build directory exists
const buildDir = path.join(__dirname, '..', 'build');
if (!fs.existsSync(buildDir)) {
  console.error('Error: Build directory does not exist. Please run the build script first.');
  process.exit(1);
}

// Serve the documentation
try {
  console.log('Serving documentation on http://localhost:3000');
  console.log('Press Ctrl+C to stop the server');
  
  execSync('npx serve build -l 3000', { 
    stdio: 'inherit'
  });
} catch (error) {
  // This will only execute if the server is stopped with Ctrl+C
  console.log('\nServer stopped.');
}
