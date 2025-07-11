#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Mermaid subgraph/end mismatches...\n');

// Define the files with issues
const filesToFix = [
  'docs/contracts/jackpot/triggers.md',
  'docs/contracts/core/token-clean.md',
  'docs/concepts/security.md',
  'docs/concepts/randomness-fixed.md',
  'docs/concepts/jackpot.md',
  'docs/concepts/jackpot-system-consolidated.md'
];

let totalFilesFixed = 0;
let totalIssuesFixed = 0;

// Process each file
filesToFix.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ File not found: ${file}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let fileIssuesFixed = 0;
    
    // Fix mermaid blocks
    content = content.replace(/```mermaid\n([\s\S]*?)```/g, (match, diagramContent) => {
      // Count subgraph and end statements
      const subgraphCount = (diagramContent.match(/subgraph/g) || []).length;
      const endCount = (diagramContent.match(/\bend\b/g) || []).length;
      
      if (subgraphCount === endCount) {
        return match; // No fix needed
      }
      
      let fixedDiagram = diagramContent;
      
      // If there are more end statements than subgraphs, remove excess end statements
      if (endCount > subgraphCount) {
        // Find trailing end statements
        const trailingEndsMatch = fixedDiagram.match(/(\s+end\s*)+$/);
        
        if (trailingEndsMatch) {
          const trailingEnds = trailingEndsMatch[0].match(/end/g).length;
          const excessEnds = endCount - subgraphCount;
          const keepEnds = trailingEnds - excessEnds;
          
          if (keepEnds <= 0) {
            // Remove all trailing ends
            fixedDiagram = fixedDiagram.replace(/(\s+end\s*)+$/, '');
          } else {
            // Keep some trailing ends
            const properEnds = Array(keepEnds).fill('    end').join('\n');
            fixedDiagram = fixedDiagram.replace(/(\s+end\s*)+$/, '\n' + properEnds);
          }
          
          fileIssuesFixed++;
        }
      }
      
      return `\`\`\`mermaid\n${fixedDiagram}\`\`\``;
    });
    
    // Write changes if needed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      totalFilesFixed++;
      totalIssuesFixed += fileIssuesFixed;
      
      console.log(`✅ Fixed ${file}: ${fileIssuesFixed} issues`);
    } else {
      console.log(`⚠️ No changes made to ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}: ${error.message}`);
  }
});

// Print summary
console.log(`\n📊 Summary:`);
console.log(`   Total files fixed: ${totalFilesFixed}`);
console.log(`   Total issues fixed: ${totalIssuesFixed}`);

if (totalFilesFixed === 0) {
  console.log('\n⚠️ No files were fixed!');
} else {
  console.log(`\n✨ Fixed issues in ${totalFilesFixed} files!`);
}

// Now let's create a more direct approach for the specific files
console.log('\n🔧 Applying direct fixes to problematic files...');

