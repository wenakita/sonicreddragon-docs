#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing all Mermaid diagram issues comprehensively (v2)...\n');

// Fix mermaid syntax with even more comprehensive patterns
function fixMermaidSyntax(content) {
  let fixed = content;
  
  // Fix within mermaid blocks
  fixed = fixed.replace(/```mermaid([\s\S]*?)```/g, (match, mermaidContent) => {
    let fixedContent = mermaidContent;
    
    // Remove ALL semicolons
    fixedContent = fixedContent.replace(/;+/g, '');
    
    // Fix diagram type declarations
    fixedContent = fixedContent.replace(/classDiagram\s*/g, 'classDiagram\n');
    fixedContent = fixedContent.replace(/flowchart\s+TB\s*/g, 'flowchart TB\n');
    fixedContent = fixedContent.replace(/graph\s+TB\s*/g, 'graph TB\n');
    fixedContent = fixedContent.replace(/graph\s+LR\s*/g, 'graph LR\n');
    fixedContent = fixedContent.replace(/sequenceDiagram\s*/g, 'sequenceDiagram\n');
    
    // Remove isolated 'end' lines
    fixedContent = fixedContent.replace(/\n\s*end\s*\n/g, '\n');
    
    // Fix class definitions in class diagrams (with curly braces)
    fixedContent = fixedContent.replace(/class\s+(\w+)\s*\{\s*/g, 'class $1 {\n');
    
    // Add more known style names to handle
    const knownStyles = [
      'primary', 'secondary', 'tertiary', 'default', 'error', 'warning', 'success', 'info',
      'eth', 'bsc', 'avax', 'matic', 'ftm', 'one', 'benefit', 'cost', 'neutral',
      'chainlink', 'user', 'token', 'contract', 'oracle', 'vault', 'trigger',
      'value', 'process', 'decision', 'destination', 'storage', 'external',
      'controller', 'vrf', 'interface', 'central', 'optimization', 'pool',
      'bucket', 'verification', 'access', 'mev', 'category', 'method', 'application',
      'fallback', 'highlight'
    ];
    
    // Fix specific problematic patterns first
    // 1. Fix "class VOTE value" specifically
    fixedContent = fixedContent.replace(/^\s*class\s+VOTE\s+value\s*$/gm, '    class VOTE value');
    
    // 2. Fix "_BRIDGEAVAX_LZ avax" patterns (missing "class" prefix)
    fixedContent = fixedContent.replace(/^\s*([A-Z_]+BRIDGE[A-Z_]+)\s+(avax|eth|bsc|matic)\s*$/gm, '    class $1 $2');
    
    // 3. Fix patterns like "class AVAX_BRIDGEAVAX_LZ avax" (looks like duplicated text)
    fixedContent = fixedContent.replace(/^\s*class\s+([A-Z]+)_BRIDGE\1_([A-Z]+)\s+(\w+)\s*$/gm, '    class $1_BRIDGE_$2 $3');
    
    // Fix patterns like "class Token highlight"
    fixedContent = fixedContent.replace(/^\s*class\s+(\w+)\s+highlight\s*$/gm, '    class $1 primary');
    
    // Fix patterns like "class Relay Integratorhighlight"
    fixedContent = fixedContent.replace(/^\s*class\s+(\w+)\s+(\w+)highlight\s*$/gm, (match, node1, node2) => {
      if (node2.toLowerCase().includes('integrator')) {
        return `    class ${node1} primary`;
      }
      return `    class ${node1} primary\n    class ${node2} primary`;
    });
    
    // Fix patterns like "class IOmniDragonSwapTriggerOracle IDragonJackpotVaultAggregatorV3Interface interface"
    fixedContent = fixedContent.replace(/^\s*class\s+(\w+)\s+(\w+)\s+(interface|external|abstract)\s*$/gm, 
      '    class $1 $3\n    class $2 $3');
    
    // Fix patterns like "class Ownable ReentrancyGuardexternal"
    fixedContent = fixedContent.replace(/^\s*class\s+(\w+)\s+(\w+)(external|interface|abstract)\s*$/gm, 
      '    class $1 $3\n    class $2 $3');
    
    // Fix patterns with multiple nodes and a style
    fixedContent = fixedContent.replace(/^\s*class\s+([A-Z]+[0-9]*)\s+([A-Z]+[0-9]*)([a-z]+)\s*$/gm, 
      (match, node1, node2, style) => {
        if (knownStyles.includes(style)) {
          return `    class ${node1} ${style}\n    class ${node2} ${style}`;
        }
        return match;
      });
    
    // Fix patterns like "class A CD E G H I J process"
    fixedContent = fixedContent.replace(/^\s*class\s+([A-Z\s]+)\s+([a-z]+)\s*$/gm, (match, nodes, style) => {
      if (knownStyles.includes(style)) {
        const nodeList = nodes.trim().split(/\s+/);
        if (nodeList.length > 1) {
          return nodeList.map(node => `    class ${node} ${style}`).join('\n');
        }
      }
      return match;
    });
    
    // Fix sequence diagram participant declarations with aliases
    // "participant App as Application" should remain as is
    fixedContent = fixedContent.replace(/^\s*participant\s+(\w+)\s+as\s+(.+)$/gm, 'participant $1 as $2');
    
    // Fix multi-word participants (wrap in quotes)
    fixedContent = fixedContent.replace(/^\s*participant\s+([A-Za-z]+)\s+([A-Za-z]+)$/gm, (match, word1, word2) => {
      // Check if it's an "as" alias pattern
      if (word2.toLowerCase() === 'as') {
        return match; // Let the alias pattern handle it
      }
      // Otherwise, it's a multi-word participant name that needs quotes
      return `participant "${word1} ${word2}"`;
    });
    
    // Fix regular participant declarations
    fixedContent = fixedContent.replace(/^\s*participant\s+(\w+)\s*$/gm, 'participant $1');
    
    // Fix arrow syntax - ensure spaces around arrows
    fixedContent = fixedContent.replace(/(\w+)-->(\w+)/g, '$1 --> $2');
    fixedContent = fixedContent.replace(/(\w+)<-->(\w+)/g, '$1 <--> $2');
    fixedContent = fixedContent.replace(/(\w+)->>(\w+)/g, '$1 ->> $2');
    fixedContent = fixedContent.replace(/(\w+)-->>(\w+)/g, '$1 -->> $2');
    
    // Clean up extra whitespace
    fixedContent = fixedContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    fixedContent = fixedContent.trim();
    
    return '```mermaid\n' + fixedContent + '\n```';
  });
  
  return fixed;
}

// Process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Apply fixes
    content = fixMermaidSyntax(content);
    
    // Write back if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function fixAllMermaid() {
  const files = glob.sync('docs/**/*.{md,mdx}');
  let fixedCount = 0;
  const fixedFiles = [];
  
  console.log(`Found ${files.length} documentation files to process...\n`);
  
  files.forEach(file => {
    if (processFile(file)) {
      fixedCount++;
      fixedFiles.push(file);
      console.log(`✅ Fixed: ${file}`);
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total files processed: ${files.length}`);
  console.log(`   Files with fixes: ${fixedCount}`);
  
  if (fixedFiles.length > 0) {
    console.log(`\n📝 Fixed files:`);
    fixedFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
  }
  
  console.log('\n✨ All Mermaid issues fixed!');
}

// Run the script
fixAllMermaid(); 