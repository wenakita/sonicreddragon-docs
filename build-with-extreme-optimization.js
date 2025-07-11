/**
 * Build with Extreme Memory Optimization Script
 * 
 * This script builds the documentation with extreme memory optimization settings.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build with extreme memory optimization...');

try {
  // Set environment variables to optimize the build process
  process.env.NODE_OPTIONS = '--max-old-space-size=12288 --max-http-header-size=16384 --no-warnings --expose-gc';
  process.env.DOCUSAURUS_WORKERS = '1'; // Reduce worker threads to minimize memory usage
  process.env.DOCUSAURUS_PREFETCH_PAGES = 'false'; // Disable prefetching
  
  // Disable certain features to reduce memory usage
  process.env.DISABLE_MERMAID_INTERACTIVE = 'true';
  
  // Run the build command with minimal features
  execSync('npx docusaurus build --no-minify', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('Build completed successfully.');
  
  // Restore the original files
  console.log('Restoring original files...');
  
  // Restore mermaidInteractiveModule.js
  const mermaidInteractiveModulePath = path.join(__dirname, '..', 'src', 'clientModules', 'mermaidInteractiveModule.js');
  const mermaidInteractiveModuleBackupPath = path.join(__dirname, '..', 'backup', 'mermaidInteractiveModule.js.backup');
  
  if (fs.existsSync(mermaidInteractiveModuleBackupPath)) {
    fs.copyFileSync(mermaidInteractiveModuleBackupPath, mermaidInteractiveModulePath);
    console.log('Restored mermaidInteractiveModule.js');
  }
  
  // Restore problematic Mermaid files
  const problematicFiles = [
    {
      path: path.join(__dirname, '..', 'docs', 'MERMAID_INTERACTIVE_ENHANCEMENT_REPORT.md'),
      backupPath: path.join(__dirname, '..', 'backup', 'MERMAID_INTERACTIVE_ENHANCEMENT_REPORT.md.backup')
    },
    {
      path: path.join(__dirname, '..', 'docs', 'test-interactive-mermaid.md'),
      backupPath: path.join(__dirname, '..', 'backup', 'test-interactive-mermaid.md.backup')
    }
  ];
  
  problematicFiles.forEach(file => {
    if (fs.existsSync(file.backupPath)) {
      fs.copyFileSync(file.backupPath, file.path);
      console.log(`Restored ${file.path}`);
    }
  });
  
  console.log('All original files restored.');
  
} catch (error) {
  console.error('Error building documentation:', error);
  
  // Restore the original files even if the build fails
  console.log('Restoring original files after build failure...');
  
  // Restore mermaidInteractiveModule.js
  const mermaidInteractiveModulePath = path.join(__dirname, '..', 'src', 'clientModules', 'mermaidInteractiveModule.js');
  const mermaidInteractiveModuleBackupPath = path.join(__dirname, '..', 'backup', 'mermaidInteractiveModule.js.backup');
  
  if (fs.existsSync(mermaidInteractiveModuleBackupPath)) {
    fs.copyFileSync(mermaidInteractiveModuleBackupPath, mermaidInteractiveModulePath);
    console.log('Restored mermaidInteractiveModule.js');
  }
  
  // Restore problematic Mermaid files
  const problematicFiles = [
    {
      path: path.join(__dirname, '..', 'docs', 'MERMAID_INTERACTIVE_ENHANCEMENT_REPORT.md'),
      backupPath: path.join(__dirname, '..', 'backup', 'MERMAID_INTERACTIVE_ENHANCEMENT_REPORT.md.backup')
    },
    {
      path: path.join(__dirname, '..', 'docs', 'test-interactive-mermaid.md'),
      backupPath: path.join(__dirname, '..', 'backup', 'test-interactive-mermaid.md.backup')
    }
  ];
  
  problematicFiles.forEach(file => {
    if (fs.existsSync(file.backupPath)) {
      fs.copyFileSync(file.backupPath, file.path);
      console.log(`Restored ${file.path}`);
    }
  });
  
  console.log('All original files restored.');
  
  process.exit(1);
}
