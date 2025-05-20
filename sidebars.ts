import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  concepts: [
    {
      type: 'category',
      label: 'Core Concepts',
      link: {
        type: 'generated-index',
        title: 'Core Concepts',
        description: 'Learn about the fundamental concepts behind Sonic Red Dragon',
      },
      items: [
        'concepts/overview',
        'concepts/architecture',
        'concepts/tokenomics',
        'concepts/security',
        'concepts/cross-chain',
        'concepts/randomness',
      ],
    },
  ],

  guides: [
    {
      type: 'category',
      label: 'Getting Started',
      link: {
        type: 'generated-index',
        title: 'Getting Started',
        description: 'Start your journey with Sonic Red Dragon',
      },
      items: [
        'guides/quickstart',
        'guides/installation',
        'guides/configuration',
        'guides/development',
      ],
    },
    {
      type: 'category',
      label: 'User Guides',
      link: {
        type: 'generated-index',
        title: 'User Guides',
        description: 'Learn how to use Sonic Red Dragon features',
      },
      items: [
        'guides/using-token',
        'guides/bridging',
        'guides/staking',
        'guides/governance',
        'guides/jackpot',
      ],
    },
  ],

  contracts: [
    {
      type: 'category',
      label: 'Smart Contracts',
      link: {
        type: 'generated-index',
        title: 'Smart Contracts',
        description: 'Explore Sonic Red Dragon smart contracts',
      },
      items: [
        {
          type: 'category',
          label: 'Core Contracts',
          items: [
            'contracts/core/token',
            'contracts/core/periphery',
            'contracts/core/deployer',
            'contracts/core/chain-registry',
          ],
        },
        {
          type: 'category',
          label: 'Governance',
          items: [
            'contracts/governance/overview',
            'contracts/governance/ve69lp',
            'contracts/governance/voting',
          ],
        },
        {
          type: 'category',
          label: 'Jackpot System',
          items: [
            'contracts/jackpot/vault',
            'contracts/jackpot/distributor',
            'contracts/jackpot/triggers',
          ],
        },
        {
          type: 'category',
          label: 'Randomness',
          items: [
            'contracts/randomness/drand',
            'contracts/randomness/chainlink',
            'contracts/randomness/arbitrum-vrf',
          ],
        },
        {
          type: 'category',
          label: 'Utilities',
          items: [
            'contracts/utils/math',
            'contracts/utils/config',
            'contracts/utils/interfaces',
          ],
        },
      ],
    },
  ],

  integrations: [
    {
      type: 'category',
      label: 'Integrations',
      link: {
        type: 'generated-index',
        title: 'Integrations',
        description: 'Learn how to integrate with Sonic Red Dragon',
      },
      items: [
        {
          type: 'category',
          label: 'LayerZero',
          items: [
            'integrations/layerzero/overview',
            'integrations/layerzero/setup',
            'integrations/layerzero/messaging',
          ],
        },
        {
          type: 'category',
          label: 'dRAND',
          items: [
            'integrations/drand/overview',
            'integrations/drand/setup',
            'integrations/drand/usage',
          ],
        },
        {
          type: 'category',
          label: 'Chainlink',
          items: [
            'integrations/chainlink/overview',
            'integrations/chainlink/vrf',
            'integrations/chainlink/price-feeds',
          ],
        },
        {
          type: 'category',
          label: 'Partners',
          items: [
            'integrations/partners/overview',
            'integrations/partners/onboarding',
            'integrations/partners/promotions',
          ],
        },
      ],
    },
  ],

  reference: [
    {
      type: 'category',
      label: 'Reference',
      link: {
        type: 'generated-index',
        title: 'Reference',
        description: 'Technical reference for Sonic Red Dragon',
      },
      items: [
        {
          type: 'category',
          label: 'API Reference',
          items: [
            'reference/api/overview',
            'reference/api/endpoints',
            'reference/api/authentication',
          ],
        },
        {
          type: 'category',
          label: 'Contract Addresses',
          items: [
            'reference/addresses/mainnet',
            'reference/addresses/testnet',
            'reference/addresses/development',
          ],
        },
        {
          type: 'category',
          label: 'ABIs',
          items: [
            'reference/abis/core',
            'reference/abis/governance',
            'reference/abis/jackpot',
          ],
        },
        {
          type: 'category',
          label: 'SDK',
          items: [
            'reference/sdk/installation',
            'reference/sdk/usage',
            'reference/sdk/examples',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
