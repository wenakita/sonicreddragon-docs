/**
 * Cleanup Client Modules Script
 * 
 * This script removes deprecated and problematic client modules
 * and updates the docusaurus.config.ts file accordingly.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Client modules to remove
const DEPRECATED_CLIENT_MODULES = [
  'src/clientModules/unifiedMermaidModule.js',
  'src/clientModules/enhancedMermaidInit.js',
  'src/clientModules/mermaidFixModule.js',
];

// Plugins to remove
const DEPRECATED_PLUGINS = [
  'src/plugins/mermaid-plugin.js',
];

/**
 * Update the docusaurus.config.ts file to remove references to deprecated modules
 */
async function updateDocusaurusConfig() {
  const configPath = 'docusaurus.config.ts';
  
  try {
    if (!fs.existsSync(configPath)) {
      console.log(`Config file not found: ${configPath}`);
      return;
    }

    let content = await readFile(configPath, 'utf8');
    let modified = false;

    // Remove references to deprecated client modules
    for (const modulePath of DEPRECATED_CLIENT_MODULES) {
      const moduleName = path.basename(modulePath, path.extname(modulePath));
      const modulePattern = new RegExp(`['"]\\.\\/src\\/clientModules\\/${moduleName}['"]`, 'g');
      
      if (modulePattern.test(content)) {
        content = content.replace(modulePattern, '');
        modified = true;
        console.log(`Removed reference to ${moduleName} from docusaurus.config.ts`);
      }
    }

    // Remove references to deprecated plugins
    for (const pluginPath of DEPRECATED_PLUGINS) {
      const pluginName = path.basename(pluginPath, path.extname(pluginPath));
      const pluginPattern = new RegExp(`['"]\\.\\/src\\/plugins\\/${pluginName}['"]`, 'g');
      
      if (pluginPattern.test(content)) {
        content = content.replace(pluginPattern, '');
        modified = true;
        console.log(`Removed reference to ${pluginName} from docusaurus.config.ts`);
      }
    }

    // Clean up any empty arrays or trailing commas
    content = content.replace(/clientModules:\s*\[\s*,\s*\]/g, 'clientModules: []');
    content = content.replace(/clientModules:\s*\[\s*,\s*,\s*\]/g, 'clientModules: []');
    content = content.replace(/plugins:\s*\[\s*,\s*\]/g, 'plugins: []');
    content = content.replace(/plugins:\s*\[\s*,\s*,\s*\]/g, 'plugins: []');
    content = content.replace(/,\s*,/g, ',');
    content = content.replace(/,\s*\]/g, ']');

    if (modified) {
      await writeFile(configPath, content, 'utf8');
      console.log(`Updated docusaurus.config.ts`);
    }
  } catch (error) {
    console.error(`Error updating docusaurus.config.ts:`, error);
  }
}

/**
 * Main cleanup function
 */
async function cleanup() {
  console.log('Starting client modules cleanup...');

  // Remove deprecated client modules
  for (const modulePath of DEPRECATED_CLIENT_MODULES) {
    try {
      if (fs.existsSync(modulePath)) {
        await unlink(modulePath);
        console.log(`Removed deprecated client module: ${modulePath}`);
      } else {
        console.log(`Client module already removed: ${modulePath}`);
      }
    } catch (error) {
      console.error(`Error removing client module ${modulePath}:`, error);
    }
  }

  // Remove deprecated plugins
  for (const pluginPath of DEPRECATED_PLUGINS) {
    try {
      if (fs.existsSync(pluginPath)) {
        await unlink(pluginPath);
        console.log(`Removed deprecated plugin: ${pluginPath}`);
      } else {
        console.log(`Plugin already removed: ${pluginPath}`);
      }
    } catch (error) {
      console.error(`Error removing plugin ${pluginPath}:`, error);
    }
  }

  // Update docusaurus.config.ts
  await updateDocusaurusConfig();

  console.log('Client modules cleanup completed!');
}

// Run the cleanup
cleanup().catch(console.error);
