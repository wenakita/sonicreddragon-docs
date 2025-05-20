#!/usr/bin/env node

/**
 * This script updates mermaid diagrams in markdown files,
 * converting old 'graph' syntax to newer 'flowchart' syntax
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all markdown files in the docs directory
const docFiles = glob.sync('docs/**/*.md', { cwd: path.resolve(__dirname, '..') });

// Count of fixes made
let fixesCount = 0;
let filesFixed = 0;

// Process each file
docFiles.forEach(file => {
  const filePath = path.resolve(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find mermaid code blocks with 'graph' syntax
  const mermaidRegex = /```mermaid\s+([\s\S]*?)```/g;
  let match;
  let fileChanged = false;
  
  // Store matches and their positions to process in reverse order 
  // (to avoid position changes when replacing)
  const matches = [];
  
  while ((match = mermaidRegex.exec(content)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      fullMatch: match[0],
      diagramCode: match[1]
    });
  }
  
  // Process matches in reverse order
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    const diagramCode = m.diagramCode;
    
    // Check if the diagram starts with 'graph '
    if (diagramCode.trim().startsWith('graph ')) {
      // Replace 'graph ' with 'flowchart '
      const fixedDiagramCode = diagramCode.replace(/^(\s*)graph(\s+)/m, '$1flowchart$2');
      
      // Construct the fixed mermaid block
      const fixedBlock = "```mermaid\n" + fixedDiagramCode + "```";
      
      // Replace the old block with the fixed one
      content = content.substring(0, m.index) + 
                fixedBlock + 
                content.substring(m.index + m.length);
      
      fileChanged = true;
      fixesCount++;
    }
  }
  
  // Save the file if changes were made
  if (fileChanged) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
    filesFixed++;
  }
});

console.log(`\nComplete! Fixed ${fixesCount} mermaid diagrams in ${filesFixed} files.`);
if (fixesCount > 0) {
  console.log("Please rebuild your site to see the changes.");
} 