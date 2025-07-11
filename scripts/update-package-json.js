#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Updating package.json to include pre-start fixes...\n');

// Read package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
let packageJson;

try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
} catch (error) {
  console.error(`❌ Error reading package.json: ${error.message}`);
  process.exit(1);
}

// Check if scripts section exists
if (!packageJson.scripts) {
  packageJson.scripts = {};
}

// Add or update scripts
const originalScripts = JSON.stringify(packageJson.scripts);

// Add pre-start script
packageJson.scripts.prestart = 'node scripts/fix-all-docs-issues.js';

// Add fix-docs script
packageJson.scripts['fix-docs'] = 'node scripts/fix-all-docs-issues.js';

// Add verify-docs script
packageJson.scripts['verify-docs'] = 'node scripts/verify-fixes.js';

// Write updated package.json
try {
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  
  if (originalScripts !== JSON.stringify(packageJson.scripts)) {
    console.log('✅ Updated package.json with the following scripts:');
    console.log(`   - prestart: ${packageJson.scripts.prestart}`);
    console.log(`   - fix-docs: ${packageJson.scripts['fix-docs']}`);
    console.log(`   - verify-docs: ${packageJson.scripts['verify-docs']}`);
  } else {
    console.log('⚠️ No changes made to package.json');
  }
} catch (error) {
  console.error(`❌ Error writing package.json: ${error.message}`);
  process.exit(1);
}

console.log('\n🚀 Package.json update completed!');
console.log('\nYou can now run the following commands:');
console.log('   - npm start: Automatically fixes documentation issues before starting the development server');
console.log('   - npm run fix-docs: Manually fix documentation issues');
console.log('   - npm run verify-docs: Verify that all documentation issues have been fixed');
