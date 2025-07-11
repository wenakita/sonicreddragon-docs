#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixRemainingMermaidIssues() {
  console.log('🔧 Fixing remaining Mermaid diagram issues...');
  
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
      const fixedDiagram = fixMermaidDiagram(diagramContent.trim());
      if (fixedDiagram !== diagramContent.trim()) {
        hasChanges = true;
        totalFixes++;
        console.log(`  ✅ Fixed diagram in ${file}`);
      }
      return '```mermaid\n' + fixedDiagram + '\n```';
    });
    
    if (hasChanges) {
      fs.writeFileSync(file, newContent);
      fixedFiles++;
    }
  });
  
  console.log(`\n🎉 Fixed ${totalFixes} diagrams in ${fixedFiles} files`);
}

function fixMermaidDiagram(diagramContent) {
  let fixed = diagramContent;
  
  // Detect diagram type
  const firstLine = fixed.split('\n')[0].trim().toLowerCase();
  
  if (firstLine.includes('flowchart') || firstLine.includes('graph')) {
    fixed = fixFlowchartDiagram(fixed);
  } else if (firstLine.includes('sequencediagram')) {
    fixed = fixSequenceDiagram(fixed);
  } else if (firstLine.includes('classdiagram')) {
    fixed = fixClassDiagram(fixed);
  }
  
  // General fixes
  fixed = fixGeneralIssues(fixed);
  
  return fixed;
}

function fixFlowchartDiagram(content) {
  let lines = content.split('\n');
  let fixed = [];
  let subgraphStack = [];
  let inSubgraph = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();
    
    // Track subgraphs
    if (trimmed.startsWith('subgraph')) {
      subgraphStack.push(trimmed);
      inSubgraph = true;
      fixed.push(line);
      continue;
    }
    
    // Handle end statements
    if (trimmed === 'end') {
      if (subgraphStack.length > 0) {
        subgraphStack.pop();
        if (subgraphStack.length === 0) {
          inSubgraph = false;
        }
        fixed.push(line);
      }
      // Skip orphaned 'end' statements
      continue;
    }
    
    // Fix node definitions that are missing proper syntax
    if (trimmed && !trimmed.startsWith('flowchart') && !trimmed.startsWith('graph') && 
        !trimmed.includes('-->') && !trimmed.includes('---') && 
        !trimmed.includes('[') && !trimmed.includes('(') && !trimmed.includes('{') &&
        !trimmed.startsWith('subgraph') && trimmed !== 'end') {
      
      // This looks like a node without proper definition, fix it
      if (trimmed.length > 0 && !trimmed.includes(':')) {
        line = line.replace(trimmed, `${trimmed}[${trimmed}]`);
      }
    }
    
    fixed.push(line);
  }
  
  // Add missing end statements
  while (subgraphStack.length > 0) {
    fixed.push('    end');
    subgraphStack.pop();
  }
  
  return fixed.join('\n');
}

function fixSequenceDiagram(content) {
  let lines = content.split('\n');
  let fixed = [];
  let hasParticipants = false;
  
  // Check if we have participant definitions
  for (let line of lines) {
    if (line.trim().startsWith('participant')) {
      hasParticipants = true;
      break;
    }
  }
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();
    
    // Add participant definitions if missing
    if (!hasParticipants && (trimmed.includes('->') || trimmed.includes('->>')) && i === 1) {
      // Extract participants from first message
      const parts = trimmed.split(/->|->>/);
      if (parts.length >= 2) {
        const participant1 = parts[0].trim().split(':')[0];
        const participant2 = parts[1].trim().split(':')[0];
        
        fixed.push(`    participant ${participant1}`);
        fixed.push(`    participant ${participant2}`);
        hasParticipants = true;
      }
    }
    
    fixed.push(line);
  }
  
  return fixed.join('\n');
}

function fixClassDiagram(content) {
  let lines = content.split('\n');
  let fixed = [];
  
  for (let line of lines) {
    const trimmed = line.trim();
    
    // Fix class definitions that might be malformed
    if (trimmed && !trimmed.startsWith('classDiagram') && 
        !trimmed.includes('-->') && !trimmed.includes('--') && 
        !trimmed.includes('..') && !trimmed.includes('{') && 
        !trimmed.includes('}') && !trimmed.startsWith('class ')) {
      
      // This might be a class name without proper definition
      if (trimmed.length > 0 && !trimmed.includes(':')) {
        line = line.replace(trimmed, `class ${trimmed} {\n        +method()\n    }`);
      }
    }
    
    fixed.push(line);
  }
  
  return fixed.join('\n');
}

function fixGeneralIssues(content) {
  let fixed = content;
  
  // Remove trailing semicolons
  fixed = fixed.replace(/;/g, '');
  
  // Fix multiple consecutive end statements
  fixed = fixed.replace(/(\s*end\s*){2,}/g, '\n    end\n');
  
  // Remove excessive empty lines
  fixed = fixed.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Ensure proper indentation
  const lines = fixed.split('\n');
  const indentedLines = lines.map((line, index) => {
    if (index === 0) return line; // Keep first line as is
    
    const trimmed = line.trim();
    if (!trimmed) return line;
    
    // Add proper indentation for content lines
    if (!line.startsWith('    ') && trimmed !== 'end' && !trimmed.startsWith('subgraph')) {
      return '    ' + trimmed;
    }
    
    return line;
  });
  
  return indentedLines.join('\n');
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
fixRemainingMermaidIssues();
