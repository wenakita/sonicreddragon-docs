#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 Verifying Mermaid syntax in documentation...\n');

// Check for problematic patterns
function checkMermaidSyntax(content, filePath) {
  const issues = [];
  
  // Extract all mermaid blocks
  const mermaidBlocks = [];
  content.replace(/```mermaid([\s\S]*?)```/g, (match, mermaidContent) => {
    mermaidBlocks.push(mermaidContent);
    return match;
  });
  
  mermaidBlocks.forEach((block, index) => {
    // Check for spaces in class assignments (the error we saw)
    const classAssignmentPattern = /^\s*class\s+([A-Z_]+)\s+([A-Z_]+)\s+([A-Z_]+)/gm;
    const matches = block.match(classAssignmentPattern);
    if (matches) {
      issues.push({
        file: filePath,
        block: index + 1,
        issue: 'Multiple nodes with spaces in class assignment',
        line: matches[0]
      });
    }
    
    // Check for semicolons (should be removed)
    if (block.includes(';')) {
      issues.push({
        file: filePath,
        block: index + 1,
        issue: 'Contains semicolons',
        line: block.split('\n').find(line => line.includes(';'))
      });
    }
    
    // Check for 'end;' pattern
    if (/\bend\s*;/g.test(block)) {
      issues.push({
        file: filePath,
        block: index + 1,
        issue: 'Contains "end;" pattern',
        line: block.split('\n').find(line => /\bend\s*;/.test(line))
      });
    }
  });
  
  return issues;
}

// Process files
function verifyFiles() {
  const files = glob.sync('docs/**/*.{md,mdx}');
  let totalIssues = 0;
  const allIssues = [];
  
  console.log(`Checking ${files.length} documentation files...\n`);
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const issues = checkMermaidSyntax(content, file);
    
    if (issues.length > 0) {
      totalIssues += issues.length;
      allIssues.push(...issues);
    }
  });
  
  if (totalIssues > 0) {
    console.log('❌ Found issues:\n');
    allIssues.forEach(issue => {
      console.log(`File: ${issue.file}`);
      console.log(`  Block #${issue.block}: ${issue.issue}`);
      console.log(`  Line: "${issue.line?.trim()}"`);
      console.log('');
    });
    console.log(`Total issues found: ${totalIssues}`);
  } else {
    console.log('✅ All Mermaid diagrams have valid syntax!');
  }
  
  // Also show some example corrected syntax
  console.log('\n📝 Example of correct class assignments:');
  console.log('For flowchart/graph diagrams:');
  console.log('    class A primary');
  console.log('    class B secondary');
  console.log('    class C tertiary');
  console.log('\nFor class diagrams:');
  console.log('    class A,B,C primary');
}

verifyFiles(); 