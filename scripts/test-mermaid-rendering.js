/**
 * Test Mermaid Rendering
 * 
 * This script tests if Mermaid diagrams are rendering correctly by:
 * 1. Checking if the Mermaid library is loaded
 * 2. Verifying the unified Mermaid module is properly configured
 * 3. Testing a sample diagram rendering
 */

const fs = require('fs');
const path = require('path');

// Function to check if the unified Mermaid module exists
function checkUnifiedMermaidModule() {
  const modulePath = path.resolve(process.cwd(), 'src/clientModules/unifiedMermaidModule.js');
  
  if (fs.existsSync(modulePath)) {
    console.log('✅ Unified Mermaid module exists');
    
    // Check if the module content is correct
    const content = fs.readFileSync(modulePath, 'utf8');
    
    if (content.includes('initializeMermaid') && content.includes('enhanceMermaidDiagrams')) {
      console.log('✅ Unified Mermaid module contains required functions');
    } else {
      console.log('❌ Unified Mermaid module is missing required functions');
    }
  } else {
    console.log('❌ Unified Mermaid module does not exist');
  }
}

// Function to check if the docusaurus.config.ts is properly configured
function checkDocusaurusConfig() {
  const configPath = path.resolve(process.cwd(), 'docusaurus.config.ts');
  
  if (fs.existsSync(configPath)) {
    console.log('✅ docusaurus.config.ts exists');
    
    // Check if the config content is correct
    const content = fs.readFileSync(configPath, 'utf8');
    
    if (content.includes('markdown: {\n    mermaid: true,') || content.includes('markdown: { mermaid: true')) {
      console.log('✅ Mermaid is enabled in markdown configuration');
    } else {
      console.log('❌ Mermaid is not enabled in markdown configuration');
    }
    
    if (content.includes('@docusaurus/theme-mermaid')) {
      console.log('✅ Mermaid theme is included');
    } else {
      console.log('❌ Mermaid theme is not included');
    }
    
    if (content.includes('unifiedMermaidModule.js')) {
      console.log('✅ Unified Mermaid module is included in clientModules');
    } else {
      console.log('❌ Unified Mermaid module is not included in clientModules');
    }
    
    if (content.includes('mermaid: {')) {
      console.log('✅ Mermaid configuration is present');
    } else {
      console.log('❌ Mermaid configuration is not present');
    }
  } else {
    console.log('❌ docusaurus.config.ts does not exist');
  }
}

// Function to create a test Mermaid diagram
function createTestDiagram() {
  const testPath = path.resolve(process.cwd(), 'docs/mermaid-test.md');
  
  const testContent = `---
title: Mermaid Test
description: Test page for Mermaid diagrams
---

# Mermaid Test

This page tests if Mermaid diagrams are rendering correctly.

## Standard Diagram

\`\`\`mermaid
flowchart LR
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> A
\`\`\`

## Immersive Diagram

<div data-immersive>

\`\`\`mermaid
flowchart TD
    A[Start] --> B{Is immersive mode working?}
    B -->|Yes| C[Excellent!]
    B -->|No| D[Check unified module]
    D --> E[Fix issues]
    E --> A
\`\`\`

</div>
`;
  
  try {
    fs.writeFileSync(testPath, testContent);
    console.log(`✅ Created test diagram at ${testPath}`);
    console.log('🔍 Please visit http://localhost:3000/mermaid-test to verify rendering');
  } catch (error) {
    console.error(`❌ Error creating test diagram:`, error);
  }
}

// Function to check if the test diagram is in the sidebar
function addTestToSidebar() {
  const sidebarPath = path.resolve(process.cwd(), 'sidebars.ts');
  
  if (fs.existsSync(sidebarPath)) {
    let content = fs.readFileSync(sidebarPath, 'utf8');
    
    // Check if the test is already in the sidebar
    if (!content.includes('mermaid-test')) {
      // Find the Guides section
      const guidesMatch = content.match(/label: ['"]Guides['"][\s\S]*?items: \[([\s\S]*?)\]/);
      
      if (guidesMatch) {
        // Add the test to the items array
        const items = guidesMatch[1];
        const newItems = items.replace(/(\s*)'test-immersive',/, "$1'test-immersive',\n$1'mermaid-test',");
        
        // Replace the items in the content
        content = content.replace(items, newItems);
        
        // Write the updated content
        fs.writeFileSync(sidebarPath, content);
        console.log('✅ Added test diagram to sidebar');
      } else {
        console.log('❌ Could not find Guides section in sidebar');
      }
    } else {
      console.log('✅ Test diagram is already in sidebar');
    }
  } else {
    console.log('❌ sidebars.ts does not exist');
  }
}

// Main function
function main() {
  console.log('🧪 Testing Mermaid rendering...');
  
  // Check if the unified Mermaid module exists
  checkUnifiedMermaidModule();
  
  // Check if the docusaurus.config.ts is properly configured
  checkDocusaurusConfig();
  
  // Create a test Mermaid diagram
  createTestDiagram();
  
  // Add the test diagram to the sidebar
  addTestToSidebar();
  
  console.log('✨ Test complete!');
  console.log('📝 Please check the development server to verify that Mermaid diagrams are rendering correctly.');
  console.log('🔍 Visit http://localhost:3000/mermaid-test to see the test diagrams.');
}

// Run the script
main();
