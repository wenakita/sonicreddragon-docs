# VRF & Randomness Overview

The OmniDragon VRF system provides secure, verifiable randomness through multiple sources with automatic failover mechanisms. This system powers the lottery, gaming applications, and any protocol requiring cryptographically secure random numbers.

## Architecture Overview

<div className="mermaid-container">
  <div className="mermaid-controls">
    <button className="mermaid-btn">Zoom In</button>
    <button className="mermaid-btn">Zoom Out</button>
    <button className="mermaid-btn">Reset View</button>
    <button className="mermaid-btn">Replay</button>
  </div>

```mermaid
%%{init: {
  'theme': 'dark',
  'themeVariables': {
    'primaryColor': '#7c3aed',
    'primaryTextColor': '#f8fafc',
    'primaryBorderColor': '#6d28d9',
    'lineColor': '#64748b',
    'secondaryColor': '#1e293b',
    'tertiaryColor': '#0f172a',
    'background': '#0f172a',
    'mainBkg': '#1e293b',
    'secondBkg': '#334155',
    'tertiaryBkg': '#475569'
  },
  'flowchart': {
    'curve': 'cardinal',
    'nodeSpacing': 60,
    'rankSpacing': 100,
    'padding': 25
  }
}}%%
graph TB
    subgraph "Central Randomness Hub"
        RP["Randomness Provider<br/>Multi-Source Orchestrator<br/>Request Management<br/>Access Control"]
    end
    
    subgraph "Cost Optimization"
        BS["Bucket System<br/>Cost-Efficient Batching<br/>1000 Numbers per Seed<br/>1-Hour Refill Cycle"]
        PS["Randomness Pool<br/>Pre-Generated Numbers<br/>30-Minute Refresh<br/>Instant Access"]
    end
    
    subgraph "VRF Sources"
        CL["Chainlink VRF 2.5<br/>Arbitrum → Sonic<br/>Maximum Security<br/>~30s Latency"]
        DR["Drand Networks<br/>Distributed Beacons<br/>Free Access<br/>&lt;1s Latency"]
    end
    
    subgraph "Consumer Applications"
        LM["Lottery Manager<br/>Entry Processing<br/>Winner Selection"]
        GA["Gaming Contracts<br/>Random Events<br/>Fair Play"]
        DF["DeFi Protocols<br/>Random Sampling<br/>Fair Distribution"]
    end
    
    RP --> BS
    RP --> PS
    RP --> CL
    RP --> DR
    
    BS --> LM
    PS --> GA
    CL --> RP
    DR --> RP
    
    RP --> LM
    RP --> GA
    RP --> DF
    
    classDef central fill:#7c3aed,stroke:#6d28d9,color:#f8fafc
    classDef optimization fill:#2563eb,stroke:#1e40af,color:#f8fafc
    classDef vrf fill:#059669,stroke:#047857,color:#f8fafc
    classDef consumer fill:#ea580c,stroke:#c2410c,color:#f8fafc
    
    class RP central
    class BS,PS optimization
    class CL,DR vrf
    class LM,GA,DF consumer
```
</div>

## VRF Sources

<div className="mermaid-container">
  <div className="mermaid-controls">
    <button className="mermaid-btn">Animate Sources</button>
  </div>

```mermaid
%%{init: {
  'theme': 'dark',
  'themeVariables': {
    'primaryColor': '#059669',
    'primaryTextColor': '#f8fafc',
    'lineColor': '#64748b',
    'tertiaryColor': '#0f172a'
  },
  'flowchart': {
    'curve': 'basis',
    'nodeSpacing': 80,
    'rankSpacing': 120
  }
}}%%
graph LR
    subgraph "Primary Source"
        CL["Chainlink VRF 2.5<br/>Location: Arbitrum Mainnet<br/>Access: LayerZero Cross-Chain<br/>Security: Industry Standard<br/>Cost: Higher Cost<br/>Latency: ~30 seconds"]
    end
    
    subgraph "Secondary Sources"
        LE["League of Entropy<br/>Location: Global Network<br/>Access: Direct Query<br/>Security: Distributed Trust<br/>Cost: Free<br/>Latency: Near-Instant"]
        
        QN["Quicknet<br/>Location: Fast Network<br/>Access: 3-Second Rounds<br/>Security: High<br/>Cost: Free<br/>Latency: ~3 seconds"]
        
        EN["EVMnet<br/>Location: EVM-Optimized<br/>Access: Direct Integration<br/>Security: Medium-High<br/>Cost: Free<br/>Latency: ~5 seconds"]
    end
    
    CL --> LE
    LE --> QN
    QN --> EN
    
    classDef primary fill:#dc2626,stroke:#b91c1c,color:#f8fafc
    classDef secondary fill:#059669,stroke:#047857,color:#f8fafc
    
    class CL primary
    class LE,QN,EN secondary
```
</div>

