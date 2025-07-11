/**
 * Build with Increased Memory
 * 
 * This script builds the documentation with increased memory allocation
 * to prevent the build process from being killed due to memory constraints.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Building documentation with increased memory allocation...');

// Use NODE_OPTIONS to increase memory limit
const env = {
  ...process.env,
  NODE_OPTIONS: '--max-old-space-size=4096' // Allocate 4GB of memory
};

// Run the build command
const buildProcess = spawn('npx', ['docusaurus', 'build'], {
  env,
  stdio: 'inherit',
  shell: true
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Build completed successfully!');
  } else {
    console.error(`❌ Build failed with code ${code}`);
    
    // Provide suggestions for fixing the build
    console.log('\n🔧 Suggestions to fix the build:');
    console.log('1. Try increasing the memory allocation further (--max-old-space-size=6144 or higher)');
    console.log('2. Check for broken links using scripts/fix-broken-links.js');
    console.log('3. Check for Mermaid diagram issues using scripts/fix-mermaid-diagrams.js');
    console.log('4. Try running the build with the --no-minify flag to reduce memory usage');
  }
});
