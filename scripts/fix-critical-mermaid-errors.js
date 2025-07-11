#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixCriticalMermaidErrors() {
  console.log('🚨 Fixing critical Mermaid syntax errors causing runtime crashes...');
  
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
      const fixedDiagram = fixCriticalSyntaxErrors(diagramContent.trim());
      if (fixedDiagram !== diagramContent.trim()) {
        hasChanges = true;
        totalFixes++;
        console.log(`  ✅ Fixed critical errors in ${file}`);
      }
      return '```mermaid\n' + fixedDiagram + '\n```';
    });
    
    if (hasChanges) {
      fs.writeFileSync(file, newContent);
      fixedFiles++;
    }
  });
  
  console.log(`\n🎉 Fixed ${totalFixes} critical errors in ${fixedFiles} files`);
}

function fixCriticalSyntaxErrors(diagramContent) {
  let fixed = diagramContent;
  
  // Detect diagram type
  const firstLine = fixed.split('\n')[0].trim().toLowerCase();
  
  if (firstLine.includes('flowchart') || firstLine.includes('graph')) {
    fixed = fixFlowchartCriticalErrors(fixed);
  } else if (firstLine.includes('sequencediagram')) {
    fixed = fixSequenceCriticalErrors(fixed);
  } else if (firstLine.includes('classdiagram')) {
    fixed = fixClassCriticalErrors(fixed);
  }
  
  // Apply general critical fixes
  fixed = fixGeneralCriticalErrors(fixed);
  
  return fixed;
}

function fixFlowchartCriticalErrors(content) {
  let lines = content.split('\n');
  let fixed = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();
    
    // Fix the specific error: "core[class TOKEN,JACKPOT" - this is invalid syntax
    // This should be either a node definition or a subgraph
    if (trimmed.includes('[class ') && !trimmed.startsWith('subgraph')) {
      // This looks like someone tried to put class syntax in a flowchart node
      // Convert to proper flowchart node syntax
      const match = trimmed.match(/(\w+)\[class\s+([^\]]+)\]/);
      if (match) {
        const nodeId = match[1];
        const nodeLabel = match[2].replace(/,/g, ' ');
        line = line.replace(trimmed, `${nodeId}[${nodeLabel}]`);
      }
    }
    
    // Fix malformed node definitions like "eth[class ETH_TOKEN,ETH"
    if (trimmed.includes('[class ') && !trimmed.includes(']')) {
      // Find the node ID
      const nodeMatch = trimmed.match(/(\w+)\[class\s+(.+)/);
      if (nodeMatch) {
        const nodeId = nodeMatch[1];
        const nodeContent = nodeMatch[2].replace(/,/g, ' ');
        line = line.replace(trimmed, `${nodeId}[${nodeContent}]`);
      }
    }
    
    // Fix nodes that have "class" in the label but wrong syntax
    if (trimmed.includes('class ') && trimmed.includes('[') && !trimmed.startsWith('subgraph')) {
      // Convert "A class B[class C decision]" to proper syntax
      const classMatch = trimmed.match(/(\w+)\s+class\s+(\w+)\[class\s+([^\]]+)\]/);
      if (classMatch) {
        const nodeId = classMatch[1];
        const nodeLabel = classMatch[3].replace(/,/g, ' ');
        line = line.replace(trimmed, `${nodeId}[${nodeLabel}]`);
      }
    }
    
    fixed.push(line);
  }
  
  return fixed.join('\n');
}

function fixSequenceCriticalErrors(content) {
  let lines = content.split('\n');
  let fixed = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();
    
    // Fix incomplete message lines like "SwapTrigger ->>" (missing destination)
    if (trimmed.includes('->>') && trimmed.endsWith('->>')) {
      // This is an incomplete message, add a placeholder destination
      line = line.replace(trimmed, trimmed + ' Destination: Message');
    }
    
    // Fix incomplete message lines like "SwapTrigger ->" (missing destination)
    if (trimmed.includes('->') && trimmed.endsWith('->')) {
      // This is an incomplete message, add a placeholder destination
      line = line.replace(trimmed, trimmed + ' Destination: Message');
    }
    
    // Fix messages that end with just the arrow
    if ((trimmed.includes('->>') || trimmed.includes('->')) && 
        (trimmed.endsWith('->>') || trimmed.endsWith('->'))) {
      const parts = trimmed.split(/->>/);
      if (parts.length === 2 && parts[1].trim() === '') {
        line = line.replace(trimmed, `${parts[0].trim()}->> Destination: Message`);
      }
    }
    
    fixed.push(line);
  }
  
  return fixed.join('\n');
}

function fixClassCriticalErrors(content) {
  let lines = content.split('\n');
  let fixed = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();
    
    // Fix malformed class definitions like "address swapTrigger {        +method()"
    if (trimmed.includes('{') && trimmed.includes('+method()') && !trimmed.includes('}')) {
      // This is a malformed class definition, fix it
      const classMatch = trimmed.match(/(\w+)\s+(\w+)\s*\{\s*\+method\(\)/);
      if (classMatch) {
        const className = classMatch[2];
        line = line.replace(trimmed, `class ${className} {\n        +method()\n    }`);
      }
    }
    
    // Fix incomplete class definitions
    if (trimmed.includes('class ') && trimmed.includes('{') && !trimmed.includes('}')) {
      // Add closing brace on next line
      fixed.push(line);
      fixed.push('    }');
      continue;
    }
    
    fixed.push(line);
  }
  
  return fixed.join('\n');
}

function fixGeneralCriticalErrors(content) {
  let fixed = content;
  
  // Remove any trailing semicolons that cause parse errors
  fixed = fixed.replace(/;/g, '');
  
  // Fix malformed subgraph syntax
  fixed = fixed.replace(/subgraph\s+([^[\n]+)\[/g, 'subgraph $1\n    ');
  
  // Fix orphaned square brackets in flowcharts
  fixed = fixed.replace(/\[class\s+([^\]]+)(?!\])/g, '[$1]');
  
  // Fix incomplete arrows
  fixed = fixed.replace(/-->\s*$/gm, '--> End');
  fixed = fixed.replace(/->\s*$/gm, '-> End');
  fixed = fixed.replace(/->>\s*$/gm, '->> End: Message');
  
  // Fix empty node definitions
  fixed = fixed.replace(/\[\s*\]/g, '[Node]');
  
  // Fix malformed node IDs with spaces
  fixed = fixed.replace(/(\w+)\s+(\w+)\[/g, '$1_$2[');
  
  // Ensure proper line endings
  fixed = fixed.replace(/\r\n/g, '\n');
  
  // Remove excessive empty lines
  fixed = fixed.replace(/\n\s*\n\s*\n/g, '\n\n');
  
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

// Run the critical fix
fixCriticalMermaidErrors(); 