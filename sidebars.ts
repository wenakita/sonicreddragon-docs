import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation
 */
const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      link: {
        type: 'doc',
        id: 'getting-started/overview',
      },
      items: [
        'getting-started/quick-start',
        'getting-started/developer-setup',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Architecture',
          link: {
            type: 'doc',
            id: 'concepts/architecture',
          },
          items: [
            'concepts/security-model',
          ],
        },
        {
          type: 'category',
          label: 'Token System',
          link: {
            type: 'doc',
            id: 'concepts/token-system',
          },
          items: [
            'concepts/fee-system',
            'concepts/jackpot',
          ],
        },
        {
          type: 'category',
          label: 'Cross-Chain',
          link: {
            type: 'doc',
            id: 'concepts/cross-chain',
          },
          items: [
            'concepts/randomness',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Technical Reference',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'Smart Contracts',
          link: {
            type: 'doc',
            id: 'contracts/overview',
          },
          items: [
            {
              type: 'category',
              label: 'Core Contracts',
              items: [
                'contracts/core/token',
                'contracts/core/omnidragon',
                'contracts/core/lottery-manager',
                'contracts/core/randomness-provider',
                'contracts/core/chain-registry',
              ],
            },
            {
              type: 'category',
              label: 'Jackpot Contracts',
              items: [
                'contracts/jackpot/vault',
                'contracts/jackpot/distributor',
                'contracts/jackpot/trigger',
                'contracts/jackpot/triggers',
              ],
            },
            {
              type: 'category',
              label: 'Randomness Contracts',
              items: [
                'contracts/randomness/overview',
                'contracts/randomness/chainlink',
                'contracts/randomness/drand',
                'contracts/randomness/arbitrum-vrf',
                'contracts/randomness/vrf-utils',
                'contracts/randomness/cross-chain-architecture',
              ],
            },
            {
              type: 'category',
              label: 'Math Libraries',
              items: [
                'contracts/math/overview',
                'contracts/math/dragon-math',
                'contracts/math/hermes-math',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'API Reference',
          link: {
            type: 'doc',
            id: 'reference/api',
          },
          items: [
            'reference/api/overview',
            'reference/api/endpoints',
            'reference/api/authentication',
          ],
        },
        {
          type: 'category',
          label: 'Network Information',
          items: [
            'reference/addresses/mainnet',
            'reference/addresses/testnet',
            'reference/addresses/development',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'User Guides',
          link: {
            type: 'doc',
            id: 'guide/user-guide',
          },
          items: [],
        },
        {
          type: 'category',
          label: 'Developer Guides',
          link: {
            type: 'doc',
            id: 'guide/developer-guide',
          },
          items: [],
        },
        {
          type: 'category',
          label: 'Interactive Diagrams',
          items: [
            'guide/animated-content',
            'guide/elegant-diagrams',
            'guide/immersive-diagrams',
            'guide/mermaid-implementation',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Resources',
      collapsed: true,
      items: [
        'resources/faq',
        'resources/glossary',
      ],
    },
  ],
};

export default sidebars;
