#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 Restructuring OmniDragon docs using Balancer best practices...\n');

// New structure based on Balancer v3 docs
const newStructure = {
  // 1. CONCEPTS - High-level understanding
  'concepts': {
    'overview.md': 'Protocol overview and key concepts',
    'architecture.md': 'System architecture and design principles',
    'tokenomics.md': 'Token economics and fee structure',
    'jackpot-system.md': 'Automatic jackpot mechanics',
    'cross-chain.md': 'Cross-chain functionality',
    'randomness.md': 'Randomness infrastructure',
    'governance.md': 've69LP governance system',
    'security-model.md': 'Security architecture and audits'
  },
  
  // 2. GUIDES - Step-by-step tutorials
  'guides': {
    'getting-started': {
      'quick-start.md': 'Quick start guide for users',
      'developer-setup.md': 'Development environment setup',
      'first-transaction.md': 'Making your first transaction'
    },
    'user-guides': {
      'buying-tokens.md': 'How to buy OmniDragon tokens',
      'cross-chain-transfer.md': 'Cross-chain token transfers',
      'governance-participation.md': 'Participating in governance',
      'jackpot-participation.md': 'Understanding jackpot mechanics'
    },
    'developer-guides': {
      'integration-guide.md': 'Integrating with OmniDragon',
      'smart-contract-interaction.md': 'Interacting with contracts',
      'building-on-omnidragon.md': 'Building applications on OmniDragon',
      'testing-guide.md': 'Testing and debugging'
    }
  },
  
  // 3. BUILD - Developer resources
  'build': {
    'smart-contracts': {
      'core': {
        'token.md': 'OmniDragon token contract',
        'vault.md': 'Jackpot vault system',
        'bridge.md': 'Cross-chain bridge contracts',
        'governance.md': 'Governance contracts'
      },
      'periphery': {
        'randomness-provider.md': 'Randomness infrastructure',
        'fee-distributor.md': 'Fee distribution system',
        'utilities.md': 'Utility contracts'
      }
    },
    'sdk': {
      'overview.md': 'SDK overview and installation',
      'examples.md': 'Code examples and snippets',
      'api-reference.md': 'Complete API reference'
    },
    'tools': {
      'deployment.md': 'Deployment tools and scripts',
      'monitoring.md': 'Monitoring and analytics',
      'testing.md': 'Testing frameworks'
    }
  },
  
  // 4. REFERENCE - Technical specifications
  'reference': {
    'contracts': {
      'addresses.md': 'Contract addresses by network',
      'abis.md': 'Contract ABIs and interfaces',
      'events.md': 'Contract events reference'
    },
    'api': {
      'rest-api.md': 'REST API documentation',
      'graphql.md': 'GraphQL API reference',
      'websocket.md': 'WebSocket API'
    },
    'networks': {
      'ethereum.md': 'Ethereum deployment details',
      'arbitrum.md': 'Arbitrum deployment details',
      'avalanche.md': 'Avalanche deployment details',
      'bsc.md': 'BSC deployment details'
    }
  },
  
  // 5. PARTNER - Integration and partnerships
  'partner': {
    'onboarding': {
      'overview.md': 'Partner onboarding overview',
      'integration-checklist.md': 'Integration requirements',
      'support.md': 'Partner support resources'
    },
    'integrations': {
      'dex-aggregators.md': 'DEX aggregator integration',
      'wallets.md': 'Wallet integration guide',
      'dapps.md': 'DApp integration patterns',
      'exchanges.md': 'Exchange integration'
    },
    'case-studies': {
      'layerzero.md': 'LayerZero integration case study',
      'chainlink.md': 'Chainlink VRF integration',
      'drand.md': 'Drand beacon integration'
    }
  },
  
  // 6. RESOURCES - Additional materials
  'resources': {
    'security': {
      'audits.md': 'Security audits and reports',
      'bug-bounty.md': 'Bug bounty program',
      'best-practices.md': 'Security best practices'
    },
    'community': {
      'governance.md': 'Community governance',
      'forums.md': 'Community forums and discussion',
      'social.md': 'Social media and communication'
    },
    'legal': {
      'terms.md': 'Terms of service',
      'privacy.md': 'Privacy policy',
      'compliance.md': 'Regulatory compliance'
    }
  }
};

