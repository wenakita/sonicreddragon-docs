/**
 * Documentation Issues Fix Script
 * 
 * This script addresses the issues identified by the documentation-review-helper.js:
 * 1. Fixes broken links
 * 2. Corrects terminology issues
 * 3. Adds missing front matter
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

// Link mapping: broken link -> correct link
const linkMapping = {
  './concepts/governance.md': './concepts/token-system.md#governance',
  '../concepts/governance.md': '../concepts/token-system.md#governance',
  './technical-architecture/overview.md': './concepts/architecture.md',
  './contracts/overview.md': './concepts/architecture.md#smart-contracts',
  '../technical/contract-architecture.md': '../concepts/architecture.md#smart-contracts'
};

// Terminology mapping: incorrect term -> correct term
const terminologyMapping = {
  'Omni Dragon': 'OmniDragon',
  'Omni-Dragon': 'OmniDragon',
  'omnidragon': 'OmniDragon',
  'omni-dragon': 'OmniDragon',
  'Dragon': 'DRAGON',
  'dragon': 'DRAGON',
  'lottery': 'jackpot',
  'lotto': 'jackpot',
  'prize pool': 'jackpot',
  'crosschain': 'cross-chain',
  'cross chain': 'cross-chain',
  've69lp': 've69LP',
  'VE69LP': 've69LP',
  'veLP': 've69LP',
  'velp': 've69LP',
  'Layer Zero': 'LayerZero',
  'layer zero': 'LayerZero',
  'layerzero': 'LayerZero',
  'layer-zero': 'LayerZero',
  'BSC': 'BNB Chain',
  'Binance Smart Chain': 'BNB Chain',
  'bnb chain': 'BNB Chain',
  'random number': 'randomness',
  'RNG': 'randomness'
};

// Default front matter templates
const defaultFrontMatter = {
  concepts: {
    sidebar_position: 1,
    title: 'Concept Title',
    description: 'Detailed explanation of this concept'
  },
  guide: {
    sidebar_position: 1,
    title: 'Guide Title',
    description: 'Step-by-step instructions for this task'
  },
  reference: {
    sidebar_position: 1,
    title: 'Reference Title',
    description: 'Technical reference information'
  },
  resources: {
    sidebar_position: 1,
    title: 'Resource Title',
    description: 'Helpful resource information'
  },
  updates: {
    sidebar_position: 1,
    title: 'Update Title',
    description: 'Information about this update'
  }
};

// Stats for reporting
const stats = {
  filesProcessed: 0,
  linksFixed: 0,
  terminologyFixed: 0,
  frontMatterFixed: 0,
  errors: []
};

/**
 * Fix broken links in a file
 */
function fixLinks(filePath, content) {
  let updatedContent = content;
  let fixCount = 0;
  
  // Fix known broken links
  Object.entries(linkMapping).forEach(([brokenLink, correctLink]) => {
    const regex = new RegExp(`\\[([^\\]]+)\\]\\(${brokenLink.replace(/\./g, '\\.')}([^\\)]*)\\)`, 'g');
    updatedContent = updatedContent.replace(regex, (match, linkText, hash) => {
      fixCount++;
      return `[${linkText}](${correctLink}${hash})`;
    });
  });
  
  // Fix relative links that might be broken
  if (filePath.includes('docs/')) {
    const relativeDir = path.dirname(filePath).replace(/^docs\//, '');
    
    // Fix links to concepts directory
    const conceptsRegex = /\[([^\]]+)\]\(\.\/concepts\/([^)]+)\)/g;
    updatedContent = updatedContent.replace(conceptsRegex, (match, linkText, target) => {
      if (!relativeDir.startsWith('concepts')) {
        fixCount++;
        return `[${linkText}](../concepts/${target})`;
      }
      return match;
    });
    
    // Fix links to guide directory
    const guideRegex = /\[([^\]]+)\]\(\.\/guide\/([^)]+)\)/g;
    updatedContent = updatedContent.replace(guideRegex, (match, linkText, target) => {
      if (!relativeDir.startsWith('guide')) {
        fixCount++;
        return `[${linkText}](../guide/${target})`;
      }
      return match;
    });
  }
  
  stats.linksFixed += fixCount;
  return updatedContent;
}

/**
 * Fix terminology issues in a file
 */
function fixTerminology(content) {
  let updatedContent = content;
  let fixCount = 0;
  
  Object.entries(terminologyMapping).forEach(([incorrect, correct]) => {
    // Create regex that matches whole words only
    const regex = new RegExp(`\\b${incorrect}\\b`, 'g');
    
    updatedContent = updatedContent.replace(regex, (match) => {
      fixCount++;
      // Preserve capitalization if the first letter is uppercase
      if (match[0] === match[0].toUpperCase()) {
        return correct[0].toUpperCase() + correct.slice(1);
      }
      return correct;
    });
  });
  
  stats.terminologyFixed += fixCount;
  return updatedContent;
}

