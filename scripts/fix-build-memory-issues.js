/**
 * Fix Build Memory Issues Script
 * 
 * This script addresses memory issues during the build process by:
 * 1. Increasing the Node.js memory limit
 * 2. Reducing the number of worker threads
 * 3. Adding a workaround for VFileMessage serialization errors
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting to fix build memory issues...');

// Create a temporary build directory if it doesn't exist
const tempBuildDir = path.join(__dirname, '..', 'temp-build');
if (!fs.existsSync(tempBuildDir)) {
  fs.mkdirSync(tempBuildDir, { recursive: true });
  console.log(`Created temporary build directory: ${tempBuildDir}`);
}

// Fix VFileMessage serialization issue by adding a custom serializer
console.log('Adding VFileMessage serializer workaround...');

// Create a temporary file to fix the serialization issue
const serializerFixPath = path.join(__dirname, '..', 'src', 'vfile-message-serializer.js');
const serializerFixContent = `/**
 * VFileMessage Serializer Fix
 * 
 * This file adds a custom serializer for VFileMessage objects to fix serialization issues during the build process.
 */

// Add this file to the webpack cache serialization process
if (typeof global.WebpackSerializationRegistered === 'undefined') {
  global.WebpackSerializationRegistered = true;
  
  // Register a custom serializer for VFileMessage
  if (global.webpack && global.webpack.util && global.webpack.util.serialization) {
    const { registerSerializers } = global.webpack.util.serialization;
    
    registerSerializers({
      serialize: (vfileMessage) => {
        // Convert VFileMessage to a serializable object
        return {
          message: vfileMessage.message || '',
          reason: vfileMessage.reason || '',
          ruleId: vfileMessage.ruleId || null,
          source: vfileMessage.source || null,
          line: vfileMessage.line || null,
          column: vfileMessage.column || null,
          position: vfileMessage.position || null,
          fatal: vfileMessage.fatal || null,
        };
      },
      deserialize: (serialized) => {
        // Create a simple object with the serialized properties
        return serialized;
      },
      name: 'VFileMessage'
    });
  }
}
`;

fs.writeFileSync(serializerFixPath, serializerFixContent);
console.log(`Created VFileMessage serializer fix at: ${serializerFixPath}`);

// Update the docusaurus.config.ts to include the serializer fix
console.log('Updating docusaurus.config.ts to include the serializer fix...');

// Read the current docusaurus.config.ts
const docusaurusConfigPath = path.join(__dirname, '..', 'docusaurus.config.ts');
let docusaurusConfig = fs.readFileSync(docusaurusConfigPath, 'utf8');

// Add the serializer fix to the clientModules array if it's not already there
if (!docusaurusConfig.includes('vfile-message-serializer.js')) {
  // Find the clientModules array
  const clientModulesRegex = /clientModules:\s*\[([\s\S]*?)\]/;
  const clientModulesMatch = docusaurusConfig.match(clientModulesRegex);
  
  if (clientModulesMatch) {
    // Add the serializer fix to the end of the array
    const updatedClientModules = clientModulesMatch[0].replace(
      /\]$/,
      `,\n    require.resolve('./src/vfile-message-serializer.js')\n  ]`
    );
    
    // Replace the clientModules array in the config
    docusaurusConfig = docusaurusConfig.replace(clientModulesRegex, updatedClientModules);
    
    // Write the updated config
    fs.writeFileSync(docusaurusConfigPath, docusaurusConfig);
    console.log('Updated docusaurus.config.ts to include the serializer fix');
  } else {
    console.error('Could not find clientModules array in docusaurus.config.ts');
  }
}

// Create a build script with increased memory limit
console.log('Creating optimized build script...');

const buildScriptPath = path.join(__dirname, '..', 'build-with-increased-memory.js');
const buildScriptContent = `/**
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
`;

fs.writeFileSync(buildScriptPath, buildScriptContent);
console.log(`Created optimized build script at: ${buildScriptPath}`);

// Add the build script to package.json
console.log('Updating package.json to include the optimized build script...');

// Read the current package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add the build script if it doesn't exist
if (!packageJson.scripts['build-with-increased-memory']) {
  packageJson.scripts['build-with-increased-memory'] = 'node ./build-with-increased-memory.js';
  
  // Write the updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json to include the optimized build script');
}

console.log('Finished fixing build memory issues.');
console.log('');
console.log('To build the documentation with increased memory, run:');
console.log('npm run build-with-increased-memory');