// Define specific fixes for each file
const specificFixes = {
  'docs/contracts/jackpot/triggers.md': {
    search: /```mermaid[\s\S]*?end\s+end\s+end\s+end```/g,
    replace: match => match.replace(/end\s+end\s+end\s+end```/, 'end\n    end\n    end\n```')
  },
  'docs/contracts/core/token-clean.md': {
    search: /```mermaid[\s\S]*?end\s+end\s+end```/g,
    replace: match => match.replace(/end\s+end\s+end```/, 'end\n    end\n```')
  },
  'docs/concepts/security.md': {
    search: /```mermaid[\s\S]*?end\s+end\s+end\s+end```/g,
    replace: match => match.replace(/end\s+end\s+end\s+end```/, 'end\n    end\n    end\n```')
  },
  'docs/concepts/randomness-fixed.md': {
    search: /```mermaid[\s\S]*?end\s+end\s+end\s+end```/g,
    replace: match => match.replace(/end\s+end\s+end\s+end```/, 'end\n    end\n    end\n```')
  },
  'docs/concepts/jackpot.md': {
    search: /```mermaid[\s\S]*?end\s+end\s+end\s+end\s+end```/g,
    replace: match => match.replace(/end\s+end\s+end\s+end\s+end```/, 'end\n    end\n    end\n    end\n```')
  },
  'docs/concepts/jackpot-system-consolidated.md': {
    search: /```mermaid[\s\S]*?end\s+end\s+end\s+end\s+end```/g,
    replace: match => match.replace(/end\s+end\s+end\s+end\s+end```/, 'end\n    end\n    end\n    end\n```')
  }
};

let directFixesApplied = 0;

// Apply specific fixes
Object.entries(specificFixes).forEach(([file, fix]) => {
  const filePath = path.join(process.cwd(), file);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ File not found: ${file}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Apply the fix
    content = content.replace(fix.search, fix.replace);
    
    // Write changes if needed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      directFixesApplied++;
      
      console.log(`✅ Applied direct fix to ${file}`);
    } else {
      console.log(`⚠️ No direct changes made to ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error applying direct fix to ${file}: ${error.message}`);
  }
});

console.log(`\n📊 Direct fixes applied: ${directFixesApplied}`);

// Final approach: manual fixes for each file
console.log('\n🔧 Applying manual fixes to problematic files...');

const manualFixes = {
  'docs/contracts/jackpot/triggers.md': content => {
    return content.replace(/```mermaid[\s\S]*?```/g, match => {
      if (match.includes('TriggerCore')) {
        return match.replace(/(\s+end){4}```/, '\n    end\n    end\n    end\n```');
      }
      return match;
    });
  },
  'docs/contracts/core/token-clean.md': content => {
    return content.replace(/```mermaid[\s\S]*?```/g, (match, index) => {
      if (index > 0 && index < 1000) { // Target the second mermaid block
        return match.replace(/(\s+end){3}```/, '\n    end\n    end\n```');
      }
      return match;
    });
  },
  'docs/concepts/security.md': content => {
    return content.replace(/```mermaid[\s\S]*?```/g, match => {
      if (match.includes('SecurityModel')) {
        return match.replace(/(\s+end){4}```/, '\n    end\n    end\n    end\n```');
      }
      return match;
    });
  },
  'docs/concepts/randomness-fixed.md': content => {
    return content.replace(/```mermaid[\s\S]*?```/g, match => {
      if (match.includes('RandomnessSystem')) {
        return match.replace(/(\s+end){4}```/, '\n    end\n    end\n    end\n```');
      }
      return match;
    });
  },
  'docs/concepts/jackpot.md': content => {
    return content.replace(/```mermaid[\s\S]*?```/g, match => {
      if (match.includes('JackpotSystem')) {
        return match.replace(/(\s+end){5}```/, '\n    end\n    end\n    end\n    end\n```');
      }
      return match;
    });
  },
  'docs/concepts/jackpot-system-consolidated.md': content => {
    return content.replace(/```mermaid[\s\S]*?```/g, match => {
      if (match.includes('JackpotSystem')) {
        return match.replace(/(\s+end){5}```/, '\n    end\n    end\n    end\n    end\n```');
      }
      return match;
    });
  }
};

let manualFixesApplied = 0;

// Apply manual fixes
Object.entries(manualFixes).forEach(([file, fixFn]) => {
  const filePath = path.join(process.cwd(), file);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ File not found: ${file}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Apply the fix
    content = fixFn(content);
    
    // Write changes if needed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      manualFixesApplied++;
      
      console.log(`✅ Applied manual fix to ${file}`);
    } else {
      console.log(`⚠️ No manual changes made to ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error applying manual fix to ${file}: ${error.message}`);
  }
});

console.log(`\n📊 Manual fixes applied: ${manualFixesApplied}`);

// Final approach: hardcoded replacements
console.log('\n🔧 Applying hardcoded replacements...');

const hardcodedFixes = [
  {
    file: 'docs/contracts/jackpot/triggers.md',
    search: `    end
    end
    end
    end\`\`\``,
    replace: `    end
    end
    end
\`\`\``
  },
  {
    file: 'docs/contracts/core/token-clean.md',
    search: `    end
    end
    end\`\`\``,
    replace: `    end
    end
\`\`\``
  },
  {
    file: 'docs/concepts/security.md',
    search: `    end
    end
    end
    end\`\`\``,
    replace: `    end
    end
    end
\`\`\``
  },
  {
    file: 'docs/concepts/randomness-fixed.md',
    search: `    end
    end
    end
    end\`\`\``,
    replace: `    end
    end
    end
\`\`\``
  },
  {
    file: 'docs/concepts/jackpot.md',
    search: `    end
    end
    end
    end
    end\`\`\``,
    replace: `    end
    end
    end
    end
\`\`\``
  },
  {
    file: 'docs/concepts/jackpot-system-consolidated.md',
    search: `    end
    end
    end
    end
    end\`\`\``,
    replace: `    end
    end
    end
    end
\`\`\``
  }
];

let hardcodedFixesApplied = 0;

// Apply hardcoded fixes
hardcodedFixes.forEach(fix => {
  const filePath = path.join(process.cwd(), fix.file);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ File not found: ${fix.file}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Apply the fix
    content = content.replace(fix.search, fix.replace);
    
    // Write changes if needed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      hardcodedFixesApplied++;
      
      console.log(`✅ Applied hardcoded fix to ${fix.file}`);
    } else {
      console.log(`⚠️ No hardcoded changes made to ${fix.file}`);
    }
  } catch (error) {
    console.error(`❌ Error applying hardcoded fix to ${fix.file}: ${error.message}`);
  }
});

console.log(`\n📊 Hardcoded fixes applied: ${hardcodedFixesApplied}`);
