// ExecutionEnvironment is not needed in Node.js scripts
// const ExecutionEnvironment = require('@docusaurus/ExecutionEnvironment');

// Node.js script - no browser environment check needed
/**
 * Documentation Review Helper Script
 * 
 * This script helps with the final review process by:
 * 1. Checking for broken internal links
 * 2. Ensuring consistent terminology
 * 3. Validating front matter in all documentation files
 * 4. Generating a review checklist
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

// Key terminology that should be used consistently
const terminology = {
  'OmniDragon': ['Omni Dragon', 'Omni-Dragon', 'omnidragon', 'omni-dragon'],
  'DRAGON': ['Dragon', 'dragon'],
  'jackpot': ['lottery', 'lotto', 'prize pool'],
  'cross-chain': ['crosschain', 'cross chain'],
  've69LP': ['ve69lp', 'VE69LP', 'veLP', 'velp'],
  'LayerZero': ['Layer Zero', 'layer zero', 'layerzero', 'layer-zero'],
  'BNB Chain': ['BSC', 'Binance Smart Chain', 'bnb chain'],
  'randomness': ['random number', 'RNG']
};

// Required front matter fields
const requiredFrontMatter = ['sidebar_position', 'title', 'description'];

// Stats for reporting
const stats = {
  filesChecked: 0,
  brokenLinks: [],
  terminologyIssues: [],
  frontMatterIssues: [],
  errors: []
};

/**
 * Check for broken internal links
 */
function checkBrokenLinks() {
  console.log('=== Checking for Broken Internal Links ===');
  
  // Get all markdown files
  const files = glob.sync('docs/**/*.{md,mdx}');
  const existingFiles = new Set(files.map(file => file.replace(/^docs\//, '')));
  
  // Add common file extensions that might be linked
  existingFiles.add('index.md');
  existingFiles.add('README.md');
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const relativeDir = path.dirname(file).replace(/^docs\//, '');
      
      // Find all markdown links
      const linkRegex = /\[.*?\]\((.*?\.md(?:#[^\)]*)?)\)/g;
      let match;
      
      while ((match = linkRegex.exec(content)) !== null) {
        const link = match[1];
        
        // Skip external links
        if (link.startsWith('http')) continue;
        
        // Resolve relative links
        let resolvedLink = link;
        if (link.startsWith('./')) {
          resolvedLink = path.join(relativeDir, link.substring(2));
        } else if (link.startsWith('../')) {
          resolvedLink = path.normalize(path.join(relativeDir, link));
        }
        
        // Remove hash fragment
        const linkWithoutHash = resolvedLink.split('#')[0];
        
        // Check if the file exists
        if (!existingFiles.has(linkWithoutHash)) {
          stats.brokenLinks.push({
            file,
            link,
            resolvedLink
          });
          console.log(`Broken link in ${file}: ${link} -> ${resolvedLink}`);
        }
      }
      
      stats.filesChecked++;
    } catch (error) {
      console.error(`Error checking links in ${file}:`, error.message);
      stats.errors.push(`Checking links in ${file}: ${error.message}`);
    }
  });
  
  console.log(`Found ${stats.brokenLinks.length} broken links\n`);
}

/**
 * Check for consistent terminology
 */
function checkTerminology() {
  console.log('=== Checking for Consistent Terminology ===');
  
  // Get all markdown files
  const files = glob.sync('docs/**/*.{md,mdx}');
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for inconsistent terminology
      Object.entries(terminology).forEach(([preferred, alternatives]) => {
        alternatives.forEach(alternative => {
          // Create regex that matches whole words only
          const regex = new RegExp(`\\b${alternative}\\b`, 'g');
          
          if (regex.test(content)) {
            stats.terminologyIssues.push({
              file,
              preferred,
              alternative
            });
            console.log(`Terminology issue in ${file}: "${alternative}" should be "${preferred}"`);
          }
        });
      });
      
      stats.filesChecked++;
    } catch (error) {
      console.error(`Error checking terminology in ${file}:`, error.message);
      stats.errors.push(`Checking terminology in ${file}: ${error.message}`);
    }
  });
  
  console.log(`Found ${stats.terminologyIssues.length} terminology issues\n`);
}

/**
 * Validate front matter in all documentation files
 */
function validateFrontMatter() {
  console.log('=== Validating Front Matter ===');
  
  // Get all markdown files
  const files = glob.sync('docs/**/*.{md,mdx}');
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Parse front matter
      const { data } = matter(content);
      
      // Check for required fields
      const missingFields = requiredFrontMatter.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        stats.frontMatterIssues.push({
          file,
          missingFields
        });
        console.log(`Front matter issue in ${file}: Missing fields: ${missingFields.join(', ')}`);
      }
      
      stats.filesChecked++;
    } catch (error) {
      console.error(`Error validating front matter in ${file}:`, error.message);
      stats.errors.push(`Validating front matter in ${file}: ${error.message}`);
    }
  });
  
  console.log(`Found ${stats.frontMatterIssues.length} front matter issues\n`);
}

