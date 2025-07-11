#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixUltimateSyntaxErrors() {
  console.log('🚨 Fixing ultimate critical Mermaid syntax errors...');
  
  const docsDir = 'docs-new';
  const files = getAllMarkdownFiles(docsDir);
  
  let fixedFiles = 0;
  let totalFixes = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let newContent = content;
    let hasChanges = false;
    
    // Fix all mermaid blocks in the file
    newContent = newContent.replace(/```mermaid\s*\n([\s\S]*?)```/g, (match, diagramContent) => {
      const fixedDiagram = fixUltimateErrors(diagramContent.trim());
      if (fixedDiagram !== diagramContent.trim()) {
        hasChanges = true;
        totalFixes++;
        console.log(`  ✅ Fixed ultimate errors in ${file}`);
      }
      return '```mermaid\n' + fixedDiagram + '\n```';
    });
    
    if (hasChanges) {
      fs.writeFileSync(file, newContent);
      fixedFiles++;
    }
  });
  
  console.log(`\n🎉 Fixed ${totalFixes} ultimate syntax errors in ${fixedFiles} files`);
}

function fixUltimateErrors(diagramContent) {
  let fixed = diagramContent;
  
  // Fix malformed class methods with double closing braces
  // "+method()    }    }        +method()" -> proper class structure
  fixed = fixed.replace(/\+method\(\)\s*\}\s*\}\s*\+method\(\)/g, '+method()\n    }');
  fixed = fixed.replace(/\+method\(\)\s*\}\s*\}/g, '+method()\n    }');
  
  // Fix incomplete sequence diagram messages ending with participant names
  // "Token ->> Token" -> "Token ->> Token: Action"
  fixed = fixed.replace(/(\w+)\s*->>\s*(\w+)\s*$/gm, '$1 ->> $2: Action completed');
  fixed = fixed.replace(/(\w+)\s*->\s*(\w+)\s*$/gm, '$1 -> $2: Action completed');
  
  // Fix incomplete sequence messages that end abruptly
  // "RandomnessProvi" -> "RandomnessProvider ->> System: Provide randomness"
  fixed = fixed.replace(/(\w+)\s*Request randomness\s+RandomnessProvi\s*$/gm, 
    '$1 -> RandomnessProvider: Request randomness\n    RandomnessProvider ->> $1: Provide randomness');
  
  // Fix incomplete bridge messages
  // "SourceBridge ->" -> "SourceBridge -> DestinationBridge: Transfer"
  fixed = fixed.replace(/SourceBridge\s*->\s*$/gm, 'SourceBridge -> DestinationBridge: Transfer tokens');
  
  // Fix token transfer messages
  // "Transfer tokens to user    Token ->> Token" -> proper sequence
  fixed = fixed.replace(/(\w+)\s*Transfer tokens to user\s+Token\s*->>\s*Token\s*$/gm, 
    '$1 -> Token: Transfer tokens to user\n    Token ->> User: Tokens transferred');
  
  // Fix cross-chain transfer messages
  // "cross-chain transfer    SourceBridge ->" -> proper sequence
  fixed = fixed.replace(/(\w+)\s*cross-chain transfer\s+SourceBridge\s*->\s*$/gm, 
    '$1 -> SourceBridge: Initiate cross-chain transfer\n    SourceBridge ->> DestinationBridge: Transfer tokens');
  
  // Fix any remaining incomplete arrows
  fixed = fixed.replace(/(\w+)\s*->>\s*$/gm, '$1 ->> System: Action completed');
  fixed = fixed.replace(/(\w+)\s*->\s*$/gm, '$1 -> System: Action completed');
  
  // Fix malformed class structures with extra braces
  fixed = fixed.replace(/\}\s*\}\s*\+method\(\)/g, '}\n\nclass AnotherClass {\n        +method()');
  
  // Clean up excessive whitespace
  fixed = fixed.replace(/\n\s*\n\s*\n/g, '\n\n');
  fixed = fixed.replace(/\r\n/g, '\n');
  
  return fixed;
}

function getAllMarkdownFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        files.push(fullPath);
      }
    });
  }
  
  traverse(dir);
  return files;
}

// Run the fix
fixUltimateSyntaxErrors(); 