#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixSubgraphIssues() {
  console.log('🔧 Fixing subgraph/end statement mismatches...');
  
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
      const fixedDiagram = fixSubgraphMismatches(diagramContent.trim());
      if (fixedDiagram !== diagramContent.trim()) {
        hasChanges = true;
        totalFixes++;
        console.log(`  ✅ Fixed subgraph issues in ${file}`);
      }
      return '```mermaid\n' + fixedDiagram + '\n```';
    });
    
    if (hasChanges) {
      fs.writeFileSync(file, newContent);
      fixedFiles++;
    }
  });
  
  console.log(`\n🎉 Fixed ${totalFixes} subgraph issues in ${fixedFiles} files`);
}

function fixSubgraphMismatches(diagramContent) {
  let lines = diagramContent.split('\n');
  let fixed = [];
  let subgraphStack = [];
  let indentLevel = 0;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();
    
    // Track subgraph openings
    if (trimmed.startsWith('subgraph')) {
      subgraphStack.push({
        line: trimmed,
        indent: indentLevel
      });
      fixed.push(line);
      indentLevel += 4;
      continue;
    }
    
    // Handle end statements
    if (trimmed === 'end') {
      if (subgraphStack.length > 0) {
        const subgraph = subgraphStack.pop();
        indentLevel = Math.max(0, indentLevel - 4);
        // Ensure proper indentation for end
        const endLine = ' '.repeat(subgraph.indent) + 'end';
        fixed.push(endLine);
      } else {
        // Orphaned end, skip it
        console.log(`    Skipping orphaned 'end' statement`);
      }
      continue;
    }
    
    // Add the line with proper indentation if inside subgraph
    if (subgraphStack.length > 0 && trimmed && !trimmed.startsWith('flowchart') && !trimmed.startsWith('graph')) {
      // Ensure proper indentation for content inside subgraphs
      if (!line.startsWith(' '.repeat(indentLevel))) {
        line = ' '.repeat(indentLevel) + trimmed;
      }
    }
    
    fixed.push(line);
  }
  
  // Add missing end statements for unclosed subgraphs
  while (subgraphStack.length > 0) {
    const subgraph = subgraphStack.pop();
    indentLevel = Math.max(0, indentLevel - 4);
    const endLine = ' '.repeat(subgraph.indent) + 'end';
    fixed.push(endLine);
    console.log(`    Added missing 'end' for subgraph: ${subgraph.line}`);
  }
  
  return fixed.join('\n');
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
fixSubgraphIssues(); 