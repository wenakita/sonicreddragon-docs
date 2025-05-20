---
title: Clean Mermaid Test
sidebar_position: 99
---

# Clean Mermaid Test

This is a test of mermaid diagrams with clean syntax.

## Basic Flowchart

```mermaid
flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> A
    C --> E[Continue]
    
    classDef start fill:#e3f2fd;stroke:#2196f3;color:#0d47a1
    classDef process fill:#fff3e0;stroke:#ff9800;color:#e65100
    classDef end fill:#e8f5e9;stroke:#4caf50;color:#1b5e20
    
    class A start
    class D process
    class C,E end
```

## Simple Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant System
    participant Database
    
    User->>System: Request data
    System->>Database: Query
    Database-->>System: Return results
    System-->>User: Display results
```

## Class Diagram

```mermaid
classDiagram
    class Token {
        +string name
        +string symbol
        +uint decimals
        +transfer(address, uint)
        +balanceOf(address)
    }
    
    class OmniDragon {
        +address owner
        +setFees(uint)
        +crossChainTransfer(uint16, address, uint)
    }
    
    Token <|-- OmniDragon
    
    classDef token fill:#e8f4f8;stroke:#4dabf7;color:#1971c2
    classDef implement fill:#e6fcf5;stroke:#3bc9db;color:#0b7285
    
    class Token token
    class OmniDragon implement
``` 