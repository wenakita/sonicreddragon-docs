/**
 * Fix Animation Demo Script
 * 
 * This script fixes the animation-demo.md file to remove references to the
 * deprecated AnimeTester component that was removed during the cleanup process.
 */

const fs = require('fs');
const path = require('path');

async function fixAnimationDemo() {
  console.log('Starting animation demo fix...');

  const animationDemoPath = path.join(__dirname, '../docs/contracts/jackpot/animation-demo.md');
  
  // Check if the file exists
  if (!fs.existsSync(animationDemoPath)) {
    console.error(`File not found: ${animationDemoPath}`);
    return;
  }

  // Read the file content
  let content = fs.readFileSync(animationDemoPath, 'utf8');

  // Remove the import for AnimeTester
  content = content.replace(/import AnimeTester from '@site\/src\/components\/AnimeTester';(\r?\n)?/g, '');

  // Remove the AnimeTester component usage
  content = content.replace(/<AnimeTester \/>(\r?\n)?/g, '');

  // Update the troubleshooting section to remove reference to AnimeTester
  content = content.replace(
    /4\. Try using a simple test animation like `AnimeTester` to verify configuration/g,
    '4. Try using a simple animation component to verify configuration'
  );

  // Write the updated content back to the file
  fs.writeFileSync(animationDemoPath, content, 'utf8');

  console.log('✅ Updated animation-demo.md to remove AnimeTester references');
  console.log('Animation demo fix completed!');
}

// Run the function
fixAnimationDemo().catch(console.error);
