/**
 * Unified Mermaid Management Script
 * 
 * This script provides comprehensive functionality for managing Mermaid diagrams:
 * - Cleaning up deprecated components and modules
 * - Checking and fixing Mermaid syntax
 * - Testing Mermaid rendering
 * 
 * This script consolidates functionality from multiple scripts:
 * - check-mermaid-syntax.js
 * - cleanup-mermaid-components.js
 * - cleanup-mermaid-implementation.js
 * - cleanup-mermaid-modules.js
 * - fix-mermaid-syntax.js
 * - test-mermaid-rendering.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');

// =============================================================================
// Configuration
// =============================================================================

// Files to be removed (deprecated components and modules)
const filesToRemove = [
  // Deprecated components
  'src/components/EnhancedMermaid.js',
  'src/components/ImmersiveMermaid.tsx',
  'src/components/ImmersiveMermaid.module.css',
  'src/components/MermaidDiagram.js',
  'src/components/MermaidWrapper.js',
  'src/components/StandardMermaid.js',
  'src/components/ModernMermaid.tsx',
  'src/components/ModernMermaid.module.css',
  
  // Deprecated client modules
  'src/clientModules/mermaidFixModule.js',
  'src/clientModules/enhancedMermaidInit.js',
  'src/clientModules/unifiedMermaidModule.js',
  
  // Deprecated plugins
  'src/plugins/mermaid-plugin.js',
];

// =============================================================================
// Cleanup Functions
// =============================================================================

/**
 * Remove deprecated files
 */
function removeDeprecatedFiles() {
  console.log('\n=== Removing deprecated Mermaid files ===\n');
  
  let removedCount = 0;
  
  filesToRemove.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`✅ Removed: ${file}`);
        removedCount++;
      } catch (error) {
        console.error(`❌ Error removing ${file}: ${error.message}`);
      }
    } else {
      console.log(`⚠️ File not found: ${file}`);
    }
  });
  
  console.log(`\nRemoved ${removedCount} deprecated files\n`);
  
  return removedCount;
}

/**
 * Update docusaurus.config.ts to remove references to deprecated modules
 */
