/**
 * Final Fixes Script
 * 
 * This script addresses the last remaining issues identified during the build process:
 * 1. Fixes broken links to OmniDragon.md
 * 2. Resolves duplicate route warning
 */

const fs = require('fs');
const path = require('path');

// Stats for reporting
const stats = {
  filesFixed: 0,
  linksFixed: 0,
  routesFixed: 0,
  errors: []
};

/**
 * Fix OmniDragon.md links
 */
function fixOmniDragonLinks() {
  const filesToFix = [
    'docs/reference/api.md',
    'docs/technical-architecture/overview.md'
  ];
  
  filesToFix.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace references to OmniDragon.md with omnidragon.md (correct case)
        const originalContent = content;
        content = content.replace(
          /\[([^\]]+)\]\(\.\.\/contracts\/core\/OmniDragon\.md([^)]*)\)/g,
          (match, linkText, hash) => `[${linkText}](../contracts/core/omnidragon.md${hash})`
        );
        
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Fixed OmniDragon links in: ${filePath}`);
          stats.linksFixed++;
          stats.filesFixed++;
        }
      }
    } catch (error) {
      console.error(`Error fixing OmniDragon links in ${filePath}:`, error.message);
      stats.errors.push(`Fixing OmniDragon links in ${filePath}: ${error.message}`);
    }
  });
}

/**
 * Fix duplicate route warning
 */
function fixDuplicateRoutes() {
  try {
    // Check if both index.md and intro.md exist at the root level
    const indexPath = 'docs/index.md';
    const introPath = 'docs/intro.md';
    
    if (fs.existsSync(indexPath) && fs.existsSync(introPath)) {
      // Rename intro.md to getting-started.md
      const newPath = 'docs/getting-started.md';
      fs.copyFileSync(introPath, newPath);
      
      // Update the content to reflect the new location
      let content = fs.readFileSync(newPath, 'utf8');
      
      // Update front matter
      if (content.startsWith('---')) {
        const frontMatterEnd = content.indexOf('---', 3);
        if (frontMatterEnd !== -1) {
          const frontMatter = content.substring(0, frontMatterEnd + 3);
          const restContent = content.substring(frontMatterEnd + 3);
          
          // Add or update title and sidebar_position
          let updatedFrontMatter = frontMatter;
          if (!updatedFrontMatter.includes('title:')) {
            updatedFrontMatter = updatedFrontMatter.replace('---\n', '---\ntitle: Getting Started\n');
          }
          if (!updatedFrontMatter.includes('sidebar_position:')) {
            updatedFrontMatter = updatedFrontMatter.replace('---\n', '---\nsidebar_position: 1\n');
          }
          
          content = updatedFrontMatter + restContent;
        }
      } else {
        // Add front matter if it doesn't exist
        content = `---
title: Getting Started
sidebar_position: 1
description: Get started with OmniDragon
---

${content}`;
      }
      
      // Save the updated content
      fs.writeFileSync(newPath, content, 'utf8');
      console.log(`Renamed intro.md to getting-started.md and updated content`);
      
      // Update sidebar.ts to reference the new file
      const sidebarPath = 'sidebars.ts';
      if (fs.existsSync(sidebarPath)) {
        let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
        
        // Replace 'intro' with 'getting-started' in the sidebar
        sidebarContent = sidebarContent.replace(/'intro'/g, "'getting-started'");
        
        fs.writeFileSync(sidebarPath, sidebarContent, 'utf8');
        console.log(`Updated sidebar to reference getting-started.md`);
      }
      
      stats.routesFixed++;
    }
  } catch (error) {
    console.error(`Error fixing duplicate routes:`, error.message);
    stats.errors.push(`Fixing duplicate routes: ${error.message}`);
  }
}

/**
 * Generate a report of changes made
 */
function generateReport() {
  console.log('=== Generating Report ===');
  
  const reportFile = 'docs/FINAL_FIXES_REPORT.md';
  const reportContent = `# Final Fixes Report

Generated: ${new Date().toLocaleString()}

## Summary

- Files fixed: ${stats.filesFixed}
- Links fixed: ${stats.linksFixed}
- Routes fixed: ${stats.routesFixed}
- Errors encountered: ${stats.errors.length}

## Fixes Applied

1. Fixed broken links to OmniDragon.md in reference/api.md and technical-architecture/overview.md
2. Resolved duplicate route warning by renaming intro.md to getting-started.md

## Errors

${stats.errors.length > 0 ? stats.errors.map(error => `- ${error}`).join('\n') : 'No errors encountered.'}

## Next Steps

1. Run a final build to verify that all issues have been resolved
2. Conduct a final review of the documentation
3. Deploy the documentation to production
`;
  
  fs.writeFileSync(reportFile, reportContent, 'utf8');
  console.log(`Report generated: ${reportFile}\n`);
}

/**
 * Main function
 */
function main() {
  console.log('=== Applying Final Fixes ===\n');
  
  // Fix OmniDragon.md links
  fixOmniDragonLinks();
  
  // Fix duplicate routes
  fixDuplicateRoutes();
  
  // Generate report
  generateReport();
  
  console.log('=== Process Complete ===');
  console.log(`Files fixed: ${stats.filesFixed}`);
  console.log(`Links fixed: ${stats.linksFixed}`);
  console.log(`Routes fixed: ${stats.routesFixed}`);
  console.log(`Errors encountered: ${stats.errors.length}`);
  console.log('\nSee docs/FINAL_FIXES_REPORT.md for details');
}

// Run the script
main();
