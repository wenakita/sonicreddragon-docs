/**
 * Fix Markdown Links Script
 * 
 * This script fixes broken markdown links in the documentation.
 * It scans all markdown files and fixes relative links.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Starting to fix markdown links...');

// Get all markdown files
const markdownFiles = glob.sync('docs/**/*.{md,mdx}');

// Counter for fixed links
let fixedLinksCount = 0;

// Process each file
markdownFiles.forEach(filePath => {
  console.log(`Processing ${filePath}...`);
  
  // Read the file content
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Fix relative links to guide/developer-guide.mdx
  if (content.includes('./guide/developer-guide.mdx')) {
    const relativePath = path.relative(path.dirname(filePath), 'docs/guide');
    const newPath = relativePath ? `${relativePath}/developer-guide.mdx` : './developer-guide.mdx';
    content = content.replace(/\.\/guide\/developer-guide\.mdx/g, newPath);
    console.log(`  Fixed link: ./guide/developer-guide.mdx -> ${newPath}`);
    fixedLinksCount++;
  }
  
  // Fix relative links to guide/user-guide.mdx
  if (content.includes('./guide/user-guide.mdx')) {
    const relativePath = path.relative(path.dirname(filePath), 'docs/guide');
    const newPath = relativePath ? `${relativePath}/user-guide.mdx` : './user-guide.mdx';
    content = content.replace(/\.\/guide\/user-guide\.mdx/g, newPath);
    console.log(`  Fixed link: ./guide/user-guide.mdx -> ${newPath}`);
    fixedLinksCount++;
  }
  
  // Fix relative links to concepts/architecture.md
  if (content.includes('./concepts/architecture.md')) {
    const relativePath = path.relative(path.dirname(filePath), 'docs/concepts');
    const newPath = relativePath ? `${relativePath}/architecture.md` : './architecture.md';
    content = content.replace(/\.\/concepts\/architecture\.md/g, newPath);
    console.log(`  Fixed link: ./concepts/architecture.md -> ${newPath}`);
    fixedLinksCount++;
  }
  
  // Fix relative links to concepts/fee-system.md
  if (content.includes('./concepts/fee-system.md')) {
    const relativePath = path.relative(path.dirname(filePath), 'docs/concepts');
    const newPath = relativePath ? `${relativePath}/fee-system.md` : './fee-system.md';
    content = content.replace(/\.\/concepts\/fee-system\.md/g, newPath);
    console.log(`  Fixed link: ./concepts/fee-system.md -> ${newPath}`);
    fixedLinksCount++;
  }
  
  // Fix relative links to concepts/jackpot.md
  if (content.includes('./concepts/jackpot.md')) {
    const relativePath = path.relative(path.dirname(filePath), 'docs/concepts');
    const newPath = relativePath ? `${relativePath}/jackpot.md` : './jackpot.md';
    content = content.replace(/\.\/concepts\/jackpot\.md/g, newPath);
    console.log(`  Fixed link: ./concepts/jackpot.md -> ${newPath}`);
    fixedLinksCount++;
  }
  
  // Fix relative links to concepts/cross-chain.md
  if (content.includes('./concepts/cross-chain.md')) {
    const relativePath = path.relative(path.dirname(filePath), 'docs/concepts');
    const newPath = relativePath ? `${relativePath}/cross-chain.md` : './cross-chain.md';
    content = content.replace(/\.\/concepts\/cross-chain\.md/g, newPath);
    console.log(`  Fixed link: ./concepts/cross-chain.md -> ${newPath}`);
    fixedLinksCount++;
  }
  
  // Fix relative links to contracts/core/omnidragon.md
  if (content.includes('./contracts/core/omnidragon.md')) {
    const relativePath = path.relative(path.dirname(filePath), 'docs/contracts/core');
    const newPath = relativePath ? `${relativePath}/omnidragon.md` : './omnidragon.md';
    content = content.replace(/\.\/contracts\/core\/omnidragon\.md/g, newPath);
    console.log(`  Fixed link: ./contracts/core/omnidragon.md -> ${newPath}`);
    fixedLinksCount++;
  }
  
  // Fix image links
  if (content.includes('static/img/docs/')) {
    content = content.replace(/static\/img\/docs\//g, '/img/docs/');
    console.log(`  Fixed image links: static/img/docs/ -> /img/docs/`);
    fixedLinksCount++;
  }
  
  // Fix links to missing images
  if (content.includes('![') && content.includes('static/img/')) {
    // Extract image paths
    const imgRegex = /!\[.*?\]\((static\/img\/.*?)\)/g;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      const imgPath = match[1];
      const newImgPath = `/${imgPath}`;
      content = content.replace(imgPath, newImgPath);
      console.log(`  Fixed image link: ${imgPath} -> ${newImgPath}`);
      fixedLinksCount++;
    }
  }
  
  // Write the file if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`  Updated ${filePath}`);
  }
});

console.log(`Finished fixing markdown links. Fixed ${fixedLinksCount} links.`);
