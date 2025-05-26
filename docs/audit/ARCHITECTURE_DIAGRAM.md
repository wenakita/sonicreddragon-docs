# OmniDragon VRF System Architecture Diagrams

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Sonic Blockchain"
        RP[OmniDragonRandomnessProvider<br/>Main Coordinator]
        DI[DrandVRFIntegrator<br/>Free Randomness]
        CI[ChainlinkVRFIntegrator<br/>Premium Randomness]
        
        RP --> DI
        RP --> CI
    end
    
    subgraph "Arbitrum Blockchain"
        VR[OmniDragonVRFRequester<br/>Chainlink VRF 2.5]
        CV[Chainlink VRF<br/>Coordinator]
        
        VR --> CV
    end
    
    subgraph "External Services"
        D1[Drand Mainnet<br/>League of Entropy]
        D2[Drand Quicknet<br/>Fast Beacon]
        D3[Drand EVMnet<br/>EVM Optimized]
    end
    
    subgraph "Cross-Chain"
        LZ[LayerZero Protocol]
    end
    
    CI <--> LZ
    LZ <--> VR
    
    DI --> D1
    DI --> D2
    DI --> D3
    
    style RP fill:#f9f,stroke:#333,stroke-width:4px
    style LZ fill:#bbf,stroke:#333,stroke-width:2px
```

## 2. Request Flow Diagrams

### 2.1 Chainlink VRF Request Flow

```mermaid
sequenceDiagram
    participant User
    participant RP as RandomnessProvider
    participant CI as ChainlinkIntegrator
    participant LZ as LayerZero
    participant VR as VRFRequester
    participant CV as Chainlink VRF
    
    User->>RP: requestRandomness()
    RP->>CI: requestRandomness(consumer)
    CI->>LZ: Send message to Arbitrum
    Note over CI,LZ: Pay LayerZero fees
    
    LZ->>VR: lzReceive(payload)
    VR->>CV: requestRandomWords()
    Note over VR,CV: Uses LINK tokens
    
    CV-->>VR: fulfillRandomWords(randomness)
    VR->>LZ: Send result back
    LZ->>CI: lzReceive(result)
    CI->>RP: fulfillRandomness()
    RP->>User: Callback with randomness
```

### 2.2 Drand Request Flow

```mermaid
sequenceDiagram
    participant User
    participant RP as RandomnessProvider
    participant DI as DrandIntegrator
    participant DN as Drand Networks
    
    User->>RP: requestRandomness()
    RP->>DI: requestRandomness(consumer)
    
    loop Collect from Networks
        DI->>DN: Fetch latest beacon
        DN-->>DI: Return signed randomness
    end
    
    DI->>DI: Aggregate randomness
    DI->>RP: fulfillRandomness()
    RP->>User: Callback with randomness
    
    Note over User,DN: Total time: ~1-2 blocks
```

## 3. Data Flow Diagram

```mermaid
graph LR
    subgraph "Input"
        R1[User Request]
        R2[Request Type]
        R3[Consumer Address]
    end
    
    subgraph "Processing"
        P1{Route Request}
        P2[Generate Request ID]
        P3[Store Request]
        P4[Forward to VRF Source]
    end
    
    subgraph "VRF Sources"
        V1[Chainlink VRF]
        V2[Drand Beacon]
        V3[Bucket System]
        V4[Pool System]
    end
    
    subgraph "Output"
        O1[Random Number]
        O2[Callback to Consumer]
        O3[Event Emission]
    end
    
    R1 --> P1
    R2 --> P1
    R3 --> P2
    
    P1 -->|Premium| V1
    P1 -->|Free| V2
    P1 -->|Instant| V3
    P1 -->|Batch| V4
    
    P2 --> P3
    P3 --> P4
    
    V1 --> O1
    V2 --> O1
    V3 --> O1
    V4 --> O1
    
    O1 --> O2
    O1 --> O3
```

## 4. Contract Interaction Diagram

```mermaid
classDiagram
    class OmniDragonRandomnessProvider {
        -mapping vrfSources
        -mapping requests
        -uint256[] randomnessBucket
        -uint256[] randomnessPool
        +requestRandomness()
        +fulfillRandomness()
        +getRandomnessFromBucket()
        +getAggregatedRandomness()
    }
    
    class DrandVRFIntegrator {
        -mapping drandNetworks
        -mapping pendingRequests
        +requestRandomness()
        +fulfillRandomness()
        +verifyDrandBeacon()
        +aggregateRandomness()
    }
    
    class ChainlinkVRFIntegrator {
        -address lzEndpoint
        -mapping trustedRemotes
        -mapping pendingRequests
        +requestRandomness()
        +lzReceive()
        +estimateFee()
    }
    
    class OmniDragonVRFRequester {
        -VRFCoordinatorV2Interface coordinator
        -uint256 subscriptionId
        -mapping requests
        +requestRandomWords()
        +fulfillRandomWords()
        +sendRandomnessToSonic()
    }
    
    OmniDragonRandomnessProvider --> DrandVRFIntegrator : uses
    OmniDragonRandomnessProvider --> ChainlinkVRFIntegrator : uses
    ChainlinkVRFIntegrator ..> OmniDragonVRFRequester : LayerZero
    
    class IVRFConsumer {
        <<interface>>
        +fulfillRandomness()
    }
    
    OmniDragonRandomnessProvider ..> IVRFConsumer : callbacks
