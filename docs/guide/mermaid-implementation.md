---
title: Mermaid Implementation Guide
description: How to use Mermaid diagrams in the OmniDragon documentation
sidebar_position: 1
---

# Mermaid Implementation Guide

This guide explains how to use Mermaid diagrams in the OmniDragon documentation, including standard diagrams, immersive diagrams, and best practices.

## Standard Mermaid Diagrams

Docusaurus has built-in support for Mermaid diagrams. To create a standard Mermaid diagram, use the following syntax:

````md
```mermaidflowchart LR
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|>|No| D[Debug]
    D| A
```
````

This will render as:
```

```mermaidflowchart LR
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|>|No| D[Debug]
    D| A
```

## Immersive Mermaid Diagrams

For more visually appealing diagrams with animations, interactive elements, and enhanced styling, use the immersive mode by wrapping your Mermaid diagram in a `<div data-immersive>` tag:

````md
<div data-immersive>

```mermaidflowchart TD
    A[Start] --> B{Is immersive mode working?}
    B -->|Yes| C[Excellent!]
    B -->|>|>|No| D[Check implementation]
    D| E[Fix issues]
    E| A
```

</div>
````

Immersive diagrams include:
- Smooth entrance animations
- Interactive hover effects
- Fullscreen mode
- Download as SVG option
- Replay animation button
- Automatic theme adaptation (light/dark)
- Accessibility features (respects reduced motion preferences)

## Diagram Titles and Captions

The immersive mode automatically detects titles and captions:

1.**Title**: The heading immediately before the diagram becomes the diagram title
2.**Caption**: The paragraph immediately after the diagram becomes the caption

Example:

````md
### My Diagram Title

<div data-immersive>
```

```mermaidflowchart LR
    A -->|> B
    B| C
```

</div>

This is the diagram caption that explains what's happening.
````

## Best Practices

### Accessibility

- Keep diagrams simple and focused
- Use clear labels with sufficient contrast
- Provide text alternatives or explanations for complex diagrams
- Immersive diagrams automatically respect the user's reduced motion preferences

### Performance

- Limit the number of nodes and edges in a single diagram
- Break complex processes into multiple smaller diagrams
- Use immersive mode sparingly for the most important diagrams

### Styling

- Use consistent node shapes and colors
- Follow the OmniDragon color scheme
- Use descriptive labels
- Keep edge lengths reasonable

## Mermaid Syntax Reference

### Flowcharts

```mermaidflowchart LR
    A[Rectangle] -->|> B(Rounded)
    B| C{Decision}
    C -->|Option 1| D[Result 1]
    C -->|Option 2| E[Result 2]
```

### Sequence Diagrams
```

```mermaidsequenceDiagram
Alice ->> John: Hello John, how are you?
    John -->> Alice: Great!
    Alice ->> John: See you later!
```

### Class Diagrams

```mermaidclassDiagram
Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck {
+String beakColor
      +swim()
      +quack()
    }
```

### State Diagrams
```

```mermaidstateDiagram-v2
    [*] -->|> Still
    Still| [*]
    Still -->|> Moving
    Moving| Still
    Moving -->|> Crash
    Crash| [*]
```

## Technical Implementation

The OmniDragon documentation uses a React-based approach for rendering Mermaid diagrams:

1.**Standard Diagrams**: Rendered using Docusaurus's built-in Mermaid support
2.**Immersive Diagrams**: Enhanced using the `UnifiedMermaid` React component
3.**MDX Components**: The `MDXComponents.js` file handles rendering of immersive diagrams directly during React rendering
4.**Client Module**: The `reactMermaidModule.js` adds global styles for consistent diagram appearance

This implementation ensures:
- Clean separation of concerns
- Proper React lifecycle management
- Server-side rendering compatibility
- Consistent styling and behavior
- Accessibility compliance
- Performance optimization

## Troubleshooting

If your diagram doesn't render correctly:

1.**Syntax Errors**: Validate your Mermaid syntax using the [Mermaid Live Editor](https://mermaid.live/)
2.**Spacing Issues**: Ensure proper indentation and line breaks
3.**Complex Diagrams**: Simplify or break into multiple diagrams
4.**Special Characters**: Avoid using special characters in node IDs and labels

For additional help, refer to the [Mermaid documentation](https://mermaid-js.github.io/mermaid/).
