---
title: Mermaid Test Page
---

# Mermaid Diagram Test Page

This page contains test diagrams using Mermaid to ensure everything is rendering correctly.

## Simple Flowchart

```mermaid
flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[Continue]
```

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant System
    
    User->>System: Request data
    System->>System: Process request
    System-->>User: Return response
    
    note over User,System: Simple interaction
```

## Class Diagram

```mermaid
classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    
    class Dog {
        +String breed
        +bark()
    }
    
    class Cat {
        +String color
        +meow()
    }
    
    Animal <|-- Dog
    Animal <|-- Cat
```

## State Diagram 

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Submit
    Processing --> Complete: Done
    Processing --> Error: Failed
    Complete --> [*]
    Error --> Idle: Retry
```

## Gantt Chart

```mermaid
gantt
    title Project Schedule
    dateFormat  YYYY-MM-DD
    
    section Design
    Research           :done,    des1, 2023-01-01, 2023-01-05
    Prototyping        :active,  des2, 2023-01-06, 2023-01-15
    
    section Development
    Coding             :         dev1, 2023-01-16, 2023-02-15
    Testing            :         dev2, 2023-02-16, 2023-02-28
    
    section Deployment
    Production         :         dep1, 2023-03-01, 2023-03-07
```

## Entity Relationship Diagram

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
``` 