/**
 * Generate a review checklist
 */
function generateChecklist() {
  console.log('=== Generating Review Checklist ===');
  
  const checklistFile = 'docs/REVIEW_CHECKLIST.md';
  const checklistContent = `# Documentation Review Checklist

Generated: ${new Date().toLocaleString()}

## Summary

- Files checked: ${stats.filesChecked}
- Broken links found: ${stats.brokenLinks.length}
- Terminology issues found: ${stats.terminologyIssues.length}
- Front matter issues found: ${stats.frontMatterIssues.length}
- Errors encountered: ${stats.errors.length}

## Broken Links

${stats.brokenLinks.length > 0 
  ? stats.brokenLinks.map(issue => `- In \`${issue.file}\`: Link \`${issue.link}\` resolves to non-existent file \`${issue.resolvedLink}\``).join('\n')
  : 'No broken links found.'}

## Terminology Issues

${stats.terminologyIssues.length > 0
  ? stats.terminologyIssues.map(issue => `- In \`${issue.file}\`: Replace "${issue.alternative}" with "${issue.preferred}"`).join('\n')
  : 'No terminology issues found.'}

## Front Matter Issues

${stats.frontMatterIssues.length > 0
  ? stats.frontMatterIssues.map(issue => `- In \`${issue.file}\`: Missing required fields: ${issue.missingFields.join(', ')}`).join('\n')
  : 'No front matter issues found.'}

## Errors

${stats.errors.length > 0
  ? stats.errors.map(error => `- ${error}`).join('\n')
  : 'No errors encountered.'}

## Manual Review Tasks

Please review the following aspects of the documentation:

### Content Review

- [ ] Verify technical accuracy of all content
- [ ] Ensure all code examples are correct and follow best practices
- [ ] Check that all diagrams accurately represent the described systems
- [ ] Verify that all mathematical formulas and calculations are correct
- [ ] Ensure all security-related information is accurate and complete

### Style Review

- [ ] Check for consistent writing style across all documents
- [ ] Ensure appropriate tone for the target audience
- [ ] Verify consistent formatting of headings, lists, and code blocks
- [ ] Check for proper use of bold, italic, and code formatting
- [ ] Ensure consistent capitalization of technical terms

### Structure Review

- [ ] Verify logical flow of information within each document
- [ ] Ensure appropriate progression from basic to advanced concepts
- [ ] Check that related topics are properly cross-referenced
- [ ] Verify that the sidebar organization makes sense
- [ ] Ensure that document titles and headings are descriptive and accurate

### Usability Review

- [ ] Check that navigation between documents is intuitive
- [ ] Ensure that important information is easy to find
- [ ] Verify that complex concepts are explained clearly
- [ ] Check that examples are provided for difficult concepts
- [ ] Ensure that the documentation is accessible to the target audience

### Final Checks

- [ ] Run a spell check on all documents
- [ ] Verify that all images have appropriate alt text
- [ ] Ensure consistent use of terminology throughout
- [ ] Check that all links work correctly
- [ ] Verify that the documentation builds without errors
`;
  
  fs.writeFileSync(checklistFile, checklistContent, 'utf8');
  console.log(`Checklist generated: ${checklistFile}\n`);
}

/**
 * Main function
 */
function main() {
  console.log('=== Documentation Review Helper ===\n');
  
  // Run the checks
  checkBrokenLinks();
  checkTerminology();
  validateFrontMatter();
  generateChecklist();
  
  console.log('=== Process Complete ===');
  console.log(`Files checked: ${stats.filesChecked}`);
  console.log(`Broken links found: ${stats.brokenLinks.length}`);
  console.log(`Terminology issues found: ${stats.terminologyIssues.length}`);
  console.log(`Front matter issues found: ${stats.frontMatterIssues.length}`);
  console.log(`Errors encountered: ${stats.errors.length}`);
  console.log('\nSee docs/REVIEW_CHECKLIST.md for details');
}

// Run the script
main();

// No need for browser environment check in Node.js scripts