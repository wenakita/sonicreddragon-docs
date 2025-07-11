/**
 * Fix Remaining Documentation Issues Script
 * 
 * This script addresses the remaining issues identified during the build process:
 * 1. Fixes broken links to governance.md
 * 2. Creates necessary directories for images
 * 3. Creates placeholder images for missing images
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Stats for reporting
const stats = {
  filesProcessed: 0,
  governanceLinksFixed: 0,
  directoriesCreated: 0,
  placeholderImagesCreated: 0,
  errors: []
};

/**
 * Fix governance links in a file
 */
function fixGovernanceLinks(filePath, content) {
  let updatedContent = content;
  let fixCount = 0;
  
  // Replace references to governance.md with token-system.md#governance
  const governanceRegex = /\[([^\]]+)\]\(\.\/governance\.md([^)]*)\)/g;
  updatedContent = updatedContent.replace(governanceRegex, (match, linkText, hash) => {
    fixCount++;
    return `[${linkText}](./token-system.md#governance${hash})`;
  });
  
  stats.governanceLinksFixed += fixCount;
  return updatedContent;
}

/**
 * Fix intro.md links
 */
function fixIntroLinks(content) {
  let updatedContent = content;
  
  // Fix links in intro.md
  updatedContent = updatedContent.replace(
    /\[([^\]]+)\]\(\.\.\/concepts\/([^)]+)\)/g,
    (match, linkText, target) => `[${linkText}](./concepts/${target})`
  );
  
  updatedContent = updatedContent.replace(
    /\[([^\]]+)\]\(\.\.\/guide\/([^)]+)\)/g,
    (match, linkText, target) => `[${linkText}](./guide/${target})`
  );
  
  return updatedContent;
}

/**
 * Create necessary directories for images
 */
function createImageDirectories() {
  const directories = [
    'docs/assets',
    'static/img/docs'
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
        stats.directoriesCreated++;
      } catch (error) {
        console.error(`Error creating directory ${dir}:`, error.message);
        stats.errors.push(`Creating directory ${dir}: ${error.message}`);
      }
    }
  });
}

/**
 * Create placeholder images for missing images
 */
function createPlaceholderImages() {
  const placeholderImages = [
    'docs/assets/wallet-connection.png',
    'docs/assets/token-purchase.png',
    'docs/assets/cross-chain-transfer.png',
    'docs/assets/jackpot-entry.png',
    'docs/assets/governance-voting.png'
  ];
  
  // Simple SVG placeholder image
  const placeholderSvg = `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="400" fill="#f0f0f0"/>
  <text x="400" y="200" font-family="Arial" font-size="24" text-anchor="middle">Placeholder Image</text>
  <text x="400" y="240" font-family="Arial" font-size="18" text-anchor="middle">(Will be replaced with actual screenshot)</text>
</svg>`;
  
  // Convert SVG to PNG using a simple approach (create an empty file)
  placeholderImages.forEach(imagePath => {
    try {
      // Create directory if it doesn't exist
      const imageDir = path.dirname(imagePath);
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }
      
      // Create a placeholder file
      fs.writeFileSync(imagePath, placeholderSvg);
      console.log(`Created placeholder image: ${imagePath}`);
      stats.placeholderImagesCreated++;
    } catch (error) {
      console.error(`Error creating placeholder image ${imagePath}:`, error.message);
      stats.errors.push(`Creating placeholder image ${imagePath}: ${error.message}`);
    }
  });
  
  // Also copy the placeholder images to static/img/docs for use in MDX files
  placeholderImages.forEach(imagePath => {
    try {
      const fileName = path.basename(imagePath);
      const staticPath = `static/img/docs/${fileName}`;
      
      fs.copyFileSync(imagePath, staticPath);
      console.log(`Copied placeholder image to: ${staticPath}`);
    } catch (error) {
      console.error(`Error copying placeholder image to static directory:`, error.message);
      stats.errors.push(`Copying placeholder image to static directory: ${error.message}`);
    }
  });
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let modified = false;
    
    // Fix governance links
    if (filePath.includes('/concepts/')) {
      const contentWithFixedGovernanceLinks = fixGovernanceLinks(filePath, updatedContent);
      if (contentWithFixedGovernanceLinks !== updatedContent) {
        updatedContent = contentWithFixedGovernanceLinks;
        modified = true;
      }
    }
    
    // Fix intro.md links
    if (filePath.endsWith('/intro.md')) {
      const contentWithFixedIntroLinks = fixIntroLinks(updatedContent);
      if (contentWithFixedIntroLinks !== updatedContent) {
        updatedContent = contentWithFixedIntroLinks;
        modified = true;
      }
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
 * Fix user guide image references
 */
function fixUserGuideImageReferences() {
  const userGuideFiles = [
    'docs/guide/user-guide.mdx',
    'docs/guide/user-guide-consolidated.md'
  ];
  
  userGuideFiles.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace image references with static path
        content = content.replace(
          /!\[([^\]]*)\]\(\.\.\/assets\/([^)]+)\)/g,
          (match, altText, imageName) => `![${altText}](/img/docs/${imageName})`
        );
        
        // Also fix any direct references to docs/assets
        content = content.replace(
          /!\[([^\]]*)\]\(docs\/assets\/([^)]+)\)/g,
          (match, altText, imageName) => `![${altText}](/img/docs/${imageName})`
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed image references in: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error fixing image references in ${filePath}:`, error.message);
      stats.errors.push(`Fixing image references in ${filePath}: ${error.message}`);
    }
  });
}

/**
 * Generate a report of changes made
 */
function generateReport() {
  console.log('=== Generating Report ===');
  
  const reportFile = 'docs/FINAL_FIX_REPORT.md';
  const reportContent = `# Final Documentation Fix Report

Generated: ${new Date().toLocaleString()}

## Summary

- Files processed: ${stats.filesProcessed}
- Governance links fixed: ${stats.governanceLinksFixed}
- Directories created: ${stats.directoriesCreated}
- Placeholder images created: ${stats.placeholderImagesCreated}
- Errors encountered: ${stats.errors.length}

## Fixes Applied

1. Fixed broken links to governance.md by redirecting to token-system.md#governance
2. Fixed relative links in intro.md
3. Created necessary directories for images
4. Created placeholder images for missing images
5. Fixed image references in user guide files

## Errors

${stats.errors.length > 0 ? stats.errors.map(error => `- ${error}`).join('\n') : 'No errors encountered.'}

## Next Steps

1. Replace placeholder images with actual screenshots
2. Run a final build to verify that all issues have been resolved
3. Conduct a final review of the documentation
`;
  
  fs.writeFileSync(reportFile, reportContent, 'utf8');
  console.log(`Report generated: ${reportFile}\n`);
}

/**
 * Main function
 */
function main() {
  console.log('=== Fixing Remaining Documentation Issues ===\n');
  
  // Create necessary directories for images
  createImageDirectories();
  
  // Create placeholder images for missing images
  createPlaceholderImages();
  
  // Fix user guide image references
  fixUserGuideImageReferences();
  
  // Get all markdown files
  const files = glob.sync('docs/**/*.{md,mdx}');
  
  // Process each file
  files.forEach(processFile);
  
  // Generate report
  generateReport();
  
  console.log('=== Process Complete ===');
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Governance links fixed: ${stats.governanceLinksFixed}`);
  console.log(`Directories created: ${stats.directoriesCreated}`);
  console.log(`Placeholder images created: ${stats.placeholderImagesCreated}`);
  console.log(`Errors encountered: ${stats.errors.length}`);
  console.log('\nSee docs/FINAL_FIX_REPORT.md for details');
}

// Run the script
main();
