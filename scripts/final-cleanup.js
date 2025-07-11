#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('FINAL CLEANUP - REMOVING ALL BROKEN DIAGRAM REMNANTS');
console.log('====================================================\n');

function finalCleanup(content) {
  let cleanedContent = content;
  
  // Remove broken diagram remnants like "```- This diagram is being updated..."
  cleanedContent = cleanedContent.replace(
    /```- This diagram is being updated to ensure compatibility with interactive features\./g,
    ''
  );
  
  // Remove orphaned comment endings
  cleanedContent = cleanedContent.replace(
    /-->\s*$/gm,
    ''
  );
  
  // Remove duplicate mermaid blocks that are identical
  cleanedContent = cleanedContent.replace(
    /(```mermaid[\s\S]*?```)\s*```- This diagram is being updated[\s\S]*?-->\s*(```mermaid[\s\S]*?```)/g,
    '$1'
  );
  
  // Clean up any remaining broken comment structures
  cleanedContent = cleanedContent.replace(
    /```- This diagram[\s\S]*?-->/g,
    ''
  );
  
  // Remove any remaining "- This diagram is being updated" lines
  cleanedContent = cleanedContent.replace(
    /- This diagram is being updated to ensure compatibility with interactive features\./g,
    ''
  );
  
  // Clean up multiple consecutive empty lines
  cleanedContent = cleanedContent.replace(/\n\n\n+/g, '\n\n');
  
  // Fix any remaining bullet point formatting issues
  cleanedContent = cleanedContent.replace(/^-\*\*/gm, '- **');
  
  return cleanedContent;
}

function processAllFiles() {
  const directories = ['docs-new'];
  let totalCleaned = 0;
  
  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = getAllMarkdownFiles(dir);
      
      files.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          const cleanedContent = finalCleanup(content);
          
          if (cleanedContent !== content) {
            fs.writeFileSync(file, cleanedContent);
            console.log(`Cleaned up ${file.replace(process.cwd() + '/', '')}`);
            totalCleaned++;
          }
        } catch (error) {
          console.log(`Error cleaning ${file}: ${error.message}`);
        }
      });
    }
  });
  
  console.log(`\nCleaned up ${totalCleaned} files.`);
  console.log('All broken diagram remnants removed!');
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

// Run the cleanup
processAllFiles(); 