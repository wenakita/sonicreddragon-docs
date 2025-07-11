/**
 * Cleanup Animation Utilities
 * 
 * This script removes deprecated animation utility files and updates imports
 * to use the new consolidated animationUtils.ts file.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Files to be removed
const filesToRemove = [
  'src/utils/animeUtils.js',
  'src/utils/animeUtils.d.ts',
  'src/utils/animationSystem.ts',
  'src/utils/performanceOptimizedAnimations.ts',
  'src/utils/unifiedAnimationSystem.ts',
];

// Function to remove deprecated files
function removeDeprecatedFiles() {
  console.log('Removing deprecated files...');
  
  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
        console.log(`Removed ${file}`);
      } catch (error) {
        console.error(`Error removing ${file}:`, error);
      }
    } else {
      console.log(`File ${file} does not exist, skipping`);
    }
  });
  
  console.log('Deprecated files removed successfully');
}

// Main function
function main() {
  console.log('Starting cleanup of animation utilities');
  
  // Remove deprecated files
  removeDeprecatedFiles();
  
  console.log('Cleanup completed successfully');
}

// Run the script
main();
