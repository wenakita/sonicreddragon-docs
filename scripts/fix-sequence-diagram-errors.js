#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('FIXING SEQUENCE DIAGRAM SYNTAX ERRORS');
console.log('=====================================\n');

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

function fixSequenceDiagramErrors(content) {
  let fixedContent = content;
  
  // Fix "SwapTrigger ->> SwapTrigger as Request randomness" (invalid syntax)
  fixedContent = fixedContent.replace(
    /SwapTrigger ->> SwapTrigger as Request randomness/g,
    'SwapTrigger ->> SwapTrigger: Request randomness'
  );
  
  // Fix any other "as" syntax in sequence diagrams (should be ":")
  fixedContent = fixedContent.replace(
    /(\w+) ->> (\w+) as ([^:\n]+)/g,
    '$1 ->> $2: $3'
  );
  
  // Fix incomplete arrows that end lines
  fixedContent = fixedContent.replace(
    /(\w+) ->>$/gm,
    '$1 ->> System: Process'
  );
  
  // Fix any remaining malformed sequence syntax
  fixedContent = fixedContent.replace(
    /(\w+) ->> (\w+) as$/gm,
    '$1 ->> $2: Process'
  );
  
  return fixedContent;
}

function processFiles() {
  const directories = ['docs', 'docs-new'];
  let totalFixed = 0;
  
  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = getAllMarkdownFiles(dir);
      
      files.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          const fixedContent = fixSequenceDiagramErrors(content);
          
          if (fixedContent !== content) {
            fs.writeFileSync(file, fixedContent);
            console.log(`Fixed sequence diagram errors in ${file.replace(process.cwd() + '/', '')}`);
            totalFixed++;
          }
          
        } catch (error) {
          console.log(`Error processing ${file}: ${error.message}`);
        }
      });
    }
  });
  
  console.log(`\nFixed sequence diagram errors in ${totalFixed} files.`);
}

// Run the fix
processFiles(); 