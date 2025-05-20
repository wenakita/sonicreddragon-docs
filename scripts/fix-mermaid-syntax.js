#!/usr/bin/env node

/**
 * This script updates mermaid diagrams in markdown files,
 * converting old 'graph' syntax to newer 'flowchart' syntax
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Function to walk through directory recursively
async function walkDir(dir, fileList = []) {
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);
    
    if (stats.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      fileList = await walkDir(filePath, fileList);
    } else if (stats.isFile() && (file.endsWith('.md') || file.endsWith('.mdx'))) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Function to update mermaid syntax in a file
async function updateMermaidInFile(filePath) {
  let content = await readFile(filePath, 'utf8');
  let originalContent = content;
  
  // Check if file contains mermaid code blocks
  if (content.includes('```mermaid')) {
    console.log(`Processing ${filePath}...`);
    
    // Regular expression to match mermaid code blocks that start with "graph"
    const mermaidBlockRegex = /```mermaid\s+(graph\s+[A-Z]+)/g;
    
    // Replace "graph XX" with "flowchart XX"
    content = content.replace(mermaidBlockRegex, (match, graphDeclaration) => {
      const flowchartDeclaration = graphDeclaration.replace('graph', 'flowchart');
      console.log(`  Replaced "${graphDeclaration}" with "${flowchartDeclaration}"`);
      return `\`\`\`mermaid\n${flowchartDeclaration}`;
    });
    
    // Only write to file if changes were made
    if (content !== originalContent) {
      await writeFile(filePath, content, 'utf8');
      console.log(`  Updated ${filePath}`);
      return true;
    }
  }
  
  return false;
}

// Main function
async function main() {
  try {
    console.log('Updating mermaid syntax in markdown files...');
    
    // Get all markdown files
    const docsDir = path.join(__dirname, '..', 'docs');
    const files = await walkDir(docsDir);
    
    let changedFiles = 0;
    
    // Process each file
    for (const file of files) {
      const changed = await updateMermaidInFile(file);
      if (changed) changedFiles++;
    }
    
    console.log('\nSummary:');
    console.log(`Total files processed: ${files.length}`);
    console.log(`Files updated: ${changedFiles}`);
    console.log('Done!');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main(); 