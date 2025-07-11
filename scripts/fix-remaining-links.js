/**
 * Fix Remaining Links Script
 * 
 * This script fixes remaining broken links in the documentation.
 * It focuses on fixing links in specific files that were identified as problematic.
 */

const fs = require('fs');
const path = require('path');

console.log('Starting to fix remaining broken links...');

// Define the files to check and fix
const filesToFix = [
  'docs/reference/api.md',
  'docs/technical-architecture/overview.md'
];

// Define link replacements
const linkReplacements = [
  // Fix links to developer guide
  { 
    pattern: /\.\/guide\/developer-guide\.mdx/g, 
    replacement: '../guide/developer-guide.mdx' 
  },
  { 
    pattern: /\.\.\/guide\/developer-guide\.mdx/g, 
    replacement: './guide/developer-guide.mdx',
    files: ['docs/reference/api.md', 'docs/technical-architecture/overview.md']
  },
  // Fix links to contracts
  { 
    pattern: /\.\/contracts\/core\/omnidragon\.md/g, 
    replacement: '../contracts/core/omnidragon.md' 
  },
  { 
    pattern: /\.\.\/contracts\/core\/omnidragon\.md/g, 
    replacement: './contracts/core/omnidragon.md',
    files: ['docs/reference/api.md', 'docs/technical-architecture/overview.md']
  },
  // Fix links to OmniDragon.md references
  { 
    pattern: /OmniDragon\.md/g, 
    replacement: 'omnidragon.md' 
  },
  // Fix links to concepts
  { 
    pattern: /\.\/concepts\/([\w-]+)\.md/g, 
    replacement: '../concepts/$1.md' 
  },
  // Fix links to guides
  { 
    pattern: /\.\/guides\/([\w-]+)/g, 
    replacement: '../guides/$1' 
  },
  // Fix links to ecosystem
  { 
    pattern: /\/docs\/ecosystem\/([\w-]+)/g, 
    replacement: '../ecosystem/$1' 
  },
  // Fix links to contracts
  { 
    pattern: /\/docs\/contracts\/([\w-]+)\/([\w-]+)/g, 
    replacement: '../contracts/$1/$2' 
  },
  // Fix links to integrations
  { 
    pattern: /\/integrations\/LayerZero/g, 
    replacement: '../integrations/layerzero' 
  },
  // Fix capitalization in links
  { 
    pattern: /DRAGON-math/g, 
    replacement: 'dragon-math' 
  },
  { 
    pattern: /OmniDragon/g, 
    replacement: 'omnidragon' 
  },
  { 
    pattern: /ve69LP/g, 
    replacement: 've69lp' 
  }
];

// Fix links in a file
function fixLinksInFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Apply each replacement
    linkReplacements.forEach(replacement => {
      // Skip if this replacement is for specific files and this file is not in the list
      if (replacement.files && !replacement.files.includes(filePath)) {
        return;
      }

      const originalContent = content;
      content = content.replace(replacement.pattern, replacement.replacement);
      
      if (content !== originalContent) {
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated links in ${filePath}`);
    } else {
      console.log(`No broken links found in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing links in ${filePath}:`, error);
  }
}

// Fix links in all specified files
filesToFix.forEach(fixLinksInFile);

console.log('Finished fixing remaining broken links.');
