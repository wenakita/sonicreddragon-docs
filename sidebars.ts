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
        {
          type: 'category',
          label: 'Core Contracts',
          items: [
            'contracts/core/omnidragon',
            'contracts/core/deployer',
            'contracts/core/periphery',
            'contracts/core/randomness-bucket',
          ],
        },
        {
          type: 'category',
          label: 'VRF & Randomness',
          items: [
            'contracts/randomness/overview',
            'contracts/randomness/chainlink-integration',
            'contracts/randomness/drand-integration',
            'contracts/randomness/vrf-consumer',
            'contracts/randomness/cross-chain-architecture',
            'contracts/randomness/arbitrum-vrf',
          ],
        },
        {
          type: 'category',
          label: 'Oracles',
          items: [
            'contracts/oracles/overview',
            'contracts/oracles/swap-trigger-oracle',
            'contracts/oracles/vrf-consumer',
            'contracts/oracles/price-feeds',
          ],
        },
        {
          type: 'category',
          label: 'Governance',
          items: [
            'contracts/governance/overview',
            'contracts/governance/partners/factory',
            'contracts/governance/partners/pool',
            'contracts/governance/partners/registry',
            'contracts/governance/voting/ve69lp',
            'contracts/governance/voting/boost-manager',
            'contracts/governance/voting/fee-distributor',
          ],
        },
        {
          type: 'category',
          label: 'Vault & Treasury',
          items: [
            'contracts/vault/jackpot-vault',
            'contracts/vault/jackpot-distributor',
            'contracts/vault/treasury-management',
          ],
        },
        {
          type: 'category',
          label: 'Math Libraries',
          items: [
            'contracts/math/overview',
            'contracts/math/dragon-math-lib',
            'contracts/math/hermes-math',
            'contracts/math/adaptive-fee-manager',
            'contracts/math/datetime-lib',
            'contracts/math/ve69lp-math',
            'contracts/math/voting-power-calculator',
          ],
        },
        {
          type: 'category',
          label: 'Configuration',
          items: [
            'contracts/config/chain-registry',
            'contracts/config/dragon-config',
            'contracts/config/deployment-settings',
          ],
        },
        {
          type: 'category',
          label: 'Utilities & Libraries',
          items: [
            'contracts/lib/access-control',
            'contracts/lib/dragon-libraries',
            'contracts/lib/security',
            'contracts/lib/utils',
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
        'guide/deployment-checklist',
        'guide/monitoring',
        'guide/maintenance',
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
        {
          type: 'category',
          label: 'LayerZero',
          items: [
            'integrations/layerzero/overview',
            'integrations/layerzero/cross-chain-messaging',
            'integrations/layerzero/security-considerations',
            'integrations/layerzero/implementation-guide',
          ],
        },
        {
          type: 'category',
          label: 'Chainlink',
          items: [
            'integrations/chainlink/overview',
            'integrations/chainlink/vrf-integration',
            'integrations/chainlink/price-feeds',
            'integrations/chainlink/automation',
            'integrations/chainlink/best-practices',
          ],
        },
        {
          type: 'category',
          label: 'Drand',
          items: [
            'integrations/drand/overview',
            'integrations/drand/beacon-integration',
            'integrations/drand/verification',
            'integrations/drand/implementation',
          ],
        },
        {
          type: 'category',
          label: 'Partners',
          items: [
            'integrations/partners/overview',
            'integrations/partners/onboarding',
            'integrations/partners/revenue-sharing',
            'integrations/partners/technical-requirements',
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
        'guides/user/getting-started',
        'guides/user/using-vrf',
        'guides/user/governance-participation',
        'guides/user/staking-rewards',
        'guides/user/cross-chain-operations',
      ],
    },
    {
      type: 'category',
      label: 'Developer Resources',
      link: {
        type: 'generated-index',
        title: 'Developer Documentation',
        description: 'Technical resources for developers building on OmniDragon',
        slug: '/category/developers',
        keywords: ['developers', 'sdk', 'api', 'testing'],
      },
      items: [
        'guide/development-setup',
        'guide/testing-framework',
        'guide/local-development',
        'guide/debugging',
        'reference/sdk/overview',
        'reference/api/endpoints',
        'smart-contracts/testing-guide',
        'smart-contracts/deployment-scripts',
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
        'technical-architecture/system-design',
        'technical-architecture/cross-chain-architecture',
        'technical-architecture/randomness-architecture',
        'technical-architecture/security-model',
        'technical-architecture/gas-optimization',
        'technical-architecture/scalability',
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
            'reference/abis/core-contracts',
            'reference/abis/vrf-contracts',
            'reference/abis/governance-contracts',
            'reference/abis/vault-contracts',
          ],
        },
        {
          type: 'category',
          label: 'Network Addresses',
          items: [
            'reference/addresses/sonic-mainnet',
            'reference/addresses/arbitrum-mainnet',
            'reference/addresses/testnet-addresses',
          ],
        },
        {
          type: 'category',
          label: 'API Reference',
          items: [
            'reference/api/overview',
            'reference/api/authentication',
            'reference/api/vrf-endpoints',
            'reference/api/governance-endpoints',
            'reference/api/analytics-endpoints',
            'reference/api/error-codes',
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
        'contracts/core/randomness-bucket',
      ],
    },
    {
      type: 'category',
      label: 'VRF & Randomness',
      items: [
        'contracts/randomness/overview',
        'contracts/randomness/chainlink-integration',
        'contracts/randomness/drand-integration',
        'contracts/randomness/vrf-consumer',
        'contracts/randomness/cross-chain-architecture',
        'contracts/randomness/arbitrum-vrf',
      ],
    },
    {
      type: 'category',
      label: 'Oracles',
      items: [
        'contracts/oracles/overview',
        'contracts/oracles/swap-trigger-oracle',
        'contracts/oracles/vrf-consumer',
        'contracts/oracles/price-feeds',
      ],
    },
    {
      type: 'category',
      label: 'Governance',
      items: [
        'contracts/governance/overview',
        'contracts/governance/partners/factory',
        'contracts/governance/partners/pool',
        'contracts/governance/partners/registry',
        'contracts/governance/voting/ve69lp',
        'contracts/governance/voting/boost-manager',
        'contracts/governance/voting/fee-distributor',
      ],
    },
    {
      type: 'category',
      label: 'Vault & Treasury',
      items: [
        'contracts/vault/jackpot-vault',
        'contracts/vault/jackpot-distributor',
        'contracts/vault/treasury-management',
      ],
    },
    {
      type: 'category',
      label: 'Math Libraries',
      items: [
        'contracts/math/overview',
        'contracts/math/dragon-math-lib',
        'contracts/math/hermes-math',
        'contracts/math/adaptive-fee-manager',
        'contracts/math/datetime-lib',
        'contracts/math/ve69lp-math',
        'contracts/math/voting-power-calculator',
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: [
        'contracts/config/chain-registry',
        'contracts/config/dragon-config',
        'contracts/config/deployment-settings',
      ],
    },
    {
      type: 'category',
      label: 'Utilities & Libraries',
      items: [
        'contracts/lib/access-control',
        'contracts/lib/dragon-libraries',
        'contracts/lib/security',
        'contracts/lib/utils',
      ],
    },
  ],

  // Dedicated sidebar for Integrations
  integrations: [
    'integrations/overview',
    {
      type: 'category',
      label: 'LayerZero',
      items: [
        'integrations/layerzero/overview',
        'integrations/layerzero/cross-chain-messaging',
        'integrations/layerzero/security-considerations',
        'integrations/layerzero/implementation-guide',
      ],
    },
    {
      type: 'category',
      label: 'Chainlink',
      items: [
        'integrations/chainlink/overview',
        'integrations/chainlink/vrf-integration',
        'integrations/chainlink/price-feeds',
        'integrations/chainlink/automation',
        'integrations/chainlink/best-practices',
      ],
    },
    {
      type: 'category',
      label: 'Drand',
      items: [
        'integrations/drand/overview',
        'integrations/drand/beacon-integration',
        'integrations/drand/verification',
        'integrations/drand/implementation',
      ],
    },
    {
      type: 'category',
      label: 'Partners',
      items: [
        'integrations/partners/overview',
        'integrations/partners/onboarding',
        'integrations/partners/revenue-sharing',
        'integrations/partners/technical-requirements',
      ],
    },
  ],

  // Dedicated sidebar for Reference
  reference: [
    {
      type: 'category',
      label: 'Contract ABIs',
      items: [
        'reference/abis/core-contracts',
        'reference/abis/vrf-contracts',
        'reference/abis/governance-contracts',
        'reference/abis/vault-contracts',
        'reference/abis/math-libraries',
      ],
    },
    {
      type: 'category',
      label: 'Network Addresses',
      items: [
        'reference/addresses/sonic-mainnet',
        'reference/addresses/arbitrum-mainnet',
        'reference/addresses/testnet-addresses',
        'reference/addresses/development-addresses',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'reference/api/overview',
        'reference/api/authentication',
        'reference/api/vrf-endpoints',
        'reference/api/governance-endpoints',
        'reference/api/analytics-endpoints',
        'reference/api/error-codes',
      ],
    },
    {
      type: 'category',
      label: 'SDK Documentation',
      items: [
        'reference/sdk/installation',
        'reference/sdk/quickstart',
        'reference/sdk/vrf-integration',
        'reference/sdk/governance-integration',
        'reference/sdk/examples',
      ],
    },
  ],
};

export default sidebars;

