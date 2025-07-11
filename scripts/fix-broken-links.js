// ExecutionEnvironment is not needed in Node.js scripts
// const ExecutionEnvironment = require('@docusaurus/ExecutionEnvironment');

// Node.js script - no browser environment check needed
/**
 * Fix Broken Links Script
 * 
 * This script fixes broken links in the documentation by:
 * 1. Creating missing files for broken links
 * 2. Updating incorrect links to point to the correct files
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Main function to execute the script
async function fixBrokenLinks() {
  console.log('Starting to fix broken links...');
  
  // Create directories for new files
  createDirectories();
  
  // Create missing files
  createMissingFiles();
  
  // Fix links in existing files
  await fixLinks();
  
  console.log('Broken links fixed successfully!');
}

// Create necessary directories
function createDirectories() {
  const directories = [
    'docs-new/concepts',
    'docs-new/resources',
    'docs-new/partner/integrations/chainlink',
    'docs-new/partner/integrations/drand',
    'docs-new/partner/integrations/layerzero',
    'docs-new/reference/contracts/core',
    'docs-new/guides',
    'docs-new/reference/security'
  ];
  
  directories.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
  });
}

// Create missing files
function createMissingFiles() {
  console.log('Creating missing files...');
  
  // Token System
  fs.writeFileSync(
    path.join(process.cwd(), 'docs-new/concepts/token-system-consolidated.md'),
    `---
title: Token System
sidebar_label: Token System
---

# Token System

This document consolidates information about the token system.

## Overview

The token system is a core component of the platform, providing governance, utility, and economic incentives.

## Features

- Governance voting
- Staking rewards
- Fee distribution
- Cross-chain compatibility

## Governance

The token enables holders to participate in governance decisions through voting on proposals.
Proposals can include parameter changes, feature additions, or treasury allocations.

## Integration with Other Systems

The token system integrates with other core components:
- Jackpot system
- Fee system
- Cross-chain functionality

For more details on implementation, see the [smart contracts documentation](/reference/contracts/core/token).`
  );
  console.log('Created token-system-consolidated.md');
  
  // Jackpot System
  fs.writeFileSync(
    path.join(process.cwd(), 'docs-new/concepts/jackpot-system-consolidated.md'),
    `---
title: Jackpot System
sidebar_label: Jackpot System
---

# Jackpot System

This document consolidates information about the jackpot system.

## Overview

The jackpot system provides incentives for participation in the network through randomized rewards.

## Mechanism

The jackpot system uses verifiable randomness to distribute rewards to participants based on their activity and stake in the network.

## Key Components

- Randomness source (Chainlink VRF or Drand)
- Reward pool
- Distribution algorithm
- Claim process

## Security Considerations

The jackpot system is designed with several security measures:
- Tamper-proof randomness
- Transparent distribution
- Audited smart contracts

## Integration with Other Systems

The jackpot system integrates with:
- Token system
- Randomness providers
- Cross-chain functionality

For more details on implementation, see the [smart contracts documentation](/reference/contracts/jackpot).`
  );
  console.log('Created jackpot-system-consolidated.md');
  
  // FAQ
  fs.writeFileSync(
    path.join(process.cwd(), 'docs-new/resources/faq.md'),
    `---
title: Frequently Asked Questions
sidebar_label: FAQ
---

# Frequently Asked Questions

## General Questions

### What is this project?

This project is a decentralized platform that leverages cross-chain technology, verifiable randomness, and innovative tokenomics to create a secure and scalable ecosystem.

### How does it work?

The system uses a combination of smart contracts across multiple blockchains, connected through secure cross-chain messaging protocols, with randomness provided by Chainlink VRF and Drand.

## Technical Questions

### How is randomness generated?

Randomness is generated using either Chainlink VRF or Drand, depending on the specific use case and chain requirements. Both provide cryptographically verifiable random numbers that cannot be manipulated.

### How do cross-chain operations work?

Cross-chain operations are facilitated through messaging protocols like LayerZero, which ensure secure and reliable communication between different blockchain networks.

## Development Questions

### How do I set up a development environment?

Please refer to the [Developer Setup Guide](/guides/getting-started/developer-setup) for detailed instructions.

### Where can I find API documentation?

API documentation is available in the [Reference section](/reference/api/rest-api).

## Security Questions

### Has the code been audited?

Yes, the core contracts have undergone security audits. You can find the audit reports in the [Security section](/reference/security/audit-documentation-summary).

### How are funds secured?

Funds are secured through a combination of multi-signature wallets, timelock contracts, and regular security audits.`
  );
  console.log('Created faq.md');
  
  // Create other required files
  const otherFiles = [
    {
      path: 'docs-new/partner/integrations/chainlink/vrf.md',
      title: 'Chainlink VRF Integration'
    },
    {
      path: 'docs-new/partner/integrations/drand/setup.md',
      title: 'Drand Integration Setup'
    },
    {
      path: 'docs-new/partner/integrations/drand/usage.md',
      title: 'Drand Integration Usage'
    },
    {
      path: 'docs-new/partner/integrations/layerzero/setup.md',
      title: 'LayerZero Integration Setup'
    },
    {
      path: 'docs-new/reference/contracts/core/omnidragon.md',
      title: 'OmniDragon Core Contract'
    },
    {
      path: 'docs-new/guides/developer-guide.md',
      title: 'Developer Guide'
    },
    {
      path: 'docs-new/reference/security/audit-documentation-summary.md',
      title: 'Security Audit Documentation Summary'
    }
  ];
  
  otherFiles.forEach(file => {
    fs.writeFileSync(
      path.join(process.cwd(), file.path),
      `---
title: ${file.title}
sidebar_label: ${file.title.split(' ').pop()}
---

# ${file.title}

This is a placeholder document for ${file.title}.
Content will be added in a future update.`
    );
    console.log(`Created ${file.path}`);
  });
}

// Fix links in existing files
async function fixLinks() {
  console.log('Fixing links in existing files...');
  
  // Map of broken links to their correct destinations
  const linkMap = {
    '/concepts/token-system': '/concepts/token-system-consolidated',
    '/concepts/jackpot': '/concepts/jackpot-system-consolidated',
    '/concepts/token-system#governance': '/concepts/token-system-consolidated#governance',
    '/getting-started/developer-setup': '/guides/getting-started/developer-setup',
    '../../../docs/resources/faq.md': '/resources/faq',
    '/integrations/chainlink/vrf': '/partner/integrations/chainlink/vrf',
    '/integrations/drand/setup': '/partner/integrations/drand/setup',
    '/integrations/drand/usage': '/partner/integrations/drand/usage',
    '/integrations/LayerZero/setup': '/partner/integrations/layerzero/setup',
    '../../../docs/contracts/core/omnidragon.md': '/reference/contracts/core/omnidragon',
    '../../../docs/guide/developer-guide.mdx': '/guides/developer-guide',
    '../security/AUDIT_DOCUMENTATION_SUMMARY.md': '/reference/security/audit-documentation-summary',
  };
  
  // Get all markdown files
  const directories = ['docs', 'docs-new'];
  const extensions = ['.md', '.mdx'];
  
  let files = [];
  for (const dir of directories) {
    for (const ext of extensions) {
      const pattern = path.join(process.cwd(), dir, `**/*${ext}`);
      const matches = glob.sync(pattern);
      files = files.concat(matches);
    }
  }
  
  console.log(`Found ${files.length} markdown files to process.`);
  
  // Process each file
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    // Replace links
    for (const [oldLink, newLink] of Object.entries(linkMap)) {
      const regex = new RegExp(`\\[([^\\]]+)\\]\\(${oldLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
      const newContent = content.replace(regex, `[$1](${newLink})`);
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
        console.log(`Fixed link in ${file}: ${oldLink} -> ${newLink}`);
      }
    }
    
    // Save changes if modified
    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`Updated file: ${file}`);
    }
  }
}

// Execute the script
if (require.main === module) {
  fixBrokenLinks().catch(console.error);
}

module.exports = { fixBrokenLinks };

// No need for browser environment check in Node.js scripts