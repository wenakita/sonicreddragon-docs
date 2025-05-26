# OmniDragon Randomness Provider

The **OmniDragonRandomnessProvider** is the single source of truth for all randomness in the OmniDragon ecosystem. It manages multiple VRF sources, provides fallback mechanisms, and serves randomness to any authorized consumer with cost-efficient bucket systems.

## Overview

The Randomness Provider serves as the central hub for:
- **Multiple VRF Sources**: Chainlink VRF 2.5 via LayerZero, Drand networks
- **Cost-Efficient Systems**: Bucket system for high-frequency requests
- **Fallback Mechanisms**: Automatic switching between VRF sources
- **Enhanced Security**: Aggregated randomness from multiple sources
- **Universal Service**: Serves any authorized consumer (lottery, games, etc.)

## Key Features

### Multiple VRF Sources
- **Primary**: Chainlink VRF 2.5 via LayerZero from Arbitrum
- **Secondary**: Drand League of Entropy beacon network
- **Fallback**: Legacy Chainlink VRF 2.0 (if available locally)
- **Tertiary**: Drand Quicknet for fast randomness
- **Quaternary**: Drand EVMnet for EVM-optimized randomness

### Cost Optimization
- **Bucket System**: Batches multiple requests for efficiency
- **Randomness Pool**: Pre-generated numbers for instant access
- **Protocol-Funded**: All randomness costs covered by protocol
- **Gas Efficient**: Optimized for high-frequency operations

### Security Features
- **Multi-Source Aggregation**: Enhanced security through diversity
- **Continuous Monitoring**: Automatic health checks and failover
- **Access Control**: Only authorized consumers can request randomness
- **Request Validation**: Comprehensive input validation

## Contract Architecture

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
    'nodeSpacing': 50,
    'rankSpacing': 80,
    'padding': 20
  }
}}%%
graph TB
    subgraph "OmniDragonRandomnessProvider"
        RP["Core Controller<br/>Request Orchestration"]
        VS["VRF Source Manager<br/>Multi-Source Coordination"]
        BS["Bucket System<br/>Cost-Efficient Batching"]
        PS["Pool System<br/>Pre-Generated Numbers"]
        AC["Access Control<br/>Consumer Authorization"]
    end
    
    subgraph "VRF Sources"
        CL["Chainlink VRF 2.5<br/>Premium Security"]
        DR["Drand Networks<br/>Distributed Beacons"]
        LG["Legacy VRF 2.0<br/>Fallback Option"]
    end
    
    subgraph "Storage Systems"
        RC["Request Cache<br/>Pending Requests"]
        SC["Statistics Cache<br/>Success/Failure Rates"]
        CC["Consumer Cache<br/>Authorized Addresses"]
    end
    
    RP --> VS
    RP --> BS
    RP --> PS
    RP --> AC
    
    VS --> CL
    VS --> DR
    VS --> LG
    
    RP --> RC
    RP --> SC
    AC --> CC
    
    classDef core fill:#7c3aed,stroke:#6d28d9,color:#f8fafc
    classDef vrf fill:#059669,stroke:#047857,color:#f8fafc
    classDef storage fill:#2563eb,stroke:#1e40af,color:#f8fafc
    classDef system fill:#ea580c,stroke:#c2410c,color:#f8fafc
    
    class RP core
    class VS,BS,PS,AC system
    class CL,DR,LG vrf
    class RC,SC,CC storage
