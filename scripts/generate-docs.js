const fs = require('fs');
const path = require('path');

const docsStructure = {
  'concepts': [
    'overview.md',
    'architecture.md',
    'tokenomics.md',
    'security.md',
    'cross-chain.md',
    'randomness.md'
  ],
  'guides': {
    '': [
      'quickstart.md',
      'installation.md',
      'configuration.md',
      'development.md'
    ],
    'user': [
      'using-token.md',
      'bridging.md',
      'staking.md',
      'governance.md',
      'jackpot.md'
    ]
  },
  'contracts': {
    'core': [
      'token.md',
      'periphery.md',
      'deployer.md',
      'chain-registry.md'
    ],
    'governance': [
      'overview.md',
      've69lp.md',
      'voting.md'
    ],
    'jackpot': [
      'vault.md',
      'distributor.md',
      'triggers.md'
    ],
    'randomness': [
      'drand.md',
      'chainlink.md',
      'arbitrum-vrf.md'
    ],
    'utils': [
      'math.md',
      'config.md',
      'interfaces.md'
    ]
  },
  'integrations': {
    'layerzero': [
      'overview.md',
      'setup.md',
      'messaging.md'
    ],
    'drand': [
      'overview.md',
      'setup.md',
      'usage.md'
    ],
    'chainlink': [
      'overview.md',
      'vrf.md',
      'price-feeds.md'
    ],
    'partners': [
      'overview.md',
      'onboarding.md',
      'promotions.md'
    ]
  },
  'reference': {
    'api': [
      'overview.md',
      'endpoints.md',
      'authentication.md'
    ],
    'addresses': [
      'mainnet.md',
      'testnet.md',
      'development.md'
    ],
    'abis': [
      'core.md',
      'governance.md',
      'jackpot.md'
    ],
    'sdk': [
      'installation.md',
      'usage.md',
      'examples.md'
    ]
  }
};

function createPlaceholderContent(filePath) {
  const title = path.basename(filePath, '.md')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return `---
sidebar_position: 1
---

# ${title}

This documentation is under construction. Please check back soon for detailed information about ${title.toLowerCase()}.

## Overview

Coming soon...

## Features

Coming soon...

## Usage

Coming soon...

## Examples

Coming soon...

## API Reference

Coming soon...
`;
}

function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateDocs(basePath, structure) {
  for (const [key, value] of Object.entries(structure)) {
    const currentPath = path.join(basePath, key);
    createDirectoryIfNotExists(currentPath);

    if (Array.isArray(value)) {
      // Handle array of files
      value.forEach(file => {
        const filePath = path.join(currentPath, file);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, createPlaceholderContent(file));
        }
      });
    } else if (typeof value === 'object') {
      // Handle nested structure
      generateDocs(currentPath, value);
    }
  }
}

// Generate all documentation files
const docsPath = path.join(__dirname, '..', 'docs');
generateDocs(docsPath, docsStructure);

console.log('Documentation structure generated successfully!'); 