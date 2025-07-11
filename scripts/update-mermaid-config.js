#!/usr/bin/env node

/**
 * Update Mermaid Configuration
 * 
 * This script updates the docusaurus.config.ts file to properly
 * include the Mermaid modules and CSS files for optimal rendering.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 UPDATING MERMAID CONFIGURATION');
console.log('================================\n');

// Configuration
const config = {
  docusaurusConfigPath: 'docusaurus.config.ts',
  backupDir: 'backups',
  clientModules: [
    './src/clientModules/optimizedMermaidInit.js',
    './src/clientModules/mermaidAnimations.js',
    './src/clientModules/mermaidAnimeIntegration.js'
  ],
  stylesheets: [
    {
      href: '/css/mermaid-animations.css',
      type: 'text/css'
    }
  ],
  dependencies: [
    { name: 'animejs', version: '^3.2.1' }
  ]
};

// Create backup directory if it doesn't exist
if (!fs.existsSync(config.backupDir)) {
  fs.mkdirSync(config.backupDir, { recursive: true });
}

// Backup the config file
function backupFile(filePath) {
  const backupPath = path.join(config.backupDir, path.basename(filePath) + '.backup');
  fs.copyFileSync(filePath, backupPath);
  console.log(`  ✅ Backed up ${filePath} to ${backupPath}`);
  return backupPath;
}

// Update the docusaurus.config.ts file
function updateDocusaurusConfig() {
  console.log('Updating docusaurus.config.ts...');
  
  if (!fs.existsSync(config.docusaurusConfigPath)) {
    console.error(`  ❌ Config file not found at ${config.docusaurusConfigPath}`);
    return false;
  }
  
  try {
    // Backup the file
    backupFile(config.docusaurusConfigPath);
    
    // Read the file
    let configContent = fs.readFileSync(config.docusaurusConfigPath, 'utf8');
    
    // Update the config
    configContent = updateThemes(configContent);
    configContent = updateClientModules(configContent);
    configContent = updateStylesheets(configContent);
    configContent = updateMarkdownConfig(configContent);
    
    // Write the updated config
    fs.writeFileSync(config.docusaurusConfigPath, configContent);
    
    console.log(`  ✅ Updated ${config.docusaurusConfigPath}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error updating config: ${error.message}`);
    return false;
  }
}

// Update the themes section
function updateThemes(content) {
  console.log('  Updating themes...');
  
  // Check if the themes section exists
  if (content.includes('themes:')) {
    // Check if the mermaid theme is already included
    if (content.includes('@docusaurus/theme-mermaid')) {
      console.log('    ℹ️ Mermaid theme already included');
    } else {
      // Add the mermaid theme
      content = content.replace(
        /themes\s*:\s*\[([\s\S]*?)\]/,
        (match, themesContent) => {
          return `themes: [${themesContent}${themesContent.trim() ? ',' : ''}\n    '@docusaurus/theme-mermaid'\n  ]`;
        }
      );
      console.log('    ✅ Added Mermaid theme');
    }
  } else {
    // Add the themes section
    content = content.replace(
      /(module\.exports\s*=\s*{[\s\S]*?)(\n\s*}\s*;?\s*$)/,
      `$1\n  themes: [\n    '@docusaurus/theme-mermaid'\n  ],$2`
    );
    console.log('    ✅ Added themes section with Mermaid theme');
  }
  
  return content;
}

// Update the clientModules section
function updateClientModules(content) {
  console.log('  Updating clientModules...');
  
  // Check if the clientModules section exists
  if (content.includes('clientModules:')) {
    // Get the current client modules
    const clientModulesMatch = content.match(/clientModules\s*:\s*\[([\s\S]*?)\]/);
    if (clientModulesMatch) {
      const currentModules = clientModulesMatch[1];
      
      // Add our client modules if they don't exist
      let updatedModules = currentModules;
      
      config.clientModules.forEach(module => {
        const modulePattern = module.replace(/\./g, '\\.').replace(/\//g, '\\/');
        if (!new RegExp(modulePattern).test(updatedModules)) {
          updatedModules += `${updatedModules.trim() ? ',' : ''}\n    require.resolve('${module}')`;
          console.log(`    ✅ Added client module: ${module}`);
        } else {
          console.log(`    ℹ️ Client module already included: ${module}`);
        }
      });
      
      // Update the content
      content = content.replace(
        /clientModules\s*:\s*\[([\s\S]*?)\]/,
        `clientModules: [${updatedModules}\n  ]`
      );
    }
  } else {
    // Add the clientModules section
    const modulesList = config.clientModules.map(module => `    require.resolve('${module}')`).join(',\n');
    
    content = content.replace(
      /(module\.exports\s*=\s*{[\s\S]*?)(\n\s*}\s*;?\s*$)/,
      `$1\n  clientModules: [\n${modulesList}\n  ],$2`
    );
    console.log('    ✅ Added clientModules section');
  }
  
  return content;
}

// Update the stylesheets section
function updateStylesheets(content) {
  console.log('  Updating stylesheets...');
  
  // Check if the stylesheets section exists
  if (content.includes('stylesheets:')) {
    // Get the current stylesheets
    const stylesheetsMatch = content.match(/stylesheets\s*:\s*\[([\s\S]*?)\]/);
    if (stylesheetsMatch) {
      const currentStylesheets = stylesheetsMatch[1];
      
      // Add our stylesheets if they don't exist
      let updatedStylesheets = currentStylesheets;
      
      config.stylesheets.forEach(stylesheet => {
        const stylesheetPattern = stylesheet.href.replace(/\//g, '\\/');
        if (!new RegExp(stylesheetPattern).test(updatedStylesheets)) {
          updatedStylesheets += `${updatedStylesheets.trim() ? ',' : ''}\n    {\n      href: '${stylesheet.href}',\n      type: '${stylesheet.type}'\n    }`;
          console.log(`    ✅ Added stylesheet: ${stylesheet.href}`);
        } else {
          console.log(`    ℹ️ Stylesheet already included: ${stylesheet.href}`);
        }
      });
      
      // Update the content
      content = content.replace(
        /stylesheets\s*:\s*\[([\s\S]*?)\]/,
        `stylesheets: [${updatedStylesheets}\n  ]`
      );
    }
  } else {
    // Add the stylesheets section
    const stylesheetsList = config.stylesheets.map(stylesheet => 
      `    {\n      href: '${stylesheet.href}',\n      type: '${stylesheet.type}'\n    }`
    ).join(',\n');
    
    content = content.replace(
      /(module\.exports\s*=\s*{[\s\S]*?)(\n\s*}\s*;?\s*$)/,
      `$1\n  stylesheets: [\n${stylesheetsList}\n  ],$2`
    );
    console.log('    ✅ Added stylesheets section');
  }
  
  return content;
}

// Update the markdown config
function updateMarkdownConfig(content) {
  console.log('  Updating markdown config...');
  
  // Check if the markdown section exists
  if (content.includes('markdown:')) {
    // Check if mermaid is already enabled
    if (content.includes('mermaid: true')) {
      console.log('    ℹ️ Mermaid already enabled in markdown config');
    } else {
      // Add mermaid to the markdown config
      content = content.replace(
        /markdown\s*:\s*{([\s\S]*?)}/,
        (match, markdownContent) => {
          return `markdown: {${markdownContent}${markdownContent.trim() ? ',' : ''}\n    mermaid: true\n  }`;
        }
      );
      console.log('    ✅ Enabled Mermaid in markdown config');
    }
  } else {
    // Add the markdown section
    content = content.replace(
      /(module\.exports\s*=\s*{[\s\S]*?)(\n\s*}\s*;?\s*$)/,
      `$1\n  markdown: {\n    mermaid: true\n  },$2`
    );
    console.log('    ✅ Added markdown section with Mermaid enabled');
  }
  
  return content;
}

// Create necessary directories
function createDirectories() {
  console.log('Creating necessary directories...');
  
  // Create the css directory in static if it doesn't exist
  const staticCssDir = path.join('static', 'css');
  if (!fs.existsSync(staticCssDir)) {
    fs.mkdirSync(staticCssDir, { recursive: true });
    console.log(`  ✅ Created ${staticCssDir}`);
  } else {
    console.log(`  ℹ️ Directory already exists: ${staticCssDir}`);
  }
  
  return true;
}

// Copy CSS files to static directory
function copyCssFiles() {
  console.log('Copying CSS files to static directory...');
  
  // Copy mermaid-animations.css to static/css
  const sourceCssPath = path.join('src', 'css', 'mermaid-animations.css');
  const targetCssPath = path.join('static', 'css', 'mermaid-animations.css');
  
  if (fs.existsSync(sourceCssPath)) {
    fs.copyFileSync(sourceCssPath, targetCssPath);
    console.log(`  ✅ Copied ${sourceCssPath} to ${targetCssPath}`);
    return true;
  } else {
    console.error(`  ❌ Source CSS file not found: ${sourceCssPath}`);
    return false;
  }
}

// Install dependencies
function installDependencies() {
  console.log('Installing dependencies...');
  
  config.dependencies.forEach(dep => {
    console.log(`  Installing ${dep.name}@${dep.version}...`);
    
    try {
      // Check if dependency is already installed
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};
      
      if (dependencies[dep.name] || devDependencies[dep.name]) {
        console.log(`    ℹ️ ${dep.name} is already installed`);
      } else {
        console.log(`    ⚠️ ${dep.name} is not installed. Please run:`);
        console.log(`       npm install ${dep.name}@${dep.version}`);
      }
    } catch (error) {
      console.error(`    ❌ Error checking dependency: ${error.message}`);
    }
  });
  
  return true;
}

// Main function
function main() {
  console.log('Starting Mermaid configuration update...\n');
  
  // Create necessary directories
  createDirectories();
  
  // Copy CSS files
  copyCssFiles();
  
  // Install dependencies
  installDependencies();
  
  // Update the docusaurus config
  const success = updateDocusaurusConfig();
  
  if (success) {
    console.log('\n✅ MERMAID CONFIGURATION UPDATE COMPLETE!');
    console.log('=======================================');
    console.log('');
    console.log('The following changes have been made:');
    console.log('1. Added @docusaurus/theme-mermaid to themes');
    console.log('2. Added optimizedMermaidInit.js, mermaidAnimations.js, and mermaidAnimeIntegration.js to clientModules');
    console.log('3. Added mermaid-animations.css to stylesheets');
    console.log('4. Enabled Mermaid in markdown config');
    console.log('5. Checked for required dependencies (anime.js)');
    console.log('');
    console.log('To apply these changes:');
    console.log('1. Install required dependencies if not already installed:');
    console.log('  npm install animejs@^3.2.1');
    console.log('');
    console.log('2. Rebuild your site:');
    console.log('  npm run build');
    console.log('');
    console.log('To test locally, run:');
    console.log('  npm run serve');
    console.log('');
  } else {
    console.log('\n❌ MERMAID CONFIGURATION UPDATE FAILED!');
    console.log('====================================');
    console.log('');
    console.log('Please check the error messages above and try again.');
    console.log('');
  }
}

// Run the main function
main();
