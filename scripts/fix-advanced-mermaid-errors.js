#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixAdvancedMermaidErrors() {
  console.log('🚨 Fixing advanced Mermaid syntax errors...');
  
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
      const fixedDiagram = fixAdvancedSyntaxErrors(diagramContent.trim());
      if (fixedDiagram !== diagramContent.trim()) {
        hasChanges = true;
        totalFixes++;
        console.log(`  ✅ Fixed advanced errors in ${file}`);
      }
      return '```mermaid\n' + fixedDiagram + '\n```';
    });
    
    if (hasChanges) {
      fs.writeFileSync(file, newContent);
      fixedFiles++;
    }
  });
  
  console.log(`\n🎉 Fixed ${totalFixes} advanced errors in ${fixedFiles} files`);
}

function fixAdvancedSyntaxErrors(diagramContent) {
  let fixed = diagramContent;
  
  // Detect diagram type
  const firstLine = fixed.split('\n')[0].trim().toLowerCase();
  
  if (firstLine.includes('flowchart') || firstLine.includes('graph')) {
    fixed = fixAdvancedFlowchartErrors(fixed);
  } else if (firstLine.includes('sequencediagram')) {
    fixed = fixAdvancedSequenceErrors(fixed);
  } else if (firstLine.includes('classdiagram')) {
    fixed = fixAdvancedClassErrors(fixed);
  }
  
  // Apply general advanced fixes
  fixed = fixGeneralAdvancedErrors(fixed);
  
  return fixed;
}

