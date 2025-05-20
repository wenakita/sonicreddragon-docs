---
title: Final Mermaid Test
---

# Final Mermaid Test

## Simple Method 1: Standard Mermaid Block

```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Do Something]
    B -->|No| D[Do Nothing]
    C --> E[End]
    D --> E
```

## Simple Method 2: Component

<MermaidWrapper chart={`
sequenceDiagram
    participant User
    participant System
    User->>System: Request
    System->>System: Process
    System-->>User: Response
`} />

## Simple Method 3: Raw HTML

<div dangerouslySetInnerHTML={{__html: `
<div class="mermaid">
classDiagram
    class Animal {
        +String name
        +move()
    }
    class Dog {
        +bark()
    }
    class Bird {
        +fly()
    }
    Animal <|-- Dog
    Animal <|-- Bird
</div>
`}} /> 