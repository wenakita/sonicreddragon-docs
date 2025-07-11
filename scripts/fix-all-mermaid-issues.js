#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing all Mermaid diagram issues comprehensively...\n');

// Fix mermaid syntax with more aggressive patterns
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
    
    // Fix problematic patterns found in the search:
    // 1. Fix patterns like "class Token highlight" -> "class Token"
    fixedContent = fixedContent.replace(/^\s*class\s+(\w+)\s+highlight\s*$/gm, '    class $1 primary');
    
    // 2. Fix patterns like "class Relay Integratorhighlight" -> separate them
    fixedContent = fixedContent.replace(/^\s*class\s+(\w+)\s+(\w+)highlight\s*$/gm, '    class $1 primary\n    class $2 primary');
    
    // 3. Fix patterns like "class DragonVRFIntegrator Storagehighlight"
    fixedContent = fixedContent.replace(/^\s*class\s+(\w+)\s+(\w+)highlight\s*$/gm, '    class $1 primary');
    
    // 4. Fix patterns like "class IOmniDragonSwapTriggerOracle IDragonJackpotVaultAggregatorV3Interface interface"
    fixedContent = fixedContent.replace(/^\s*class\s+(\w+)\s+(\w+)\s+interface\s*$/gm, '    class $1 interface\n    class $2 interface');
    
    // 5. Fix patterns like "class Ownable ReentrancyGuardexternal"
    fixedContent = fixedContent.replace(/^\s*class\s+(\w+)\s+(\w+)external\s*$/gm, '    class $1 external\n    class $2 external');
    
    // 6. Fix patterns like "class RP central"
    fixedContent = fixedContent.replace(/^\s*class\s+(\w+)\s+central\s*$/gm, '    class $1 central');
    
    // 7. Fix patterns with multiple nodes and a style like "class BS PSoptimization"
    fixedContent = fixedContent.replace(/^\s*class\s+([A-Z]+[0-9]*)\s+([A-Z]+[0-9]*)([a-z]+)\s*$/gm, 
      (match, node1, node2, style) => {
        return `    class ${node1} ${style}\n    class ${node2} ${style}`;
      });
    
    // 8. Fix patterns like "class A CD E G H I J process"
    fixedContent = fixedContent.replace(/^\s*class\s+([A-Z\s]+)\s+([a-z]+)\s*$/gm, (match, nodes, style) => {
      const nodeList = nodes.trim().split(/\s+/);
      if (nodeList.length > 1) {
        return nodeList.map(node => `    class ${node} ${style}`).join('\n');
      }
      return `    class ${nodes.trim()} ${style}`;
    });
    
    // 9. Fix patterns like "class B Fdecision" (missing space between nodes)
    fixedContent = fixedContent.replace(/^\s*class\s+([A-Z])\s+([A-Z])([a-z]+)\s*$/gm, 
      (match, node1, node2, style) => {
        return `    class ${node1} ${style}\n    class ${node2} ${style}`;
      });
    
    // 10. Fix patterns like "class K LM destination" (mixed single and double letter nodes)
    fixedContent = fixedContent.replace(/^\s*class\s+([A-Z][A-Z]?)\s+([A-Z][A-Z]?)\s+([a-z]+)\s*$/gm, 
      (match, node1, node2, style) => {
        return `    class ${node1} ${style}\n    class ${node2} ${style}`;
      });
    
    // Generic fix for remaining class statements
    fixedContent = fixedContent.replace(/^\s*class\s+(.+?)\s*$/gm, (match, rest) => {
      const parts = rest.trim().split(/\s+/);
      
      if (parts.length === 2 && /^[a-z]+$/.test(parts[1])) {
        // Single node with style
        return `    class ${parts[0]} ${parts[1]}`;
      } else if (parts.length > 2) {
        // Multiple nodes - check if last part is a style
        const lastPart = parts[parts.length - 1];
        if (/^[a-z]+$/.test(lastPart)) {
          // Last part is a style
          const nodes = parts.slice(0, -1);
          return nodes.map(node => `    class ${node} ${lastPart}`).join('\n');
        }
      }
      
      return match;
    });
    
    // Fix participant declarations in sequence diagrams
    fixedContent = fixedContent.replace(/participant\s+(\w+)\s*/g, 'participant $1\n');
    
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