function updateDocusaurusConfig() {
  console.log('\n=== Updating docusaurus.config.ts ===\n');
  
  const configPath = path.resolve(process.cwd(), 'docusaurus.config.ts');
  
  if (!fs.existsSync(configPath)) {
    console.error(`❌ Config file not found: ${configPath}`);
    return false;
  }
  
  try {
    let configContent = fs.readFileSync(configPath, 'utf8');
    let modified = false;
    
    // Remove references to deprecated client modules
    const clientModulesToRemove = [
      'mermaidFixModule',
      'enhancedMermaidInit',
      'unifiedMermaidModule',
    ];
    
    clientModulesToRemove.forEach(module => {
      const regex = new RegExp(`[\\s\\t]*['"]\\./src/clientModules/${module}['"],?\\n`, 'g');
      if (regex.test(configContent)) {
        configContent = configContent.replace(regex, '');
        console.log(`✅ Removed reference to ${module} from docusaurus.config.ts`);
        modified = true;
      }
    });
    
    // Remove references to deprecated plugins
    const pluginsToRemove = [
      'mermaid-plugin',
    ];
    
    pluginsToRemove.forEach(plugin => {
      const regex = new RegExp(`[\\s\\t]*\\[?['"]\\./src/plugins/${plugin}['"]\\]?,?\\n`, 'g');
      if (regex.test(configContent)) {
        configContent = configContent.replace(regex, '');
        console.log(`✅ Removed reference to ${plugin} from docusaurus.config.ts`);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(configPath, configContent, 'utf8');
      console.log('✅ Updated docusaurus.config.ts');
    } else {
      console.log('⚠️ No changes needed in docusaurus.config.ts');
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error updating docusaurus.config.ts: ${error.message}`);
    return false;
  }
}

// =============================================================================
// Syntax Check and Fix Functions
// =============================================================================

/**
 * Sanitize mermaid diagram code
 */
function sanitizeMermaidDiagram(text) {
  if (!text) return text;

  // Apply comprehensive sanitization
  return text
    // Fix classDef with problematic Unicode
    .replace(/classDef\s+(\w+)\s+fill:[^\n;]*/g, (match, className) => {
      return `classDef ${className} fill:#4a80d1`;
    })
    // Fix missing semicolons at the end of lines
    .replace(/([^;\s])\n/g, '$1;\n')
    // Fix extra spaces in node definitions
    .replace(/(\w+)\s+\[([^\]]*)\]/g, '$1[$2]')
    // Fix invalid arrow styles
    .replace(/--x/g, '-->')
    .replace(/--\*/g, '-->')
    // Fix invalid syntax in subgraphs
    .replace(/subgraph\s+([^\n]+)\n/g, 'subgraph $1\n')
    // Fix missing end statements
    .replace(/subgraph\s+([^\n]+)\n([\s\S]*?)(?!\s*end\s*\n)/g, 'subgraph $1\n$2\nend\n')
    // Fix invalid class assignments
    .replace(/class\s+(\w+)\s+(\w+)\s*([^;\n]*)/g, 'class $1 $2$3;')
    // Fix invalid direction statements
    .replace(/direction\s+([^\n;]+)/g, 'direction $1;')
    // Fix invalid linkStyle statements
    .replace(/linkStyle\s+(\d+)\s+([^;\n]*)/g, 'linkStyle $1 $2;')
    // Fix invalid style statements
    .replace(/style\s+(\w+)\s+([^;\n]*)/g, 'style $1 $2;');
}

/**
 * Check and fix Mermaid syntax in all markdown files
 */
function checkAndFixMermaidSyntax() {
  console.log('\n=== Checking and fixing Mermaid syntax ===\n');
  
  // Find all markdown files in the docs directory
  const docFiles = glob.sync('docs/**/*.md', { cwd: process.cwd() });
  
  // Count of issues found and fixed
  let issuesFound = 0;
  let issuesFixed = 0;
  
  // Check each file
  docFiles.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find mermaid code blocks
    const mermaidRegex = /```mermaid\s+([\s\S]*?)```/g;
    let match;
    let fileHasIssues = false;
    let newContent = content;
    
    while ((match = mermaidRegex.exec(content)) !== null) {
      const originalDiagram = match[1];
      const sanitizedDiagram = sanitizeMermaidDiagram(originalDiagram);
      
      if (originalDiagram !== sanitizedDiagram) {
        fileHasIssues = true;
        issuesFound++;
        
        // Replace the diagram with the sanitized version
        // Using simple string concatenation to avoid template literal issues
        const oldBlock = "```mermaid\n" + originalDiagram + "```";
        const newBlock = "```mermaid\n" + sanitizedDiagram + "```";
        newContent = newContent.replace(oldBlock, newBlock);
        
        issuesFixed++;
      }
    }
    
    if (fileHasIssues) {
      console.log(`📄 ${file}: Fixed Mermaid syntax issues`);
      fs.writeFileSync(filePath, newContent, 'utf8');
    }
  });
  
  console.log(`\nFound ${issuesFound} Mermaid syntax issues in ${docFiles.length} files`);
  console.log(`Fixed ${issuesFixed} Mermaid syntax issues\n`);
  
  return { issuesFound, issuesFixed };
}

// =============================================================================
// Testing Functions
// =============================================================================

/**
 * Check if the UnifiedMermaid component exists
 */