/**
 * Fix missing front matter in a file
 */
function fixFrontMatter(filePath, content) {
  // Parse existing front matter
  const { data, content: contentWithoutFrontMatter } = matter(content);
  let fixCount = 0;
  
  // Determine which template to use based on file path
  let template = defaultFrontMatter.concepts; // Default
  
  if (filePath.includes('/concepts/')) {
    template = defaultFrontMatter.concepts;
  } else if (filePath.includes('/guide/')) {
    template = defaultFrontMatter.guide;
  } else if (filePath.includes('/reference/')) {
    template = defaultFrontMatter.reference;
  } else if (filePath.includes('/resources/')) {
    template = defaultFrontMatter.resources;
  } else if (filePath.includes('/updates/')) {
    template = defaultFrontMatter.updates;
  }
  
  // Generate title from filename if missing
  if (!data.title) {
    const fileName = path.basename(filePath, path.extname(filePath));
    const title = fileName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    data.title = title;
    fixCount++;
  }
  
  // Add missing sidebar_position if needed
  if (!data.sidebar_position) {
    data.sidebar_position = template.sidebar_position;
    fixCount++;
  }
  
  // Add missing description if needed
  if (!data.description) {
    data.description = template.description;
    fixCount++;
  }
  
  // Generate new front matter
  const newFrontMatter = matter.stringify(contentWithoutFrontMatter, data);
  
  stats.frontMatterFixed += fixCount;
  return newFrontMatter;
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let modified = false;
    
    // Fix links
    const contentWithFixedLinks = fixLinks(filePath, updatedContent);
    if (contentWithFixedLinks !== updatedContent) {
      updatedContent = contentWithFixedLinks;
      modified = true;
    }
    
    // Fix terminology
    const contentWithFixedTerminology = fixTerminology(updatedContent);
    if (contentWithFixedTerminology !== updatedContent) {
      updatedContent = contentWithFixedTerminology;
      modified = true;
    }
    
    // Fix front matter
    const contentWithFixedFrontMatter = fixFrontMatter(filePath, updatedContent);
    if (contentWithFixedFrontMatter !== updatedContent) {
      updatedContent = contentWithFixedFrontMatter;
      modified = true;
    }
    
    // Save updated content if modified
    if (modified) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
    
    stats.filesProcessed++;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    stats.errors.push(`Processing ${filePath}: ${error.message}`);
  }
}

/**
 * Generate a report of changes made
 */
function generateReport() {
  console.log('=== Generating Report ===');
  
  const reportFile = 'docs/DOCUMENTATION_FIX_REPORT.md';
  const reportContent = `# Documentation Fix Report

Generated: ${new Date().toLocaleString()}

## Summary

- Files processed: ${stats.filesProcessed}
- Links fixed: ${stats.linksFixed}
- Terminology issues fixed: ${stats.terminologyFixed}
- Front matter issues fixed: ${stats.frontMatterFixed}
- Errors encountered: ${stats.errors.length}

## Link Mapping

The following link mappings were applied:

${Object.entries(linkMapping).map(([brokenLink, correctLink]) => `- \`${brokenLink}\` -> \`${correctLink}\``).join('\n')}

## Terminology Mapping

The following terminology mappings were applied:

${Object.entries(terminologyMapping).map(([incorrect, correct]) => `- "${incorrect}" -> "${correct}"`).join('\n')}

## Errors

${stats.errors.length > 0 ? stats.errors.map(error => `- ${error}`).join('\n') : 'No errors encountered.'}

## Next Steps

1. Review the fixed files to ensure the changes are appropriate
2. Run the documentation-review-helper.js script again to verify that issues have been resolved
3. Conduct a final manual review of the documentation
`;
  
  fs.writeFileSync(reportFile, reportContent, 'utf8');
  console.log(`Report generated: ${reportFile}\n`);
}

/**
 * Main function
 */
function main() {
  console.log('=== Documentation Issues Fix ===\n');
  
  // Get all markdown files
  const files = glob.sync('docs/**/*.{md,mdx}');
  
  // Process each file
  files.forEach(processFile);
  
  // Generate report
  generateReport();
  
  console.log('=== Process Complete ===');
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Links fixed: ${stats.linksFixed}`);
  console.log(`Terminology issues fixed: ${stats.terminologyFixed}`);
  console.log(`Front matter issues fixed: ${stats.frontMatterFixed}`);
  console.log(`Errors encountered: ${stats.errors.length}`);
  console.log('\nSee docs/DOCUMENTATION_FIX_REPORT.md for details');
}

// Run the script
main();
