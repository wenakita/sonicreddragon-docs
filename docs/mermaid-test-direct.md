---
title: Mermaid Direct Test
---

# Mermaid Direct Component Test

This page tests direct usage of the MermaidWrapper component.

## Using the MermaidWrapper Component

<MermaidWrapper chart={`
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[Finish]
`} />

## Using a Regular Mermaid Code Block

```mermaid
sequenceDiagram
    participant User
    participant System
    
    User->>System: Request data
    System->>System: Process request
    System-->>User: Return response
    
    note over User,System: Simple interaction
```

## Class Diagram Example

```mermaid
classDiagram
    class OmniDragon {
        +String name
        +address layerZeroEndpoint
        +send(uint16 dstChainId)
        +receive(uint16 srcChainId)
    }
    
    class OmniMessenger {
        +address token
        +sendMessage(bytes data)
    }
    
    OmniDragon --> OmniMessenger: uses
``` 