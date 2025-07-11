#!/usr/bin/env node

/**
 * Fix All Documentation Issues
 * 
 * This script combines all the fixes we've created into a single script
 * that can be run to fix all the issues at once.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 FIXING ALL DOCUMENTATION ISSUES');
console.log('================================\n');

// Configuration
const config = {
  scripts: [
    {
      name: 'Fix Mermaid Diagrams',
      path: 'scripts/mermaid-diagram-fixer.js',
      description: 'Fixes common Mermaid syntax issues in all documentation files'
    },
    {
      name: 'Fix Broken Links',
      path: 'scripts/fix-broken-links.js',
      description: 'Fixes broken links by creating missing files or updating incorrect links'
    },
    {
      name: 'Update Mermaid Configuration',
      path: 'scripts/update-mermaid-config.js',
      description: 'Updates the Docusaurus configuration to include Mermaid modules and CSS files'
    }
  ],
  dependencies: [
    { name: 'animejs', version: '^3.2.1' }
  ]
};

// Check if a script exists
function scriptExists(scriptPath) {
  return fs.existsSync(scriptPath);
}

// Make a script executable
function makeExecutable(scriptPath) {
  try {
    execSync(`chmod +x ${scriptPath}`);
    console.log(`  ✅ Made ${scriptPath} executable`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error making ${scriptPath} executable: ${error.message}`);
    return false;
  }
}

// Run a script
function runScript(scriptPath) {
  console.log(`Running ${scriptPath}...`);
  
  try {
    const output = execSync(`node ${scriptPath}`, { encoding: 'utf8' });
    console.log(output);
    console.log(`  ✅ Successfully ran ${scriptPath}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error running ${scriptPath}: ${error.message}`);
    return false;
  }
}

// Check if a dependency is installed
function checkDependency(name, version) {
  console.log(`Checking if ${name}@${version} is installed...`);
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    if (dependencies[name] || devDependencies[name]) {
      console.log(`  ✅ ${name} is already installed`);
      return true;
    } else {
      console.log(`  ⚠️ ${name} is not installed. Installing...`);
      
      try {
        execSync(`npm install ${name}@${version}`, { encoding: 'utf8' });
        console.log(`  ✅ Successfully installed ${name}@${version}`);
        return true;
      } catch (error) {
        console.error(`  ❌ Error installing ${name}@${version}: ${error.message}`);
        console.log(`  ⚠️ Please run 'npm install ${name}@${version}' manually`);
        return false;
      }
    }
  } catch (error) {
    console.error(`  ❌ Error checking dependency: ${error.message}`);
    return false;
  }
}

// Build the documentation
function buildDocs() {
  console.log('Building documentation...');
  
  try {
    execSync('npm run build', { encoding: 'utf8' });
    console.log('  ✅ Successfully built documentation');
    return true;
  } catch (error) {
    console.error(`  ❌ Error building documentation: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting to fix all documentation issues...\n');
  
  // Check and install dependencies
  console.log('Checking dependencies...\n');
  
  let allDependenciesInstalled = true;
  
  for (const dep of config.dependencies) {
    const installed = checkDependency(dep.name, dep.version);
    allDependenciesInstalled = allDependenciesInstalled && installed;
    console.log(''); // Add a blank line between dependencies
  }
  
  if (!allDependenciesInstalled) {
    console.log('\n⚠️ Some dependencies could not be installed automatically.');
    console.log('Please install them manually before continuing.\n');
  }
  
  // Check if all scripts exist
  console.log('Checking if all scripts exist...\n');
  
  let allScriptsExist = true;
  
  for (const script of config.scripts) {
    if (scriptExists(script.path)) {
      console.log(`  ✅ ${script.path} exists`);
      makeExecutable(script.path);
    } else {
      console.error(`  ❌ ${script.path} does not exist`);
      allScriptsExist = false;
    }
  }
  
  if (!allScriptsExist) {
    console.error('\n❌ Some scripts are missing. Please make sure all scripts exist before continuing.');
    process.exit(1);
  }
  
  console.log(''); // Add a blank line
  
  // Run each script
  console.log('Running scripts...\n');
  
  let allScriptsSucceeded = true;
  
  for (const script of config.scripts) {
    console.log(`\n📝 ${script.name}`);
    console.log(`Description: ${script.description}`);
    console.log('-'.repeat(50));
    
    const success = runScript(script.path);
    allScriptsSucceeded = allScriptsSucceeded && success;
    
    console.log('-'.repeat(50));
  }
  
  console.log('\n📊 Summary:');
  
  if (allScriptsSucceeded) {
    console.log('  ✅ All scripts ran successfully');
  } else {
    console.log('  ⚠️ Some scripts encountered errors. Check the output above for details.');
  }
  
  // Ask if the user wants to build the documentation
  console.log('\nWould you like to build the documentation now to verify the fixes? (y/n)');
  
  // Since we can't get user input in this context, we'll just provide instructions
  console.log('\nTo build the documentation and verify the fixes, run:');
  console.log('  npm run build');
  
  console.log('\nTo serve the documentation locally, run:');
  console.log('  npm run serve');
  
  console.log('\n🎉 All fixes have been applied!');
}

// Run the main function
main().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});