### Primary: Chainlink VRF 2.5
- **Location**: Arbitrum mainnet
- **Access**: Via LayerZero cross-chain messaging
- **Security**: Industry-standard cryptographic verification
- **Cost**: Higher cost, maximum security
- **Latency**: ~30 seconds (cross-chain)

### Secondary: Drand Networks
- **League of Entropy**: Main beacon network
- **Quicknet**: Fast randomness (3-second rounds)
- **EVMnet**: EVM-optimized randomness
- **Security**: Distributed trust model
- **Cost**: Free (only gas costs)
- **Latency**: Near-instant

## Cost Optimization Systems

<div className="mermaid-container">
  <div className="mermaid-controls">
    <button className="mermaid-btn">Zoom In</button>
    <button className="mermaid-btn">Replay</button>
  </div>

```mermaid
%%{init: {
  'theme': 'dark',
  'themeVariables': {
    'primaryColor': '#2563eb',
    'primaryTextColor': '#f8fafc',
    'lineColor': '#64748b',
    'tertiaryColor': '#0f172a'
  },
  'flowchart': {
    'curve': 'basis',
    'nodeSpacing': 70,
    'rankSpacing': 90
  }
}}%%
graph TD
    subgraph "Bucket System"
        B1["VRF Seed<br/>Cryptographically Secure"]
        B2["Nonce Counter<br/>Unique Generation"]
        B3["1000 Numbers<br/>Per Bucket"]
        B4["Refill at 100<br/>Remaining"]
    end
    
    subgraph "Pool System"
        P1["Pre-Generated Pool<br/>1000 Random Numbers"]
        P2["Current Index<br/>Draw Position"]
        P3["30-Minute Refresh<br/>Automatic Update"]
        P4["Instant Access<br/>No Wait Time"]
    end
    
    subgraph "Cost Benefits"
        C1["High-Frequency Use<br/>~50k Gas per Draw"]
        C2["Protocol Funded<br/>No Consumer Cost"]
        C3["Instant Delivery<br/>No VRF Wait"]
        C4["Automatic Refill<br/>Seamless Operation"]
    end
    
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> C1
    
    P1 --> P2
    P2 --> P3
    P3 --> P4
    P4 --> C2
    
    C1 --> C3
    C2 --> C4
    
    classDef bucket fill:#2563eb,stroke:#1e40af,color:#f8fafc
    classDef pool fill:#ea580c,stroke:#c2410c,color:#f8fafc
    classDef cost fill:#65a30d,stroke:#4d7c0f,color:#f8fafc
    
    class B1,B2,B3,B4 bucket
    class P1,P2,P3,P4 pool
    class C1,C2,C3,C4 cost
```
</div>

### Bucket System
- **Purpose**: Cost-efficient randomness for high-frequency requests
- **Capacity**: 1000 random numbers per VRF seed
- **Refill**: Automatic when < 100 numbers remain
- **Use Case**: Gaming, frequent lottery entries

### Randomness Pool
- **Purpose**: Pre-generated randomness for instant access
- **Size**: 1000 pre-computed numbers
- **Refresh**: Every 30 minutes or when depleted
- **Use Case**: Immediate randomness needs

## Integration Patterns

<div className="mermaid-container">
  <div className="mermaid-controls">
    <button className="mermaid-btn">Show Patterns</button>
  </div>