// Create the new directory structure
function createNewStructure() {
  console.log('📁 Creating new directory structure...');
  
  function createDirs(structure, basePath = 'docs-new') {
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
    }
    
    Object.keys(structure).forEach(key => {
      const fullPath = path.join(basePath, key);
      
      if (typeof structure[key] === 'object' && !key.endsWith('.md')) {
        // It's a directory
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
        }
        createDirs(structure[key], fullPath);
      } else {
        // It's a file - create placeholder if it doesn't exist
        if (!fs.existsSync(fullPath)) {
          const description = structure[key];
          const content = createPlaceholderContent(key, description);
          fs.writeFileSync(fullPath, content);
          console.log(`  ✅ Created: ${fullPath}`);
        }
      }
    });
  }
  
  createDirs(newStructure);
}

// Create placeholder content for new files
function createPlaceholderContent(filename, description) {
  const title = filename.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return `---
title: ${title}
description: ${description}
---

# ${title}

${description}

## Overview

This section covers ${description.toLowerCase()}.

## Key Features

- Feature 1
- Feature 2
- Feature 3

## Getting Started

Instructions for getting started with ${title.toLowerCase()}.

## Examples

\`\`\`javascript
// Example code will go here
\`\`\`

## Next Steps

- [Related Topic 1](#)
- [Related Topic 2](#)
- [Related Topic 3](#)
`;
}

// Migration mapping from old structure to new
const migrationMap = {
  // Concepts
  'docs/concepts/architecture.md': 'docs-new/concepts/architecture.md',
  'docs/concepts/tokenomics.md': 'docs-new/concepts/tokenomics.md',
  'docs/concepts/jackpot-system.md': 'docs-new/concepts/jackpot-system.md',
  'docs/concepts/cross-chain.md': 'docs-new/concepts/cross-chain.md',
  'docs/concepts/randomness.md': 'docs-new/concepts/randomness.md',
  'docs/concepts/security-model.md': 'docs-new/concepts/security-model.md',
  
  // Getting Started → Guides
  'docs/getting-started/quick-start.md': 'docs-new/guides/getting-started/quick-start.md',
  'docs/getting-started/developer-setup.md': 'docs-new/guides/getting-started/developer-setup.md',
  'docs/getting-started/overview.md': 'docs-new/concepts/overview.md',
  
  // Contracts → Build
  'docs/contracts/core/token.md': 'docs-new/build/smart-contracts/core/token.md',
  'docs/contracts/jackpot/vault.md': 'docs-new/build/smart-contracts/core/vault.md',
  'docs/contracts/governance/ve69lp.md': 'docs-new/build/smart-contracts/core/governance.md',
  
  // Reference
  'docs/reference/addresses.md': 'docs-new/reference/contracts/addresses.md',
  'docs/reference/abis.md': 'docs-new/reference/contracts/abis.md',
  'docs/reference/api.md': 'docs-new/reference/api/rest-api.md',
  
  // Integrations → Partner
  'docs/integrations/layerzero/overview.md': 'docs-new/partner/case-studies/layerzero.md',
  'docs/integrations/chainlink/overview.md': 'docs-new/partner/case-studies/chainlink.md',
  'docs/integrations/drand/overview.md': 'docs-new/partner/case-studies/drand.md',
  
  // Security → Resources
  'docs/audit/': 'docs-new/resources/security/',
};

