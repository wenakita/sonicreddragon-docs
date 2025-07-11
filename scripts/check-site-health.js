#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🏥 Checking OmniDragon Docs Site Health...\n');

// Check for common issues
function checkSiteHealth() {
  const issues = [];
  const checks = {
    mermaidSyntax: { passed: true, message: 'Mermaid diagrams syntax' },
    brokenLinks: { passed: true, message: 'Documentation links' },
    navbarDuplication: { passed: true, message: 'Navbar configuration' },
    cssGradient: { passed: true, message: 'Gradient background' },
    themeComponents: { passed: true, message: 'Theme components' }
  };

  // 1. Check Mermaid syntax
  const files = glob.sync('docs/**/*.{md,mdx}');
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for problematic mermaid patterns
    if (content.includes('```mermaid')) {
      const mermaidBlocks = content.match(/```mermaid([\s\S]*?)```/g) || [];
      mermaidBlocks.forEach(block => {
        // Check for spaces in class assignments
        if (/class\s+[A-Z_]+\s+[A-Z_]+\s+[a-z]+/.test(block)) {
          checks.mermaidSyntax.passed = false;
          issues.push(`Mermaid syntax issue in ${file}`);
        }
        // Check for semicolons
        if (block.includes(';')) {
          checks.mermaidSyntax.passed = false;
          issues.push(`Semicolons found in mermaid block in ${file}`);
        }
      });
    }
    
    // Check for broken links
    const brokenLinkPatterns = [
      /\/token-system\.md/,
      /\/fee-system\.md/,
      /\/jackpot-system\.md/,
      /\/randomness\.md/,
      /\/cross-chain\.md/,
      /\/security-model\.md/
    ];
    
    brokenLinkPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        checks.brokenLinks.passed = false;
        issues.push(`Broken link pattern found in ${file}`);
      }
    });
  });

  // 2. Check CSS for gradient
  const cssFile = path.join('src/css/custom.css');
  if (fs.existsSync(cssFile)) {
    const cssContent = fs.readFileSync(cssFile, 'utf8');
    // Updated check for blue to orange gradient
    if (!cssContent.includes('linear-gradient') || (!cssContent.includes('#1e3a8a') && !cssContent.includes('#f97316'))) {
      checks.cssGradient.passed = false;
      issues.push('Gradient background not found in custom.css');
    }
  }

  // 3. Check for duplicate navbar setup
  const docRootLayout = path.join('src/theme/DocRoot/Layout/index.js');
  if (fs.existsSync(docRootLayout)) {
    const layoutContent = fs.readFileSync(docRootLayout, 'utf8');
    if (layoutContent.includes('<Layout') && !layoutContent.includes('OriginalDocRootLayout')) {
      checks.navbarDuplication.passed = false;
      issues.push('DocRoot Layout might cause duplicate navbar');
    }
  }

  // 4. Check theme components exist
  const requiredThemeFiles = [
    'src/theme/Layout/index.tsx',
    'src/clientModules/animeModule.js',
    'src/clientModules/mermaidInit.js'
  ];
  
  requiredThemeFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      checks.themeComponents.passed = false;
      issues.push(`Missing theme file: ${file}`);
    }
  });

  // Print results
  console.log('Health Check Results:');
  console.log('====================\n');
  
  Object.entries(checks).forEach(([key, check]) => {
    const status = check.passed ? '✅' : '❌';
    console.log(`${status} ${check.message}`);
  });
  
  if (issues.length > 0) {
    console.log('\n⚠️  Issues found:');
    issues.forEach(issue => {
      console.log(`   - ${issue}`);
    });
    console.log('\n💡 Run "npm run fix-all-mermaid" for Mermaid issues.');
    console.log('💡 Run "npm run fix-all-docs" for broken links.');
  } else {
    console.log('\n🎉 All checks passed! Your site is healthy.');
  }
  
  // Additional tips
  console.log('\n📝 Quick commands:');
  console.log('   npm run fix-all-mermaid  - Fix Mermaid diagram issues');
  console.log('   npm run fix-all-docs     - Fix all documentation issues');
  console.log('   npm run verify-mermaid   - Verify Mermaid syntax');
  console.log('   npm run start            - Start development server');
  console.log('   npm run build            - Build for production');
}

checkSiteHealth(); 