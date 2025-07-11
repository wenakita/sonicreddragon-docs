#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Running pre-start fixes...\n');

// Find all markdown files
const files = glob.sync('docs/**/*.md', { cwd: process.cwd() });
console.log(`Found ${files.length} documentation files to process...\n`);

let totalFilesProcessed = 0;
let totalFilesWithFixes = 0;
let totalMermaidIssuesFixed = 0;
let totalBrokenLinksFixed = 0;

// Fix Mermaid syntax issues
function fixMermaidSyntax(content, filePath) {
  let fixed = content;
  let issuesFixed = 0;

  // Fix mermaid blocks
  fixed = fixed.replace(/```mermaid\n([\s\S]*?)```/g, (match, diagramContent) => {
    let fixedDiagram = diagramContent;
    
    // Fix 1: Fix invalid color code #fffffffff (too many f's)
    const originalColorCount = (fixedDiagram.match(/#fffffffff/g) || []).length;
    fixedDiagram = fixedDiagram.replace(/#fffffffff/g, '#ffffff');
    issuesFixed += originalColorCount;
    
    // Fix 2: Fix mismatched subgraph/end statements
    // Count subgraph and end statements
    const subgraphCount = (fixedDiagram.match(/subgraph/g) || []).length;
    const endCount = (fixedDiagram.match(/\bend\b/g) || []).length;
    
    // Fix specific issue with "endstyle" pattern (missing space)
    if (fixedDiagram.includes('endstyle')) {
      const endstyleCount = (fixedDiagram.match(/endstyle/g) || []).length;
      fixedDiagram = fixedDiagram.replace(/endstyle/g, 'end\n    style');
      issuesFixed += endstyleCount;
    }
    
    // Fix specific issue with consecutive "end" statements without proper spacing
    if (fixedDiagram.match(/end(\s*)end/)) {
      const endEndCount = (fixedDiagram.match(/end(\s*)end/g) || []).length;
      fixedDiagram = fixedDiagram.replace(/end(\s*)end/g, 'end\n    end');
      issuesFixed += endEndCount;
    }
    
    // If there are more subgraphs than end statements, add missing end statements
    if (subgraphCount > endCount) {
      // First, identify and fix properly structured subgraphs
      fixedDiagram = fixedDiagram.replace(/subgraph\s+"([^"]+)"\s*\n((?:(?!subgraph|end)[^\n]*\n)*)/g, (match, title, content) => {
        const lines = content.split('\n').filter(line => line.trim());
        const indentedLines = lines.map(line => line.trim() ? `    ${line.trim()}` : '').join('\n');
        return `subgraph "${title}"\n${indentedLines}\n    end`;
      });
      
      // Count again after fixing structured subgraphs
      const newEndCount = (fixedDiagram.match(/\bend\b/g) || []).length;
      const missingEnds = subgraphCount - newEndCount;
      
      if (missingEnds > 0) {
        // Add missing end statements at the end of the diagram
        const properEnds = Array(missingEnds).fill('    end').join('\n');
        // Just append the end statements to the end of the diagram
        fixedDiagram = fixedDiagram.trim() + '\n' + properEnds;
        issuesFixed += missingEnds;
      }
    } else if (endCount > subgraphCount) {
      // If there are more end statements than subgraphs, remove excess end statements
      
      // First, identify and fix properly structured subgraphs
      fixedDiagram = fixedDiagram.replace(/subgraph\s+"([^"]+)"\s*\n((?:(?!subgraph|end)[^\n]*\n)*)/g, (match, title, content) => {
        const lines = content.split('\n').filter(line => line.trim());
        const indentedLines = lines.map(line => line.trim() ? `    ${line.trim()}` : '').join('\n');
        return `subgraph "${title}"\n${indentedLines}\n    end`;
      });
      
      // Count again after fixing structured subgraphs
      const newSubgraphCount = (fixedDiagram.match(/subgraph/g) || []).length;
      const newEndCount = (fixedDiagram.match(/\bend\b/g) || []).length;
      
      if (newEndCount > newSubgraphCount) {
        // Remove excess end statements
        const excessEnds = newEndCount - newSubgraphCount;
        let endRemoved = 0;
        
        // Remove standalone end statements first
        const standaloneEndRegex = /^\s*end\s*$/gm;
        const standaloneMatches = fixedDiagram.match(standaloneEndRegex) || [];
        
        if (standaloneMatches.length > 0) {
          // Only remove as many as needed
          const toRemove = Math.min(excessEnds, standaloneMatches.length);
          let tempDiagram = fixedDiagram;
          
          for (let i = 0; i < toRemove; i++) {
            tempDiagram = tempDiagram.replace(standaloneEndRegex, '');
            endRemoved++;
          }
          
          fixedDiagram = tempDiagram;
        }
        
        // If we still have excess ends, look for trailing ends
        if (endRemoved < excessEnds) {
          const trailingEndRegex = /(\s*end\s*)+$/g;
          if (trailingEndRegex.test(fixedDiagram)) {
            const remainingToRemove = excessEnds - endRemoved;
            const trailingEnds = fixedDiagram.match(/(\s*end\s*)+$/)[0].match(/end/g).length;
            const keepEnds = Math.max(0, trailingEnds - remainingToRemove);
            
            if (keepEnds === 0) {
              // Remove all trailing ends
              fixedDiagram = fixedDiagram.replace(trailingEndRegex, '');
            } else {
              // Keep some trailing ends
              const properEnds = Array(keepEnds).fill('    end').join('\n');
              fixedDiagram = fixedDiagram.replace(trailingEndRegex, '\n' + properEnds);
            }
            
            endRemoved += Math.min(trailingEnds, remainingToRemove);
          }
        }
        
        issuesFixed += endRemoved;
      }
    }
    
    return `\`\`\`mermaid\n${fixedDiagram}\`\`\``;
  });

  if (issuesFixed > 0) {
    totalMermaidIssuesFixed += issuesFixed;
  }
  
  return { content: fixed, issuesFixed };
}

