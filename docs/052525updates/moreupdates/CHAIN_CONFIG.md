# Chain Configuration Guide

Here's the complete configuration for all chains mentioned in the project. Add this to your `hardhat.config.ts` file:

```typescript
// Network configuration
networks: {
  // Sonic mainnet
  sonic: {
    url: process.env.SONIC_URL || "https://rpc.soniclabs.com",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 146,
    gasPrice: 10000000000, // 10 gwei
  },
  
  // Sonic testnet
  "sonic-testnet": {
    url: process.env.SONIC_TESTNET_URL || "https://rpc.ankr.com/sonic_testnet",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 64165,
    gasPrice: 10000000000, // 10 gwei
  },
  
  // Ethereum mainnet
  ethereum: {
    url: process.env.ETHEREUM_URL || "https://eth.llamarpc.com",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 1,
    gasPrice: 30000000000, // 30 gwei default
    timeout: 120000 // 2 minute timeout
  },
  
  // Arbitrum One
  arbitrum: {
    url: process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 42161,
    gasPrice: 1000000000, // 1 gwei
  },
  
  // Base mainnet
  base: {
    url: process.env.BASE_URL || "https://base.llamarpc.com",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 8453,
    gasPrice: 150000000000, // 150 gwei
    timeout: 120000 // 2 minutes timeout
  },
  
  // Base Sepolia testnet
  "base-sepolia": {
    url: process.env.BASE_SEPOLIA_URL || "https://sepolia.base.org",
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    chainId: 84532,
    gasPrice: 1000000000, // 1 gwei
  },
  
  // Local development
  hardhat: {
    gas: 10000000,
    allowUnlimitedContractSize: true,
  },
  
  localhost: {
    url: "http://127.0.0.1:8545"
  }
},

// Verification configuration
etherscan: {
  apiKey: {
    // Mainnet API Keys
    sonic: process.env.SONICSCAN_API_KEY || "6CMN3IV9FZRHYFA1BPVGWCXUWCUUQG54J1",
    mainnet: process.env.ETHERSCAN_API_KEY || "",
    arbitrum: process.env.ARBISCAN_API_KEY || "",
    base: process.env.BASESCAN_API_KEY || "",
    
    // Testnet API Keys
    "sonic-testnet": process.env.SONICSCAN_TESTNET_API_KEY || process.env.SONICSCAN_API_KEY || "",
    "base-sepolia": process.env.BASESCAN_API_KEY || ""
  },
  customChains: [
    // Sonic Mainnet
    {
      network: "sonic",
      chainId: 146,
      urls: {
        apiURL: "https://api.sonicscan.org/api",
        browserURL: "https://sonicscan.org"
      }
    },
    // Sonic Testnet
    {
      network: "sonic-testnet",
      chainId: 64165,
      urls: {
        apiURL: "https://api-testnet.sonicscan.org/api",
        browserURL: "https://testnet.sonicscan.org"
      }
    },
    // Base Mainnet
    {
      network: "base",
      chainId: 8453,
      urls: {
        apiURL: "https://api.basescan.org/api",
        browserURL: "https://basescan.org"
      }
    },
    // Base Sepolia Testnet
    {
      network: "base-sepolia",
      chainId: 84532,
      urls: {
        apiURL: "https://api-sepolia.basescan.org/api",
        browserURL: "https://sepolia.basescan.org"
      }
    }
  ]
}
```

## LayerZero Endpoint Addresses

Add these to your `.env` file:

```
# LayerZero Endpoint Addresses
LZ_ENDPOINT_ETHEREUM=0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675
LZ_ENDPOINT_ARBITRUM=0x3c2269811836af69497E5F486A85D7316753cf62
LZ_ENDPOINT_BASE=0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7
LZ_ENDPOINT_SONIC=0x3c2269811836af69497E5F486A85D7316753cf62
```

## Chainlink VRF Coordinator Addresses

```
# Chainlink VRF Coordinators
VRF_COORDINATOR_ETHEREUM=0x271682DEB8C4E0901D1a1550aD2e64D568E69909
VRF_COORDINATOR_ARBITRUM=0x41034678D6C633D8a95c75e1138A360a28bA15d1
VRF_COORDINATOR_BASE=0x2D159AE3bFf04a10A355B608D22BDEC092e934fa
VRF_COORDINATOR_SONIC=0x4e2F2a1eC8AFA293A7e55243Ec4F5E9eAb42c189
```

## Note on Gas Prices

The gas prices configured above are just starting points. For production deployments, you should use a gas price oracle or service to get current gas prices, especially for Ethereum mainnet where prices fluctuate significantly.

## API Keys

Make sure to register for your own API keys at:
- [Sonic Scan](https://sonicscan.org)
- [Etherscan](https://etherscan.io/myapikey)
- [Arbiscan](https://arbiscan.io/myapikey)
- [BaseScan](https://basescan.org/myapikey)

And add them to your `.env` file:

```
SONICSCAN_API_KEY=your_sonicscan_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
ARBISCAN_API_KEY=your_arbiscan_api_key
BASESCAN_API_KEY=your_basescan_api_key
``` 