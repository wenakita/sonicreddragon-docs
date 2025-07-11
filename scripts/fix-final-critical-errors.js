#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixFinalCriticalErrors() {
  console.log('🚨 Fixing final critical Mermaid syntax errors...');
  
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
      const fixedDiagram = fixCriticalErrors(diagramContent.trim());
      if (fixedDiagram !== diagramContent.trim()) {
        hasChanges = true;
        totalFixes++;
        console.log(`  ✅ Fixed critical errors in ${file}`);
      }
      return '```mermaid\n' + fixedDiagram + '\n```';
    });
    
    if (hasChanges) {
      fs.writeFileSync(file, newContent);
      fixedFiles++;
    }
  });
  
  console.log(`\n🎉 Fixed ${totalFixes} final critical errors in ${fixedFiles} files`);
}

function fixCriticalErrors(diagramContent) {
  let fixed = diagramContent;
  
  // Fix malformed class definitions with double braces
  // "class { {    +method()}" -> "class ClassName { +method() }"
  fixed = fixed.replace(/class\s*\{\s*\{\s*\+method\(\)\s*\}/g, 'class ClassName {\n        +method()\n    }');
  fixed = fixed.replace(/class\s*\{\s*\{/g, 'class ClassName {');
  
  // Fix incomplete sequence diagram messages ending with "->"
  // "SwapTrigger ->>" -> "SwapTrigger ->> System: Action"
  fixed = fixed.replace(/(\w+)\s*->>\s*$/gm, '$1 ->> System: Action completed');
  fixed = fixed.replace(/(\w+)\s*->\s*$/gm, '$1 -> System: Action completed');
  
  // Fix sequence messages that end with "Notify of purchase" but no target
  fixed = fixed.replace(/(\w+)\s*->\s*Notify of purchase\s+(\w+)\s*->>\s*$/gm, 
    '$1 -> System: Notify of purchase\n    $2 ->> System: Process notification');
  
  // Fix malformed class syntax with missing class name
  fixed = fixed.replace(/\}\s*class\s*\{\s*\{/g, '}\n\nclass ClassName {');
  fixed = fixed.replace(/\}\s*class\s*\{/g, '}\n\nclass ClassName {');
  
  // Fix class definitions that are missing names entirely
  fixed = fixed.replace(/class\s*\{/g, 'class ClassName {');
  
  // Fix sequence diagram incomplete arrows
  fixed = fixed.replace(/(\w+)\s*->\s*Notify of purchase\s*$/gm, '$1 -> System: Notify of purchase');
  
  // Fix any remaining malformed class structures
  fixed = fixed.replace(/class\s*\{\s*\{\s*/g, 'class ClassName {\n        ');
  fixed = fixed.replace(/\+method\(\)\s*\}\s*class\s*\{/g, '+method()\n    }\n\n    class ClassName {');
  
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
fixFinalCriticalErrors(); 