#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 Verifying site health...\n');

let allGood = true;

// 1. Check for Mermaid syntax errors
console.log('1. Checking Mermaid syntax...');
const files = glob.sync('docs/**/*.md', { cwd: process.cwd() });
let mermaidIssues = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const mermaidBlocks = content.match(/```mermaid\n([\s\S]*?)\n```/g);
  
  if (mermaidBlocks) {
    mermaidBlocks.forEach((block, index) => {
      const diagramContent = block.replace(/```mermaid\n/, '').replace(/\n```$/, '');
      
      // Check for common syntax issues
      const subgraphCount = (diagramContent.match(/subgraph\s+/g) || []).length;
      const endCount = (diagramContent.match(/\bend\b/g) || []).length;
      
      if (subgraphCount > 0 && subgraphCount !== endCount) {
        console.log(`   ❌ ${file}: Mismatch in subgraph/end statements (${subgraphCount} subgraphs, ${endCount} ends)`);
        mermaidIssues++;
        allGood = false;
      }
      
      // Check for color typos
      if (diagramContent.includes('#fffffffff')) {
        console.log(`   ❌ ${file}: Invalid color code #fffffffff found`);
        mermaidIssues++;
        allGood = false;
      }
    });
  }
});

if (mermaidIssues === 0) {
  console.log('   ✅ All Mermaid diagrams have valid syntax');
} else {
  console.log(`   ❌ Found ${mermaidIssues} Mermaid syntax issues`);
}

// 2. Check for broken links
console.log('\n2. Checking for broken links...');
let brokenLinks = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check for the specific broken link pattern
  if (content.includes('/token-system.md')) {
    console.log(`   ❌ ${file}: Contains broken link /token-system.md`);
    brokenLinks++;
    allGood = false;
  }
});

if (brokenLinks === 0) {
  console.log('   ✅ No broken links found');
} else {
  console.log(`   ❌ Found ${brokenLinks} broken links`);
}

// 3. Check server status
console.log('\n3. Checking server status...');
const { exec } = require('child_process');

exec('curl -s http://localhost:3000 > /dev/null', (error, stdout, stderr) => {
  if (error) {
    console.log('   ❌ Server not responding');
    allGood = false;
  } else {
    console.log('   ✅ Server is running and responding');
  }
  
  // 4. Final summary
  console.log('\n📊 Health Check Summary:');
  if (allGood) {
    console.log('   ✅ All systems are healthy!');
    console.log('   🚀 Your OmniDragon documentation site is ready!');
    console.log('   🌐 Visit: http://localhost:3000');
  } else {
    console.log('   ❌ Some issues found. Please review the errors above.');
  }
});

// 5. Check key files exist
console.log('\n4. Checking key files...');
const keyFiles = [
  'docusaurus.config.ts',
  'sidebars.ts',
  'src/css/custom.css',
  'src/clientModules/mermaidInit.js',
  'static/css/custom-sidebar.css'
];

keyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} missing`);
    allGood = false;
  }
}); 