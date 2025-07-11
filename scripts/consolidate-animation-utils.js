// ExecutionEnvironment is not needed in Node.js scripts
// const ExecutionEnvironment = require('@docusaurus/ExecutionEnvironment');

/**
 * Consolidate Animation Utilities Script
 * 
 * This script consolidates multiple animation utility files into a single
 * unified animation system with proper accessibility and performance checks.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// Animation utility files to consolidate
const ANIMATION_UTILS = [
  'src/utils/animationSystem.ts',
  'src/utils/animeUtils.js',
  'src/utils/enhancedMermaidAnimations.ts',
  'src/utils/performanceOptimizedAnimations.ts',
];

// Output file for consolidated utilities
const CONSOLIDATED_FILE = 'src/utils/unifiedAnimationSystem.ts';

/**
 * Create a consolidated animation utility file
 */
async function createConsolidatedFile() {
  try {
    // Create the content for the consolidated file
    let content = `/**
 * Unified Animation System
 * 
 * This file consolidates multiple animation utilities into a single system
 * with consistent accessibility and performance checks.
 */

import anime from 'animejs/lib/anime.es.js';
import { useEffect, useRef, useState } from 'react';

// Node.js script - no browser environment check needed
// =============================================================================
// Accessibility and Performance Utilities
// =============================================================================

/**
 * Check if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if the device has low performance
 */
export function hasLowPerformance(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for low-end devices
  const connection = (navigator as any).connection;
  if (connection && (connection.saveData || connection.effectiveType === '2g')) {
    return true;
  }
  
  // Check for low memory devices
  if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4) {
    return true;
  }
  
  // Check for low CPU cores
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    return true;
  }
  
  return false;
}

/**
 * Animation Performance Manager
 * Singleton class to manage animation performance settings
 */
export class AnimationPerformanceManager {
  private static instance: AnimationPerformanceManager;
  private _prefersReducedMotion: boolean = false;
  private _hasLowPerformance: boolean = false;
  private _isEnabled: boolean = true;
  private _listeners: Array<() => void> = [];
  
  private constructor() {
    if (typeof window !== 'undefined') {
      this._prefersReducedMotion = prefersReducedMotion();
      this._hasLowPerformance = hasLowPerformance();
      
      // Listen for changes to prefers-reduced-motion
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', () => {
        this._prefersReducedMotion = mediaQuery.matches;
        this.notifyListeners();
      });
    }
  }
  
  public static getInstance(): AnimationPerformanceManager {
    if (!AnimationPerformanceManager.instance) {
      AnimationPerformanceManager.instance = new AnimationPerformanceManager();
    }
    return AnimationPerformanceManager.instance;
  }
  
  public get prefersReducedMotion(): boolean {
    return this._prefersReducedMotion;
  }
  
  public get hasLowPerformance(): boolean {
    return this._hasLowPerformance;
  }
  
  public get isEnabled(): boolean {
    return this._isEnabled;
  }
  
  public set isEnabled(value: boolean) {
    this._isEnabled = value;
    this.notifyListeners();
  }
  
  public shouldAnimate(): boolean {
    return this._isEnabled && !this._prefersReducedMotion;
  }
  
  public getParticleCount(defaultCount: number): number {
    if (this._prefersReducedMotion) return 0;
    if (this._hasLowPerformance) return Math.floor(defaultCount / 3);
    return defaultCount;
  }
  
  public getDurationMultiplier(): number {
    if (this._prefersReducedMotion) return 0.1;
    if (this._hasLowPerformance) return 1.5;
    return 1;
  }
  
  public addListener(listener: () => void): void {
    this._listeners.push(listener);
  }
  
  public removeListener(listener: () => void): void {
    this._listeners = this._listeners.filter(l => l !== listener);
  }
  
  private notifyListeners(): void {
    this._listeners.forEach(listener => listener());
  }
}

/**
 * React hook to access the animation performance manager
 */
export function useAnimationPerformance() {
  const [state, setState] = useState({
    prefersReducedMotion: false,
    hasLowPerformance: false,
    isEnabled: true,
  });
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const manager = AnimationPerformanceManager.getInstance();
    
    const updateState = () => {
      setState({
        prefersReducedMotion: manager.prefersReducedMotion,
        hasLowPerformance: manager.hasLowPerformance,
        isEnabled: manager.isEnabled,
      });
    };
    
    // Initial state
    updateState();
    
    // Listen for changes
    manager.addListener(updateState);
    
    return () => {
      manager.removeListener(updateState);
    };
  }, []);
  
  return {
    ...state,
    shouldAnimate: () => AnimationPerformanceManager.getInstance().shouldAnimate(),
    getParticleCount: (defaultCount: number) => 
      AnimationPerformanceManager.getInstance().getParticleCount(defaultCount),
    getDurationMultiplier: () => 
      AnimationPerformanceManager.getInstance().getDurationMultiplier(),
  };
}

// =============================================================================
// Core Animation Functions
// =============================================================================

/**
 * Animate elements with a fade-in effect
 */
export function fadeIn(
  elements: HTMLElement | HTMLElement[] | NodeListOf<Element>,
  options: {
    duration?: number;
    delay?: number;
    easing?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
    distance?: number;
    staggerDelay?: number;
  } = {}
) {
  if (prefersReducedMotion()) return;
  
  const {
    duration = 600,
    delay = 0,
    easing = 'easeOutCubic',
    direction = 'up',
    distance = 20,
    staggerDelay = 50,
  } = options;
  
  const manager = AnimationPerformanceManager.getInstance();
  const actualDuration = duration * manager.getDurationMultiplier();
  
  // Prepare animation properties
  const animationProps: any = { opacity: [0, 1] };
  
  switch (direction) {
    case 'up':
      animationProps.translateY = [distance, 0];
      break;
    case 'down':
      animationProps.translateY = [-distance, 0];
      break;
    case 'left':
      animationProps.translateX = [distance, 0];
      break;
    case 'right':
      animationProps.translateX = [-distance, 0];
      break;
  }
  
  // Create animation
  return anime({
    targets: elements,
    ...animationProps,
    duration: actualDuration,
    delay: Array.isArray(elements) || elements instanceof NodeList
      ? anime.stagger(staggerDelay, { start: delay })
      : delay,
    easing,
  });
}

/**
 * Animate SVG paths with a drawing effect
 */
export function animatePaths(
  paths: SVGPathElement | SVGPathElement[] | NodeListOf<SVGPathElement>,
  options: {
    duration?: number;
    delay?: number;
    easing?: string;
    direction?: 'normal' | 'reverse';
    staggerDelay?: number;
  } = {}
) {
  if (prefersReducedMotion()) return;
  
  const {
    duration = 1000,
    delay = 0,
    easing = 'easeInOutSine',
    direction = 'normal',
    staggerDelay = 50,
  } = options;
  
  const manager = AnimationPerformanceManager.getInstance();
  const actualDuration = duration * manager.getDurationMultiplier();
  
  // Create animation
  return anime({
    targets: paths,
    strokeDashoffset: [anime.setDashoffset, 0],
    duration: actualDuration,
    delay: Array.isArray(paths) || paths instanceof NodeList
      ? anime.stagger(staggerDelay, { start: delay })
      : delay,
    easing,
    direction,
  });
}

/**
 * Create a timeline for sequencing animations
 */
export function createTimeline(options: {
  easing?: string;
  duration?: number;
  autoplay?: boolean;
  loop?: boolean | number;
} = {}) {
  const {
    easing = 'easeOutExpo',
    duration = 1000,
    autoplay = true,
    loop = false,
  } = options;
  
  const manager = AnimationPerformanceManager.getInstance();
  const actualDuration = duration * manager.getDurationMultiplier();
  
  return anime.timeline({
    easing,
    duration: actualDuration,
    autoplay,
    loop,
  });
}

/**
 * Create floating particles effect
 */
export function createParticles(
  container: HTMLElement,
  options: {
    count?: number;
    colors?: string[];
    size?: { min: number; max: number };
    speed?: { min: number; max: number };
    opacity?: { min: number; max: number };
  } = {}
) {
  if (prefersReducedMotion()) return;
  
  const {
    count = 30,
    colors = ['#FF6B35', '#4ECDC4', '#FF1744'],
    size = { min: 2, max: 6 },
    speed = { min: 1, max: 3 },
    opacity = { min: 0.3, max: 0.8 },
  } = options;
  
  const manager = AnimationPerformanceManager.getInstance();
  const actualCount = manager.getParticleCount(count);
  
  if (actualCount === 0) return;
  
  // Create particles
  for (let i = 0; i < actualCount; i++) {
    const particle = document.createElement('div');
    
    // Random properties
    const particleSize = size.min + Math.random() * (size.max - size.min);
    const particleColor = colors[Math.floor(Math.random() * colors.length)];
    const particleOpacity = opacity.min + Math.random() * (opacity.max - opacity.min);
    
    // Set styles
    particle.style.position = 'absolute';
    particle.style.width = \`\${particleSize}px\`;
    particle.style.height = \`\${particleSize}px\`;
    particle.style.backgroundColor = particleColor;
    particle.style.borderRadius = '50%';
    particle.style.opacity = particleOpacity.toString();
    particle.style.top = \`\${Math.random() * 100}%\`;
    particle.style.left = \`\${Math.random() * 100}%\`;
    particle.style.pointerEvents = 'none';
    
    // Add to container
    container.appendChild(particle);
    
    // Animate
    const duration = (speed.min + Math.random() * (speed.max - speed.min)) * 1000;
    
    anime({
      targets: particle,
      translateX: () => [
        anime.random(-50, 50),
        anime.random(-50, 50),
      ],
      translateY: () => [
        anime.random(-50, 50),
        anime.random(-50, 50),
      ],
      opacity: [
        particleOpacity,
        particleOpacity * 0.5,
        particleOpacity,
      ],
      scale: [1, 1.2, 1],
      duration: duration * manager.getDurationMultiplier(),
      easing: 'easeInOutSine',
      loop: true,
      direction: 'alternate',
    });
  }
}

// =============================================================================
// Mermaid-specific Animation Functions
// =============================================================================

/**
 * Animate a Mermaid diagram
 */
export function animateMermaidDiagram(svg: SVGElement) {
  if (!svg || prefersReducedMotion()) return;
  
  const manager = AnimationPerformanceManager.getInstance();
  
  // Get all nodes, edges, and labels
  const nodes = svg.querySelectorAll('.node rect, .node circle, .node ellipse, .node polygon, .node path');
  const edges = svg.querySelectorAll('.edgePath .path');
  const labels = svg.querySelectorAll('.edgeLabel, .nodeLabel');
  
  // Create timeline
  const timeline = createTimeline({
    easing: 'easeOutExpo',
    duration: 500,
  });
  
  // Animate nodes
  timeline.add({
    targets: nodes,
    opacity: [0, 1],
    scale: [0.8, 1],
    translateY: [10, 0],
    delay: anime.stagger(50),
    duration: 600 * manager.getDurationMultiplier(),
  });
  
  // Animate edges
  timeline.add({
    targets: edges,
    strokeDashoffset: [anime.setDashoffset, 0],
    duration: 800 * manager.getDurationMultiplier(),
    delay: anime.stagger(100),
    easing: 'easeInOutSine',
  }, '-=400');
  
  // Animate labels
  timeline.add({
    targets: labels,
    opacity: [0, 1],
    translateY: [5, 0],
    duration: 400 * manager.getDurationMultiplier(),
    delay: anime.stagger(50),
  }, '-=600');
  
  return timeline;
}

/**
 * Add interactive hover effects to a Mermaid diagram
 */
export function addMermaidInteractivity(svg: SVGElement) {
  if (!svg || prefersReducedMotion()) return;
  
  // Get all nodes and edges
  const nodes = svg.querySelectorAll('.node');
  const edges = svg.querySelectorAll('.edgePath');
  
  // Add hover effects to nodes
  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      if (prefersReducedMotion()) return;
      
      // Get node shape
      const shape = node.querySelector('rect, circle, ellipse, polygon, path');
      if (!shape) return;
      
      // Apply hover effect
      (shape as HTMLElement).style.transform = 'scale(1.05) translateY(-3px)';
      (shape as HTMLElement).style.transition = 'transform 0.3s ease';
      
      // Highlight connected edges
      const nodeId = node.id;
      edges.forEach(edge => {
        if (edge.id.includes(nodeId)) {
          const path = edge.querySelector('.path');
          if (path) {
            (path as HTMLElement).style.strokeWidth = '3px';
            (path as HTMLElement).style.transition = 'stroke-width 0.3s ease';
          }
        }
      });
    });
    
    node.addEventListener('mouseleave', () => {
      if (prefersReducedMotion()) return;
      
      // Get node shape
      const shape = node.querySelector('rect, circle, ellipse, polygon, path');
      if (!shape) return;
      
      // Remove hover effect
      (shape as HTMLElement).style.transform = 'scale(1) translateY(0)';
      
      // Reset connected edges
      const nodeId = node.id;
      edges.forEach(edge => {
        if (edge.id.includes(nodeId)) {
          const path = edge.querySelector('.path');
          if (path) {
            (path as HTMLElement).style.strokeWidth = '1.5px';
          }
        }
      });
    });
  });
  
  // Add hover effects to edges
  edges.forEach(edge => {
    edge.addEventListener('mouseenter', () => {
      if (prefersReducedMotion()) return;
      
      // Get edge path
      const path = edge.querySelector('.path');
      if (!path) return;
      
      // Apply hover effect
      (path as HTMLElement).style.strokeWidth = '3px';
      (path as HTMLElement).style.transition = 'stroke-width 0.3s ease';
    });
    
    edge.addEventListener('mouseleave', () => {
      if (prefersReducedMotion()) return;
      
      // Get edge path
      const path = edge.querySelector('.path');
      if (!path) return;
      
      // Remove hover effect
      (path as HTMLElement).style.strokeWidth = '1.5px';
    });
  });
}

// Export anime.js for direct use
export { anime };
`;

    // Write the consolidated file
    await writeFile(CONSOLIDATED_FILE, content, 'utf8');
    console.log(`Created consolidated animation utility file: ${CONSOLIDATED_FILE}`);
    
    return true;
  } catch (error) {
    console.error(`Error creating consolidated file:`, error);
    return false;
  }
}