```mermaid
%%{init: {
  'theme': 'dark',
  'themeVariables': {
    'primaryColor': '#1e40af',
    'primaryTextColor': '#f8fafc',
    'lineColor': '#64748b'
  },
  'flowchart': {
    'curve': 'cardinal',
    'nodeSpacing': 60,
    'rankSpacing': 80
  }
}}%%
graph TB
    subgraph "High-Security Applications"
        HS1["Financial Protocols<br/>Large Value Transactions"]
        HS2["Major Lottery Draws<br/>Jackpot Distributions"]
        HS3["Tournament Finals<br/>Championship Events"]
    end
    
    subgraph "High-Frequency Applications"
        HF1["Gaming Mechanics<br/>Real-Time Events"]
        HF2["Mini-Games<br/>Quick Interactions"]
        HF3["Sampling Systems<br/>Data Selection"]
    end
    
    subgraph "Immediate Needs"
        IN1["UI Randomization<br/>Visual Effects"]
        IN2["Content Shuffling<br/>User Experience"]
        IN3["Playlist Generation<br/>Music Selection"]
    end
    
    subgraph "Integration Methods"
        M1["Individual VRF Request<br/>requestRandomness()"]
        M2["Bucket System Draw<br/>drawRandomnessFromBucket()"]
        M3["Pool Access<br/>getAggregatedRandomness()"]
    end
    
    HS1 --> M1
    HS2 --> M1
    HS3 --> M1
    
    HF1 --> M2
    HF2 --> M2
    HF3 --> M2
    
    IN1 --> M3
    IN2 --> M3
    IN3 --> M3
    
    classDef highSec fill:#dc2626,stroke:#b91c1c,color:#f8fafc
    classDef highFreq fill:#059669,stroke:#047857,color:#f8fafc
    classDef immediate fill:#ea580c,stroke:#c2410c,color:#f8fafc
    classDef method fill:#7c3aed,stroke:#6d28d9,color:#f8fafc
    
    class HS1,HS2,HS3 highSec
    class HF1,HF2,HF3 highFreq
    class IN1,IN2,IN3 immediate
    class M1,M2,M3 method
```
</div>

### For High-Security Applications
```solidity
// Request individual VRF for maximum security
uint256 requestId = randomnessProvider.requestRandomness();
```

### For High-Frequency Applications
```solidity
// Use bucket system for cost efficiency
uint256 randomness = randomnessProvider.drawRandomnessFromBucket();
```

### For Immediate Needs
```solidity
// Get aggregated randomness instantly
uint256 randomness = randomnessProvider.getAggregatedRandomness();
```

## Security Features

<div className="mermaid-container">
  <div className="mermaid-controls">
    <button className="mermaid-btn">Zoom In</button>
    <button className="mermaid-btn">Replay</button>
  </div>

```mermaid
%%{init: {
  'theme': 'dark',
  'themeVariables': {
    'primaryColor': '#be185d',
    'primaryTextColor': '#f8fafc',
    'lineColor': '#64748b'
  }
}}%%
graph TB
    subgraph "Multi-Source Verification"
        MS1["Automatic Failover<br/>Between VRF Sources"]
        MS2["Aggregated Randomness<br/>Multiple Drand Networks"]
        MS3["Cryptographic Verification<br/>Each Step Validated"]
    end
    
    subgraph "Access Control"
        AC1["Authorized Consumers<br/>Only Approved Contracts"]
        AC2["Rate Limiting<br/>Abuse Prevention"]
        AC3["Emergency Pause<br/>System Protection"]
    end
    
    subgraph "MEV Protection"
        MEV1["Commit-Reveal Schemes<br/>Sensitive Operations"]
        MEV2["Block-Based Expiry<br/>Commitment Timeout"]
        MEV3["Multiple Commitments<br/>Per User Support"]
    end
    
    MS1 --> AC1
    MS2 --> AC2
    MS3 --> AC3
    
    AC1 --> MEV1
    AC2 --> MEV2
    AC3 --> MEV3
    
    classDef multiSource fill:#059669,stroke:#047857,color:#f8fafc
    classDef accessControl fill:#7c3aed,stroke:#6d28d9,color:#f8fafc
    classDef mevProtection fill:#be185d,stroke:#9d174d,color:#f8fafc
    
    class MS1,MS2,MS3 multiSource
    class AC1,AC2,AC3 accessControl
    class MEV1,MEV2,MEV3 mevProtection
```
</div>

