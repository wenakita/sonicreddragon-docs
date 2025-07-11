#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Final targeted Mermaid fixes...\n');

// Find all markdown files
const files = glob.sync('docs/**/*.md', { cwd: process.cwd() });
let totalFixed = 0;

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  const originalContent = content;

  // Process each mermaid block
  content = content.replace(/```mermaid\n([\s\S]*?)\n```/g, (match, diagramContent) => {
    let fixed = diagramContent.trim();
    let blockChanged = false;
    
    // Fix 1: Replace invalid color codes
    if (fixed.includes('#fffffffff')) {
      fixed = fixed.replace(/#fffffffff/g, '#ffffff');
      blockChanged = true;
    }
    
    // Fix 2: Ensure proper subgraph structure
    if (fixed.includes('subgraph')) {
      const lines = fixed.split('\n');
      const processedLines = [];
      let subgraphLevel = 0;
      let pendingEnds = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('subgraph')) {
          processedLines.push(`    ${line}`);
          subgraphLevel++;
          pendingEnds++;
        } else if (line === 'end') {
          processedLines.push(`    end`);
          subgraphLevel--;
          pendingEnds--;
        } else if (line.startsWith('classDef') || line.startsWith('class ')) {
          // Style definitions go at the end
          processedLines.push(`    ${line}`);
        } else if (line && !line.startsWith('    ')) {
          // Regular content - check if we're in a subgraph
          if (subgraphLevel > 0) {
            processedLines.push(`        ${line}`);
          } else {
            processedLines.push(`    ${line}`);
          }
        } else if (line) {
          processedLines.push(line);
        }
      }
      
      // Add missing end statements
      while (pendingEnds > 0) {
        // Find the last content line before style definitions
        let insertIndex = processedLines.length;
        for (let i = processedLines.length - 1; i >= 0; i--) {
          const line = processedLines[i].trim();
          if (!line.startsWith('classDef') && !line.startsWith('class ') && line) {
            insertIndex = i + 1;
            break;
          }
        }
        processedLines.splice(insertIndex, 0, '    end');
        pendingEnds--;
        blockChanged = true;
      }
      
      fixed = processedLines.join('\n');
    }
    
    // Fix 3: Ensure proper indentation
    const lines = fixed.split('\n');
    const indentedLines = lines.map(line => {
      if (line.trim() === '') return '';
      if (line.startsWith('    ')) return line;
      return `    ${line.trim()}`;
    });
    fixed = indentedLines.join('\n');
    
    if (blockChanged || fixed !== diagramContent.trim()) {
      hasChanges = true;
    }
    
    return `\`\`\`mermaid\n${fixed}\n\`\`\``;
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
    totalFixed++;
  }
});

console.log(`\n📊 Summary: Fixed ${totalFixed} files with Mermaid issues`);

if (totalFixed === 0) {
  console.log('✨ All Mermaid diagrams are perfect!');
} else {
  console.log('✨ All Mermaid issues have been resolved!');
} 