const fs = require('fs');
const path = require('path');

// Define the replacements for each file
const replacements = [
  {
    file: 'docs-new/concepts/cross-chain.md',
    replacements: [
      { from: '/concepts/tokenomics#governance', to: '/concepts/governance' }
    ]
  },
  {
    file: 'docs-new/guides/getting-started/developer-setup.md',
    replacements: [
      { from: '/concepts/architecture.md#smart-contracts', to: '/concepts/architecture' }
    ]
  }
];

// Function to fix links in a file
const fixLinksInFile = (fileInfo) => {
  const filePath = fileInfo.file;
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let replacementsMade = 0;
  
  fileInfo.replacements.forEach(replacement => {
    const regex = new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    
    if (matches) {
      replacementsMade += matches.length;
      content = content.replace(regex, replacement.to);
    }
  });
  
  fs.writeFileSync(fullPath, content);
  console.log(`Fixed ${replacementsMade} anchors in ${filePath}`);
};

// Main function
const main = () => {
  console.log('Starting to fix broken anchors...');
  
  // Fix links in each file
  replacements.forEach(fileInfo => {
    fixLinksInFile(fileInfo);
  });
  
  console.log('Finished fixing broken anchors.');
};

main();
