/**
 * Fix All Markdown Links Script
 * 
 * This script fixes all broken markdown links in the documentation.
 * It handles various link formats and ensures they resolve correctly.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Starting to fix all markdown links...');

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
  let changes = false;
  
  // Fix links with excessive dots (......../path)
  const excessiveDotsRegex = /(\.\.\.\.\.\.\.\.)\/([^)\s]+)/g;
  if (content.match(excessiveDotsRegex)) {
    content = content.replace(excessiveDotsRegex, (match, dots, linkPath) => {
      console.log(`  Fixed excessive dots link: ${match} -> /${linkPath}`);
      fixedLinksCount++;
      changes = true;
      return `/${linkPath}`;
    });
  }
  
  // Fix links with single dot (.path)
  const singleDotRegex = /\(\.([^.\/][^)\s]+)\)/g;
  if (content.match(singleDotRegex)) {
    content = content.replace(singleDotRegex, (match, linkPath) => {
      console.log(`  Fixed single dot link: ${match} -> (/${linkPath})`);
      fixedLinksCount++;
      changes = true;
      return `(/${linkPath})`;
    });
  }
  
  // Fix relative links to guide/developer-guide.mdx
  if (content.includes('./guide/developer-guide.mdx') || content.includes('../guide/developer-guide.mdx')) {
    content = content.replace(/\.\.?\/guide\/developer-guide\.mdx/g, '/guide/developer-guide.mdx');
    console.log(`  Fixed link: ./guide/developer-guide.mdx -> /guide/developer-guide.mdx`);
    fixedLinksCount++;
    changes = true;
  }
  
  // Fix relative links to guide/user-guide.mdx
  if (content.includes('./guide/user-guide.mdx') || content.includes('../guide/user-guide.mdx')) {
    content = content.replace(/\.\.?\/guide\/user-guide\.mdx/g, '/guide/user-guide.mdx');
    console.log(`  Fixed link: ./guide/user-guide.mdx -> /guide/user-guide.mdx`);
    fixedLinksCount++;
    changes = true;
  }
  
  // Fix relative links to concepts/architecture.md
  if (content.includes('./concepts/architecture.md') || content.includes('../concepts/architecture.md')) {
    content = content.replace(/\.\.?\/concepts\/architecture\.md/g, '/concepts/architecture.md');
    console.log(`  Fixed link: ./concepts/architecture.md -> /concepts/architecture.md`);
    fixedLinksCount++;
    changes = true;
  }
  
  // Fix relative links to concepts/fee-system.md
  if (content.includes('./concepts/fee-system.md') || content.includes('../concepts/fee-system.md')) {
    content = content.replace(/\.\.?\/concepts\/fee-system\.md/g, '/concepts/fee-system.md');
    console.log(`  Fixed link: ./concepts/fee-system.md -> /concepts/fee-system.md`);
    fixedLinksCount++;
    changes = true;
  }
  
  // Fix relative links to concepts/jackpot.md
  if (content.includes('./concepts/jackpot.md') || content.includes('../concepts/jackpot.md')) {
    content = content.replace(/\.\.?\/concepts\/jackpot\.md/g, '/concepts/jackpot.md');
    console.log(`  Fixed link: ./concepts/jackpot.md -> /concepts/jackpot.md`);
    fixedLinksCount++;
    changes = true;
  }
  
  // Fix relative links to concepts/cross-chain.md
  if (content.includes('./concepts/cross-chain.md') || content.includes('../concepts/cross-chain.md')) {
    content = content.replace(/\.\.?\/concepts\/cross-chain\.md/g, '/concepts/cross-chain.md');
    console.log(`  Fixed link: ./concepts/cross-chain.md -> /concepts/cross-chain.md`);
    fixedLinksCount++;
    changes = true;
  }
  
  // Fix relative links to contracts/core/omnidragon.md
  if (content.includes('./contracts/core/omnidragon.md') || content.includes('../contracts/core/omnidragon.md')) {
    content = content.replace(/\.\.?\/contracts\/core\/omnidragon\.md/g, '/contracts/core/omnidragon.md');
    console.log(`  Fixed link: ./contracts/core/omnidragon.md -> /contracts/core/omnidragon.md`);
    fixedLinksCount++;
    changes = true;
  }
  
  // Fix relative links to guide/elegant-diagrams.mdx
  if (content.includes('./guide/elegant-diagrams.mdx') || content.includes('../guide/elegant-diagrams.mdx')) {
    content = content.replace(/\.\.?\/guide\/elegant-diagrams\.mdx/g, '/guide/elegant-diagrams.mdx');
    console.log(`  Fixed link: ./guide/elegant-diagrams.mdx -> /guide/elegant-diagrams.mdx`);
    fixedLinksCount++;
    changes = true;
  }
  
  // Fix relative links to guide/animated-content.mdx
  if (content.includes('./guide/animated-content.mdx') || content.includes('../guide/animated-content.mdx')) {
    content = content.replace(/\.\.?\/guide\/animated-content\.mdx/g, '/guide/animated-content.mdx');
    console.log(`  Fixed link: ./guide/animated-content.mdx -> /guide/animated-content.mdx`);
    fixedLinksCount++;
    changes = true;
  }
  
  // Fix image links
  if (content.includes('static/img/docs/')) {
    content = content.replace(/static\/img\/docs\//g, '/img/docs/');
    console.log(`  Fixed image links: static/img/docs/ -> /img/docs/`);
    fixedLinksCount++;
    changes = true;
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
      changes = true;
    }
  }
  
  // Fix all remaining relative links with a more general approach
  const relativeLinksRegex = /\[(.*?)\]\((\.\.?\/[^)]+)\)/g;
  let relativeMatch;
  while ((relativeMatch = relativeLinksRegex.exec(originalContent)) !== null) {
    const linkText = relativeMatch[1];
    const linkPath = relativeMatch[2];
    const absolutePath = `/${linkPath.replace(/^\.\.?\//g, '')}`;
    content = content.replace(`[${linkText}](${linkPath})`, `[${linkText}](${absolutePath})`);
    console.log(`  Fixed relative link: ${linkPath} -> ${absolutePath}`);
    fixedLinksCount++;
    changes = true;
  }
  
  // Write the file if changes were made
  if (changes) {
    fs.writeFileSync(filePath, content);
    console.log(`  Updated ${filePath}`);
  }
});

console.log(`Finished fixing markdown links. Fixed ${fixedLinksCount} links.`);