/**
 * Update imports in files that use the old animation utilities
 */
async function updateImports() {
  try {
    // Find all TypeScript and JavaScript files
    const findFiles = async (dir) => {
      const files = await readdir(dir);
      const result = [];
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = await stat(filePath);
        
        if (stats.isDirectory()) {
          const subDirFiles = await findFiles(filePath);
          result.push(...subDirFiles);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
          result.push(filePath);
        }
      }
      
      return result;
    };
    
    const files = await findFiles('src');
    console.log(`Found ${files.length} files to check for animation imports`);
    
    // Update imports in each file
    for (const filePath of files) {
      let content = await readFile(filePath, 'utf8');
      let modified = false;
      
      // Check for imports from old animation utilities
      const importPatterns = [
        {
          pattern: /import .* from ['"]\.\.\/utils\/animationSystem['"];/g,
          replacement: "import { createTimeline, fadeIn, animatePaths, createParticles, anime } from '../utils/unifiedAnimationSystem';"
        },
        {
          pattern: /import .* from ['"]\.\.\/utils\/animeUtils['"];/g,
          replacement: "import { fadeIn, createParticles, anime } from '../utils/unifiedAnimationSystem';"
        },
        {
          pattern: /import .* from ['"]\.\.\/utils\/enhancedMermaidAnimations['"];/g,
          replacement: "import { animateMermaidDiagram, addMermaidInteractivity } from '../utils/unifiedAnimationSystem';"
        },
        {
          pattern: /import .* from ['"]\.\.\/utils\/performanceOptimizedAnimations['"];/g,
          replacement: "import { useAnimationPerformance, prefersReducedMotion, hasLowPerformance } from '../utils/unifiedAnimationSystem';"
        },
        {
          pattern: /import anime from ['"]animejs\/lib\/anime\.es\.js['"];/g,
          replacement: "import { anime } from '../utils/unifiedAnimationSystem';"
        }
      ];
      
      for (const { pattern, replacement } of importPatterns) {
        if (pattern.test(content)) {
          content = content.replace(pattern, replacement);
          modified = true;
        }
      }
      
      if (modified) {
        await writeFile(filePath, content, 'utf8');
        console.log(`Updated imports in ${filePath}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating imports:`, error);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Starting animation utilities consolidation...');
  
  // Create the consolidated file
  const fileCreated = await createConsolidatedFile();
  if (!fileCreated) {
    console.error('Failed to create consolidated file. Aborting.');
    return;
  }
  
  // Update imports in files
  const importsUpdated = await updateImports();
  if (!importsUpdated) {
    console.error('Failed to update imports. Consolidation may be incomplete.');
  }
  
  console.log('Animation utilities consolidation completed!');
}

// Run the main function
main().catch(console.error);

// No need for browser environment check in Node.js scripts