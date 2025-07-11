# Client Modules for Docusaurus

This directory contains consolidated client-side modules for enhancing Docusaurus, particularly focused on Mermaid diagrams, animations, and navigation improvements.

## Directory Structure

```
src/clientModules/
├── core/
│   ├── mermaidCore.js         # Core Mermaid initialization
│   └── animeCore.js           # Core Anime.js setup
├── animations/
│   ├── basicAnimations.js     # CSS-based animations
│   ├── advancedAnimations.js  # Anime.js animations
│   └── interactiveFeatures.js # Interactive elements
├── navigation/
│   └── spaNavigation.js       # SPA navigation fixes
└── index.js                   # Main entry point
```

## Usage

### Basic Usage

The simplest way to use these modules is to import the main index.js file in your Docusaurus configuration:

```js
// docusaurus.config.js
module.exports = {
  // ... other config
  clientModules: [
    require.resolve('./src/clientModules/index.js'),
  ],
};
```

### Advanced Configuration

For more control, you can configure the modules:

```js
// docusaurus.config.js
module.exports = {
  // ... other config
  clientModules: [
    [
      require.resolve('./src/clientModules/index.js'),
      {
        mermaid: {
          theme: 'dark',
          logLevel: 'warn',
        },
        animations: {
          enabled: true,
          useAnime: true,
        },
        navigation: {
          smoothTransitions: true,
        }
      }
    ],
  ],
};
```

## Module Descriptions

### Core Modules

- **mermaidCore.js**: Robust initialization for Mermaid diagrams with error handling, theme support, and SPA navigation handling.
- **animeCore.js**: Sets up Anime.js with global configuration and utility functions.

### Animation Modules

- **basicAnimations.js**: CSS-based animations that don't require Anime.js.
- **advancedAnimations.js**: Advanced animations using Anime.js.
- **interactiveFeatures.js**: Interactive features like tooltips, explanations, and clickable nodes.

### Navigation Modules

- **spaNavigation.js**: Fixes and enhancements for Single Page Application navigation.