```
</div>

## VRF Sources

### Supported Sources

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
    'lineColor': '#64748b'
  }
}}%%
graph LR
    subgraph "Primary VRF"
        CL25["Chainlink VRF 2.5<br/>Arbitrum → Sonic<br/>Maximum Security<br/>~30s Latency<br/>Higher Cost"]
    end
    
    subgraph "Secondary VRF"
        DB["Drand Beacon<br/>League of Entropy<br/>High Security<br/>&lt;1s Latency<br/>Free"]
    end
    
    subgraph "Fallback Options"
        CL20["Chainlink VRF 2.0<br/>Local if Available<br/>High Security<br/>~10s Latency<br/>Medium Cost"]
        DQ["Drand Quicknet<br/>Fast Rounds<br/>Medium Security<br/>~3s Latency<br/>Free"]
        DE["Drand EVMnet<br/>EVM Optimized<br/>Medium Security<br/>~5s Latency<br/>Free"]
    end
    
    CL25 --> DB
    DB --> CL20
    CL20 --> DQ
    DQ --> DE
    
    classDef primary fill:#dc2626,stroke:#b91c1c,color:#f8fafc
    classDef secondary fill:#059669,stroke:#047857,color:#f8fafc
    classDef fallback fill:#7c3aed,stroke:#6d28d9,color:#f8fafc
    
    class CL25 primary
    class DB secondary
    class CL20,DQ,DE fallback
```
</div>

```solidity
enum VRFSource {
    CHAINLINK_V2_5,    // Primary: Chainlink VRF 2.5 via LayerZero
    DRAND_BEACON,      // Secondary: Drand League of Entropy
    CHAINLINK_V2_0,    // Fallback: Legacy Chainlink VRF 2.0
    DRAND_QUICKNET,    // Tertiary: Drand Quicknet
    DRAND_EVMNET       // Quaternary: Drand EVMnet
}
```

### VRF Configuration

```solidity
struct VRFConfig {
    address contractAddress;    // VRF contract address
    bool isActive;             // Whether this VRF source is active
    uint256 priority;          // Priority level (1 = highest)
    uint256 maxRetries;        // Maximum retry attempts
    uint256 timeoutSeconds;    // Timeout for VRF response
    uint256 successCount;      // Number of successful requests
    uint256 failureCount;      // Number of failed requests
}
```

## Core Systems

### Bucket System

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
    'lineColor': '#64748b'
  },
  'flowchart': {
    'curve': 'basis',
    'nodeSpacing': 50,
    'rankSpacing': 70
  }
}}%%
graph TD
    A["Bucket System<br/>Cost-Efficient Randomness"]
    
    A --> B["VRF Seed<br/>Cryptographically Secure"]
    A --> C["Nonce Counter<br/>Unique Number Generator"]
    A --> D["Capacity: 1000<br/>Random Numbers per Seed"]
    A --> E["Refill at 100<br/>Remaining Numbers"]
    
    B --> F["Generate Random<br/>keccak256(seed + nonce + consumer)"]
    C --> F
    F --> G["Deliver to Consumer<br/>Instant Response"]
    
    E --> H["Request New VRF<br/>Automatic Refill"]
    H --> I["1 Hour Interval<br/>Rate Limiting"]
    I --> B
    
    classDef bucket fill:#2563eb,stroke:#1e40af,color:#f8fafc
    classDef process fill:#059669,stroke:#047857,color:#f8fafc
    classDef refill fill:#be185d,stroke:#9d174d,color:#f8fafc
    
    class A bucket
    class B,C,D,F,G process
    class E,H,I refill
```
</div>

The bucket system provides cost-efficient randomness for high-frequency requests:

```solidity
struct RandomnessBucket {
    uint256 seed;              // Current VRF seed
    uint256 nonce;             // Counter for deriving unique numbers
    uint256 maxNonce;          // Maximum nonce for this seed
    uint256 lastRefill;        // Timestamp of last VRF request
}
```

**Constants**:
- `BUCKET_SIZE`: 1000 random numbers per bucket
- `REFILL_THRESHOLD`: 100 numbers remaining triggers refill
- `CHAINLINK_REQUEST_INTERVAL`: 1 hour between Chainlink requests

### Randomness Pool

<div className="mermaid-container">
  <div className="mermaid-controls">
    <button className="mermaid-btn">Animate Pool</button>
  </div>

```mermaid
%%{init: {
  'theme': 'dark',
  'themeVariables': {
    'primaryColor': '#ea580c',
    'primaryTextColor': '#f8fafc',
    'lineColor': '#64748b'
  }
}}%%
graph LR
    subgraph "Randomness Pool System"
        A["Pool Manager<br/>Instant Access Controller"]
        B["Pre-Generated Pool<br/>1000 Random Numbers"]
        C["Current Index<br/>Draw Position Tracker"]
        D["Refresh Timer<br/>30 Minute Intervals"]
    end
    
    subgraph "Pool Generation"
        E["Latest Chainlink Seed<br/>High-Quality Entropy"]
        F["Drand Aggregation<br/>Multi-Network Mixing"]
        G["Mathematical Mixing<br/>Enhanced Randomness"]
    end
    
    A --> B
    B --> C
    A --> D
    
    D --> E
    D --> F
    E --> G
    F --> G
    G --> B
    
    classDef pool fill:#ea580c,stroke:#c2410c,color:#f8fafc
    classDef generation fill:#7c3aed,stroke:#6d28d9,color:#f8fafc
    
    class A,B,C,D pool
    class E,F,G generation