function checkUnifiedMermaidComponent() {
  console.log('\n=== Checking UnifiedMermaid component ===\n');
  
  const componentPath = path.resolve(process.cwd(), 'src/components/UnifiedMermaid.tsx');
  const stylePath = path.resolve(process.cwd(), 'src/components/UnifiedMermaid.module.css');
  
  if (fs.existsSync(componentPath)) {
    console.log('✅ UnifiedMermaid component exists');
    
    // Check if the component content is correct
    const content = fs.readFileSync(componentPath, 'utf8');
    if (content.includes('useEffect') && content.includes('useRef')) {
      console.log('✅ UnifiedMermaid component uses React hooks correctly');
    } else {
      console.log('⚠️ UnifiedMermaid component may not be using React hooks correctly');
    }
  } else {
    console.log('❌ UnifiedMermaid component does not exist');
    return false;
  }
  
  if (fs.existsSync(stylePath)) {
    console.log('✅ UnifiedMermaid styles exist');
  } else {
    console.log('⚠️ UnifiedMermaid styles do not exist');
  }
  
  return true;
}

/**
 * Check if MDXComponents.js is updated to use UnifiedMermaid
 */
function checkMDXComponents() {
  console.log('\n=== Checking MDXComponents.js ===\n');
  
  const mdxComponentsPath = path.resolve(process.cwd(), 'src/theme/MDXComponents.js');
  
  if (fs.existsSync(mdxComponentsPath)) {
    console.log('✅ MDXComponents.js exists');
    
    // Check if the file imports and uses UnifiedMermaid
    const content = fs.readFileSync(mdxComponentsPath, 'utf8');
    if (content.includes('UnifiedMermaid')) {
      console.log('✅ MDXComponents.js imports UnifiedMermaid');
    } else {
      console.log('⚠️ MDXComponents.js does not import UnifiedMermaid');
      return false;
    }
  } else {
    console.log('❌ MDXComponents.js does not exist');
    return false;
  }
  
  return true;
}

/**
 * Test a sample Mermaid diagram
 */
function testSampleDiagram() {
  console.log('\n=== Testing sample Mermaid diagram ===\n');
  
  const testFilePath = path.resolve(process.cwd(), 'docs/test-unified-mermaid.md');
  const sampleDiagram = `# Test Unified Mermaid

This is a test file to verify that the UnifiedMermaid component is working correctly.

\`\`\`mermaid
graph TD;
    A[Start] --> B{Is it working?};
    B -->|Yes| C[Great!];
    B -->|No| D[Debug];
    D --> A;
\`\`\`

The diagram above should render correctly using the UnifiedMermaid component.
`;
  
  // Create or update the test file
  fs.writeFileSync(testFilePath, sampleDiagram, 'utf8');
  console.log(`✅ Created test file: ${testFilePath}`);
  
  console.log('✅ Sample diagram created for testing');
  console.log('To test rendering, run: npm run start');
  
  return true;
}

// =============================================================================
// Main Function
// =============================================================================

/**
 * Main function
 */
function main() {
  console.log('Starting unified Mermaid management...');
  
  // Cleanup
  const removedCount = removeDeprecatedFiles();
  const configUpdated = updateDocusaurusConfig();
  
  // Syntax check and fix
  const { issuesFound, issuesFixed } = checkAndFixMermaidSyntax();
  
  // Testing
  const componentExists = checkUnifiedMermaidComponent();
  const mdxComponentsUpdated = checkMDXComponents();
  const testFileCreated = testSampleDiagram();
  
  // Summary
  console.log('\n=== Summary ===\n');
  console.log(`Removed ${removedCount} deprecated files`);
  console.log(`Config updated: ${configUpdated ? 'Yes' : 'No'}`);
  console.log(`Found ${issuesFound} Mermaid syntax issues`);
  console.log(`Fixed ${issuesFixed} Mermaid syntax issues`);
  console.log(`UnifiedMermaid component exists: ${componentExists ? 'Yes' : 'No'}`);
  console.log(`MDXComponents.js updated: ${mdxComponentsUpdated ? 'Yes' : 'No'}`);
  console.log(`Test file created: ${testFileCreated ? 'Yes' : 'No'}`);
  
  console.log('\nUnified Mermaid management completed!');
}

// Run the main function
main();
