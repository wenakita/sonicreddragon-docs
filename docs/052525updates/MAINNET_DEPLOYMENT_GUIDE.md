# 🚀 OmniDragon VRF System - Mainnet Deployment Guide

## ⚠️ **CRITICAL WARNINGS**

1. **THIS IS FOR MAINNET** - Real money is at stake
2. **NEVER SKIP TESTNET** - Test everything first
3. **GET AN AUDIT** - Professional security review required
4. **USE MULTI-SIG** - Admin functions should use multi-signature wallets
5. **HAVE EMERGENCY PLANS** - Know how to pause/upgrade if needed

## 📋 **Pre-Deployment Checklist**

### **Financial Requirements**
- [ ] **100+ LINK tokens** on Arbitrum for Chainlink VRF subscription
- [ ] **10+ $S tokens** on Sonic for LayerZero fees
- [ ] **ETH on Arbitrum** for deployment gas
- [ ] **$S on Sonic** for deployment gas
- [ ] **Emergency fund** for unexpected costs

### **Technical Requirements**
- [ ] Contracts audited by reputable firm
- [ ] All `console.log` statements removed
- [ ] Gas optimization completed
- [ ] Deployment tested on testnet
- [ ] Monitoring infrastructure ready

### **Operational Requirements**
- [ ] Multi-sig wallets configured
- [ ] Team trained on emergency procedures
- [ ] Legal compliance verified
- [ ] Insurance/coverage arranged

## 🔧 **Step 1: Environment Setup**

```bash
# Clone and setup
git clone https://github.com/your-org/omnidragon.git
cd omnidragon

# Install dependencies
npm install
forge install

# Copy environment file
cp .env.mainnet.example .env.mainnet

# Edit .env.mainnet with your values
# ⚠️ NEVER commit this file!
```

## 🔗 **Step 2: Create Chainlink VRF Subscription**

1. Go to https://vrf.chain.link/arbitrum
2. Connect wallet with 100+ LINK
3. Create new subscription
4. Fund with LINK tokens
5. Copy subscription ID to `.env.mainnet`

## 🚀 **Step 3: Deploy to Sonic Mainnet**

```bash
# Load environment
source .env.mainnet

# Deploy to Sonic
forge script script/DeployVRFSystem.s.sol \
  --rpc-url $SONIC_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --verifier-url $SONIC_EXPLORER_URL \
  --etherscan-api-key $SONIC_EXPLORER_API_KEY \
  -vvvv

# Save the deployed addresses!
```

**Expected Output:**
- `RandomnessProvider`: 0x...
- `DrandIntegrator`: 0x...
- `ChainlinkIntegrator`: 0x...

## 🌉 **Step 4: Deploy to Arbitrum Mainnet**

```bash
# Update SONIC_CHAINLINK_INTEGRATOR in .env.mainnet with address from Step 3

# Deploy to Arbitrum
forge script script/DeployVRFSystem.s.sol \
  --rpc-url $ARBITRUM_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --verifier-url https://api.arbiscan.io/api \
  --etherscan-api-key $ARBISCAN_API_KEY \
  -vvvv
```

**Expected Output:**
- `VRFRequester`: 0x...

## 🔐 **Step 5: Configure Cross-Chain Communication**

```bash
# Run configuration script
forge script script/DeployVRFSystem.s.sol:ConfigureVRFSystem \
  --rpc-url $SONIC_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  -vvvv
```

## ✅ **Step 6: Post-Deployment Configuration**

### **On Arbitrum:**
1. Add VRF Requester to Chainlink subscription
2. Verify consumer is authorized
3. Check LINK balance

### **On Sonic:**
1. Transfer ownership to multi-sig
2. Set authorized consumers
3. Fund with $S for operations

## 🧪 **Step 7: Mainnet Testing**

### **Test 1: Drand Randomness**
```javascript
// Test free randomness
const tx = await randomnessProvider.drawRandomnessFromBucket();
console.log("Drand randomness:", tx);
```

### **Test 2: Chainlink VRF (Small Amount)**
```javascript
// Test premium randomness with minimal funds
const tx = await randomnessProvider.requestRandomness();
console.log("Chainlink request:", tx);
```

### **Test 3: Fallback Mechanism**
```javascript
// Temporarily disable Chainlink and test fallback
// DO THIS CAREFULLY!
```

## 📊 **Step 8: Monitoring Setup**

### **Set up alerts for:**
- Low LINK balance (<10 LINK)
- Low $S balance for LayerZero
- Failed VRF requests
- Unusual gas consumption
- Contract pauses/errors

### **Recommended Tools:**
- Tenderly for real-time monitoring
- OpenZeppelin Defender for automation
- Custom Grafana dashboards

## 🚨 **Emergency Procedures**

### **If Something Goes Wrong:**

1. **PAUSE IMMEDIATELY**
   ```javascript
   await randomnessProvider.pause(); // If pausable
   ```

2. **Assess the situation**
   - Check transaction logs
   - Review error messages
   - Determine fund safety

3. **Communicate**
   - Notify team immediately
   - Prepare public statement if needed
   - Contact security partners

4. **Recovery Plan**
   - Fix identified issues
   - Test fixes on fork
   - Deploy fixes via timelock/multi-sig

## 📝 **Final Checklist**

- [ ] All contracts verified on block explorers
- [ ] Ownership transferred to multi-sig
- [ ] Emergency contacts documented
- [ ] Monitoring active
- [ ] Team briefed on procedures
- [ ] Initial small-scale test successful
- [ ] Public documentation ready
- [ ] Legal compliance confirmed

## 🎯 **Go-Live Steps**

1. **Soft Launch** (Week 1)
   - Limited users
   - Small lottery amounts
   - Close monitoring

2. **Beta Phase** (Weeks 2-4)
   - Gradual increase in limits
   - Community feedback
   - Performance optimization

3. **Full Launch** (Week 5+)
   - Remove limits
   - Marketing campaign
   - Full feature activation

## 💡 **Important Reminders**

- **NEVER** deploy directly to mainnet without testnet validation
- **ALWAYS** have sufficient funds for operations + emergency
- **MONITOR** continuously for the first 48 hours
- **DOCUMENT** every step and decision
- **BACKUP** all deployment artifacts

---

**🚨 This is a HIGH-RISK operation. Proceed with extreme caution! 🚨**

For support, contact: security@omnidragon.com 