# Sonic VRF System Deployment Guide

## Overview
The OmniDragon VRF system provides verifiable randomness using both Drand (free) and Chainlink VRF 2.5 (premium) sources. With the LayerZero endpoint now configured, we're one step closer to deployment.

## Architecture
- **Sonic Chain**: Hosts the main RandomnessProvider, DrandVRFIntegrator, and ChainlinkVRFIntegrator
- **Arbitrum Chain**: Hosts the OmniDragonVRFRequester for Chainlink VRF 2.5
- **LayerZero**: Enables cross-chain messaging between Sonic and Arbitrum

## Updated Configuration

### Sonic Mainnet
- Chain ID: `146`
- LayerZero Endpoint V2: `0x6F475642a6e85809B1c36Fa62763669b1b48DD5B`
- LayerZero Chain ID: `332` (eid 30332)
- Native Token: S

### Arbitrum Mainnet
- Chain ID: `42161`
- LayerZero Endpoint V2: `0x1a44076050125825900e736c501f859c50fE728c`
- LayerZero Chain ID: `110` (eid 30110)
- VRF Coordinator: `0x3C0Ca683b403E37668AE3DC4FB62F4B29B6f7a3e`

## Pre-Deployment Checklist

### ⚠️ CRITICAL REQUIREMENTS
1. **Security Audit** ❌ NOT COMPLETED
   - Contract audit by reputable firm (Certik, Trail of Bits, OpenZeppelin)
   - Estimated cost: $50,000 - $100,000
   - Timeline: 2-4 weeks

2. **Chainlink VRF Subscription** ✅ CREATED
   - Subscription ID: 65914062761074472397678945586748169687979388122746586980459153805795126649565
   - VRF Coordinator: 0x3C0Ca683b403E37668AE3DC4FB62F4B29B6f7a3e
   - Key Hash: 0x8472ba59cf7134dfe321f4d61a430c4857e8b19cdd5230b09952a92671c24409
   - ⚠️ Remember to add your VRF Requester as consumer after deployment

3. **Wallet Funding** ✅ FUNDED
   - Sonic wallet: Funded with S tokens
   - Arbitrum wallet: Funded with ETH
   - LINK subscription: Has sufficient balance

4. **Testnet Testing** ❌ NOT TESTED
   - Deploy to Sonic testnet first
   - Verify cross-chain messaging works
   - Test both Drand and Chainlink randomness

## Deployment Steps

### Step 1: Local Testing (Safe)
```bash
# Start local fork
anvil --fork-url https://rpc.soniclabs.com

# Deploy locally
forge script script/DeployVRFSystem.s.sol:DeployVRFSystem \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  -vvv
```

### Step 2: Testnet Deployment (Recommended Next Step)
```bash
# Set environment variables
export PRIVATE_KEY=<your-testnet-private-key>
export SONIC_RPC_URL=<sonic-testnet-rpc>
export ARBITRUM_RPC_URL=<arbitrum-testnet-rpc>

# Deploy to Sonic testnet
forge script script/DeployVRFSystem.s.sol:DeployVRFSystem \
  --rpc-url $SONIC_RPC_URL \
  --broadcast \
  --verify \
  -vvv

# Deploy to Arbitrum testnet
forge script script/DeployVRFSystem.s.sol:DeployVRFSystem \
  --rpc-url $ARBITRUM_RPC_URL \
  --broadcast \
  --verify \
  -vvv
```

### Step 3: Mainnet Deployment (Only After Audit)
```bash
# STOP! Have you completed the security audit?
# STOP! Have you tested on testnet?
# STOP! Do you have a funded Chainlink subscription?

# If yes to all above, proceed:

# Deploy to Sonic mainnet
forge script script/DeployVRFSystem.s.sol:DeployVRFSystem \
  --rpc-url https://rpc.soniclabs.com \
  --broadcast \
  --verify \
  --slow \
  -vvv

# Deploy to Arbitrum mainnet
forge script script/DeployVRFSystem.s.sol:DeployVRFSystem \
  --rpc-url https://arb1.arbitrum.io/rpc \
  --broadcast \
  --verify \
  --slow \
  -vvv
```

### Step 4: Post-Deployment Configuration
```bash
# Configure the VRF system
forge script script/DeployVRFSystem.s.sol:ConfigureVRFSystem \
  --rpc-url https://rpc.soniclabs.com \
  --broadcast \
  -vvv
```

## Cost Estimates

### Deployment Costs
- Sonic deployment: ~10 S tokens
- Arbitrum deployment: ~0.05 ETH
- LayerZero configuration: ~5 S tokens

### Operational Costs
- Drand randomness: FREE
- Chainlink VRF: ~$3-5 per request
- LayerZero messaging: ~$0.10 per message

## Security Considerations

1. **Access Control**
   - Use multi-sig wallet for owner functions
   - Implement timelock for critical changes
   - Regular security monitoring

2. **Cross-Chain Security**
   - Verify LayerZero trusted remotes
   - Monitor for unusual cross-chain activity
   - Have emergency pause mechanisms

3. **Randomness Security**
   - Never use on-chain sources alone
   - Implement request/fulfill pattern
   - Add cooldown periods for high-value operations

## Support and Resources

- Sonic Docs: https://docs.soniclabs.com
- LayerZero Docs: https://docs.layerzero.network/v2
- Chainlink VRF: https://docs.chain.link/vrf/v2-5/introduction
- Drand: https://drand.love

## Emergency Contacts

- Sonic Support: Discord/Telegram
- LayerZero Support: https://layerzero.network/support
- Chainlink Support: https://chain.link/contact

## Next Steps

1. **Immediate**: Start security audit process
2. **This Week**: Deploy to testnet for testing
3. **Next Month**: Complete audit and prepare mainnet deployment
4. **Future**: Implement additional VRF sources (API3, Pyth Entropy) 