```
</div>

Enhanced pool system for instant randomness access:

```solidity
struct RandomnessPool {
    uint256[] randomNumbers;    // Array of pre-generated random numbers
    uint256 currentIndex;       // Current index for drawing numbers
    uint256 lastChainlinkSeed; // Last Chainlink VRF seed used
    uint256 lastRefreshTime;    // Last time pool was refreshed
    bool isRefreshing;          // Whether pool is currently being refreshed
}
```

**Constants**:
- `POOL_SIZE`: 1000 pre-generated numbers
- `POOL_REFRESH_INTERVAL`: 30 minutes between refreshes
- `MIN_POOL_SIZE`: 100 minimum numbers before refresh

### Drand Network Aggregation

<div className="mermaid-container">
  <div className="mermaid-controls">
    <button className="mermaid-btn">Zoom In</button>
    <button className="mermaid-btn">Replay</button>
  </div>

```mermaid
%%{init: {
  'theme': 'dark',
  'themeVariables': {
    'primaryColor': '#047857',
    'primaryTextColor': '#f8fafc',
    'lineColor': '#64748b'
  }
}}%%
graph TB
    subgraph "Global Drand Networks"
        LE["League of Entropy<br/>Global Beacon Network<br/>30s Rounds<br/>Maximum Security"]
        QN["Quicknet<br/>Fast Beacon Network<br/>3s Rounds<br/>High Security"]
        EN["EVMnet<br/>EVM-Optimized Network<br/>5s Rounds<br/>Medium Security"]
    end
    
    subgraph "Aggregation Process"
        AG["Aggregator<br/>Multi-Network Combiner"]
        WM["Weight Manager<br/>Network Priority System"]
        VM["Validator<br/>Signature Verification"]
    end
    
    subgraph "Output"
        AR["Aggregated Randomness<br/>Combined Entropy"]
        TS["Timestamp<br/>Last Update Time"]
        CT["Counter<br/>Aggregation Sequence"]
    end
    
    LE --> AG
    QN --> AG
    EN --> AG
    
    AG --> WM
    AG --> VM
    WM --> AR
    VM --> AR
    AR --> TS
    AR --> CT
    
    classDef network fill:#047857,stroke:#065f46,color:#f8fafc
    classDef process fill:#059669,stroke:#047857,color:#f8fafc
    classDef output fill:#be185d,stroke:#9d174d,color:#f8fafc
    
    class LE,QN,EN network
    class AG,WM,VM process
    class AR,TS,CT output