// Migrate existing content
function migrateContent() {
  console.log('\n📦 Migrating existing content...');
  
  Object.keys(migrationMap).forEach(oldPath => {
    const newPath = migrationMap[oldPath];
    
    if (fs.existsSync(oldPath)) {
      // Ensure target directory exists
      const targetDir = path.dirname(newPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      if (fs.statSync(oldPath).isDirectory()) {
        // Copy directory recursively
        copyDir(oldPath, newPath);
      } else {
        // Copy file
        fs.copyFileSync(oldPath, newPath);
        console.log(`  📄 Migrated: ${oldPath} → ${newPath}`);
      }
    }
  });
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  📄 Migrated: ${srcPath} → ${destPath}`);
    }
  });
}

// Update sidebars configuration
function createNewSidebars() {
  console.log('\n⚙️ Creating new sidebars configuration...');
  
  const newSidebars = {
    docs: [
      {
        type: 'category',
        label: 'Concepts',
        items: [
          'concepts/overview',
          'concepts/architecture',
          'concepts/tokenomics',
          'concepts/jackpot-system',
          'concepts/cross-chain',
          'concepts/randomness',
          'concepts/governance',
          'concepts/security-model'
        ]
      },
      {
        type: 'category',
        label: 'Guides',
        items: [
          {
            type: 'category',
            label: 'Getting Started',
            items: [
              'guides/getting-started/quick-start',
              'guides/getting-started/developer-setup',
              'guides/getting-started/first-transaction'
            ]
          },
          {
            type: 'category',
            label: 'User Guides',
            items: [
              'guides/user-guides/buying-tokens',
              'guides/user-guides/cross-chain-transfer',
              'guides/user-guides/governance-participation',
              'guides/user-guides/jackpot-participation'
            ]
          },
          {
            type: 'category',
            label: 'Developer Guides',
            items: [
              'guides/developer-guides/integration-guide',
              'guides/developer-guides/smart-contract-interaction',
              'guides/developer-guides/building-on-omnidragon',
              'guides/developer-guides/testing-guide'
            ]
          }
        ]
      },
      {
        type: 'category',
        label: 'Build',
        items: [
          {
            type: 'category',
            label: 'Smart Contracts',
            items: [
              {
                type: 'category',
                label: 'Core',
                items: [
                  'build/smart-contracts/core/token',
                  'build/smart-contracts/core/vault',
                  'build/smart-contracts/core/bridge',
                  'build/smart-contracts/core/governance'
                ]
              },
              {
                type: 'category',
                label: 'Periphery',
                items: [
                  'build/smart-contracts/periphery/randomness-provider',
                  'build/smart-contracts/periphery/fee-distributor',
                  'build/smart-contracts/periphery/utilities'
                ]
              }
            ]
          },
          {
            type: 'category',
            label: 'SDK',
            items: [
              'build/sdk/overview',
              'build/sdk/examples',
              'build/sdk/api-reference'
            ]
          },
          {
            type: 'category',
            label: 'Tools',
            items: [
              'build/tools/deployment',
              'build/tools/monitoring',
              'build/tools/testing'
            ]
          }
        ]
      },
      {
        type: 'category',
        label: 'Reference',
        items: [
          {
            type: 'category',
            label: 'Contracts',
            items: [
              'reference/contracts/addresses',
              'reference/contracts/abis',
              'reference/contracts/events'
            ]
          },
          {
            type: 'category',
            label: 'API',
            items: [
              'reference/api/rest-api',
              'reference/api/graphql',
              'reference/api/websocket'
            ]
          },
          {
            type: 'category',
            label: 'Networks',
            items: [
              'reference/networks/ethereum',
              'reference/networks/arbitrum',
              'reference/networks/avalanche',
              'reference/networks/bsc'
            ]
          }
        ]
      },
      {
        type: 'category',
        label: 'Partner',
        items: [
          {
            type: 'category',
            label: 'Onboarding',
            items: [
              'partner/onboarding/overview',
              'partner/onboarding/integration-checklist',
              'partner/onboarding/support'
            ]
          },
          {
            type: 'category',
            label: 'Integrations',
            items: [
              'partner/integrations/dex-aggregators',
              'partner/integrations/wallets',
              'partner/integrations/dapps',
              'partner/integrations/exchanges'
            ]
          },
          {
            type: 'category',
            label: 'Case Studies',
            items: [
              'partner/case-studies/layerzero',
              'partner/case-studies/chainlink',
              'partner/case-studies/drand'
            ]
          }
        ]
      },
      {
        type: 'category',
        label: 'Resources',
        items: [
          {
            type: 'category',
            label: 'Security',
            items: [
              'resources/security/audits',
              'resources/security/bug-bounty',
              'resources/security/best-practices'
            ]
          },
          {
            type: 'category',
            label: 'Community',
            items: [
              'resources/community/governance',
              'resources/community/forums',
              'resources/community/social'
            ]
          },
          {
            type: 'category',
            label: 'Legal',
            items: [
              'resources/legal/terms',
              'resources/legal/privacy',
              'resources/legal/compliance'
            ]
          }
        ]
      }
    ]
  };
  
  fs.writeFileSync('sidebars-new.ts', `
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = ${JSON.stringify(newSidebars, null, 2)};

export default sidebars;
`);
  
  console.log('  ✅ Created: sidebars-new.ts');
}

// Main execution
function main() {
  try {
    createNewStructure();
    migrateContent();
    createNewSidebars();
    
    console.log('\n🎉 Documentation restructuring complete!');
    console.log('\n📋 Next steps:');
    console.log('  1. Review the new structure in docs-new/');
    console.log('  2. Update docusaurus.config.ts to point to docs-new/');
    console.log('  3. Replace sidebars.ts with sidebars-new.ts');
    console.log('  4. Test the new documentation structure');
    console.log('  5. Update any remaining internal links');
    
  } catch (error) {
    console.error('❌ Error during restructuring:', error);
  }
}

main(); 