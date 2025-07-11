#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 Verifying fixes for Mermaid syntax issues and broken links...\n');

// Find all markdown files
const files = glob.sync('docs/**/*.md', { cwd: process.cwd() });
console.log(`Found ${files.length} documentation files to check...\n`);

let totalMermaidIssues = 0;
let totalBrokenLinks = 0;
let filesWithMermaidIssues = [];
let filesWithBrokenLinks = [];

// Check for Mermaid syntax issues
function checkMermaidSyntax(content, filePath) {
  let issues = 0;
  let issueDetails = [];

  // Check for invalid color codes
  const invalidColorMatches = content.match(/#fffffffff/g) || [];
  if (invalidColorMatches.length > 0) {
    issues += invalidColorMatches.length;
    issueDetails.push(`${invalidColorMatches.length} invalid color codes (#fffffffff)`);
  }

  // Check for mermaid blocks
  const mermaidBlocks = [];
  content.replace(/```mermaid\n([\s\S]*?)```/g, (match, mermaidContent) => {
    mermaidBlocks.push(mermaidContent);
    return match;
  });

  // Check for mismatched subgraph/end statements in each block
  mermaidBlocks.forEach((block, index) => {
    // Count only explicit subgraph declarations
    const subgraphMatches = block.match(/subgraph\s+/g) || [];
    const subgraphCount = subgraphMatches.length;
    
    // Count only standalone end statements (not part of other words like "endstyle")
    const endMatches = block.match(/\b(end)\b/g) || [];
    const endCount = endMatches.length;
    
    if (subgraphCount !== endCount) {
      issues += Math.abs(subgraphCount - endCount);
      issueDetails.push(`Block ${index+1}: Mismatched subgraph/end (${subgraphCount} subgraphs, ${endCount} ends)`);
    }
    
    // Check for "endstyle" pattern (missing space)
    const endstyleMatches = block.match(/endstyle/g) || [];
    if (endstyleMatches.length > 0) {
      issues += endstyleMatches.length;
      issueDetails.push(`Block ${index+1}: ${endstyleMatches.length} "endstyle" patterns found`);
    }
  });

  if (issues > 0 && filePath) {
    console.log(`   Details for ${filePath}:`);
    issueDetails.forEach(detail => console.log(`     - ${detail}`));
  }

  return issues;
}

// Check for broken links
function checkBrokenLinks(content, filePath) {
  let issues = 0;
  
  // Check for links with .md extension
  const brokenLinkPatterns = [
    /\(\/token-system\.md/g,
    /\(\/fee-system\.md/g,
    /\(\/jackpot-system\.md/g,
    /\(\/randomness\.md/g,
    /\(\/cross-chain\.md/g,
    /\(\/security-model\.md/g,
    /\(\/governance\.md/g,
    /\(\/architecture\.md/g,
    /\(\/concepts\/token-system\.md/g,
    /\(\/concepts\/fee-system\.md/g,
    /\(\/concepts\/jackpot-system\.md/g,
    /\(\/concepts\/randomness\.md/g,
    /\(\/concepts\/cross-chain\.md/g,
    /\(\/concepts\/security-model\.md/g,
    /\(\/concepts\/governance\.md/g,
    /\(\/concepts\/architecture\.md/g
  ];

  brokenLinkPatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    issues += matches.length;
  });

  return issues;
}

// Process each file
files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for Mermaid syntax issues
  const mermaidIssues = checkMermaidSyntax(content, file);
  if (mermaidIssues > 0) {
    totalMermaidIssues += mermaidIssues;
    filesWithMermaidIssues.push({ file, issues: mermaidIssues });
  }
  
  // Check for broken links
  const brokenLinks = checkBrokenLinks(content, file);
  if (brokenLinks > 0) {
    totalBrokenLinks += brokenLinks;
    filesWithBrokenLinks.push({ file, issues: brokenLinks });
  }
});

// Print results
console.log('📊 Verification Results:');
console.log(`   Total files checked: ${files.length}`);

if (totalMermaidIssues === 0) {
  console.log('✅ No Mermaid syntax issues found!');
} else {
  console.log(`❌ Found ${totalMermaidIssues} Mermaid syntax issues in ${filesWithMermaidIssues.length} files:`);
  filesWithMermaidIssues.forEach(item => {
    console.log(`   - ${item.file}: ${item.issues} issues`);
  });
}

if (totalBrokenLinks === 0) {
  console.log('✅ No broken links found!');
} else {
  console.log(`❌ Found ${totalBrokenLinks} broken links in ${filesWithBrokenLinks.length} files:`);
  filesWithBrokenLinks.forEach(item => {
    console.log(`   - ${item.file}: ${item.issues} issues`);
  });
}

if (totalMermaidIssues === 0 && totalBrokenLinks === 0) {
  console.log('\n🎉 All issues have been fixed successfully!');
} else {
  console.log('\n⚠️ Some issues still need to be fixed. Run the fix script again.');
}