```
</div>

Multi-network Drand integration for enhanced security:

```solidity
struct DrandNetwork {
    address integrator;
    bool active;
    uint256 weight;
    uint256 lastUpdate;
    uint256 lastValue;
    uint256 lastRound;
}
```

## Request Lifecycle

<div className="mermaid-container">
  <div className="mermaid-controls">
    <button className="mermaid-btn">Zoom In</button>
    <button className="mermaid-btn">Replay Flow</button>
  </div>

```mermaid
%%{init: {
  'theme': 'dark',
  'themeVariables': {
    'primaryColor': '#1e40af',
    'primaryTextColor': '#f8fafc',
    'lineColor': '#64748b'
  },
  'sequence': {
    'actorMargin': 50,
    'width': 150,
    'height': 65,
    'boxMargin': 10,
    'boxTextMargin': 5,
    'noteMargin': 10,
    'messageMargin': 35
  }
}}%%
sequenceDiagram
    participant C as Consumer
    participant RP as Randomness Provider
    participant BS as Bucket System
    participant PS as Pool System
    participant VRF as VRF Sources
    
    Note over C,VRF: Request Initiation
    C->>RP: requestRandomness()
    RP->>RP: Validate Consumer
    RP->>RP: Assign Request ID
    
    Note over RP,PS: Source Selection
    alt Bucket Available
        RP->>BS: drawFromBucket()
        BS->>BS: Generate from Seed
        BS->>RP: Instant Randomness
        RP->>C: Fulfill Request
    else Pool Available
        RP->>PS: drawFromPool()
        PS->>PS: Get Pre-Generated
        PS->>RP: Pool Randomness
        RP->>C: Fulfill Request
    else VRF Required
        RP->>VRF: Request VRF
        VRF->>VRF: Generate Secure Random
        VRF->>RP: VRF Response
        RP->>C: Fulfill Request
    end
    
    Note over C,VRF: Statistics Update
    RP->>RP: Update Success Metrics
```
</div>

## Core Functions

### Main Randomness Functions

#### Request Randomness
```solidity
function requestRandomness() external returns (uint256 requestId);
```

**Features**:
- Protocol covers all costs
- Automatic source selection
- Fallback mechanisms
- Request tracking

**Requirements**:
- Caller must be authorized consumer
- System must not be paused
- VRF sources must be available

#### Request with Specific Source
```solidity
function requestRandomnessWithSource(
    VRFSource vrfSource, 
    bool useBucket
) public returns (uint256 requestId);
```

**Parameters**:
- `vrfSource`: Preferred VRF source
- `useBucket`: Whether to use bucket system for cost efficiency

#### Draw from Bucket
```solidity
function drawRandomnessFromBucket() external returns (uint256 randomness);
```

**Features**:
- Instant randomness delivery
- Cost-efficient for high-frequency use
- Automatic refill management
- Deterministic generation from VRF seed

**Important Notes**:
- Reverts if bucket is empty
- Check `getBucketStatus()` before calling
- Bucket refills are asynchronous

#### Get Aggregated Randomness
```solidity
function getAggregatedRandomness() external view returns (uint256 randomness);
```

**Features**:
- Free, immediate access
- Aggregated from all Drand networks
- May be stale if not recently updated
- No gas cost for reading

## Cost Model

<div className="mermaid-container">
  <div className="mermaid-controls">
    <button className="mermaid-btn">Animate Costs</button>
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
graph TD
    subgraph "Protocol-Funded Operations"
        A["Protocol Treasury<br/>Covers All Randomness Costs"]
    end
    
    subgraph "Chainlink VRF Costs"
        B["LayerZero Fees<br/>~0.01 S per request"]
        C["LINK Token Fees<br/>~0.3-0.5 LINK per request"]
        D["Gas Costs<br/>~200k gas on Sonic"]
    end
    
    subgraph "Drand Costs"
        E["Network Queries<br/>Free to Access"]
        F["Gas Only<br/>~50k gas per aggregation"]
    end
    
    subgraph "Consumer Experience"
        G["Free Randomness<br/>No Direct Costs"]
        H["Authorization Required<br/>Must be Approved"]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    
    B --> G
    C --> G
    D --> G
    E --> G
    F --> G
    
    G --> H
    
    classDef protocol fill:#1e40af,stroke:#1d4ed8,color:#f8fafc
    classDef chainlink fill:#059669,stroke:#047857,color:#f8fafc
    classDef drand fill:#047857,stroke:#065f46,color:#f8fafc
    classDef consumer fill:#65a30d,stroke:#4d7c0f,color:#f8fafc
    
    class A protocol
    class B,C,D chainlink
    class E,F drand
    class G,H consumer
```
</div>

