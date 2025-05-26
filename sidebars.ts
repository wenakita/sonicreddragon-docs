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
    'getting-started',
    {
      type: 'category',
      label: 'System Overview',
      link: {
        type: 'generated-index',
        title: 'OmniDragon System Overview',
        description: 'Comprehensive overview of the OmniDragon cross-chain VRF system',
        slug: '/category/overview',
        keywords: ['overview', 'architecture', 'system'],
      },
      items: [
        'comprehensive-system',
        'concepts/overview',
        'concepts/architecture',
        'concepts/cross-chain',
        'concepts/randomness',
        'concepts/security',
      ],
    },
    {
      type: 'category',
      label: 'Security & Audit',
      link: {
        type: 'generated-index',
        title: 'Security Documentation',
        description: 'Security audit findings, threat model, and security best practices',
        slug: '/category/security',
        keywords: ['security', 'audit', 'threat-model'],
      },
      items: [
        'audit/AUDIT_DOCUMENTATION_SUMMARY',
        'audit/TECHNICAL_SPECIFICATION',
        'audit/THREAT_MODEL',
        'audit/ARCHITECTURE_DIAGRAM',
        '052525updates/SECURITY_AUDIT_RECOMMENDATIONS',
        '052525updates/DRAGONMATH_SECURITY_FIXES',
        '052525updates/DRAGONMATH_CRITICAL_FIXES_V2',
      ],
    },
    {
      type: 'category',
      label: 'Smart Contracts',
      link: {
        type: 'generated-index',
        title: 'Smart Contract Documentation',
        description: 'Comprehensive documentation for all OmniDragon smart contracts',
        slug: '/category/contracts',
        keywords: ['contracts', 'solidity', 'smart-contracts'],
      },
      items: [
        'contracts/overview',
        {
          type: 'category',
          label: 'Core Contracts',
          items: [
            'contracts/core/omnidragon',
            'contracts/core/deployer',
            'contracts/core/periphery',
            'contracts/core/chain-registry',
            'contracts/core/token',
          ],
        },
        {
          type: 'category',
          label: 'VRF & Randomness',
          items: [
            'contracts/randomness/index',
            'contracts/randomness/chainlink',
            'contracts/randomness/drand',
            'contracts/randomness/arbitrum-vrf',
            'contracts/randomness/vrf-consumer',
            'contracts/randomness/cross-chain-architecture',
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
          label: 'Governance',
          items: [
            'contracts/governance/overview',
            'contracts/governance/ve69lp',
            'contracts/governance/voting',
          ],
        },
        {
          type: 'category',
          label: 'Jackpot & Vault',
          items: [
            'contracts/jackpot/vault',
            'contracts/jackpot/distributor',
            'contracts/jackpot/trigger',
            'contracts/jackpot/triggers',
          ],
        },
        {
          type: 'category',
          label: 'Math Libraries',
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
          label: 'Utilities',
          items: [
            'contracts/utils/math',
            'contracts/utils/config',
            'contracts/utils/interfaces',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Deployment & Operations',
      link: {
        type: 'generated-index',
        title: 'Deployment Guides',
        description: 'Comprehensive deployment and operational guides',
        slug: '/category/deployment',
        keywords: ['deployment', 'mainnet', 'operations'],
      },
      items: [
        '052525updates/VRF_DEPLOYMENT_READINESS',
        '052525updates/SONIC_VRF_DEPLOYMENT_GUIDE',
        '052525updates/MAINNET_DEPLOYMENT_GUIDE',
        '052525updates/VRF_SIMULATION_COMPREHENSIVE',
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      link: {
        type: 'generated-index',
        title: 'Third-Party Integrations',
        description: 'Integration guides for LayerZero, Chainlink, Drand, and partner protocols',
        slug: '/category/integrations',
        keywords: ['integrations', 'layerzero', 'chainlink', 'drand'],
      },
      items: [
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
          label: 'Drand',
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
    },
    {
      type: 'category',
      label: 'User Guides',
      link: {
        type: 'generated-index',
        title: 'User Documentation',
        description: 'Guides for end users interacting with the OmniDragon ecosystem',
        slug: '/category/user-guides',
        keywords: ['users', 'guides', 'tutorials'],
      },
      items: [
        'guides/quickstart',
        'guides/installation',
        'guides/configuration',
        'guides/development',
        'guides/user/bridging',
        'guides/user/governance',
        'guides/user/jackpot',
        'guides/user/staking',
        'guides/user/using-token',
      ],
    },
    {
      type: 'category',
      label: 'Technical Architecture',
      link: {
        type: 'generated-index',
        title: 'Technical Architecture',
        description: 'Deep dive into the technical architecture and design decisions',
        slug: '/category/architecture',
        keywords: ['architecture', 'technical', 'design'],
      },
      items: [
        'technical-architecture/architecture-overview',
        'technical-architecture/cross-chain-functionality',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      link: {
        type: 'generated-index',
        title: 'API & Contract Reference',
        description: 'Complete reference documentation for APIs, ABIs, and contract addresses',
        slug: '/category/reference',
        keywords: ['reference', 'api', 'abi', 'addresses'],
      },
      items: [
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
          label: 'SDK Documentation',
          items: [
            'reference/sdk/installation',
            'reference/sdk/usage',
            'reference/sdk/examples',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Updates & Changes',
      link: {
        type: 'generated-index',
        title: 'Recent Updates',
        description: 'Latest updates, reorganization summary, and changelog',
        slug: '/category/updates',
        keywords: ['updates', 'changelog', 'reorganization'],
      },
      items: [
        '052525updates/REORGANIZATION_SUMMARY',
        '052525updates/LOTTERY_ARCHITECTURE_REFACTORING_SUMMARY',
        '052525updates/JACKPOT_CONTRACTS_CODE_REVIEW_FIXES',
        '052525updates/DRAGON_MATH_LIBRARIES_FINAL_REVIEW',
        '052525updates/CLEANUP_SUMMARY',
      ],
    },
  ],

  // Dedicated sidebar for Security & Audit
  security: [
    'audit/AUDIT_DOCUMENTATION_SUMMARY',
    'audit/TECHNICAL_SPECIFICATION',
    'audit/THREAT_MODEL',
    'audit/ARCHITECTURE_DIAGRAM',
    '052525updates/SECURITY_AUDIT_RECOMMENDATIONS',
    '052525updates/DRAGONMATH_SECURITY_FIXES',
    '052525updates/DRAGONMATH_CRITICAL_FIXES_V2',
    '052525updates/DRAGONMATH_CRITICAL_FIXES_IMPLEMENTED',
    '052525updates/DRAGONMATH_COMPREHENSIVE_REVIEW_SUMMARY',
  ],

  // Dedicated sidebar for Contracts
  contracts: [
    'contracts/overview',
    {
      type: 'category',
      label: 'Core Contracts',
      items: [
        'contracts/core/omnidragon',
        'contracts/core/deployer',
        'contracts/core/periphery',
        'contracts/core/chain-registry',
        'contracts/core/token',
      ],
    },
    {
      type: 'category',
      label: 'VRF & Randomness',
      items: [
        'contracts/randomness/index',
        'contracts/randomness/chainlink',
        'contracts/randomness/drand',
        'contracts/randomness/arbitrum-vrf',
        'contracts/randomness/vrf-consumer',
        'contracts/randomness/cross-chain-architecture',
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
      label: 'Governance',
      items: [
        'contracts/governance/overview',
        'contracts/governance/ve69lp',
        'contracts/governance/voting',
      ],
    },
    {
      type: 'category',
      label: 'Jackpot & Vault',
      items: [
        'contracts/jackpot/vault',
        'contracts/jackpot/distributor',
        'contracts/jackpot/trigger',
        'contracts/jackpot/triggers',
      ],
    },
    {
      type: 'category',
      label: 'Math Libraries',
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
      label: 'Utilities',
      items: [
        'contracts/utils/math',
        'contracts/utils/config',
        'contracts/utils/interfaces',
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
      label: 'Drand',
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
      label: 'SDK Documentation',
      items: [
        'reference/sdk/installation',
        'reference/sdk/usage',
        'reference/sdk/examples',
      ],
    },
  ],
};

export default sidebars;

