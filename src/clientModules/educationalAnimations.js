/**
 * Educational Animations Module for OmniDragon Docs
 * 
 * This module creates sophisticated educational animations that help readers
 * understand complex blockchain and DeFi concepts through visual storytelling.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import anime from 'animejs/lib/anime.es.js';

if (ExecutionEnvironment.canUseDOM) {
  let anime;
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEducationalAnimations);
  } else {
    initializeEducationalAnimations();
  }

  async function initializeEducationalAnimations() {
    console.log('📚 Initializing educational animations...');
    
    // Load anime.js
    try {
      anime = (await import('animejs')).default;
    } catch (error) {
      console.warn('Anime.js not available for educational animations');
      return;
    }
    
    // Add educational animation styles
    addEducationalStyles();
    
    // Initialize concept-specific animations
    setTimeout(() => {
      initializeConceptAnimations();
    }, 2000);
  }

  function addEducationalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Educational animation container */
      .educational-animation {
        position: relative;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border-radius: 12px;
        padding: 24px;
        margin: 24px 0;
        overflow: hidden;
        border: 1px solid rgba(37, 99, 235, 0.1);
      }
      
      .educational-animation::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa);
        opacity: 0;
        animation: progressBar 8s ease-in-out infinite;
      }
      
      @keyframes progressBar {
        0%, 100% { opacity: 0; transform: translateX(-100%); }
        10%, 90% { opacity: 1; transform: translateX(0); }
      }
      
      /* Cross-chain flow animation */
      .cross-chain-flow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 200px;
        position: relative;
      }
      
      .blockchain-node {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2563eb, #3b82f6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        text-align: center;
        position: relative;
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .blockchain-node.active {
        opacity: 1;
        transform: scale(1);
        box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
      }
      
      .blockchain-node.highlighted {
        animation: nodeHighlight 2s ease-in-out infinite;
      }
      
      @keyframes nodeHighlight {
        0%, 100% { 
          transform: scale(1);
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
        }
        50% { 
          transform: scale(1.1);
          box-shadow: 0 0 30px rgba(37, 99, 235, 0.8);
        }
      }
      
      .connection-line {
        position: absolute;
        height: 3px;
        background: linear-gradient(90deg, #2563eb, #60a5fa);
        top: 50%;
        transform: translateY(-50%);
        opacity: 0;
        border-radius: 2px;
      }
      
      .connection-line.animated {
        opacity: 1;
        animation: connectionFlow 3s ease-in-out infinite;
      }
      
      @keyframes connectionFlow {
        0% { 
          background: linear-gradient(90deg, #2563eb 0%, #60a5fa 0%, transparent 0%);
        }
        50% { 
          background: linear-gradient(90deg, #2563eb 0%, #60a5fa 50%, transparent 50%);
        }
        100% { 
          background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%, transparent 100%);
        }
      }
      
      /* Token flow particles */
      .token-particle {
        position: absolute;
        width: 12px;
        height: 12px;
        background: #fbbf24;
        border-radius: 50%;
        opacity: 0;
        box-shadow: 0 0 8px rgba(251, 191, 36, 0.6);
        z-index: 10;
      }
      
      /* Jackpot animation */
      .jackpot-visualization {
        position: relative;
        height: 150px;
        background: radial-gradient(circle at center, rgba(251, 191, 36, 0.1) 0%, transparent 70%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      
      .jackpot-center {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        position: relative;
        z-index: 2;
      }
      
      .jackpot-ring {
        position: absolute;
        border: 2px solid rgba(251, 191, 36, 0.3);
        border-radius: 50%;
        opacity: 0;
      }
      
      .jackpot-ring.animated {
        animation: jackpotRipple 3s ease-out infinite;
      }
      
      @keyframes jackpotRipple {
        0% {
          width: 60px;
          height: 60px;
          opacity: 1;
        }
        100% {
          width: 200px;
          height: 200px;
          opacity: 0;
        }
      }
      
      /* VRF randomness visualization */
      .vrf-visualization {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 8px;
        padding: 20px;
        background: rgba(15, 23, 42, 0.05);
        border-radius: 8px;
      }
      
      .random-block {
        width: 30px;
        height: 30px;
        background: #e2e8f0;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: #64748b;
        transition: all 0.3s ease;
      }
      
      .random-block.generating {
        background: linear-gradient(135deg, #2563eb, #3b82f6);
        color: white;
        animation: randomGeneration 0.5s ease-in-out;
      }
      
      @keyframes randomGeneration {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
      
      /* Governance voting animation */
      .governance-visualization {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 20px;
        background: rgba(34, 197, 94, 0.05);
        border-radius: 8px;
      }
      
      .vote-bar {
        height: 20px;
        background: #e2e8f0;
        border-radius: 10px;
        position: relative;
        overflow: hidden;
      }
      
      .vote-progress {
        height: 100%;
        background: linear-gradient(90deg, #22c55e, #16a34a);
        border-radius: 10px;
        width: 0%;
        transition: width 2s ease-out;
        position: relative;
      }
      
      .vote-progress::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: voteShimmer 2s ease-in-out infinite;
      }
      
      @keyframes voteShimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      /* Concept explanation overlay */
      .concept-explanation {
        position: absolute;
        bottom: 16px;
        left: 16px;
        right: 16px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 8px;
        padding: 16px;
        font-size: 14px;
        line-height: 1.5;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s ease;
        border: 1px solid rgba(37, 99, 235, 0.1);
      }
      
      .concept-explanation.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Interactive learning controls */
      .learning-controls {
        display: flex;
        gap: 12px;
        margin-top: 16px;
        justify-content: center;
      }
      
      .learning-btn {
        background: linear-gradient(135deg, #2563eb, #3b82f6);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 16px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      
      .learning-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      }
      
      .learning-btn:active {
        transform: translateY(0);
      }
      
      .learning-btn.secondary {
        background: linear-gradient(135deg, #64748b, #475569);
      }
      
      /* Step indicator */
      .step-indicator {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-bottom: 20px;
      }
      
      .step-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #e2e8f0;
        transition: all 0.3s ease;
      }
      
      .step-dot.active {
        background: #2563eb;
        transform: scale(1.2);
      }
      
      .step-dot.completed {
        background: #22c55e;
      }
      
      /* Dark mode support */
      [data-theme='dark'] .educational-animation {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        border-color: rgba(59, 130, 246, 0.2);
      }
      
      [data-theme='dark'] .concept-explanation {
        background: rgba(15, 23, 42, 0.95);
        color: #e2e8f0;
        border-color: rgba(59, 130, 246, 0.2);
      }
      
      [data-theme='dark'] .vrf-visualization {
        background: rgba(15, 23, 42, 0.3);
      }
      
      [data-theme='dark'] .governance-visualization {
        background: rgba(34, 197, 94, 0.1);
      }
    `;
    document.head.appendChild(style);
  }

  function initializeConceptAnimations() {
    // Initialize cross-chain flow animations
    initializeCrossChainAnimations();
    
    // Initialize jackpot animations
    initializeJackpotAnimations();
    
    // Initialize VRF randomness animations
    initializeVRFAnimations();
    
    // Initialize governance animations
    initializeGovernanceAnimations();
    
    // Add educational overlays to existing diagrams
    enhanceExistingDiagrams();
  }

  function initializeCrossChainAnimations() {
    const crossChainDiagrams = document.querySelectorAll('[data-concept="cross-chain"]');
    
    crossChainDiagrams.forEach(diagram => {
      createCrossChainVisualization(diagram);
    });
  }

  function createCrossChainVisualization(container) {
    const visualization = document.createElement('div');
    visualization.className = 'educational-animation';
    visualization.innerHTML = `
      <div class="step-indicator">
        <div class="step-dot active"></div>
        <div class="step-dot"></div>
        <div class="step-dot"></div>
        <div class="step-dot"></div>
      </div>
      
      <div class="cross-chain-flow">
        <div class="blockchain-node" data-chain="ethereum">
          ETH
        </div>
        <div class="connection-line" style="left: 90px; width: calc(100% - 180px);"></div>
        <div class="blockchain-node" data-chain="polygon">
          POLY
        </div>
      </div>
      
      <div class="concept-explanation">
        <strong>Cross-Chain Token Transfer:</strong> Watch how OmniDragon tokens move seamlessly between Ethereum and Polygon networks using LayerZero's messaging protocol.
      </div>
      
      <div class="learning-controls">
        <button class="learning-btn" data-action="play">▶ Start Animation</button>
        <button class="learning-btn secondary" data-action="reset">↻ Reset</button>
        <button class="learning-btn secondary" data-action="explain">💡 Explain</button>
      </div>
    `;
    
    container.appendChild(visualization);
    
    // Add event listeners
    const controls = visualization.querySelector('.learning-controls');
    controls.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      if (action) {
        handleCrossChainAction(visualization, action);
      }
    });
  }

  function handleCrossChainAction(container, action) {
    switch (action) {
      case 'play':
        playCrossChainAnimation(container);
        break;
      case 'reset':
        resetCrossChainAnimation(container);
        break;
      case 'explain':
        toggleCrossChainExplanation(container);
        break;
    }
  }

  function playCrossChainAnimation(container) {
    const nodes = container.querySelectorAll('.blockchain-node');
    const line = container.querySelector('.connection-line');
    const explanation = container.querySelector('.concept-explanation');
    const steps = container.querySelectorAll('.step-dot');
    
    // Reset
    nodes.forEach(node => node.classList.remove('active', 'highlighted'));
    line.classList.remove('animated');
    explanation.classList.remove('visible');
    steps.forEach((step, i) => {
      step.classList.remove('active', 'completed');
      if (i === 0) step.classList.add('active');
    });
    
    // Step 1: Show source chain
    setTimeout(() => {
      nodes[0].classList.add('active');
      updateStep(steps, 0, 'User initiates transfer on Ethereum');
    }, 500);
    
    // Step 2: Activate connection
    setTimeout(() => {
      line.classList.add('animated');
      updateStep(steps, 1, 'LayerZero processes cross-chain message');
      createTokenParticle(container, nodes[0], nodes[1]);
    }, 1500);
    
    // Step 3: Show destination chain
    setTimeout(() => {
      nodes[1].classList.add('active');
      updateStep(steps, 2, 'Tokens arrive on Polygon network');
    }, 3000);
    
    // Step 4: Complete
    setTimeout(() => {
      nodes.forEach(node => node.classList.add('highlighted'));
      updateStep(steps, 3, 'Cross-chain transfer completed successfully');
      explanation.classList.add('visible');
    }, 4000);
  }

  function createTokenParticle(container, fromNode, toNode) {
    const particle = document.createElement('div');
    particle.className = 'token-particle';
    container.appendChild(particle);
    
    const fromRect = fromNode.getBoundingClientRect();
    const toRect = toNode.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const startX = fromRect.left - containerRect.left + fromRect.width / 2;
    const startY = fromRect.top - containerRect.top + fromRect.height / 2;
    const endX = toRect.left - containerRect.left + toRect.width / 2;
    const endY = toRect.top - containerRect.top + toRect.height / 2;
    
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    
    if (anime) {
      anime({
        targets: particle,
        left: endX,
        top: endY,
        opacity: [0, 1, 0],
        scale: [0.5, 1, 0.5],
        duration: 2000,
        easing: 'easeInOutQuad',
        complete: () => particle.remove()
      });
    }
  }

  function updateStep(steps, activeIndex, message) {
    steps.forEach((step, i) => {
      step.classList.remove('active');
      if (i < activeIndex) {
        step.classList.add('completed');
      } else if (i === activeIndex) {
        step.classList.add('active');
      }
    });
  }

  function initializeJackpotAnimations() {
    const jackpotDiagrams = document.querySelectorAll('[data-concept="jackpot"]');
    
    jackpotDiagrams.forEach(diagram => {
      createJackpotVisualization(diagram);
    });
  }

  function createJackpotVisualization(container) {
    const visualization = document.createElement('div');
    visualization.className = 'educational-animation';
    visualization.innerHTML = `
      <div class="jackpot-visualization">
        <div class="jackpot-ring animated" style="animation-delay: 0s;"></div>
        <div class="jackpot-ring animated" style="animation-delay: 1s;"></div>
        <div class="jackpot-ring animated" style="animation-delay: 2s;"></div>
        <div class="jackpot-center">
          🎰
        </div>
      </div>
      
      <div class="concept-explanation visible">
        <strong>Automatic Jackpot System:</strong> When specific conditions are met (like reaching transaction thresholds), the smart contract automatically triggers a jackpot distribution using verifiable randomness.
      </div>
      
      <div class="learning-controls">
        <button class="learning-btn" data-action="trigger">🎯 Trigger Jackpot</button>
        <button class="learning-btn secondary" data-action="explain">📊 Show Stats</button>
      </div>
    `;
    
    container.appendChild(visualization);
  }

  function initializeVRFAnimations() {
    const vrfDiagrams = document.querySelectorAll('[data-concept="randomness"]');
    
    vrfDiagrams.forEach(diagram => {
      createVRFVisualization(diagram);
    });
  }

  function createVRFVisualization(container) {
    const visualization = document.createElement('div');
    visualization.className = 'educational-animation';
    
    const blocks = Array.from({length: 16}, (_, i) => 
      `<div class="random-block" data-index="${i}">?</div>`
    ).join('');
    
    visualization.innerHTML = `
      <div class="vrf-visualization">
        ${blocks}
      </div>
      
      <div class="concept-explanation">
        <strong>Verifiable Random Function (VRF):</strong> Chainlink VRF generates cryptographically secure random numbers that cannot be manipulated, ensuring fair jackpot distributions.
      </div>
      
      <div class="learning-controls">
        <button class="learning-btn" data-action="generate">🎲 Generate Random</button>
        <button class="learning-btn secondary" data-action="verify">✓ Verify</button>
      </div>
    `;
    
    container.appendChild(visualization);
    
    // Add event listeners
    const controls = visualization.querySelector('.learning-controls');
    controls.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      if (action === 'generate') {
        generateRandomSequence(visualization);
      }
    });
  }

  function generateRandomSequence(container) {
    const blocks = container.querySelectorAll('.random-block');
    const explanation = container.querySelector('.concept-explanation');
    
    blocks.forEach((block, index) => {
      setTimeout(() => {
        block.classList.add('generating');
        const randomNum = Math.floor(Math.random() * 16).toString(16).toUpperCase();
        block.textContent = randomNum;
        
        setTimeout(() => {
          block.classList.remove('generating');
        }, 500);
      }, index * 100);
    });
    
    setTimeout(() => {
      explanation.classList.add('visible');
    }, blocks.length * 100 + 500);
  }

  function initializeGovernanceAnimations() {
    const govDiagrams = document.querySelectorAll('[data-concept="governance"]');
    
    govDiagrams.forEach(diagram => {
      createGovernanceVisualization(diagram);
    });
  }

  function createGovernanceVisualization(container) {
    const visualization = document.createElement('div');
    visualization.className = 'educational-animation';
    visualization.innerHTML = `
      <div class="governance-visualization">
        <div class="vote-bar">
          <div class="vote-progress" data-proposal="fee-reduction"></div>
        </div>
        <div class="vote-bar">
          <div class="vote-progress" data-proposal="new-feature"></div>
        </div>
        <div class="vote-bar">
          <div class="vote-progress" data-proposal="security-upgrade"></div>
        </div>
      </div>
      
      <div class="concept-explanation">
        <strong>Decentralized Governance:</strong> Token holders vote on protocol changes. Each proposal requires a minimum threshold to pass, ensuring community consensus.
      </div>
      
      <div class="learning-controls">
        <button class="learning-btn" data-action="vote">🗳️ Cast Votes</button>
        <button class="learning-btn secondary" data-action="results">📊 Show Results</button>
      </div>
    `;
    
    container.appendChild(visualization);
    
    // Add event listeners
    const controls = visualization.querySelector('.learning-controls');
    controls.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      if (action === 'vote') {
        simulateVoting(visualization);
      }
    });
  }

  function simulateVoting(container) {
    const progressBars = container.querySelectorAll('.vote-progress');
    const targetWidths = ['75%', '45%', '85%'];
    
    progressBars.forEach((bar, index) => {
      setTimeout(() => {
        bar.style.width = targetWidths[index];
      }, index * 500);
    });
  }

  function enhanceExistingDiagrams() {
    // Add educational enhancements to existing Mermaid diagrams
    const mermaidContainers = document.querySelectorAll('.docusaurus-mermaid-container');
    
    mermaidContainers.forEach(container => {
      // Detect diagram type and add appropriate educational features
      const svg = container.querySelector('svg');
      if (svg) {
        const diagramType = detectDiagramType(svg);
        addEducationalEnhancements(container, diagramType);
      }
    });
  }

  function detectDiagramType(svg) {
    const text = svg.textContent.toLowerCase();
    
    if (text.includes('layerzero') || text.includes('cross-chain') || text.includes('bridge')) {
      return 'cross-chain';
    } else if (text.includes('jackpot') || text.includes('lottery') || text.includes('reward')) {
      return 'jackpot';
    } else if (text.includes('vrf') || text.includes('random') || text.includes('chainlink')) {
      return 'randomness';
    } else if (text.includes('governance') || text.includes('voting') || text.includes('dao')) {
      return 'governance';
    }
    
    return 'general';
  }

  function addEducationalEnhancements(container, type) {
    // Add concept-specific educational overlays
    const enhancement = document.createElement('div');
    enhancement.className = 'concept-explanation';
    
    const explanations = {
      'cross-chain': 'This diagram shows how tokens move between different blockchain networks while maintaining security and decentralization.',
      'jackpot': 'Automatic jackpot distribution system that triggers based on predefined conditions and uses verifiable randomness.',
      'randomness': 'Cryptographically secure random number generation that ensures fair and unpredictable outcomes.',
      'governance': 'Decentralized decision-making process where token holders vote on protocol changes and improvements.',
      'general': 'Interactive diagram showing the relationships between different components of the OmniDragon protocol.'
    };
    
    enhancement.textContent = explanations[type];
    container.appendChild(enhancement);
    
    // Show explanation on hover
    container.addEventListener('mouseenter', () => {
      enhancement.classList.add('visible');
    });
    
    container.addEventListener('mouseleave', () => {
      enhancement.classList.remove('visible');
    });
  }

  function resetCrossChainAnimation(container) {
    const nodes = container.querySelectorAll('.blockchain-node');
    const line = container.querySelector('.connection-line');
    const explanation = container.querySelector('.concept-explanation');
    const steps = container.querySelectorAll('.step-dot');
    
    nodes.forEach(node => node.classList.remove('active', 'highlighted'));
    line.classList.remove('animated');
    explanation.classList.remove('visible');
    steps.forEach((step, i) => {
      step.classList.remove('active', 'completed');
      if (i === 0) step.classList.add('active');
    });
  }

  function toggleCrossChainExplanation(container) {
    const explanation = container.querySelector('.concept-explanation');
    explanation.classList.toggle('visible');
  }
}

// Educational Animation System for Interactive Learning
class EducationalAnimationSystem {
  constructor() {
    this.isInitialized = false;
    this.activeTours = new Map();
    this.tooltips = new Map();
    this.stepByStepModes = new Map();
    this.currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    // Educational content templates
    this.educationalContent = {
      flowchart: {
        title: "Understanding Flow Diagrams",
        description: "Flow diagrams show the sequence of operations and decision points in a process.",
        steps: [
          { selector: '.node', content: "These are process nodes - each represents a step or action" },
          { selector: '.edgePath', content: "These arrows show the flow direction between steps" },
          { selector: '[class*="decision"]', content: "Diamond shapes represent decision points" }
        ]
      },
      sequence: {
        title: "Sequence Diagram Walkthrough",
        description: "Sequence diagrams show how different components interact over time.",
        steps: [
          { selector: '.actor', content: "These are the participants or actors in the sequence" },
          { selector: '.messageLine0, .messageLine1', content: "These lines represent messages between actors" },
          { selector: '.activation', content: "These bars show when an actor is actively processing" }
        ]
      },
      class: {
        title: "Class Diagram Guide",
        description: "Class diagrams show the structure and relationships between classes.",
        steps: [
          { selector: '.classBox', content: "These boxes represent classes with their properties and methods" },
          { selector: '.relation', content: "These lines show relationships between classes" }
        ]
      }
    };
  }

  init() {
    if (this.isInitialized) return;
    
    console.log('📚 Initializing Educational Animation System...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupEducationalFeatures());
    } else {
      this.setupEducationalFeatures();
    }
    
    this.isInitialized = true;
  }

  setupEducationalFeatures() {
    // Observe for new Mermaid diagrams
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.processEducationalDiagrams(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Process existing diagrams
    this.processEducationalDiagrams(document);
  }

  processEducationalDiagrams(container) {
    const mermaidContainers = container.querySelectorAll?.('.docusaurus-mermaid-container') || 
                             (container.classList?.contains('docusaurus-mermaid-container') ? [container] : []);

    mermaidContainers.forEach((container, index) => {
      setTimeout(() => {
        this.addEducationalFeatures(container);
      }, 200 + index * 100);
    });
  }

  addEducationalFeatures(container) {
    const svg = container.querySelector('svg');
    if (!svg) return;

    // Detect diagram type
    const diagramType = this.detectDiagramType(svg);
    
    // Add educational controls
    this.addEducationalControls(container, svg, diagramType);
    
    // Add interactive tooltips
    this.addInteractiveTooltips(container, svg, diagramType);
    
    // Add step-by-step mode
    this.addStepByStepMode(container, svg, diagramType);
    
    // Add contextual help
    this.addContextualHelp(container, svg, diagramType);
  }

  detectDiagramType(svg) {
    const svgContent = svg.innerHTML.toLowerCase();
    
    if (svgContent.includes('flowchart') || svgContent.includes('graph')) return 'flowchart';
    if (svgContent.includes('sequence')) return 'sequence';
    if (svgContent.includes('class')) return 'class';
    if (svgContent.includes('state')) return 'state';
    
    return 'flowchart'; // default
  }

  addEducationalControls(container, svg, diagramType) {
    // Create educational control panel
    const controlPanel = document.createElement('div');
    controlPanel.className = 'educational-controls';
    controlPanel.style.cssText = `
      position: absolute;
      bottom: 10px;
      left: 10px;
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 20;
    `;

    // Step-by-step button
    const stepButton = this.createControlButton('📖', 'Step-by-step guide');
    stepButton.addEventListener('click', () => this.startStepByStepTour(container, svg, diagramType));

    // Interactive mode button
    const interactiveButton = this.createControlButton('🎯', 'Interactive mode');
    interactiveButton.addEventListener('click', () => this.toggleInteractiveMode(container, svg));

    // Explanation button
    const explainButton = this.createControlButton('💡', 'Explain diagram');
    explainButton.addEventListener('click', () => this.showDiagramExplanation(container, diagramType));

    // Quiz mode button
    const quizButton = this.createControlButton('🧠', 'Quiz mode');
    quizButton.addEventListener('click', () => this.startQuizMode(container, svg, diagramType));

    controlPanel.appendChild(stepButton);
    controlPanel.appendChild(interactiveButton);
    controlPanel.appendChild(explainButton);
    controlPanel.appendChild(quizButton);

    container.appendChild(controlPanel);

    // Show controls on hover
    container.addEventListener('mouseenter', () => {
      anime({
        targets: controlPanel,
        opacity: 1,
        translateY: [-10, 0],
        duration: 200
      });
    });

    container.addEventListener('mouseleave', () => {
      anime({
        targets: controlPanel,
        opacity: 0,
        translateY: 10,
        duration: 200
      });
    });
  }

  createControlButton(icon, title) {
    const button = document.createElement('button');
    button.innerHTML = icon;
    button.title = title;
    button.style.cssText = `
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border: none;
      border-radius: 6px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    `;

    button.addEventListener('mouseenter', () => {
      anime({
        targets: button,
        scale: 1.1,
        background: 'rgba(0, 0, 0, 0.9)',
        duration: 150
      });
    });

    button.addEventListener('mouseleave', () => {
      anime({
        targets: button,
        scale: 1,
        background: 'rgba(0, 0, 0, 0.8)',
        duration: 150
      });
    });

    return button;
  }

  addInteractiveTooltips(container, svg, diagramType) {
    const elements = svg.querySelectorAll('.node, .actor, .classBox, .edgePath, .messageLine0, .messageLine1');
    
    elements.forEach((element, index) => {
      element.style.cursor = 'pointer';
      
      element.addEventListener('mouseenter', (e) => {
        this.showTooltip(e, element, diagramType, index);
      });

      element.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });

      // Add click for detailed info
      element.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showDetailedInfo(element, diagramType, index);
      });
    });
  }

  showTooltip(event, element, diagramType, index) {
    const tooltip = document.createElement('div');
    tooltip.className = 'educational-tooltip';
    
    const content = this.getTooltipContent(element, diagramType, index);
    
    tooltip.innerHTML = `
      <div class="tooltip-header">${content.title}</div>
      <div class="tooltip-body">${content.description}</div>
    `;
    
    tooltip.style.cssText = `
      position: fixed;
      background: ${this.currentTheme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
      color: ${this.currentTheme === 'dark' ? '#f1f5f9' : '#1e293b'};
      border: 1px solid ${this.currentTheme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
      border-radius: 8px;
      padding: 12px;
      max-width: 250px;
      font-size: 14px;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      pointer-events: none;
      opacity: 0;
      transform: translateY(10px);
    `;

    document.body.appendChild(tooltip);

    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;

    // Animate in
    anime({
      targets: tooltip,
      opacity: 1,
      translateY: 0,
      duration: 200,
      easing: 'easeOutQuart'
    });

    this.currentTooltip = tooltip;
  }

  hideTooltip() {
    if (this.currentTooltip) {
      anime({
        targets: this.currentTooltip,
        opacity: 0,
        translateY: 10,
        duration: 150,
        complete: () => {
          if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
          }
        }
      });
    }
  }

  getTooltipContent(element, diagramType, index) {
    const className = element.className.baseVal || element.className;
    
    if (className.includes('node') || className.includes('flowchart-node')) {
      return {
        title: 'Process Node',
        description: 'Represents a step or action in the workflow. Click for more details.'
      };
    }
    
    if (className.includes('actor')) {
      return {
        title: 'Actor/Participant',
        description: 'A participant in the sequence. Represents a system, user, or component.'
      };
    }
    
    if (className.includes('classBox')) {
      return {
        title: 'Class',
        description: 'Represents a class with its properties and methods.'
      };
    }
    
    if (className.includes('edge') || className.includes('message')) {
      return {
        title: 'Connection',
        description: 'Shows the relationship or flow between elements.'
      };
    }
    
    return {
      title: 'Diagram Element',
      description: 'Part of the diagram structure. Click to learn more.'
    };
  }

  startStepByStepTour(container, svg, diagramType) {
    const content = this.educationalContent[diagramType];
    if (!content) return;

    // Create tour overlay
    const overlay = document.createElement('div');
    overlay.className = 'step-by-step-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Create tour content
    const tourContent = document.createElement('div');
    tourContent.style.cssText = `
      background: ${this.currentTheme === 'dark' ? '#1e293b' : '#ffffff'};
      color: ${this.currentTheme === 'dark' ? '#f1f5f9' : '#1e293b'};
      border-radius: 12px;
      padding: 2rem;
      max-width: 500px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;

    let currentStep = 0;
    
    const updateTourContent = () => {
      if (currentStep === 0) {
        tourContent.innerHTML = `
          <h2 style="margin-top: 0; color: #CD7D58;">${content.title}</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 2rem;">${content.description}</p>
          <button class="tour-btn tour-start" style="background: #CD7D58; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 500;">Start Tour</button>
          <button class="tour-btn tour-close" style="background: transparent; color: #64748b; border: 1px solid #cbd5e1; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; margin-left: 12px;">Close</button>
        `;
      } else if (currentStep <= content.steps.length) {
        const step = content.steps[currentStep - 1];
        tourContent.innerHTML = `
          <h3 style="margin-top: 0; color: #CD7D58;">Step ${currentStep} of ${content.steps.length}</h3>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 2rem;">${step.content}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <button class="tour-btn tour-prev" ${currentStep === 1 ? 'disabled' : ''} style="background: transparent; color: #64748b; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Previous</button>
            <span style="color: #64748b;">${currentStep} / ${content.steps.length}</span>
            <button class="tour-btn tour-next" style="background: #CD7D58; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">${currentStep === content.steps.length ? 'Finish' : 'Next'}</button>
          </div>
        `;
        
        // Highlight current step elements
        this.highlightStepElements(svg, step.selector);
      }
    };

    updateTourContent();

    // Event delegation for tour buttons
    tourContent.addEventListener('click', (e) => {
      if (e.target.classList.contains('tour-start')) {
        currentStep = 1;
        updateTourContent();
      } else if (e.target.classList.contains('tour-next')) {
        if (currentStep < content.steps.length) {
          currentStep++;
          updateTourContent();
        } else {
          this.closeTour(overlay);
        }
      } else if (e.target.classList.contains('tour-prev')) {
        if (currentStep > 1) {
          currentStep--;
          updateTourContent();
        }
      } else if (e.target.classList.contains('tour-close')) {
        this.closeTour(overlay);
      }
    });

    overlay.appendChild(tourContent);
    document.body.appendChild(overlay);

    // Animate in
    anime({
      targets: overlay,
      opacity: [0, 1],
      duration: 300
    });

    anime({
      targets: tourContent,
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 400,
      delay: 100,
      easing: 'easeOutBack'
    });
  }

  highlightStepElements(svg, selector) {
    // Remove previous highlights
    svg.querySelectorAll('.educational-highlight').forEach(el => {
      el.classList.remove('educational-highlight');
    });

    // Add new highlights
    const elements = svg.querySelectorAll(selector);
    elements.forEach(element => {
      element.classList.add('educational-highlight');
      
      // Add pulsing animation
      anime({
        targets: element,
        scale: [1, 1.1, 1],
        duration: 1000,
        loop: true,
        easing: 'easeInOutSine'
      });
    });
  }

  closeTour(overlay) {
    anime({
      targets: overlay,
      opacity: 0,
      duration: 200,
      complete: () => overlay.remove()
    });
  }

  toggleInteractiveMode(container, svg) {
    const isInteractive = container.classList.contains('interactive-mode');
    
    if (isInteractive) {
      container.classList.remove('interactive-mode');
      this.disableInteractiveMode(svg);
    } else {
      container.classList.add('interactive-mode');
      this.enableInteractiveMode(svg);
    }
  }

  enableInteractiveMode(svg) {
    const elements = svg.querySelectorAll('.node, .actor, .classBox');
    
    elements.forEach(element => {
      element.style.filter = 'brightness(1.2)';
      element.style.transition = 'all 0.3s ease';
      
      element.addEventListener('click', this.handleInteractiveClick);
    });
  }

  disableInteractiveMode(svg) {
    const elements = svg.querySelectorAll('.node, .actor, .classBox');
    
    elements.forEach(element => {
      element.style.filter = '';
      element.removeEventListener('click', this.handleInteractiveClick);
    });
  }

  handleInteractiveClick = (event) => {
    const element = event.target;
    
    // Add click animation
    anime({
      targets: element,
      scale: [1, 1.2, 1],
      duration: 300,
      easing: 'easeOutBack'
    });
    
    // Show interactive feedback
    this.showInteractiveFeedback(element);
  }

  showInteractiveFeedback(element) {
    const feedback = document.createElement('div');
    feedback.textContent = '✨ Interactive!';
    feedback.style.cssText = `
      position: absolute;
      background: #22c55e;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      pointer-events: none;
      z-index: 100;
    `;

    const rect = element.getBoundingClientRect();
    feedback.style.left = `${rect.left + rect.width / 2}px`;
    feedback.style.top = `${rect.top - 30}px`;

    document.body.appendChild(feedback);

    anime({
      targets: feedback,
      translateY: [-10, -30],
      opacity: [1, 0],
      duration: 1000,
      easing: 'easeOutQuart',
      complete: () => feedback.remove()
    });
  }

  showDiagramExplanation(container, diagramType) {
    const content = this.educationalContent[diagramType];
    if (!content) return;

    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: ${this.currentTheme === 'dark' ? '#1e293b' : '#ffffff'};
      color: ${this.currentTheme === 'dark' ? '#f1f5f9' : '#1e293b'};
      border-radius: 12px;
      padding: 2rem;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
    `;

    modalContent.innerHTML = `
      <h2 style="margin-top: 0; color: #CD7D58;">${content.title}</h2>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 1.5rem;">${content.description}</p>
      <h3 style="color: #CD7D58; margin-bottom: 1rem;">Key Components:</h3>
      <ul style="line-height: 1.8;">
        ${content.steps.map(step => `<li>${step.content}</li>`).join('')}
      </ul>
      <button style="background: #CD7D58; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; margin-top: 1.5rem; float: right;">Close</button>
    `;

    modalContent.querySelector('button').addEventListener('click', () => {
      anime({
        targets: modal,
        opacity: 0,
        duration: 200,
        complete: () => modal.remove()
      });
    });

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    anime({
      targets: modal,
      opacity: [0, 1],
      duration: 300
    });

    anime({
      targets: modalContent,
      scale: [0.8, 1],
      duration: 400,
      delay: 100,
      easing: 'easeOutBack'
    });
  }

  startQuizMode(container, svg, diagramType) {
    // Simple quiz implementation
    const questions = this.generateQuizQuestions(diagramType);
    if (!questions.length) return;

    let currentQuestion = 0;
    let score = 0;

    const showQuestion = () => {
      if (currentQuestion >= questions.length) {
        this.showQuizResults(score, questions.length);
        return;
      }

      const question = questions[currentQuestion];
      const modal = document.createElement('div');
      modal.className = 'quiz-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
      `;

      const modalContent = document.createElement('div');
      modalContent.style.cssText = `
        background: ${this.currentTheme === 'dark' ? '#1e293b' : '#ffffff'};
        color: ${this.currentTheme === 'dark' ? '#f1f5f9' : '#1e293b'};
        border-radius: 12px;
        padding: 2rem;
        max-width: 500px;
        text-align: center;
      `;

      modalContent.innerHTML = `
        <h3 style="margin-top: 0; color: #CD7D58;">Question ${currentQuestion + 1} of ${questions.length}</h3>
        <p style="font-size: 16px; margin-bottom: 1.5rem;">${question.question}</p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${question.options.map((option, index) => 
            `<button class="quiz-option" data-index="${index}" style="background: #f1f5f9; border: 2px solid #e2e8f0; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left; transition: all 0.2s ease;">${option}</button>`
          ).join('')}
        </div>
      `;

      modalContent.addEventListener('click', (e) => {
        if (e.target.classList.contains('quiz-option')) {
          const selectedIndex = parseInt(e.target.dataset.index);
          const isCorrect = selectedIndex === question.correct;
          
          if (isCorrect) {
            score++;
            e.target.style.background = '#22c55e';
            e.target.style.color = 'white';
          } else {
            e.target.style.background = '#ef4444';
            e.target.style.color = 'white';
            // Show correct answer
            modalContent.querySelectorAll('.quiz-option')[question.correct].style.background = '#22c55e';
            modalContent.querySelectorAll('.quiz-option')[question.correct].style.color = 'white';
          }

          // Disable all options
          modalContent.querySelectorAll('.quiz-option').forEach(btn => {
            btn.style.pointerEvents = 'none';
          });

          setTimeout(() => {
            modal.remove();
            currentQuestion++;
            showQuestion();
          }, 1500);
        }
      });

      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      anime({
        targets: modal,
        opacity: [0, 1],
        duration: 300
      });
    };

    showQuestion();
  }

  generateQuizQuestions(diagramType) {
    const questions = {
      flowchart: [
        {
          question: "What do diamond shapes typically represent in flowcharts?",
          options: ["Start/End points", "Decision points", "Process steps", "Data storage"],
          correct: 1
        },
        {
          question: "What do arrows in flowcharts indicate?",
          options: ["Data flow", "Time progression", "Flow direction", "All of the above"],
          correct: 3
        }
      ],
      sequence: [
        {
          question: "What do vertical lines in sequence diagrams represent?",
          options: ["Messages", "Lifelines", "Activations", "Returns"],
          correct: 1
        },
        {
          question: "What shows the order of interactions in a sequence diagram?",
          options: ["Vertical position", "Horizontal position", "Color coding", "Line thickness"],
          correct: 0
        }
      ],
      class: [
        {
          question: "What do the lines between classes typically represent?",
          options: ["Inheritance", "Associations", "Dependencies", "All of the above"],
          correct: 3
        }
      ]
    };

    return questions[diagramType] || [];
  }

  showQuizResults(score, total) {
    const percentage = Math.round((score / total) * 100);
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: ${this.currentTheme === 'dark' ? '#1e293b' : '#ffffff'};
      color: ${this.currentTheme === 'dark' ? '#f1f5f9' : '#1e293b'};
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      max-width: 400px;
    `;

    const emoji = percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚';
    const message = percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good job!' : 'Keep learning!';

    modalContent.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 1rem;">${emoji}</div>
      <h2 style="margin: 0 0 1rem 0; color: #CD7D58;">${message}</h2>
      <p style="font-size: 18px; margin-bottom: 1rem;">You scored ${score} out of ${total} (${percentage}%)</p>
      <button style="background: #CD7D58; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;">Close</button>
    `;

    modalContent.querySelector('button').addEventListener('click', () => {
      modal.remove();
    });

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    anime({
      targets: modal,
      opacity: [0, 1],
      duration: 300
    });

    anime({
      targets: modalContent,
      scale: [0.8, 1],
      duration: 400,
      delay: 100,
      easing: 'easeOutBack'
    });
  }

  addContextualHelp(container, svg, diagramType) {
    // Add floating help button
    const helpButton = document.createElement('button');
    helpButton.innerHTML = '?';
    helpButton.title = 'Get help with this diagram';
    helpButton.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      background: #CD7D58;
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      z-index: 15;
      opacity: 0.7;
      transition: all 0.3s ease;
    `;

    helpButton.addEventListener('click', () => {
      this.showContextualHelp(diagramType);
    });

    helpButton.addEventListener('mouseenter', () => {
      anime({
        targets: helpButton,
        scale: 1.2,
        opacity: 1,
        duration: 200
      });
    });

    helpButton.addEventListener('mouseleave', () => {
      anime({
        targets: helpButton,
        scale: 1,
        opacity: 0.7,
        duration: 200
      });
    });

    container.appendChild(helpButton);
  }

  showContextualHelp(diagramType) {
    const helpContent = {
      flowchart: "💡 Tip: Follow the arrows to understand the process flow. Diamond shapes are decision points!",
      sequence: "💡 Tip: Read from top to bottom to see the sequence of interactions over time.",
      class: "💡 Tip: Look at the connections between classes to understand their relationships."
    };

    const message = helpContent[diagramType] || "💡 Tip: Hover over elements to learn more about them!";
    
    this.showToast(message, 'info', 5000);
  }

  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.innerHTML = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      max-width: 300px;
      line-height: 1.4;
    `;

    document.body.appendChild(toast);

    anime({
      targets: toast,
      translateX: [100, 0],
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutQuart'
    });

    setTimeout(() => {
      anime({
        targets: toast,
        translateX: 100,
        opacity: 0,
        duration: 300,
        easing: 'easeInQuart',
        complete: () => toast.remove()
      });
    }, duration);
  }
}

// Initialize the educational animation system
const educationalAnimationSystem = new EducationalAnimationSystem();

// Export for global access
window.EducationalAnimationSystem = educationalAnimationSystem;

// Auto-initialize
if (typeof window !== 'undefined') {
  educationalAnimationSystem.init();
}

export default educationalAnimationSystem; 