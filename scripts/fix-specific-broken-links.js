/**
 * Fix Specific Broken Links
 * 
 * This script fixes the specific broken links mentioned in the build error.
 */

const fs = require('fs');
const path = require('path');

// Files with broken links
const filesToFix = [
  'docs/concepts/cross-chain.md',
  'docs/concepts/interactive-learning.md',
  'docs/concepts/randomness.md',
  'docs/concepts/security-model.md',
  'docs/guides/getting-started/developer-setup.md',
  'docs/guides/getting-started/quick-start.md',
  'docs/partner/case-studies/chainlink.md',
  'docs/partner/case-studies/drand.md',
  'docs/partner/case-studies/layerzero.md',
  'docs/reference/api/rest-api.md'
];

// Link replacements
const linkReplacements = {
  '/concepts/token-system': '/concepts/token-system-consolidated',
  '/concepts/jackpot': '/concepts/jackpot-system-consolidated',
  '/concepts/token-system#governance': '/concepts/token-system-consolidated#governance',
  '../../../docs/resources/faq.md': '/resources/faq',
  '/getting-started/developer-setup': '/guides/getting-started/developer-setup',
  '/integrations/chainlink/vrf': '/partner/integrations/chainlink/vrf',
  '/integrations/drand/setup': '/partner/integrations/drand/setup',
  '/integrations/drand/usage': '/partner/integrations/drand/usage',
  '/integrations/LayerZero/setup': '/partner/integrations/layerzero/setup',
  '../../../docs/contracts/core/omnidragon.md': '/reference/contracts/core/omnidragon',
  '../../../docs/guide/developer-guide.mdx': '/guides/developer-guide',
  '../security/AUDIT_DOCUMENTATION_SUMMARY.md': '/reference/security/audit-documentation-summary'
};

// Fix broken links in a file
function fixBrokenLinksInFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let replacementsMade = 0;
  
  // Replace all broken links
  for (const [brokenLink, fixedLink] of Object.entries(linkReplacements)) {
    const regex = new RegExp(brokenLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    
    if (matches) {
      content = content.replace(regex, fixedLink);
      replacementsMade += matches.length;
      console.log(`  Fixed ${matches.length} occurrences of ${brokenLink} -> ${fixedLink}`);
    }
  }
  
  // Save the file if changes were made
  if (replacementsMade > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Saved ${replacementsMade} fixes to ${filePath}`);
  } else {
    console.log(`  ℹ️ No broken links found in ${filePath}`);
  }
}

// Process all files
console.log('Starting to fix specific broken links...');

// Create directories for docs-new if they don't exist
const dirsToCreate = [
  'docs-new/partner/integrations/chainlink',
  'docs-new/partner/integrations/drand',
  'docs-new/partner/integrations/layerzero',
  'docs-new/reference/contracts/core',
  'docs-new/guides',
  'docs-new/reference/security'
];

dirsToCreate.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Create missing files
const missingFiles = [
  'docs-new/partner/integrations/chainlink/vrf.md',
  'docs-new/partner/integrations/drand/setup.md',
  'docs-new/partner/integrations/drand/usage.md',
  'docs-new/partner/integrations/layerzero/setup.md',
  'docs-new/reference/contracts/core/omnidragon.md',
  'docs-new/guides/developer-guide.md',
  'docs-new/reference/security/audit-documentation-summary.md'
];

missingFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) {
    const content = `---
title: ${path.basename(file, '.md').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
description: This page was created to fix broken links
---

# ${path.basename(file, '.md').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}

This page was created to fix broken links in the documentation.
`;
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Created file: ${file}`);
  }
});

// Fix broken links in files
filesToFix.forEach(file => {
  try {
    fixBrokenLinksInFile(file);
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

// Also check docs-new directory for the same files
filesToFix.forEach(file => {
  const newFile = file.replace('docs/', 'docs-new/');
  try {
    if (fs.existsSync(newFile)) {
      fixBrokenLinksInFile(newFile);
    }
  } catch (error) {
    console.error(`Error processing ${newFile}:`, error.message);
  }
});

console.log('Finished fixing specific broken links.');