```

## 5. Security Architecture

```mermaid
graph TD
    subgraph "Access Control Layer"
        AC1[Owner Functions]
        AC2[Authorized Consumers]
        AC3[Trusted Remotes]
    end
    
    subgraph "Validation Layer"
        V1[Request Validation]
        V2[Message Authentication]
        V3[Nonce Checking]
        V4[Timeout Enforcement]
    end
    
    subgraph "Security Features"
        S1[ReentrancyGuard]
        S2[Pausable]
        S3[Rate Limiting]
        S4[Gas Limits]
    end
    
    subgraph "Core Logic"
        C1[Randomness Generation]
        C2[Cross-chain Messaging]
        C3[Callback Execution]
    end
    
    AC1 --> V1
    AC2 --> V1
    AC3 --> V2
    
    V1 --> C1
    V2 --> C2
    V3 --> C2
    V4 --> C3
    
    S1 --> C1
    S2 --> C1
    S3 --> C1
    S4 --> C3
```

## 6. Gas Optimization Strategy

```mermaid
graph LR
    subgraph "Storage Optimization"
        SO1[Packed Structs]
        SO2[Efficient Mappings]
        SO3[Minimal SSTORE]
    end
    
    subgraph "Computation Optimization"
        CO1[Pre-computed Bucket]
        CO2[Batch Processing]
        CO3[View Functions]
    end
    
    subgraph "Cross-chain Optimization"
        CC1[Message Batching]
        CC2[Optimal Payload Size]
        CC3[Gas Estimation]
    end
    
    SO1 --> |Reduces| GasCost
    SO2 --> |Reduces| GasCost
    SO3 --> |Reduces| GasCost
    
    CO1 --> |Reduces| GasCost
    CO2 --> |Reduces| GasCost
    CO3 --> |Reduces| GasCost
    
    CC1 --> |Reduces| GasCost
    CC2 --> |Reduces| GasCost
    CC3 --> |Optimizes| GasCost
    
    GasCost[Total Gas Cost]
```

## 7. Failure Recovery Flow

```mermaid
stateDiagram-v2
    [*] --> RequestInitiated
    RequestInitiated --> ChainlinkProcessing: Use Chainlink
    RequestInitiated --> DrandProcessing: Use Drand
    
    ChainlinkProcessing --> CrossChainMessage: Send via LayerZero
    CrossChainMessage --> ArbitrumProcessing: Message Received
    CrossChainMessage --> MessageTimeout: Timeout (5 min)
    
    ArbitrumProcessing --> VRFRequest: Request to Chainlink
    VRFRequest --> VRFFulfilled: Success
    VRFRequest --> VRFTimeout: Timeout (10 min)
    
    VRFFulfilled --> ReturnMessage: Send back to Sonic
    ReturnMessage --> Completed: Success
    ReturnMessage --> ReturnTimeout: Timeout (5 min)
    
    MessageTimeout --> FallbackToDrand: Auto-fallback
    VRFTimeout --> FallbackToDrand: Auto-fallback
    ReturnTimeout --> ManualRecovery: Admin intervention
    
    FallbackToDrand --> DrandProcessing
    DrandProcessing --> Completed: Success
    
    ManualRecovery --> Completed: Resolved
    Completed --> [*]
```

## 8. Cost Structure

```mermaid
pie title "Cost Distribution per VRF Request"
    "LINK Tokens (Chainlink)" : 85
    "LayerZero Fees" : 10
    "Gas on Sonic" : 3
    "Gas on Arbitrum" : 2
```

## 9. Performance Metrics

```mermaid
graph TD
    subgraph "Latency"
        L1[Bucket: Instant]
        L2[Drand: 1-2 blocks]
        L3[Chainlink: 1-2 minutes]
    end
    
    subgraph "Throughput"
        T1[Bucket: 1000 req/block]
        T2[Pool: 100 req/block]
        T3[Direct: 10 req/block]
    end
    
    subgraph "Cost per Request"
        C1[Bucket: $0.01]
        C2[Drand: $0.02]
        C3[Chainlink: $3-5]
    end
    
    L1 --> |Best| Performance
    T1 --> |Best| Performance
    C1 --> |Best| Performance
    
    Performance[Overall System Performance]
```

## 10. Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        D1[Local Fork Testing]
        D2[Unit Tests]
        D3[Integration Tests]
    end
    
    subgraph "Staging"
        S1[Sonic Testnet]
        S2[Arbitrum Testnet]
        S3[Cross-chain Testing]
    end
    
    subgraph "Production"
        P1[Sonic Mainnet]
        P2[Arbitrum Mainnet]
        P3[Monitoring]
    end
    
    D1 --> S1
    D2 --> S1
    D3 --> S3
    
    S1 --> P1
    S2 --> P2
    S3 --> P3
    
    style P1 fill:#f96,stroke:#333,stroke-width:2px
    style P2 fill:#f96,stroke:#333,stroke-width:2px
```

## Notes for Auditors

1. **Critical Paths**: Focus on cross-chain message flow (Section 2.1)
2. **Attack Surface**: Review Security Architecture (Section 5)
3. **Economic Model**: Understand cost structure (Section 8)
4. **Failure Modes**: Study recovery flow (Section 7)
5. **Performance**: Consider throughput limits (Section 9) 