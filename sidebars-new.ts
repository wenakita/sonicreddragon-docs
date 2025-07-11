import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  "docs": [
    {
      "type": "category",
      "label": "Concepts",
      "items": [
        "concepts/overview",
        "concepts/interactive-learning",
        "concepts/architecture",
        "concepts/tokenomics",
        "concepts/jackpot-system",
        "concepts/cross-chain",
        "concepts/randomness",
        "concepts/governance",
        "concepts/security-model"
      ]
    },
    {
      "type": "category",
      "label": "Guides",
      "items": [
        {
          "type": "category",
          "label": "Getting Started",
          "items": [
            "guides/getting-started/quick-start",
            "guides/getting-started/developer-setup",
            "guides/getting-started/first-transaction"
          ]
        },
        {
          "type": "category",
          "label": "User Guides",
          "items": [
            "guides/user-guides/buying-tokens",
            "guides/user-guides/cross-chain-transfer",
            "guides/user-guides/governance-participation",
            "guides/user-guides/jackpot-participation"
          ]
        },
        {
          "type": "category",
          "label": "Developer Guides",
          "items": [
            "guides/developer-guides/integration-guide",
            "guides/developer-guides/smart-contract-interaction",
            "guides/developer-guides/building-on-omnidragon",
            "guides/developer-guides/testing-guide"
          ]
        }
      ]
    },
    {
      "type": "category",
      "label": "Build",
      "items": [
        {
          "type": "category",
          "label": "Smart Contracts",
          "items": [
            {
              "type": "category",
              "label": "Core",
              "items": [
                "build/smart-contracts/core/token",
                "build/smart-contracts/core/vault",
                "build/smart-contracts/core/bridge",
                "build/smart-contracts/core/governance"
              ]
            },
            {
              "type": "category",
              "label": "Periphery",
              "items": [
                "build/smart-contracts/periphery/randomness-provider",
                "build/smart-contracts/periphery/fee-distributor",
                "build/smart-contracts/periphery/utilities"
              ]
            }
          ]
        },
        {
          "type": "category",
          "label": "SDK",
          "items": [
            "build/sdk/overview",
            "build/sdk/examples",
            "build/sdk/api-reference"
          ]
        },
        {
          "type": "category",
          "label": "Tools",
          "items": [
            "build/tools/deployment",
            "build/tools/monitoring",
            "build/tools/testing"
          ]
        }
      ]
    },
    {
      "type": "category",
      "label": "Reference",
      "items": [
        {
          "type": "category",
          "label": "Contracts",
          "items": [
            "reference/contracts/addresses",
            "reference/contracts/abis",
            "reference/contracts/events"
          ]
        },
        {
          "type": "category",
          "label": "API",
          "items": [
            "reference/api/rest-api",
            "reference/api/graphql",
            "reference/api/websocket"
          ]
        },
        {
          "type": "category",
          "label": "Networks",
          "items": [
            "reference/networks/ethereum",
            "reference/networks/arbitrum",
            "reference/networks/avalanche",
            "reference/networks/bsc"
          ]
        }
      ]
    },
    {
      "type": "category",
      "label": "Partner",
      "items": [
        {
          "type": "category",
          "label": "Onboarding",
          "items": [
            "partner/onboarding/overview",
            "partner/onboarding/integration-checklist",
            "partner/onboarding/support"
          ]
        },
        {
          "type": "category",
          "label": "Integrations",
          "items": [
            "partner/integrations/dex-aggregators",
            "partner/integrations/wallets",
            "partner/integrations/dapps",
            "partner/integrations/exchanges"
          ]
        },
        {
          "type": "category",
          "label": "Case Studies",
          "items": [
            "partner/case-studies/layerzero",
            "partner/case-studies/chainlink",
            "partner/case-studies/drand"
          ]
        }
      ]
    },
    {
      "type": "category",
      "label": "Resources",
      "items": [
        {
          "type": "category",
          "label": "Security",
          "items": [
            "resources/security/audits",
            "resources/security/bug-bounty",
            "resources/security/best-practices"
          ]
        },
        {
          "type": "category",
          "label": "Community",
          "items": [
            "resources/community/governance",
            "resources/community/forums",
            "resources/community/social"
          ]
        },
        {
          "type": "category",
          "label": "Legal",
          "items": [
            "resources/legal/terms",
            "resources/legal/privacy",
            "resources/legal/compliance"
          ]
        }
      ]
    }
  ]
};

export default sidebars;