### Multi-Source Verification
- Automatic failover between VRF sources
- Aggregated randomness from multiple Drand networks
- Cryptographic verification at each step

### Access Control
- Only authorized consumers can request randomness
- Rate limiting and abuse prevention
- Emergency pause mechanisms

### MEV Protection
- Commit-reveal schemes for sensitive operations
- Block-based commitment expiry
- Multiple commitment support per user

## Performance Metrics

<div className="mermaid-container">
  <div className="mermaid-controls">
    <button className="mermaid-btn">Show Performance</button>
  </div>

```mermaid
%%{init: {
  'theme': 'dark',
  'themeVariables': {
    'primaryColor': '#1d4ed8',
    'primaryTextColor': '#f8fafc',
    'lineColor': '#64748b',
    'tertiaryColor': '#0f172a'
  },
  'xyChart': {
    'width': 800,
    'height': 500
  }
}}%%
xychart-beta
    title "VRF Method Performance Comparison"
    x-axis ["Cost Score", "Latency Score", "Security Score", "Throughput Score"]
    y-axis "Performance Rating" 0 --> 10
    bar [2, 2, 10, 3]
    bar [8, 9, 8, 8]
    bar [9, 10, 6, 9]
    bar [10, 10, 6, 10]
```
</div>

| Method | Cost | Latency | Security | Use Case |
|--------|------|---------|----------|----------|
| **Chainlink VRF** | High | ~30s | Maximum | Critical applications |
| **Drand Aggregated** | Low | &lt;1s | High | General purpose |
| **Bucket Draw** | Very Low | &lt;1s | Medium | High-frequency |
| **Pool Access** | Minimal | Instant | Medium | Immediate needs |

## Contract Addresses

### Sonic Mainnet
- **Randomness Provider**: `[TO_BE_DEPLOYED]`
- **Chainlink Integrator**: `[TO_BE_DEPLOYED]`
- **Drand Integrators**: `[TO_BE_DEPLOYED]`

### Arbitrum Mainnet
- **VRF Requester**: `[TO_BE_DEPLOYED]`
- **VRF Coordinator**: `0x3C0Ca683b403E37668AE3DC4FB62F4B29B6f7a3e`

## Best Practices

<div className="mermaid-container">
  <div className="mermaid-controls">
    <button className="mermaid-btn">Show Practices</button>
  </div>

```mermaid
%%{init: {
  'theme': 'dark',
  'themeVariables': {
    'primaryColor': '#65a30d',
    'primaryTextColor': '#f8fafc',
    'lineColor': '#64748b'
  }
}}%%
mindmap
  root((Best Practices))
    For Developers
      Choose Appropriate Source
        Security Requirements
        Cost Considerations
        Latency Needs
      Implement Validation
        Callback Verification
        Request ID Matching
        Error Handling
      Handle Edge Cases
        Bucket Empty Scenarios
        Pool Refresh States
        VRF Timeouts
      MEV Protection
        Commit-Reveal Patterns
        Timing Considerations
        Multiple Commitments
    For Operators
      Monitor Health
        VRF Source Status
        Funding Levels
        Success Rates
      Setup Automation
        Drand Collection
        Pool Refresh
        Bucket Refills
      Maintain Access
        Consumer Authorization
        Rate Limit Tuning
        Emergency Procedures
```
</div>

### For Developers
1. **Choose appropriate randomness source** based on security needs
2. **Implement proper callback validation** for VRF responses
3. **Handle bucket empty scenarios** gracefully
4. **Monitor pool status** for high-frequency operations
5. **Use commit-reveal** for MEV-sensitive operations

### For Protocol Operators
1. **Monitor VRF source health** and funding levels
2. **Set up automated Drand collection** for fresh randomness
3. **Configure pool refresh automation** based on usage patterns
4. **Maintain proper access control** for authorized consumers

## Links

- **[Randomness Provider](/contracts/core/randomness-provider)**: Core randomness contract
- **[Chainlink Integration](/contracts/randomness/chainlink)**: Chainlink VRF details
- **[Drand Integration](/contracts/randomness/drand)**: Drand network integration
- **[VRF Interfaces](/contracts/randomness/interfaces)**: Interface documentation



 