function fixAdvancedFlowchartErrors(content) {
  let lines = content.split('\n');
  let fixed = [];
  let stylingSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();
    
    // Fix malformed flowchart declaration like "flowchart TB_A[LP Token Holde"
    if (trimmed.startsWith('flowchart ') && trimmed.includes('[')) {
      // This is a malformed flowchart declaration with node definition mixed in
      const parts = trimmed.split('[');
      if (parts.length > 1) {
        // Split into proper flowchart declaration and node definition
        const flowchartDecl = parts[0].trim();
        const nodeContent = parts.slice(1).join('[');
        
        // Fix the flowchart declaration
        const flowchartMatch = flowchartDecl.match(/flowchart\s+(\w+)_(\w+)/);
        if (flowchartMatch) {
          const direction = flowchartMatch[1];
          const nodeId = flowchartMatch[2];
          
          fixed.push(`flowchart ${direction}`);
          // Add the node definition on next line
          fixed.push(`    ${nodeId}[${nodeContent}`);
          continue;
        }
      }
    }
    
    // Fix styling syntax errors like "color:#000000_core[TOKEN JACKPOT CROSS"
    if (trimmed.includes('color:#') && trimmed.includes('_') && trimmed.includes('[')) {
      // This is malformed styling mixed with node definition
      const parts = trimmed.split('_');
      if (parts.length > 1) {
        const stylePart = parts[0];
        const nodePart = parts.slice(1).join('_');
        
        // Extract node ID and content
        const nodeMatch = nodePart.match(/(\w+)\[(.+)/);
        if (nodeMatch) {
          const nodeId = nodeMatch[1];
          const nodeContent = nodeMatch[2];
          
          // Add proper node definition
          fixed.push(`    ${nodeId}[${nodeContent}]`);
          // Add styling on separate line
          if (stylePart.includes('color:')) {
            fixed.push(`    style ${nodeId} ${stylePart}`);
          }
          continue;
        }
      }
    }
    
    // Fix incomplete styling lines
    if (trimmed.includes('color:#') && !trimmed.includes('style ')) {
      // This might be a malformed style line
      const colorMatch = trimmed.match(/color:(#[0-9a-fA-F]{6})/);
      if (colorMatch) {
        // Skip malformed styling for now, will be handled by node fixes
        continue;
      }
    }
    
    // Fix nodes with styling mixed in like "px,color:#ffffff_eth[ETH_TOKEN ETH_BRIDG"
    if (trimmed.includes('px,color:#') && trimmed.includes('_') && trimmed.includes('[')) {
      const parts = trimmed.split('_');
      if (parts.length > 1) {
        const nodePart = parts[parts.length - 1];
        const nodeMatch = nodePart.match(/(\w+)\[(.+)/);
        if (nodeMatch) {
          const nodeId = nodeMatch[1];
          const nodeContent = nodeMatch[2];
          fixed.push(`    ${nodeId}[${nodeContent}]`);
          continue;
        }
      }
    }
    
    // Fix class definitions in flowcharts (should be nodes, not classes)
    if (trimmed.startsWith('class +') || trimmed.includes('class +address')) {
      // This is class diagram syntax in a flowchart, convert to node
      const classMatch = trimmed.match(/class\s+\+?(\w+)\s+(\w+)/);
      if (classMatch) {
        const nodeId = classMatch[2];
        const nodeLabel = classMatch[1];
        fixed.push(`    ${nodeId}[${nodeLabel}]`);
        continue;
      }
    }
    
    fixed.push(line);
  }
  
  return fixed.join('\n');
}

function fixAdvancedSequenceErrors(content) {
  let lines = content.split('\n');
  let fixed = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();
    
    // Fix incomplete sequence messages that end with arrows
    if (trimmed.includes('->>') && (trimmed.endsWith('->>') || trimmed.endsWith('->>'))) {
      // Find the source participant
      const parts = trimmed.split('->>');
      if (parts.length >= 1) {
        const source = parts[0].trim();
        // Add a generic destination
        line = line.replace(trimmed, `${source}->> System: Action`);
      }
    }
    
    // Fix incomplete regular arrows
    if (trimmed.includes('->') && trimmed.endsWith('->')) {
      const parts = trimmed.split('->');
      if (parts.length >= 1) {
        const source = parts[0].trim();
        line = line.replace(trimmed, `${source}-> System: Action`);
      }
    }
    
    fixed.push(line);
  }
  
  return fixed.join('\n');
}

function fixAdvancedClassErrors(content) {
  let lines = content.split('\n');
  let fixed = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();
    
    // Fix malformed class definitions with + at the beginning
    if (trimmed.startsWith('class +')) {
      // Remove the + and fix the syntax
      const cleanLine = trimmed.replace('class +', 'class ');
      const parts = cleanLine.split(' ');
      if (parts.length >= 3) {
        const className = parts[2];
        fixed.push(`class ${className} {`);
        fixed.push('    +method()');
        fixed.push('}');
        continue;
      }
    }
    
    fixed.push(line);
  }
  
  return fixed.join('\n');
}

function fixGeneralAdvancedErrors(content) {
  let fixed = content;
  
  // Fix malformed flowchart declarations with underscores
  fixed = fixed.replace(/flowchart\s+(\w+)_(\w+)\[/g, 'flowchart $1\n    $2[');
  
  // Fix styling mixed with node definitions
  fixed = fixed.replace(/([^,\s]+),color:(#[0-9a-fA-F]{6})_(\w+)\[([^\]]+)\]/g, 
    '    $3[$4]\n    style $3 fill:$2');
  
  // Fix incomplete node definitions that got cut off
  fixed = fixed.replace(/(\w+)\[([^\]]+)$/gm, '$1[$2]');
  
  // Fix nodes that have styling prefixes
  fixed = fixed.replace(/\w+px,color:#[0-9a-fA-F]{6}_(\w+)\[([^\]]+)/g, '$1[$2]');
  
  // Remove malformed styling lines that couldn't be parsed
  fixed = fixed.replace(/^\s*[^,\s]+,color:#[0-9a-fA-F]{6}_.*$/gm, '');
  
  // Fix class syntax in flowcharts
  fixed = fixed.replace(/^\s*class\s+\+(\w+)\s+(\w+).*$/gm, '    $2[$1]');
  
  // Clean up empty lines created by removals
  fixed = fixed.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Ensure proper line endings
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

// Run the advanced fix
fixAdvancedMermaidErrors(); 