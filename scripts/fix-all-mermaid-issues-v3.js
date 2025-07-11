#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing all Mermaid diagram issues comprehensively (v3)...\n');

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

  // Fix 1: Ensure proper mermaid code block syntax
  content = content.replace(/```mermaid\s*\n([^`]+)\n```/g, (match, diagramContent) => {
    let fixed = diagramContent.trim();
    
    // Fix subgraph syntax - ensure proper end statements
    fixed = fixed.replace(/subgraph\s+"([^"]+)"\s*\n((?:(?!subgraph|end)[^\n]*\n)*)/g, (match, title, content) => {
      const lines = content.split('\n').filter(line => line.trim());
      const indentedLines = lines.map(line => line.trim() ? `        ${line.trim()}` : '').join('\n');
      return `    subgraph "${title}"\n${indentedLines}\n    end`;
    });
    
    // Fix class definitions - ensure proper syntax
    fixed = fixed.replace(/classDef\s+(\w+)\s+fill:#([a-fA-F0-9]{6})/g, 'classDef $1 fill:#$2,stroke:#$2,stroke-width:2px,color:#fff');
    
    // Fix class assignments - ensure comma separation
    fixed = fixed.replace(/class\s+([A-Z_,\s]+)\s+(\w+)/g, (match, nodes, className) => {
      const nodeList = nodes.split(/\s+/).filter(n => n.trim()).join(',');
      return `class ${nodeList} ${className}`;
    });
    
    // Fix flowchart syntax
    if (fixed.includes('flowchart')) {
      // Ensure proper indentation for subgraphs
      fixed = fixed.replace(/^(\s*)([A-Z_]+\[)/gm, '    $2');
      fixed = fixed.replace(/^(\s*)([A-Z_]+\s*-->)/gm, '    $2');
      fixed = fixed.replace(/^(\s*)(classDef)/gm, '    $2');
      fixed = fixed.replace(/^(\s*)(class\s)/gm, '    $2');
    }
    
    // Fix sequence diagram syntax
    if (fixed.includes('sequenceDiagram')) {
      fixed = fixed.replace(/^(\s*)(participant|User|Token)/gm, '    $2');
      fixed = fixed.replace(/^(\s*)([A-Za-z]+\s*->>)/gm, '    $2');
    }
    
    // Fix class diagram syntax
    if (fixed.includes('classDiagram')) {
      fixed = fixed.replace(/^(\s*)(class\s+\w+)/gm, '    $2');
      fixed = fixed.replace(/^(\s*)([A-Za-z]+\s*-->)/gm, '    $2');
    }
    
    return `\`\`\`mermaid\n${fixed}\n\`\`\``;
  });

  // Fix 2: Remove any invalid mermaid syntax patterns
  content = content.replace(/```mermaid\s*\n\s*\n```/g, ''); // Remove empty mermaid blocks
  
  // Fix 3: Ensure proper line endings
  content = content.replace(/\r\n/g, '\n');
  
  // Fix 4: Remove any trailing whitespace in mermaid blocks
  content = content.replace(/```mermaid\n([\s\S]*?)\n```/g, (match, diagramContent) => {
    const lines = diagramContent.split('\n').map(line => line.trimRight());
    return `\`\`\`mermaid\n${lines.join('\n')}\n\`\`\``;
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
  console.log('\n✨ All Mermaid issues already fixed!');
} else {
  console.log(`\n✨ Fixed Mermaid issues in ${totalFilesWithFixes} files!`);
} 