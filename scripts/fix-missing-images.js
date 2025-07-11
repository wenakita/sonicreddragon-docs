/**
 * Fix Missing Images Script
 * 
 * This script fixes missing image references in the documentation.
 * It specifically addresses the issue with bridge-interface.png and other images
 * by creating symbolic links or copying files from their current location to the expected location.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting to fix missing images...');

// Define the images to fix
const imagesToFix = [
  {
    name: 'bridge-interface.png',
    source: 'docs/assets/bridge-interface.png',
    target: 'static/img/docs/bridge-interface.png'
  },
  {
    name: 'jackpot-dashboard.png',
    source: 'docs/assets/jackpot-entry.png',
    target: 'static/img/docs/jackpot-dashboard.png'
  },
  {
    name: 'governance-staking.png',
    source: 'docs/assets/governance-voting.png',
    target: 'static/img/docs/governance-staking.png'
  },
  {
    name: 'wallet-connect.png',
    source: 'docs/assets/wallet-connection.png',
    target: 'static/img/docs/wallet-connect.png'
  },
  {
    name: 'token-buy.png',
    source: 'docs/assets/token-purchase.png',
    target: 'static/img/docs/token-buy.png'
  }
];

// Ensure the target directory exists
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
}

// Fix each image
imagesToFix.forEach(image => {
  try {
    // Check if the target already exists
    if (fs.existsSync(image.target)) {
      console.log(`Image ${image.name} already exists, skipping.`);
      return;
    }

    // Ensure the target directory exists
    ensureDirectoryExists(image.target);

    // Check if the source exists
    if (fs.existsSync(image.source)) {
      // Copy the file
      fs.copyFileSync(image.source, image.target);
      console.log(`Copied ${image.source} to ${image.target}`);
    } else {
      console.error(`Source image ${image.source} not found.`);
    }
  } catch (error) {
    console.error(`Error fixing image ${image.name}:`, error);
  }
});

// Update image references in MDX files
function updateImageReferences() {
  const docsDir = path.join(__dirname, '..', 'docs');
  
  // Find all MDX files
  try {
    const mdxFiles = execSync(`find ${docsDir} -name "*.mdx"`, { encoding: 'utf8' }).split('\n').filter(Boolean);
    
    mdxFiles.forEach(filePath => {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        
        // Replace old image paths with new ones
        imagesToFix.forEach(image => {
          const oldPath = `../assets/${path.basename(image.source)}`;
          const newPath = `/img/docs/${image.name}`;
          
          if (content.includes(oldPath)) {
            content = content.replace(new RegExp(oldPath.replace(/\./g, '\\.'), 'g'), newPath);
            updated = true;
          }
        });
        
        if (updated) {
          fs.writeFileSync(filePath, content);
          console.log(`Updated image references in ${filePath}`);
        }
      } catch (error) {
        console.error(`Error updating image references in ${filePath}:`, error);
      }
    });
  } catch (error) {
    console.error('Error finding MDX files:', error);
  }
}

// Update image references
updateImageReferences();

console.log('Finished fixing missing images.');
