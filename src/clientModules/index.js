/**
 * Main Entry Point for Client Modules
 * 
 * This file serves as the main entry point for all client modules.
 * It initializes and configures all modules based on the provided configuration.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Import core modules
import mermaidCore from './core/mermaidCore';
import animeCore from './core/animeCore';

// Import animation modules
import basicAnimations from './animations/basicAnimations';
import advancedAnimations from './animations/advancedAnimations';
import interactiveFeatures from './animations/interactiveFeatures';

// Import navigation modules
import spaNavigation from './navigation/spaNavigation';

// Default configuration
const defaultConfig = {
  mermaid: {
    theme: 'auto',
    logLevel: 'error',
    startOnLoad: true,
    securityLevel: 'loose',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 14,
  },
  animations: {
    enabled: true,
    useAnime: true,
    basic: {
      enabled: true,
      flowAnimation: true,
      progressiveReveal: true,
      nodeInteractivity: true,
      zoomControls: true,
    },
    advanced: {
      enabled: true,
      defaultAnimation: 'staggered-fade',
      duration: 1000,
      easing: 'easeOutElastic(1, .5)',
    },
    interactive: {
      enabled: true,
      tooltips: true,
      explanations: true,
      clickableNodes: true,
      highlightConnections: true,
    },
  },
  navigation: {
    enabled: true,
    smoothTransitions: true,
    preserveScroll: true,
    reinitMermaid: true,
    reinitAnimations: true,
  },
};

/**
 * Initialize all modules with the provided configuration
 * @param {Object} userConfig - User configuration to override defaults
 */
function initializeModules(userConfig = {}) {
  // Only execute in browser environment
  if (!ExecutionEnvironment.canUseDOM) {
    return;
  }
  
  console.log('Initializing client modules...');
  
  // Merge user config with defaults
  const config = mergeConfig(defaultConfig, userConfig);
  
  // Initialize core modules
  mermaidCore(config.mermaid);
  
  // Initialize Anime.js if enabled
  if (config.animations.useAnime) {
    animeCore(config.animations);
  }
  
  // Initialize animation modules
  if (config.animations.enabled) {
    // Basic animations are always enabled
    basicAnimations(config.animations.basic);
    
    // Advanced animations require Anime.js
    if (config.animations.useAnime) {
      advancedAnimations(config.animations.advanced);
    }
    
    // Interactive features
    interactiveFeatures(config.animations.interactive);
  }
  
  // Initialize navigation modules
  if (config.navigation.enabled) {
    spaNavigation(config.navigation);
  }
  
  console.log('All client modules initialized successfully.');
}

/**
 * Merge user configuration with defaults
 * @param {Object} defaults - Default configuration
 * @param {Object} user - User configuration
 * @returns {Object} - Merged configuration
 */
function mergeConfig(defaults, user) {
  // Create a deep copy of defaults
  const result = JSON.parse(JSON.stringify(defaults));
  
  // If user config is empty, return defaults
  if (!user || Object.keys(user).length === 0) {
    return result;
  }
  
  // Merge top-level properties
  for (const key in user) {
    if (typeof user[key] === 'object' && user[key] !== null && key in result) {
      // Recursively merge nested objects
      result[key] = mergeConfig(result[key], user[key]);
    } else {
      // Replace primitive values
      result[key] = user[key];
    }
  }
  
  return result;
}

// Export the initialization function
export default function(userConfig) {
  // Initialize modules when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeModules(userConfig));
  } else {
    initializeModules(userConfig);
  }
}
