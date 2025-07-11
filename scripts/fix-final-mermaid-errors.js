#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixFinalMermaidErrors() {
  console.log('🚨 Fixing final Mermaid syntax errors...');
  
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
      const fixedDiagram = fixFinalSyntaxErrors(diagramContent.trim());
      if (fixedDiagram !== diagramContent.trim()) {
        hasChanges = true;
        totalFixes++;
        console.log(`  ✅ Fixed final errors in ${file}`);
      }
      return '```mermaid\n' + fixedDiagram + '\n```';
    });
    
    if (hasChanges) {
      fs.writeFileSync(file, newContent);
      fixedFiles++;
    }
  });
  
  console.log(`\n🎉 Fixed ${totalFixes} final errors in ${fixedFiles} files`);
}

function fixFinalSyntaxErrors(diagramContent) {
  let fixed = diagramContent;
  
  // Fix double closing brackets like "core]]" -> "core]"
  fixed = fixed.replace(/(\w+)\]\]/g, '$1]');
  
  // Fix incomplete styling statements like "style core cl" -> remove them
  fixed = fixed.replace(/^\s*style\s+\w+\s+cl\s*$/gm, '');
  fixed = fixed.replace(/^\s*style\s+\w+\s+cla\s*$/gm, '');
  
  // Fix malformed class definitions with multiple closing braces
  fixed = fixed.replace(/\+method\(\)\}\s*\}\s*\+method\(\)/g, '+method()');
  
  // Fix incomplete sequence diagram messages
  fixed = fixed.replace(/(\w+)\s*->>\s*$/gm, '$1->> System: Action');
  fixed = fixed.replace(/(\w+)\s*->\s*$/gm, '$1-> System: Action');
  
  // Fix malformed node definitions that got corrupted
  fixed = fixed.replace(/(\w+)\[([^\]]+)\]\]\s*style/g, '$1[$2]\n    style');
  
  // Clean up any remaining double brackets in various contexts
  fixed = fixed.replace(/\]\]\s*style/g, ']\n    style');
  fixed = fixed.replace(/\]\]\s*end/g, ']\n    end');
  fixed = fixed.replace(/\]\]\s*(\w+)/g, ']\n    $1');
  
  // Fix class diagram syntax errors
  fixed = fixed.replace(/class\s+(\w+)\s*\{\s*\+method\(\)\s*\}\s*\}\s*\+method\(\)/g, 
    'class $1 {\n        +method()\n    }');
  
  // Remove orphaned styling statements
  fixed = fixed.replace(/^\s*style\s+\w+\s*$/gm, '');
  
  // Clean up excessive whitespace
  fixed = fixed.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Ensure proper line endings
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

// Run the final fix
fixFinalMermaidErrors(); 