/**
 * Fix Mermaid Syntax Script
 * 
 * This script scans all Markdown files in the docs directory and fixes common
 * Mermaid syntax issues to ensure proper rendering.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to sanitize mermaid diagram code
function sanitizeMermaidDiagram(text) {
  if (!text) return text;
  
  // Apply comprehensive sanitization
  return text
    // Fix classDef with problematic Unicode
    .replace(/classDef\s+(\w+)\s+fill:[^\n;]*/g, (match, className) => {
      return `classDef ${className} fill:#4a80d1`;
    })
    // Fix class statements with commas and highlight keyword
    .replace(/class\s+([^;\n]+)(\s+highlight)/g, (match, classList, highlight) => {
      // Replace commas with spaces in the class list
      const fixedClassList = classList.replace(/,/g, ' ');
      return `class ${fixedClassList}${highlight}`;
    })
    // Fix commas in class names in class diagrams that don't have highlight
    .replace(/class\s+([^;\n]+)(?!\s+highlight)/g, (match, classList) => {
      // Replace commas with spaces
      const fixedClassList = classList.replace(/,/g, ' ');
      return `class ${fixedClassList}`;
    })
    // Replace all non-ASCII characters
    .replace(/[^\x00-\x7F]/g, '')
    // Ensure spaces around relationships
    .replace(/(\w+)--+>(\w+)/g, '$1 --> $2')
    .replace(/(\w+)<--+(\w+)/g, '$1 <-- $2')
    .replace(/(\w+)-.+->(\w+)/g, '$1 --> $2')
    // Replace any remaining problematic characters
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[—–]/g, '-');
}

// Function to fix mermaid diagrams in a file
function fixMermaidDiagramsInFile(filePath) {
  try {
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find all mermaid code blocks
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
    let match;
    let newContent = content;
    let hasChanges = false;
    
    // Process each mermaid code block
    while ((match = mermaidRegex.exec(content)) !== null) {
      const originalDiagram = match[1];
      const sanitizedDiagram = sanitizeMermaidDiagram(originalDiagram);
      
      // Replace the diagram if changes were made
      if (sanitizedDiagram !== originalDiagram) {
        newContent = newContent.replace(
          `\`\`\`mermaid\n${originalDiagram}\`\`\``,
          `\`\`\`mermaid\n${sanitizedDiagram}\`\`\``
        );
        hasChanges = true;
      }
    }
    
    // Save the file if changes were made
    if (hasChanges) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed Mermaid diagrams in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Function to fix all mermaid diagrams in the docs directory
function fixAllMermaidDiagrams() {
  // Find all markdown files in the docs directory
  const files = glob.sync('docs/**/*.{md,mdx}');
  
  // Process each file
  let fixedCount = 0;
  let totalDiagrams = 0;
  
  files.forEach(file => {
    const filePath = path.resolve(file);
    
    // Count mermaid diagrams in the file
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const mermaidMatches = content.match(/```mermaid\n([\s\S]*?)```/g) || [];
      totalDiagrams += mermaidMatches.length;
      
      // Fix mermaid diagrams in the file
      if (mermaidMatches.length > 0) {
        const fixed = fixMermaidDiagramsInFile(filePath);
        if (fixed) {
          fixedCount++;
        }
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  });
  
  // Print summary
  console.log('\nMermaid Diagram Fix Summary:');
  console.log(`Total files scanned: ${files.length}`);
  console.log(`Total Mermaid diagrams found: ${totalDiagrams}`);
  console.log(`Files with fixed diagrams: ${fixedCount}`);
}

// Function to fix mermaid syntax in content
function fixMermaidSyntax(content) {
  let fixed = content;
  
  // Fix classDiagram with semicolon
  fixed = fixed.replace(/classDiagram;/g, 'classDiagram');
  
  // Fix flowchart/graph/sequenceDiagram with semicolons
  fixed = fixed.replace(/flowchart TB;/g, 'flowchart TB');
  fixed = fixed.replace(/graph TB;/g, 'graph TB');
  fixed = fixed.replace(/sequenceDiagram;/g, 'sequenceDiagram');
  
  // Fix semicolons at end of lines in mermaid blocks
  // This regex looks for lines ending with semicolon within mermaid blocks
  fixed = fixed.replace(/```mermaid([\s\S]*?)```/g, (match, mermaidContent) => {
    // Remove semicolons at the end of lines
    let fixedContent = mermaidContent.replace(/;(\s*\n)/g, '$1');
    
    // Fix class definitions with semicolons
    fixedContent = fixedContent.replace(/\{;/g, '{');
    fixedContent = fixedContent.replace(/\};/g, '}');
    
    // Fix subgraph syntax with end on wrong line
    fixedContent = fixedContent.replace(/subgraph\s+"([^"]+)";\s*\n\s*end\s*\n/g, 'subgraph "$1"\n');
    fixedContent = fixedContent.replace(/subgraph\s+"([^"]+)"\s*\n\s*end\s*\n/g, 'subgraph "$1"\n');
    
    // Fix multiple class assignments
    fixedContent = fixedContent.replace(/class\s+([A-Za-z0-9\s]+)([a-z]+);;/g, 'class $1 $2');
    
    // Fix class assignments with commas
    fixedContent = fixedContent.replace(/class\s+([A-Za-z0-9]+)\s+([A-Za-z0-9]+)([A-Za-z0-9]+)\s+([A-Za-z0-9]+)\s+([A-Za-z0-9]+)\s+([a-z]+);/g, 
      'class $1,$2,$3,$4,$5 $6');
    
    return '```mermaid' + fixedContent + '```';
  });
  
  return fixed;
}

// Process all markdown files
function processFiles() {
  const files = glob.sync('docs/**/*.md');
  let filesFixed = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const fixedContent = fixMermaidSyntax(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(file, fixedContent);
      console.log(`Fixed: ${file}`);
      filesFixed++;
    }
  });
  
  console.log(`\nFixed ${filesFixed} files with mermaid syntax errors.`);
}

// Run the script
console.log('Starting Mermaid syntax fix script...');
fixAllMermaidDiagrams();
console.log('Mermaid syntax fix script completed.');

console.log('Fixing mermaid syntax errors...\n');
processFiles();
