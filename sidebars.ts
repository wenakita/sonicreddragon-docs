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
  // By default, Docusaurus generates a sidebar from the docs folder structure
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Concepts',
      link: {
        type: 'generated-index',
        title: 'Core Concepts',
        description: 'Learn about the key concepts in the Sonic Red Dragon ecosystem',
        slug: '/category/concepts',
        keywords: ['concepts'],
      },
      items: [
        'concepts/overview',
        'concepts/architecture',
        'concepts/tokenomics',
        'concepts/security',
        'concepts/cross-chain',
        'concepts/randomness',
        'concepts/jackpot',
      ],
    },
    {
      type: 'category',
      label: 'Visualizations',
      link: {
        type: 'generated-index',
        title: 'Interactive Diagrams',
        description: 'Explore the Sonic Red Dragon ecosystem through interactive visualizations',
        slug: '/category/diagrams',
        keywords: ['diagrams', 'visualizations'],
      },
      items: [
        'diagrams/dragon_ecosystem_diagram',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      link: {
        type: 'generated-index',
        title: 'Guides',
        description: 'Step-by-step guides for users and developers',
        slug: '/category/guides',
        keywords: ['guides', 'tutorials'],
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
      label: 'Contracts',
      link: {
        type: 'generated-index',
        title: 'Smart Contracts',
        description: 'Detailed documentation for OmniDragon smart contracts',
        slug: '/category/contracts',
        keywords: ['contracts', 'solidity'],
      },
      items: [
        {
          type: 'category',
          label: 'Core',
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
          label: 'Jackpot',
          items: [
            'contracts/jackpot/vault',
            'contracts/jackpot/distributor',
            'contracts/jackpot/trigger',
            'contracts/jackpot/triggers',
          ],
        },
        {
          type: 'category',
          label: 'Oracles',
          items: [
            'contracts/oracles/vrf-consumer',
            'contracts/oracles/vrf-integrator',
            'contracts/oracles/vrf-lib',
            'contracts/oracles/drand-integration',
          ],
        },
        {
          type: 'category',
          label: 'Math',
          items: [
            'contracts/math/overview',
            'contracts/math/dragon-math-lib',
            'contracts/math/hermes-math',
            'contracts/math/ve69lp-math',
            'contracts/math/date-time-lib',
            'contracts/math/adaptive-fee',
          ],
        },
        {
          type: 'category',
          label: 'Utils',
          items: [
            'contracts/utils/math',
            'contracts/utils/config',
            'contracts/utils/interfaces',
          ],
        },
      ],
    },
  ],

  // Dedicated sidebar for Concepts
  concepts: [
    'intro',
    'concepts/overview',
    'concepts/architecture',
    'concepts/tokenomics',
    'concepts/security',
    'concepts/cross-chain',
    'concepts/randomness',
    'concepts/jackpot',
  ],

  // Dedicated sidebar for Guides
  guides: [
    'guides/quickstart',
    'guides/installation',
    'guides/configuration',
    'guides/development',
    {
      type: 'category',
      label: 'User Guides',
      items: [
        'guides/user/bridging',
        'guides/user/governance',
        'guides/user/jackpot',
        'guides/user/staking',
        'guides/user/using-token',
      ],
    },
  ],

  // Dedicated sidebar for Contracts
  contracts: [
    'contracts/overview',
    {
      type: 'category',
      label: 'Core',
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
      label: 'Jackpot',
      items: [
        'contracts/jackpot/vault',
        'contracts/jackpot/distributor',
        'contracts/jackpot/trigger',
        'contracts/jackpot/triggers',
      ],
    },
    {
      type: 'category',
      label: 'Oracles',
      items: [
        'contracts/oracles/vrf-consumer',
        'contracts/oracles/vrf-integrator',
        'contracts/oracles/vrf-lib',
        'contracts/oracles/drand-integration',
      ],
    },
    {
      type: 'category',
      label: 'Math',
      items: [
        'contracts/math/overview',
        'contracts/math/dragon-math-lib',
        'contracts/math/hermes-math',
        'contracts/math/ve69lp-math',
        'contracts/math/date-time-lib',
        'contracts/math/adaptive-fee',
      ],
    },
    {
      type: 'category',
      label: 'Utils',
      items: [
        'contracts/utils/math',
        'contracts/utils/config',
        'contracts/utils/interfaces',
      ],
    },
    {
      type: 'category',
      label: 'Randomness',
      items: [
        'contracts/randomness/index',
        'contracts/randomness/drand',
        'contracts/randomness/chainlink',
        'contracts/randomness/arbitrum-vrf',
        'contracts/randomness/vrf-consumer',
        'contracts/randomness/vrf-utils',
        'contracts/randomness/cross-chain-architecture',
      ],
    },
  ],

  // Dedicated sidebar for Integrations
  integrations: [
    'integrations/index',
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
      label: 'Chainlink',
      items: [
        'integrations/chainlink/overview',
        'integrations/chainlink/price-feeds',
        'integrations/chainlink/vrf',
      ],
    },
    {
      type: 'category',
      label: 'DRAND',
      items: [
        'integrations/drand/overview',
        'integrations/drand/setup',
        'integrations/drand/usage',
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

  // Dedicated sidebar for Reference
  reference: [
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'reference/api/overview',
        'reference/api/authentication',
        'reference/api/endpoints',
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
    {
      type: 'category',
      label: 'Contract ABIs',
      items: [
        'reference/abis/core',
        'reference/abis/governance',
        'reference/abis/jackpot',
      ],
    },
    {
      type: 'category',
      label: 'Network Addresses',
      items: [
        'reference/addresses/mainnet',
        'reference/addresses/testnet',
        'reference/addresses/development',
      ],
    },
  ],
};

export default sidebars;

