#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing specific Mermaid syntax issues...\n');

// Define the fixes for each file
const fileFixes = {
  'docs/contracts/jackpot/triggers.md': {
    search: `    end
    end
    end
    end\`\`\``,
    replace: `    end
    end
    end
\`\`\``
  },
  'docs/contracts/core/token-clean.md': {
    search: `    end
    end
    end\`\`\``,
    replace: `    end
    end
\`\`\``
  },
  'docs/concepts/security.md': {
    search: `    end
    end
    end
    end\`\`\``,
    replace: `    end
    end
    end
\`\`\``
  },
  'docs/concepts/randomness-fixed.md': {
    search: `    end
    end
    end
    end\`\`\``,
    replace: `    end
    end
    end
\`\`\``
  },
  'docs/concepts/jackpot.md': {
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
  'docs/concepts/jackpot-system-consolidated.md': {
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
};

let totalFilesFixed = 0;

// Process each file
Object.entries(fileFixes).forEach(([file, fix]) => {
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
      totalFilesFixed++;
      
      console.log(`✅ Fixed ${file}`);
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

if (totalFilesFixed === 0) {
  console.log('\n⚠️ No files were fixed!');
} else {
  console.log(`\n✨ Fixed issues in ${totalFilesFixed} files!`);
}
