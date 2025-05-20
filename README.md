# Sonic Red Dragon Documentation

This documentation is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

## Using Mermaid Diagrams

This documentation site supports Mermaid diagrams in two ways:

### 1. Code Block Method

Use triple backticks with the `mermaid` language identifier:

```
```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[Continue]
```
```

### 2. Component Method

For more advanced diagrams with custom styling, you can use the MermaidWrapper component:

```jsx
<MermaidWrapper chart={`
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[Finish]
`} />
```

## Installation

```
$ npm install
```

## Local Development

```
$ npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```
$ npm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

The documentation is automatically deployed when changes are merged to the main branch.