### Protocol-Funded Operations

The protocol covers all randomness costs:

- **Chainlink VRF**: LayerZero fees paid in $S (Sonic native token)
- **Drand**: Free queries, only gas costs
- **Consumers**: Free to request randomness (must be authorized)

### Operational Requirements

1. **ChainlinkVRFIntegrator** must be funded with $S for LayerZero fees
2. **OmniDragonVRFRequester** must be deployed on Arbitrum with funded VRF subscription
3. **LayerZero endpoints** must be configured for cross-chain messaging
4. **Drand integrator contracts** must be deployed and configured

### Gas Costs

- **Individual Request**: ~200k gas
- **Bucket Draw**: ~50k gas
- **Pool Refresh**: ~1M gas
- **Drand Collection**: ~1M gas (multiple networks)

## Security Features

### Access Control

```solidity
modifier onlyAuthorizedConsumer() {
    require(authorizedConsumers[msg.sender], "Not authorized consumer");
    _;
}
```

### Request Validation

```solidity
function _validateRequest(address requester, VRFSource source) internal view {
    require(authorizedConsumers[requester], "Not authorized");
    require(vrfConfigs[source].isActive, "VRF source not active");
    require(!paused(), "System paused");
}
```

### Randomness Generation

```solidity
function _generateFromSeed(
    uint256 seed, 
    uint256 nonce, 
    address consumer
) internal pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(seed, nonce, consumer)));
}
```

**Security Notes**:
- Uses only VRF-derived seeds
- Deterministic generation for auditability
- Consumer address adds uniqueness
- Suitable for high-frequency, lower-security use cases

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
    'lineColor': '#64748b'
  },
  'xyChart': {
    'width': 700,
    'height': 400
  }
}}%%
xychart-beta
    title "VRF Method Performance Comparison"
    x-axis ["Cost", "Latency", "Security", "Throughput"]
    y-axis "Performance Score" 0 --> 10
    bar [9, 2, 10, 3]
    bar [3, 9, 8, 8]
    bar [1, 10, 6, 9]
    bar [2, 10, 6, 10]
```
</div>

| Method | Cost | Latency | Security | Use Case |
|--------|------|---------|----------|----------|
| Chainlink VRF | High | ~30s | Maximum | Critical applications |
| Drand Aggregated | Low | &lt;1s | High | General purpose |
| Bucket Draw | Very Low | &lt;1s | Medium | High-frequency |
| Pool Access | Minimal | Instant | Medium | Immediate needs |

## Integration Examples

### For Consumers

1. **Get Authorized**
   ```solidity
   // Owner must authorize your contract
   randomnessProvider.authorizeConsumer(yourContract, true);
   ```

2. **Implement Callback**
   ```solidity
   function fulfillRandomness(uint256 requestId, uint256 randomness) external {
       require(msg.sender == address(randomnessProvider), "Unauthorized");
       // Use randomness for your logic
   }
   ```

3. **Request Randomness**
   ```solidity
   uint256 requestId = randomnessProvider.requestRandomness();
   // Store requestId for callback matching
   ```

### For High-Frequency Use

1. **Check Bucket Status**
   ```solidity
   function getBucketStatus() external view returns (
       uint256 remainingNumbers,
       uint256 lastRefill,
       bool needsRefill
   );
   ```

2. **Draw from Bucket**
   ```solidity
   try randomnessProvider.drawRandomnessFromBucket() returns (uint256 randomness) {
       // Use randomness immediately
   } catch {
       // Bucket empty, fallback to regular request
       uint256 requestId = randomnessProvider.requestRandomness();
   }
   ```

## Links

- **Social**: [Twitter](https://x.com/sonicreddragon) | [Telegram](https://t.me/sonicreddragon)
- **Repository**: [GitHub](https://github.com/wenakita/omnidragon)
- **VRF Integration**: [Chainlink VRF](/contracts/randomness/chainlink) | [Drand Integration](/contracts/randomness/drand)



 