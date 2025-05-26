# OmniDragon VRF System Threat Model

## 1. System Overview

The OmniDragon VRF system operates across two blockchains (Sonic and Arbitrum) using LayerZero for cross-chain messaging. This distributed architecture introduces unique attack vectors that must be carefully considered.

## 2. Assets at Risk

### Primary Assets
1. **Random Number Integrity**: The core value proposition
2. **User Funds**: ETH, S tokens, LINK tokens
3. **System Availability**: Continuous randomness service
4. **Protocol Reputation**: Trust in fairness

### Secondary Assets
1. **Gas Fees**: Cross-chain messaging costs
2. **Subscription Balance**: LINK tokens for Chainlink VRF
3. **Configuration Data**: Trusted remotes, authorized consumers

## 3. Threat Actors

### External Threats
1. **Malicious Users**: Attempting to predict or manipulate randomness
2. **MEV Bots**: Front-running randomness requests
3. **Competitors**: Attempting to disrupt service
4. **Hackers**: Seeking to exploit vulnerabilities for profit

### Internal Threats
1. **Compromised Owner**: Malicious contract owner
2. **Rogue Integrator**: Compromised VRF source
3. **Insider Knowledge**: Team members with system knowledge

## 4. Attack Vectors and Mitigations

### 4.1 Randomness Manipulation

#### Attack: Predictable Randomness
- **Vector**: Using on-chain data (block.timestamp, block.number) for entropy
- **Impact**: HIGH - Complete compromise of randomness
- **Likelihood**: LOW - Current implementation uses external sources
- **Mitigation**: 
  - ✓ Use only external VRF sources (Chainlink, Drand)
  - ✓ Never use blockchain state for entropy
  - ✓ Multiple entropy source aggregation

#### Attack: Biased Randomness from Drand
- **Vector**: Compromised Drand beacon or network
- **Impact**: MEDIUM - Partial randomness compromise
- **Likelihood**: LOW - Drand uses threshold cryptography
- **Mitigation**:
  - ✓ Aggregate multiple Drand networks
  - ✓ Weighted distribution across sources
  - ✓ Fallback to Chainlink if suspicious patterns detected

### 4.2 Cross-Chain Vulnerabilities

#### Attack: LayerZero Message Spoofing
- **Vector**: Fake cross-chain messages claiming to be from trusted remote
- **Impact**: CRITICAL - Complete system compromise
- **Likelihood**: LOW - LayerZero has authentication
- **Mitigation**:
  ```solidity
  require(msg.sender == address(lzEndpoint), "Invalid endpoint");
  require(_srcChainId == trustedChainId, "Invalid source chain");
  require(keccak256(_srcAddress) == keccak256(trustedRemote), "Invalid source");
  ```

#### Attack: Cross-Chain Replay
- **Vector**: Replaying old randomness responses
- **Impact**: HIGH - Predictable randomness
- **Likelihood**: MEDIUM - Without proper nonce handling
- **Mitigation**:
  - ✓ Nonce-based message tracking
  - ✓ Request ID validation
  - ✓ Timestamp checks

### 4.3 Economic Attacks

#### Attack: Griefing via High Gas Consumption
- **Vector**: Requesting randomness with callback that consumes excessive gas
- **Impact**: MEDIUM - Temporary DoS, fund drainage
- **Likelihood**: MEDIUM - Easy to attempt
- **Mitigation**:
  - ✓ Gas limit on callbacks (500,000)
  - ✓ Separate fulfillment transaction
  - ✓ Consumer pays for their own gas

#### Attack: Subscription Drainage
- **Vector**: Spam requests to drain LINK balance
- **Impact**: HIGH - Service disruption
- **Likelihood**: MEDIUM - Requires authorized access
- **Mitigation**:
  - ✓ Rate limiting per consumer
  - ✓ Minimum balance requirements
  - ✓ Automatic fallback to Drand

### 4.4 Front-Running Attacks

#### Attack: Request Front-Running
- **Vector**: MEV bot sees randomness request and places bet before fulfillment
- **Impact**: HIGH - Unfair advantage in games
- **Likelihood**: HIGH - Common in DeFi
- **Mitigation**:
  - ✓ Commit-reveal pattern for sensitive operations
  - ✓ Request IDs prevent correlation
  - ✓ Delayed fulfillment pattern

#### Attack: Fulfillment Front-Running
- **Vector**: MEV bot sees randomness result and acts before consumer
- **Impact**: MEDIUM - Depends on consumer implementation
- **Likelihood**: MEDIUM - Requires specific conditions
- **Mitigation**:
  - ✓ Direct callback to consumer
  - ✓ Consumer must handle in same transaction
  - ✓ Time-locked reveals

### 4.5 Access Control Exploits

#### Attack: Unauthorized Consumer
- **Vector**: Non-whitelisted address requesting randomness
- **Impact**: LOW - Waste of resources
- **Likelihood**: HIGH - Easy to attempt
- **Mitigation**:
  ```solidity
  modifier onlyAuthorizedConsumer() {
      require(authorizedConsumers[msg.sender], "Unauthorized");
      _;
  }
  ```

