#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixSequenceDiagramSyntax() {
  console.log('🔍 Searching for sequence diagram syntax errors...');
  
  const docsDir = 'docs-new';
  const files = getAllMarkdownFiles(docsDir);
  
  let fixedCount = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let newContent = content;
    let hasChanges = false;
    
    // Fix sequence diagram syntax issues
    // Look for sequence diagrams with potential syntax errors
    const sequenceDiagramRegex = /```mermaid\s*\n\s*sequenceDiagram([\s\S]*?)```/g;
    
    newContent = newContent.replace(sequenceDiagramRegex, (match, diagramContent) => {
      let fixedDiagram = diagramContent;
      
      // Remove any stray numbers or characters after function calls
      fixedDiagram = fixedDiagram.replace(/fulfillRandomness\(\)\s*[0-9]+/g, 'fulfillRandomness()');
      
      // Fix any malformed participant declarations
      fixedDiagram = fixedDiagram.replace(/participant\s+([^:]+):\s*([^:]+):\s*(.+)/g, 'participant $1 as $3');
      
      // Fix any malformed arrows with extra characters
      fixedDiagram = fixedDiagram.replace(/(->>?)\s*([0-9]+)/g, '$1');
      
      // Fix any malformed note syntax
      fixedDiagram = fixedDiagram.replace(/Note\s+over\s+([^:]+):\s*([^:]+):\s*(.+)/g, 'Note over $1,$2: $3');
      
      // Remove any trailing numbers or invalid characters from lines
      const lines = fixedDiagram.split('\n');
      const cleanedLines = lines.map(line => {
        // Remove trailing numbers that aren't part of valid syntax
        return line.replace(/^(\s*[^:]+:\s*[^:]+)\s*[0-9]+\s*$/, '$1');
      });
      
      const result = '```mermaid\n    sequenceDiagram' + cleanedLines.join('\n') + '```';
      
      if (result !== match) {
        hasChanges = true;
        console.log(`  📝 Fixed sequence diagram in ${file}`);
      }
      
      return result;
    });
    
    if (hasChanges) {
      fs.writeFileSync(file, newContent);
      fixedCount++;
    }
  });
  
  console.log(`✅ Fixed ${fixedCount} files with sequence diagram syntax errors`);
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
fixSequenceDiagramSyntax(); 