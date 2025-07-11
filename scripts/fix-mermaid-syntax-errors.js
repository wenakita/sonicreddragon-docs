#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing specific Mermaid syntax errors...\n');

// Find all markdown files
const files = glob.sync('docs/**/*.md', { cwd: process.cwd() });
console.log(`Found ${files.length} documentation files to process...\n`);

let totalFilesProcessed = 0;
let totalFilesWithFixes = 0;

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  const originalContent = content;

  // Fix 1: Remove "end" statements that are incorrectly placed before class statements
  content = content.replace(/end\s+class\s+([A-Z_]+)\s+(\w+)/g, 'class $1 $2');
  
  // Fix 2: Fix class definitions with "interface" keyword
  content = content.replace(/class\s+([A-Z_]+)\s+interface/g, 'class $1 interface_style');
  
  // Fix 3: Fix malformed classDef statements
  content = content.replace(/classDef\s+(\w+)\s+fill:#([a-fA-F0-9]{6}),stroke:#([a-fA-F0-9]{6}),stroke-width:2px,color:#fff,stroke:#([a-fA-F0-9]{6}),stroke-width:2px,color:#fff/g, 'classDef $1 fill:#$2,stroke:#$3,stroke-width:2px,color:#fff');
  
  // Fix 4: Fix malformed classDef with multiple stroke definitions
  content = content.replace(/classDef\s+(\w+)\s+fill:#([a-fA-F0-9]{6}),stroke:#([a-fA-F0-9]{6}),stroke-width:2px,color:#([a-fA-F0-9]{6}),stroke:#([a-fA-F0-9]{6}),stroke-width:2px,color:#([a-fA-F0-9]{6})/g, 'classDef $1 fill:#$2,stroke:#$3,stroke-width:2px,color:#$4');
  
  // Fix 5: Fix classDef with concatenated properties
  content = content.replace(/classDef\s+(\w+)\s+fill:#([a-fA-F0-9]{6}),stroke:#([a-fA-F0-9]{6}),stroke-width:2px,color:#fffstroke:#([a-fA-F0-9]{6})color:#([a-fA-F0-9]{6})font-style:italic/g, 'classDef $1 fill:#$2,stroke:#$3,stroke-width:2px,color:#fff');
  
  // Fix 6: Ensure proper subgraph syntax
  content = content.replace(/```mermaid\n([\s\S]*?)\n```/g, (match, diagramContent) => {
    let fixed = diagramContent;
    
    // Fix subgraph end statements
    fixed = fixed.replace(/subgraph\s+"([^"]+)"\s*\n((?:(?!subgraph|end)[^\n]*\n)*)/g, (match, title, content) => {
      const lines = content.split('\n').filter(line => line.trim());
      const indentedLines = lines.map(line => line.trim() ? `        ${line.trim()}` : '').join('\n');
      return `    subgraph "${title}"\n${indentedLines}\n    end`;
    });
    
    // Fix class statements that appear after "end"
    fixed = fixed.replace(/end\s+(class\s+[A-Z_,\s]+\s+\w+)/g, '$1');
    
    return `\`\`\`mermaid\n${fixed}\n\`\`\``;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    hasChanges = true;
    totalFilesWithFixes++;
    console.log(`✅ Fixed: ${file}`);
  }

  totalFilesProcessed++;
});

console.log(`\n📊 Summary:`);
console.log(`   Total files processed: ${totalFilesProcessed}`);
console.log(`   Files with fixes: ${totalFilesWithFixes}`);

if (totalFilesWithFixes === 0) {
  console.log('\n✨ All Mermaid syntax errors already fixed!');
} else {
  console.log(`\n✨ Fixed Mermaid syntax errors in ${totalFilesWithFixes} files!`);
} 