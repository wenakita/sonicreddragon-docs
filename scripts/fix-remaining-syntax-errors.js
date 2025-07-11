#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixRemainingSyntaxErrors() {
  console.log('🚨 Fixing remaining critical Mermaid syntax errors...');
  
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
      const fixedDiagram = fixCriticalSyntaxIssues(diagramContent.trim());
      if (fixedDiagram !== diagramContent.trim()) {
        hasChanges = true;
        totalFixes++;
        console.log(`  ✅ Fixed remaining errors in ${file}`);
      }
      return '```mermaid\n' + fixedDiagram + '\n```';
    });
    
    if (hasChanges) {
      fs.writeFileSync(file, newContent);
      fixedFiles++;
    }
  });
  
  console.log(`\n🎉 Fixed ${totalFixes} remaining syntax errors in ${fixedFiles} files`);
}

function fixCriticalSyntaxIssues(diagramContent) {
  let fixed = diagramContent;
  
  // Fix malformed styling with classDef mixed in
  // "style core classDef benefit fil" -> separate into proper statements
  fixed = fixed.replace(/style\s+(\w+)\s+classDef\s+(\w+)\s+fil[^l]*/g, 
    'style $1 fill:#e1f5fe,stroke:#01579b,stroke-width:2px\n    classDef $2 fill:#f3e5f5,stroke:#4a148c,stroke-width:2px');
  
  // Fix incomplete styling statements
  fixed = fixed.replace(/style\s+(\w+)\s+classDef\s+(\w+)\s+fill:#([^,\s]*)/g, 
    'style $1 fill:#$3,stroke:#333,stroke-width:2px\n    classDef $2 fill:#$3,stroke:#333,stroke-width:2px');
  
  // Fix class definitions with missing spacing
  // "}    }class jackpotVault" -> proper class definition
  fixed = fixed.replace(/\}\s*\}\s*class\s+(\w+)/g, '}\n\nclass $1');
  fixed = fixed.replace(/\+method\(\)\s*\}\s*\}\s*class\s+(\w+)/g, '+method()\n    }\n\nclass $1');
  
  // Fix incomplete sequence diagram messages
  // "SwapTrigger ->>" -> "SwapTrigger ->> System: Action"
  fixed = fixed.replace(/(\w+)\s*->>\s*$/gm, '$1 ->> System: Action completed');
  fixed = fixed.replace(/(\w+)\s*->\s*$/gm, '$1 -> System: Action completed');
  
  // Fix malformed class diagram syntax
  fixed = fixed.replace(/class\s+(\w+)\s*\{\s*\+method\(\)\s*\}\s*\}\s*class/g, 
    'class $1 {\n        +method()\n    }\n    \n    class');
  
  // Fix styling syntax errors - separate style and classDef properly
  fixed = fixed.replace(/style\s+(\w+)\s+classDef/g, 'style $1 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px\n    classDef');
  
  // Fix incomplete classDef statements
  fixed = fixed.replace(/classDef\s+(\w+)\s+fi[^l]*/g, 'classDef $1 fill:#f3e5f5,stroke:#4a148c,stroke-width:2px');
  fixed = fixed.replace(/classDef\s+(\w+)\s+fill:#([^,\s]*)\s*$/gm, 'classDef $1 fill:#$2,stroke:#333,stroke-width:2px');
  
  // Fix decision node styling issues
  fixed = fixed.replace(/style\s+decision\s+classDef\s+decision\s+fi[^l]*/g, 
    'style decision fill:#fff2cc,stroke:#d6b656,stroke-width:2px\n    classDef decision fill:#fff2cc,stroke:#d6b656,stroke-width:2px');
  
  // Clean up any remaining malformed styling
  fixed = fixed.replace(/style\s+(\w+)\s+classDef\s+(\w+)\s*$/gm, 
    'style $1 fill:#e1f5fe,stroke:#01579b,stroke-width:2px\n    classDef $2 fill:#f3e5f5,stroke:#4a148c,stroke-width:2px');
  
  // Fix sequence diagram incomplete messages
  fixed = fixed.replace(/(\w+)\s+->\s*Notify of purchase\s+(\w+)\s+->\s*$/gm, 
    '$1 -> System: Notify of purchase\n    $2 -> System: Process notification');
  
  // Clean up excessive whitespace and ensure proper line endings
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
fixRemainingSyntaxErrors(); 