// Fix broken links
function fixBrokenLinks(content, filePath) {
  let fixed = content;
  let linksFixed = 0;
  
  // Define link mappings
  const linkMappings = {
    '/token-system.md': '/concepts/token-system',
    '/fee-system.md': '/concepts/fee-system',
    '/jackpot-system.md': '/concepts/jackpot-system',
    '/randomness.md': '/concepts/randomness',
    '/cross-chain.md': '/concepts/cross-chain',
    '/security-model.md': '/concepts/security-model',
    '/governance.md': '/concepts/governance',
    '/architecture.md': '/concepts/architecture',
    // Add mappings for links that already have /concepts/ prefix but still have .md extension
    '/concepts/token-system.md': '/concepts/token-system',
    '/concepts/fee-system.md': '/concepts/fee-system',
    '/concepts/jackpot-system.md': '/concepts/jackpot-system',
    '/concepts/randomness.md': '/concepts/randomness',
    '/concepts/cross-chain.md': '/concepts/cross-chain',
    '/concepts/security-model.md': '/concepts/security-model',
    '/concepts/governance.md': '/concepts/governance',
    '/concepts/architecture.md': '/concepts/architecture'
  };

  // Apply each mapping
  Object.entries(linkMappings).forEach(([oldLink, newLink]) => {
    const regex = new RegExp(`\\(${oldLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    const matches = fixed.match(regex) || [];
    linksFixed += matches.length;
    
    if (matches.length > 0) {
      fixed = fixed.replace(regex, `(${newLink}`);
    }

    // Also fix with hash fragments
    const hashRegex = new RegExp(`\\(${oldLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}#`, 'g');
    const hashMatches = fixed.match(hashRegex) || [];
    linksFixed += hashMatches.length;
    
    if (hashMatches.length > 0) {
      fixed = fixed.replace(hashRegex, `(${newLink}#`);
    }
  });

  if (linksFixed > 0) {
    totalBrokenLinksFixed += linksFixed;
  }
  
  return { content: fixed, linksFixed };
}

// Process each file
files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Fix Mermaid syntax
  const mermaidResult = fixMermaidSyntax(content, file);
  content = mermaidResult.content;
  
  // Fix broken links
  const linksResult = fixBrokenLinks(content, file);
  content = linksResult.content;
  
  // Write changes if needed
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFilesWithFixes++;
    
    console.log(`✅ Fixed ${file}:`);
    if (mermaidResult.issuesFixed > 0) {
      console.log(`   - Fixed ${mermaidResult.issuesFixed} Mermaid syntax issues`);
    }
    if (linksResult.linksFixed > 0) {
      console.log(`   - Fixed ${linksResult.linksFixed} broken links`);
    }
  }
  
  totalFilesProcessed++;
});