#### Attack: Owner Privilege Abuse
- **Vector**: Compromised owner key modifying critical settings
- **Impact**: CRITICAL - Complete system compromise
- **Likelihood**: LOW - Requires key compromise
- **Mitigation**:
  - ⚠️ Multi-sig wallet for owner (RECOMMENDED)
  - ⚠️ Timelock for critical changes (RECOMMENDED)
  - ✓ Event emission for all admin actions

### 4.6 Denial of Service

#### Attack: Bucket Exhaustion
- **Vector**: Rapidly consuming all pre-generated randomness
- **Impact**: LOW - Temporary unavailability
- **Likelihood**: MEDIUM - Easy to execute
- **Mitigation**:
  - ✓ Rate limiting per address
  - ✓ Automatic refill mechanism
  - ✓ Fallback to direct requests

#### Attack: Request Flooding
- **Vector**: Creating many pending requests
- **Impact**: MEDIUM - Gas cost increase, slower processing
- **Likelihood**: MEDIUM - Requires funds
- **Mitigation**:
  - ✓ Request timeout (24 hours)
  - ✓ Maximum pending requests per consumer
  - ✓ Increasing cost per request

### 4.7 Smart Contract Vulnerabilities

#### Attack: Reentrancy in Payment Functions
- **Vector**: Callback during payment processing
- **Impact**: HIGH - Fund theft
- **Likelihood**: LOW - Standard protection applied
- **Mitigation**:
  - ✓ ReentrancyGuard on all payment functions
  - ✓ Checks-Effects-Interactions pattern
  - ✓ Pull payment pattern where applicable

#### Attack: Integer Overflow in Aggregation
- **Vector**: Overflow when mixing multiple randomness sources
- **Impact**: HIGH - Predictable randomness
- **Likelihood**: LOW - Solidity 0.8+ has built-in checks
- **Mitigation**:
  - ✓ Solidity 0.8.20 automatic overflow protection
  - ✓ Explicit checks in critical calculations
  - ✓ Bounded input ranges

## 5. Risk Matrix

| Threat | Impact | Likelihood | Risk Level | Mitigation Status |
|--------|---------|------------|------------|-------------------|
| LayerZero Message Spoofing | CRITICAL | LOW | HIGH | ✓ Mitigated |
| Randomness Manipulation | HIGH | LOW | MEDIUM | ✓ Mitigated |
| Front-Running | HIGH | HIGH | HIGH | ✓ Mitigated |
| Owner Privilege Abuse | CRITICAL | LOW | MEDIUM | ⚠️ Partial |
| Subscription Drainage | HIGH | MEDIUM | HIGH | ✓ Mitigated |
| Reentrancy | HIGH | LOW | MEDIUM | ✓ Mitigated |

## 6. Security Assumptions

1. **LayerZero Protocol Security**: Assumes LayerZero's messaging is secure
2. **Chainlink VRF Integrity**: Trusts Chainlink's randomness generation
3. **Drand Beacon Reliability**: Assumes threshold cryptography is unbroken
4. **Owner Responsibility**: Assumes owner acts in good faith
5. **Consumer Implementation**: Assumes consumers handle callbacks correctly

## 7. Recommendations for Auditors

### High Priority
1. Verify cross-chain message authentication
2. Test randomness unpredictability
3. Check for reentrancy in all external functions
4. Validate access control implementation

### Medium Priority
1. Review gas optimization for griefing resistance
2. Test edge cases in bucket/pool systems
3. Verify timeout and cleanup mechanisms
4. Check event emission completeness

### Low Priority
1. Code style and documentation
2. Gas optimization opportunities
3. Future upgrade paths

## 8. Incident Response Plan

### Detection
- Monitor for unusual request patterns
- Track gas consumption anomalies
- Watch for repeated failed transactions
- Alert on admin function usage

### Response
1. **Immediate**: Pause affected components
2. **Assessment**: Identify attack vector
3. **Mitigation**: Deploy fixes or configuration changes
4. **Recovery**: Resume normal operations
5. **Post-Mortem**: Document and improve

### Communication
- Security email: security@omnidragon.xyz
- Bug bounty: via Immunefi
- Public disclosure: 90 days after fix

## 9. Future Security Enhancements

1. **Multi-Signature Wallet**: For owner functions
2. **Timelock Contract**: For configuration changes
3. **Circuit Breakers**: Automatic pause on anomalies
4. **Decentralized Governance**: Remove single points of failure
5. **Additional VRF Sources**: Further redundancy

## 10. Conclusion

The OmniDragon VRF system has implemented comprehensive security measures for most identified threats. The primary remaining risks involve centralized control points (owner privileges) and reliance on external protocols. Regular security reviews and the planned enhancements will further strengthen the system's security posture. 