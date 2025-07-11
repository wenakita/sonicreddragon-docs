/**
 * Enhanced Animation Module for OmniDragon Docs
 * 
 * This module provides sophisticated animations for Mermaid diagrams to help readers
 * understand complex concepts through progressive reveals and interactive flows.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Only execute in browser
if (ExecutionEnvironment.canUseDOM) {
  // Load anime.js dynamically
  let anime;
  
  // Initialize animations when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations);
  } else {
    initializeAnimations();
  }

  async function initializeAnimations() {
    console.log('🎨 Initializing sophisticated diagram animations...');
    
    // Load anime.js
    try {
      anime = (await import('animejs')).default;
    } catch (error) {
      console.warn('Anime.js not available, falling back to CSS animations');
    }
    
    // Add enhanced animation styles
    addEnhancedAnimationStyles();
    
    // Initialize diagram animations with delay for Mermaid rendering
    setTimeout(() => {
      initializeDiagramAnimations();
    }, 1500);
    
    // Initialize scroll-triggered animations
    initializeScrollAnimations();
    
    // Initialize interactive explanations
    initializeInteractiveExplanations();
  }

  function addEnhancedAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced diagram container */
      .docusaurus-mermaid-container {
        position: relative;
        overflow: visible;
        border-radius: 8px;
        background: linear-gradient(135deg, rgba(37, 99, 235, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%);
        padding: 20px;
        margin: 20px 0;
        transition: all 0.3s ease;
      }
      
      .docusaurus-mermaid-container:hover {
        background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
        box-shadow: 0 8px 32px rgba(37, 99, 235, 0.1);
      }
      
      /* Progressive reveal animations */
      .mermaid-step {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .mermaid-step.revealed {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      
      /* Flow animation for paths */
      .mermaid .edgePath path {
        stroke-dasharray: 5, 5;
        animation: flowAnimation 3s linear infinite;
      }
      
      @keyframes flowAnimation {
        0% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: 20; }
      }
      
      /* Highlight animation for important nodes */
      .mermaid-highlight {
        animation: highlightPulse 2s ease-in-out infinite;
        filter: drop-shadow(0 0 8px rgba(37, 99, 235, 0.6));
      }
      
      @keyframes highlightPulse {
        0%, 100% { 
          transform: scale(1);
          filter: drop-shadow(0 0 8px rgba(37, 99, 235, 0.6));
        }
        50% { 
          transform: scale(1.05);
          filter: drop-shadow(0 0 12px rgba(37, 99, 235, 0.8));
        }
      }
      
      /* Interactive tooltip */
      .diagram-tooltip {
        position: absolute;
        background: rgba(15, 23, 42, 0.95);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        line-height: 1.4;
        max-width: 300px;
        z-index: 1000;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(37, 99, 235, 0.3);
      }
      
      .diagram-tooltip.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .diagram-tooltip::before {
        content: '';
        position: absolute;
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid rgba(15, 23, 42, 0.95);
      }
      
      /* Step-by-step explanation overlay */
      .diagram-explanation {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(37, 99, 235, 0.2);
        border-radius: 8px;
        padding: 16px;
        max-width: 250px;
        font-size: 13px;
        line-height: 1.5;
        opacity: 0;
        transform: translateX(20px);
        transition: all 0.4s ease;
        backdrop-filter: blur(10px);
      }
      
      .diagram-explanation.active {
        opacity: 1;
        transform: translateX(0);
      }
      
      /* Play/pause controls */
      .diagram-controls {
        position: absolute;
        bottom: 10px;
        left: 10px;
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .docusaurus-mermaid-container:hover .diagram-controls {
        opacity: 1;
      }
      
      .diagram-control-btn {
        background: rgba(37, 99, 235, 0.9);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 8px 12px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .diagram-control-btn:hover {
        background: rgba(37, 99, 235, 1);
        transform: translateY(-1px);
      }
      
      /* Data flow visualization */
      .data-flow-particle {
        position: absolute;
        width: 6px;
        height: 6px;
        background: #2563eb;
        border-radius: 50%;
        opacity: 0;
        box-shadow: 0 0 8px rgba(37, 99, 235, 0.6);
      }
      
      /* Concept grouping animations */
      .concept-group {
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .concept-group.revealed {
        opacity: 1;
        transform: scale(1);
      }
      
      /* Progressive complexity reveal */
      .complexity-level-1 { animation-delay: 0.2s; }
      .complexity-level-2 { animation-delay: 0.6s; }
      .complexity-level-3 { animation-delay: 1.0s; }
      .complexity-level-4 { animation-delay: 1.4s; }
      
      /* Enhanced node interactions */
      .mermaid .node {
        cursor: pointer;
        transition: all 0.3s ease;
        transform-origin: center center;
      }
      
      .mermaid .node:hover {
        transform: scale(1.08);
        filter: brightness(1.1);
      }
      
      .mermaid .node.active {
        animation: activeNodePulse 1.5s ease-in-out infinite;
      }
      
      @keyframes activeNodePulse {
        0%, 100% { 
          transform: scale(1);
          filter: drop-shadow(0 0 0px rgba(37, 99, 235, 0));
        }
        50% { 
          transform: scale(1.05);
          filter: drop-shadow(0 0 12px rgba(37, 99, 235, 0.8));
        }
      }
      
      /* Smooth theme transitions */
      .mermaid * {
        transition: fill 0.4s ease, stroke 0.4s ease, color 0.4s ease;
      }
      
      /* Loading state for complex diagrams */
      .diagram-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        font-size: 14px;
        color: #64748b;
      }
      
      .diagram-loading::before {
        content: '';
        width: 20px;
        height: 20px;
        border: 2px solid rgba(37, 99, 235, 0.3);
        border-top: 2px solid #2563eb;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 12px;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  function initializeDiagramAnimations() {
    const mermaidContainers = document.querySelectorAll('.docusaurus-mermaid-container');
    
    mermaidContainers.forEach((container, index) => {
      const svg = container.querySelector('svg');
      if (!svg) return;
      
      // Add interactive controls
      addDiagramControls(container);
      
      // Initialize progressive reveal
      initializeProgressiveReveal(container, svg);
      
      // Add interactive tooltips
      addInteractiveTooltips(container, svg);
      
      // Initialize flow animations
      initializeFlowAnimations(svg);
      
      // Add concept grouping
      addConceptGrouping(svg);
    });
  }

  function addDiagramControls(container) {
    const controls = document.createElement('div');
    controls.className = 'diagram-controls';
    controls.innerHTML = `
      <button class="diagram-control-btn" data-action="play">▶ Play</button>
      <button class="diagram-control-btn" data-action="reset">↻ Reset</button>
      <button class="diagram-control-btn" data-action="explain">💡 Explain</button>
    `;
    
    container.appendChild(controls);
    
    // Add event listeners
    controls.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      if (action) {
        handleDiagramAction(container, action);
      }
    });
  }

  function handleDiagramAction(container, action) {
    const svg = container.querySelector('svg');
    
    switch (action) {
      case 'play':
        playDiagramAnimation(container, svg);
        break;
      case 'reset':
        resetDiagramAnimation(container, svg);
        break;
      case 'explain':
        toggleExplanation(container);
        break;
    }
  }

  function initializeProgressiveReveal(container, svg) {
    const nodes = svg.querySelectorAll('.node');
    const edges = svg.querySelectorAll('.edgePath');
    
    // Hide all elements initially
    [...nodes, ...edges].forEach(el => {
      el.classList.add('mermaid-step');
    });
    
    // Progressive reveal on scroll or interaction
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            revealDiagramSteps(container, svg);
          }, 500);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(container);
  }

  function revealDiagramSteps(container, svg) {
    const steps = svg.querySelectorAll('.mermaid-step');
    
    steps.forEach((step, index) => {
      setTimeout(() => {
        step.classList.add('revealed');
        
        // Add explanation for each step
        if (index === 0) {
          showStepExplanation(container, 'Starting with the core components...');
        } else if (index === Math.floor(steps.length / 2)) {
          showStepExplanation(container, 'Connections between components...');
        } else if (index === steps.length - 1) {
          showStepExplanation(container, 'Complete system overview');
        }
      }, index * 300);
    });
  }

  function addInteractiveTooltips(container, svg) {
    const nodes = svg.querySelectorAll('.node');
    
    nodes.forEach(node => {
      node.addEventListener('mouseenter', (e) => {
        const tooltip = createTooltip(node);
        container.appendChild(tooltip);
        
        // Position tooltip
        const rect = node.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        tooltip.style.left = `${rect.left - containerRect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - containerRect.top - 10}px`;
        tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
        
        setTimeout(() => tooltip.classList.add('visible'), 10);
      });
      
      node.addEventListener('mouseleave', () => {
        const tooltip = container.querySelector('.diagram-tooltip');
        if (tooltip) {
          tooltip.remove();
        }
      });
    });
  }

  function createTooltip(node) {
    const tooltip = document.createElement('div');
    tooltip.className = 'diagram-tooltip';
    
    // Extract node information
    const textElement = node.querySelector('text');
    const nodeText = textElement ? textElement.textContent : 'Component';
    
    // Generate contextual explanation
    const explanation = generateNodeExplanation(nodeText);
    tooltip.textContent = explanation;
    
    return tooltip;
  }

  function generateNodeExplanation(nodeText) {
    const explanations = {
      'OmniDragon': 'Core protocol managing cross-chain token operations and jackpot distributions',
      'LayerZero': 'Cross-chain messaging protocol enabling seamless token transfers',
      'Chainlink VRF': 'Verifiable random function providing secure randomness for jackpots',
      'Token': 'ERC-20 compatible token with built-in jackpot mechanics',
      'Vault': 'Secure storage for jackpot funds and token reserves',
      'Bridge': 'Cross-chain bridge facilitating token transfers between networks',
      'Oracle': 'External data provider for price feeds and randomness',
      'Governance': 'Decentralized governance system for protocol parameters'
    };
    
    // Find best match
    for (const [key, value] of Object.entries(explanations)) {
      if (nodeText.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    
    return `${nodeText}: Click to learn more about this component`;
  }

  function initializeFlowAnimations(svg) {
    const paths = svg.querySelectorAll('.edgePath path');
    
    paths.forEach(path => {
      // Add flowing animation
      path.style.strokeDasharray = '5, 5';
      path.style.animation = 'flowAnimation 3s linear infinite';
      
      // Add data flow particles
      if (anime) {
        createDataFlowParticles(path);
      }
    });
  }

  function createDataFlowParticles(path) {
    const pathLength = path.getTotalLength();
    const particle = document.createElement('div');
    particle.className = 'data-flow-particle';
    path.parentElement.appendChild(particle);
    
    if (anime) {
      anime({
        targets: particle,
        opacity: [0, 1, 0],
        duration: 2000,
        loop: true,
        easing: 'easeInOutQuad',
        update: function(anim) {
          const progress = anim.progress / 100;
          const point = path.getPointAtLength(pathLength * progress);
          particle.style.left = `${point.x}px`;
          particle.style.top = `${point.y}px`;
        }
      });
    }
  }

  function addConceptGrouping(svg) {
    // Group related nodes by concept
    const nodes = svg.querySelectorAll('.node');
    const concepts = new Map();
    
    nodes.forEach(node => {
      const text = node.querySelector('text')?.textContent || '';
      const concept = categorizeNode(text);
      
      if (!concepts.has(concept)) {
        concepts.set(concept, []);
      }
      concepts.get(concept).push(node);
    });
    
    // Apply concept-based animations
    concepts.forEach((nodeGroup, concept) => {
      nodeGroup.forEach((node, index) => {
        node.classList.add('concept-group');
        node.classList.add(`complexity-level-${Math.min(4, Math.floor(index / 2) + 1)}`);
      });
    });
  }

  function categorizeNode(text) {
    const categories = {
      'core': ['omnidragon', 'token', 'vault'],
      'bridge': ['layerzero', 'bridge', 'cross-chain'],
      'oracle': ['chainlink', 'vrf', 'oracle', 'drand'],
      'governance': ['governance', 'voting', 'dao']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        return category;
      }
    }
    
    return 'misc';
  }

  function playDiagramAnimation(container, svg) {
    // Reset and play full animation sequence
    resetDiagramAnimation(container, svg);
    
    setTimeout(() => {
      revealDiagramSteps(container, svg);
      
      // Highlight key components in sequence
      setTimeout(() => {
        highlightKeyComponents(svg);
      }, 2000);
    }, 500);
  }

  function resetDiagramAnimation(container, svg) {
    // Remove all animation classes
    const elements = svg.querySelectorAll('.mermaid-step, .concept-group');
    elements.forEach(el => {
      el.classList.remove('revealed');
    });
    
    // Clear explanations
    const explanation = container.querySelector('.diagram-explanation');
    if (explanation) {
      explanation.remove();
    }
  }

  function highlightKeyComponents(svg) {
    const keyNodes = svg.querySelectorAll('.node');
    
    keyNodes.forEach((node, index) => {
      setTimeout(() => {
        node.classList.add('mermaid-highlight');
        
        setTimeout(() => {
          node.classList.remove('mermaid-highlight');
        }, 1500);
      }, index * 800);
    });
  }

  function showStepExplanation(container, text) {
    // Remove existing explanation
    const existing = container.querySelector('.diagram-explanation');
    if (existing) {
      existing.remove();
    }
    
    const explanation = document.createElement('div');
    explanation.className = 'diagram-explanation';
    explanation.textContent = text;
    
    container.appendChild(explanation);
    
    setTimeout(() => {
      explanation.classList.add('active');
    }, 100);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      explanation.classList.remove('active');
      setTimeout(() => explanation.remove(), 400);
    }, 3000);
  }

  function toggleExplanation(container) {
    const existing = container.querySelector('.diagram-explanation');
    
    if (existing) {
      existing.remove();
    } else {
      showStepExplanation(container, 'This diagram shows the interconnected components of the OmniDragon protocol. Each node represents a key component, and the connections show how data and tokens flow through the system.');
    }
  }

  function initializeScrollAnimations() {
    // Enhanced scroll-triggered animations for better understanding
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          if (element.classList.contains('docusaurus-mermaid-container')) {
            // Trigger diagram animation
            setTimeout(() => {
              const svg = element.querySelector('svg');
              if (svg) {
                revealDiagramSteps(element, svg);
              }
            }, 300);
          }
        }
      });
    }, { 
      threshold: 0.2,
      rootMargin: '50px'
    });
    
    // Observe all mermaid containers
    document.querySelectorAll('.docusaurus-mermaid-container').forEach(container => {
      observer.observe(container);
    });
  }

  function initializeInteractiveExplanations() {
    // Add click handlers for detailed explanations
    document.addEventListener('click', (e) => {
      const node = e.target.closest('.mermaid .node');
      if (node) {
        const container = node.closest('.docusaurus-mermaid-container');
        if (container) {
          showDetailedExplanation(container, node);
        }
      }
    });
  }

  function showDetailedExplanation(container, node) {
    const textElement = node.querySelector('text');
    const nodeText = textElement ? textElement.textContent : 'Component';
    
    const detailedExplanations = {
      'OmniDragon': 'The OmniDragon protocol is the central hub that coordinates all cross-chain operations. It manages token minting, burning, and jackpot distributions across multiple blockchain networks.',
      'LayerZero': 'LayerZero provides the cross-chain messaging infrastructure that enables OmniDragon tokens to move seamlessly between different blockchain networks while maintaining security and decentralization.',
      'Chainlink VRF': 'Chainlink VRF (Verifiable Random Function) ensures that jackpot distributions are truly random and cannot be manipulated, providing cryptographic proof of randomness.',
      'Token': 'The OmniDragon token is an advanced ERC-20 token with built-in cross-chain capabilities and automatic jackpot mechanics triggered by specific conditions.',
      'Vault': 'The vault securely stores jackpot funds and manages the distribution mechanism, ensuring that rewards are distributed fairly and transparently.',
      'Bridge': 'The bridge component facilitates secure token transfers between different blockchain networks, maintaining the total supply balance across all chains.'
    };
    
    let explanation = detailedExplanations[nodeText] || `${nodeText}: This component plays a crucial role in the OmniDragon ecosystem. Click the explain button to learn more about how it interacts with other components.`;
    
    showStepExplanation(container, explanation);
  }
}