// Fix specific files with complex issues
const specificFixes = {
  'docs/contracts/core/token-clean.md': {
    search: `    end
    end
    end\`\`\``,
    replace: `    end
    end
\`\`\``
  }
};

// Apply specific fixes
Object.entries(specificFixes).forEach(([file, fix]) => {
  const filePath = path.join(process.cwd(), file);
  
  try {
    if (!fs.existsSync(filePath)) {
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Apply the fix
    content = content.replace(fix.search, fix.replace);
    
    // Write changes if needed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Applied specific fix to ${file}`);
      
      if (!files.includes(file)) {
        totalFilesWithFixes++;
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}: ${error.message}`);
  }
});

// Print summary
console.log(`\n📊 Summary:`);
console.log(`   Total files processed: ${totalFilesProcessed}`);
console.log(`   Files with fixes: ${totalFilesWithFixes}`);
console.log(`   Mermaid issues fixed: ${totalMermaidIssuesFixed}`);
console.log(`   Broken links fixed: ${totalBrokenLinksFixed}`);

if (totalFilesWithFixes === 0) {
  console.log('\n✨ No issues found!');
} else {
  console.log(`\n✨ Fixed issues in ${totalFilesWithFixes} files!`);
}

// Verify fixes
console.log('\n🔍 Verifying fixes...');

let verificationPassed = true;
let remainingMermaidIssues = 0;
let remainingBrokenLinks = 0;

// Check for Mermaid syntax issues
function checkMermaidSyntax(content) {
  let issues = 0;

  // Check for invalid color codes
  const invalidColorMatches = content.match(/#fffffffff/g) || [];
  issues += invalidColorMatches.length;

  // Check for mermaid blocks
  const mermaidBlocks = [];
  content.replace(/```mermaid\n([\s\S]*?)```/g, (match, mermaidContent) => {
    mermaidBlocks.push(mermaidContent);
    return match;
  });

  // Check for mismatched subgraph/end statements in each block
  mermaidBlocks.forEach(block => {
    const subgraphCount = (block.match(/subgraph/g) || []).length;
    const endCount = (block.match(/\bend\b/g) || []).length;
    
    if (subgraphCount !== endCount) {
      issues += Math.abs(subgraphCount - endCount);
    }
    
    // Check for "endstyle" pattern (missing space)
    const endstyleMatches = block.match(/endstyle/g) || [];
    issues += endstyleMatches.length;
  });

  return issues;
}

// Check for broken links
function checkBrokenLinks(content) {
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

// Process each file for verification
files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for Mermaid syntax issues
  const mermaidIssues = checkMermaidSyntax(content);
  if (mermaidIssues > 0) {
    remainingMermaidIssues += mermaidIssues;
    verificationPassed = false;
  }
  
  // Check for broken links
  const brokenLinks = checkBrokenLinks(content);
  if (brokenLinks > 0) {
    remainingBrokenLinks += brokenLinks;
    verificationPassed = false;
  }
});

// Print verification results
if (verificationPassed) {
  console.log('✅ All issues have been fixed successfully!');
} else {
  console.log('⚠️ Some issues still remain:');
  if (remainingMermaidIssues > 0) {
    console.log(`   - ${remainingMermaidIssues} Mermaid syntax issues`);
  }
  if (remainingBrokenLinks > 0) {
    console.log(`   - ${remainingBrokenLinks} broken links`);
  }
}

console.log('\n🚀 Pre-start fixes completed!');
