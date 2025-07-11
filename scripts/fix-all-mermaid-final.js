#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Final comprehensive Mermaid fix...\n');

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

  // Process each mermaid block
  content = content.replace(/```mermaid\n([\s\S]*?)\n```/g, (match, diagramContent) => {
    let fixed = diagramContent.trim();
    
    // Fix 1: Ensure proper subgraph syntax with end statements
    let subgraphCount = 0;
    let endCount = 0;
    
    // Count subgraphs and ends
    const subgraphMatches = fixed.match(/subgraph\s+/g);
    const endMatches = fixed.match(/\bend\b/g);
    
    if (subgraphMatches) subgraphCount = subgraphMatches.length;
    if (endMatches) endCount = endMatches.length;
    
    // Fix subgraph structure
    if (fixed.includes('subgraph')) {
      // Split into lines for processing
      const lines = fixed.split('\n');
      const processedLines = [];
      let inSubgraph = false;
      let subgraphLevel = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('subgraph')) {
          processedLines.push(`    ${line}`);
          inSubgraph = true;
          subgraphLevel++;
        } else if (line === 'end') {
          processedLines.push(`    end`);
          subgraphLevel--;
          if (subgraphLevel === 0) inSubgraph = false;
        } else if (inSubgraph && line && !line.startsWith('classDef') && !line.startsWith('class ')) {
          // Indent content inside subgraphs
          processedLines.push(`        ${line}`);
        } else {
          // Regular content
          if (line) processedLines.push(`    ${line}`);
        }
      }
      
      // Ensure we have proper end statements
      if (subgraphCount > endCount) {
        // Add missing end statements
        for (let i = 0; i < (subgraphCount - endCount); i++) {
          // Find the last subgraph content and add end after it
          const lastSubgraphIndex = processedLines.findLastIndex(line => 
            line.trim().startsWith('subgraph') || 
            (line.trim() && !line.trim().startsWith('classDef') && !line.trim().startsWith('class '))
          );
          if (lastSubgraphIndex >= 0) {
            processedLines.splice(lastSubgraphIndex + 1, 0, '    end');
          }
        }
      }
      
      fixed = processedLines.join('\n');
    }
    
    // Fix 2: Clean up class definitions
    fixed = fixed.replace(/classDef\s+(\w+)\s+fill:#([a-fA-F0-9]{6}),stroke:#([a-fA-F0-9]{6}),stroke-width:2px,color:#fff/g, 
      'classDef $1 fill:#$2,stroke:#$3,stroke-width:2px,color:#ffffff');
    
    // Fix 3: Ensure proper spacing
    fixed = fixed.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Fix 4: Remove any trailing spaces
    fixed = fixed.split('\n').map(line => line.trimRight()).join('\n');
    
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
  console.log('\n✨ All Mermaid diagrams are perfect!');
} else {
  console.log(`\n✨ Fixed Mermaid diagrams in ${totalFilesWithFixes} files!`);
} 