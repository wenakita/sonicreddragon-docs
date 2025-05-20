const fs = require('fs');
const path = require('path');

// Get a list of all doc files
function getAllDocs() {
  const docsDir = path.join(__dirname, '../docs');
  const allDocs = [];
  
  function scanDir(dir, baseDir = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        scanDir(itemPath, path.join(baseDir, item));
      } else if (stat.isFile() && item.endsWith('.md')) {
        const docPath = path.join(baseDir, item.replace('.md', ''));
        allDocs.push(docPath);
      }
    });
  }
  
  scanDir(docsDir);
  return allDocs;
}

// Extract all sidebar doc links
function extractSidebarLinks() {
  const sidebarFile = path.join(__dirname, '../sidebars.ts');
  const fileContent = fs.readFileSync(sidebarFile, 'utf8');
  
  // Use regex to find all doc paths
  const regex = /'([^']+)'/g;
  const matches = [];
  let match;
  
  while ((match = regex.exec(fileContent)) !== null) {
    // Skip if not a potential doc path
    if (!match[1].includes('/')) continue;
    
    // Only consider potential doc links (not labels or other strings)
    if (!match[1].startsWith('/') && !match[1].startsWith('http')) {
      matches.push(match[1]);
    }
  }
  
  return matches;
}

// Main function
function checkDocsIntegrity() {
  console.log('Checking docs integrity...');
  
  const allDocs = getAllDocs().map(doc => doc.replace(/\\/g, '/'));
  console.log(`Found ${allDocs.length} docs in file system`);
  
  const sidebarLinks = extractSidebarLinks();
  console.log(`Found ${sidebarLinks.length} doc links in sidebar`);
  
  // Check for missing docs
  const missingDocs = sidebarLinks.filter(link => !allDocs.includes(link));
  
  if (missingDocs.length > 0) {
    console.log('\nMissing docs referenced in sidebar:');
    missingDocs.forEach(doc => console.log(`- ${doc}`));
  } else {
    console.log('\nAll docs referenced in sidebar exist!');
  }
  
  // Check for orphaned docs (files not in sidebar)
  const orphanedDocs = allDocs.filter(doc => !sidebarLinks.includes(doc) && doc !== 'intro');
  
  if (orphanedDocs.length > 0) {
    console.log('\nOrphaned docs (not referenced in sidebar):');
    orphanedDocs.forEach(doc => console.log(`- ${doc}`));
  } else {
    console.log('\nNo orphaned docs found!');
  }
}

checkDocsIntegrity(); 