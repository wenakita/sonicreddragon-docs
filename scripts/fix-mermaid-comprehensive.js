#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixAllMermaidSyntax() {
  console.log('🔧 Applying comprehensive Mermaid syntax fixes...');
  
  const docsDir = 'docs-new';
  const files = getAllMarkdownFiles(docsDir);
  
  let fixedCount = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let newContent = content;
    let hasChanges = false;
    
    // Fix flowchart diagrams with multiple 'end' statements
    const flowchartRegex = /```mermaid\s*\n\s*(flowchart|graph)\s+(TB|TD|BT|RL|LR|LR|TB)([\s\S]*?)```/g;
    
    newContent = newContent.replace(flowchartRegex, (match, diagramType, direction, diagramContent) => {
      let fixedDiagram = diagramContent;
      
      // Fix multiple consecutive 'end' statements
      fixedDiagram = fixedDiagram.replace(/(\s*end\s*){2,}/g, '\n    end\n');
      
      // Fix malformed subgraph endings
      fixedDiagram = fixedDiagram.replace(/end\s+end\s+end\s+end/g, 'end');
      
      // Remove extra 'end' statements that don't match subgraphs
      const lines = fixedDiagram.split('\n');
      const cleanedLines = [];
      let subgraphCount = 0;
      let endCount = 0;
      
      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('subgraph')) {
          subgraphCount++;
          cleanedLines.push(line);
        } else if (trimmedLine === 'end') {
          endCount++;
          if (endCount <= subgraphCount) {
            cleanedLines.push(line);
          }
        } else {
          cleanedLines.push(line);
        }
      });
      
      const result = '```mermaid\n    ' + diagramType + ' ' + direction + cleanedLines.join('\n') + '\n```';
      
      if (result !== match) {
        hasChanges = true;
        console.log(`  📝 Fixed flowchart diagram in ${file}`);
      }
      
      return result;
    });
    
    // Fix sequence diagrams with malformed notes
    const sequenceDiagramRegex = /```mermaid\s*\n\s*sequenceDiagram([\s\S]*?)```/g;
    
    newContent = newContent.replace(sequenceDiagramRegex, (match, diagramContent) => {
      let fixedDiagram = diagramContent;
      
      // Fix malformed participant declarations
      fixedDiagram = fixedDiagram.replace(/participant\s+([^:]+):\s*([^:]+):\s*(.+)/g, 'participant $1 as $3');
      
      // Fix malformed notes that are missing text
      fixedDiagram = fixedDiagram.replace(/Note\s+over\s+([^:]+)\s*$/gm, 'Note over $1: Additional information');
      
      // Fix incomplete note syntax
      fixedDiagram = fixedDiagram.replace(/Note\s+over\s+([^:]+)\s*\n/g, 'Note over $1: Process details\n');
      
      // Fix malformed arrows with extra characters
      fixedDiagram = fixedDiagram.replace(/(->>?)\s*([0-9]+)/g, '$1');
      
      // Remove any stray numbers or characters after function calls
      fixedDiagram = fixedDiagram.replace(/fulfillRandomness\(\)\s*[0-9]+/g, 'fulfillRandomness()');
      fixedDiagram = fixedDiagram.replace(/transfer\(\)\s*[0-9]+/g, 'transfer()');
      
      const result = '```mermaid\n    sequenceDiagram' + fixedDiagram + '\n```';
      
      if (result !== match) {
        hasChanges = true;
        console.log(`  📝 Fixed sequence diagram in ${file}`);
      }
      
      return result;
    });
    
    // Fix class diagrams
    const classDiagramRegex = /```mermaid\s*\n\s*classDiagram([\s\S]*?)```/g;
    
    newContent = newContent.replace(classDiagramRegex, (match, diagramContent) => {
      let fixedDiagram = diagramContent;
      
      // Fix malformed class definitions
      fixedDiagram = fixedDiagram.replace(/class\s+([^{]+)\s*{\s*([^}]*)\s*}\s*([^{]*)\s*{\s*([^}]*)\s*}/g, 
        'class $1 {\n        $2\n    }\n    class $3 {\n        $4\n    }');
      
      const result = '```mermaid\n    classDiagram' + fixedDiagram + '\n```';
      
      if (result !== match) {
        hasChanges = true;
        console.log(`  📝 Fixed class diagram in ${file}`);
      }
      
      return result;
    });
    
    if (hasChanges) {
      fs.writeFileSync(file, newContent);
      fixedCount++;
    }
  });
  
  console.log(`✅ Fixed ${fixedCount} files with comprehensive Mermaid syntax errors`);
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
fixAllMermaidSyntax(); 