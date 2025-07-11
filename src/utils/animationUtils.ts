import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

/**
 * Unified Animation Utilities
 * 
 * This file consolidates multiple animation utilities into a single system
 * with consistent accessibility and performance checks.
 */

import anime from 'animejs';
import { useEffect, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

// Only execute in browser environment
if (ExecutionEnvironment.canUseDOM) {
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
    private _frameRate: number = 60;
    private _lastFrameTime: number = 0;
    private _frameCount: number = 0;
    private _performanceThreshold: number = 30; // Minimum acceptable FPS
    private _activeAnimations: Set<string> = new Set();
    
    private constructor() {
      if (typeof window !== 'undefined') {
        this._prefersReducedMotion = prefersReducedMotion();
        this._hasLowPerformance = hasLowPerformance();
        
        // Listen for changes to prefers-reduced-motion
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMediaChange = (e: MediaQueryListEvent) => {
          this._prefersReducedMotion = e.matches;
          if (this._prefersReducedMotion) {
            this.pauseAllAnimations();
          }
          this.notifyListeners();
        };
        
        // Modern browsers
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleMediaChange);
        } 
        // Older browsers
        else if ('addListener' in mediaQuery) {
          mediaQuery.addListener(handleMediaChange as any);
        }
        
        // Monitor frame rate
        this.monitorFrameRate();
      }
    }
    
    private monitorFrameRate(): void {
      if (typeof window === 'undefined') return;
      
      const measureFrame = (timestamp: number) => {
        if (this._lastFrameTime) {
          const delta = timestamp - this._lastFrameTime;
          this._frameRate = 1000 / delta;
          this._frameCount++;
          
          // Check performance every 60 frames
          if (this._frameCount % 60 === 0) {
            if (this._frameRate < this._performanceThreshold) {
              this._hasLowPerformance = true;
              this.optimizeForLowPerformance();
              this.notifyListeners();
            }
          }
        }
        this._lastFrameTime = timestamp;
        requestAnimationFrame(measureFrame);
      };
      
      requestAnimationFrame(measureFrame);
    }
    
    private optimizeForLowPerformance(): void {
      // Reduce animation complexity
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--animation-duration-multiplier', '0.5');
        document.documentElement.style.setProperty('--particle-count-multiplier', '0.3');
        
        // Disable complex animations
        document.documentElement.classList.add('low-performance-mode');
      }
    }
    
    private pauseAllAnimations(): void {
      this._activeAnimations.forEach(animationId => {
        if (typeof document !== 'undefined') {
          const element = document.querySelector(`[data-animation-id="${animationId}"]`);
          if (element) {
            (element as HTMLElement).style.animationPlayState = 'paused';
          }
        }
      });
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
    
    public shouldUseComplexAnimation(): boolean {
      return this.shouldAnimate() && this._frameRate > this._performanceThreshold;
    }
    
    public getParticleCount(defaultCount: number): number {
      if (this._prefersReducedMotion) return 0;
      if (this._hasLowPerformance) return Math.floor(defaultCount * 0.3);
      return defaultCount;
    }
    
    public getDurationMultiplier(): number {
      if (this._prefersReducedMotion) return 0.1;
      if (this._hasLowPerformance) return 1.5;
      return 1;
    }
    
    public getOptimalDuration(baseDuration: number): number {
      if (this._prefersReducedMotion) return baseDuration * 0.1;
      if (this._hasLowPerformance) return baseDuration * 0.5;
      return baseDuration;
    }
    
    public registerAnimation(id: string): void {
      this._activeAnimations.add(id);
    }
    
    public unregisterAnimation(id: string): void {
      this._activeAnimations.delete(id);
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
    
    public cleanup(): void {
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        // Modern browsers
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', () => {});
        } 
        // Older browsers
        else if ('removeListener' in mediaQuery) {
          mediaQuery.removeListener(() => {});
        }
      }
      
      this._listeners = [];
      this._activeAnimations.clear();
    }
  }
  
  /**
   * React hook to access the animation performance manager
   */
  export function useAnimationPerformance() {
    const isBrowser = useIsBrowser();
    const [state, setState] = useState({
      prefersReducedMotion: false,
      hasLowPerformance: false,
      isEnabled: true,
    });
    
    useEffect(() => {
      if (!isBrowser) return;
      
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
    }, [isBrowser]);
    
    return {
      ...state,
      shouldAnimate: () => isBrowser ? AnimationPerformanceManager.getInstance().shouldAnimate() : false,
      shouldUseComplexAnimation: () => isBrowser ? AnimationPerformanceManager.getInstance().shouldUseComplexAnimation() : false,
      getParticleCount: (defaultCount: number) => 
        isBrowser ? AnimationPerformanceManager.getInstance().getParticleCount(defaultCount) : 0,
      getDurationMultiplier: () => 
        isBrowser ? AnimationPerformanceManager.getInstance().getDurationMultiplier() : 1,
      getOptimalDuration: (baseDuration: number) =>
        isBrowser ? AnimationPerformanceManager.getInstance().getOptimalDuration(baseDuration) : baseDuration,
      registerAnimation: (id: string) => 
        isBrowser && AnimationPerformanceManager.getInstance().registerAnimation(id),
      unregisterAnimation: (id: string) => 
        isBrowser && AnimationPerformanceManager.getInstance().unregisterAnimation(id),
    };
  }
  
  /**
   * Intersection Observer for performance-aware animations
   */
  export function useIntersectionAnimation(
    elementRef: React.RefObject<HTMLElement>,
    animationCallback: () => void,
    options: IntersectionObserverInit = {}
  ) {
    const isBrowser = useIsBrowser();
    const manager = isBrowser ? AnimationPerformanceManager.getInstance() : null;
  
    useEffect(() => {
      if (!isBrowser || !elementRef.current || !manager?.shouldAnimate()) return;
  
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animationCallback();
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      });
  
      observer.observe(elementRef.current);
  
      return () => observer.disconnect();
    }, [isBrowser, elementRef, animationCallback, manager]);
  }
  
  // =============================================================================
  // Core Animation Functions
  // =============================================================================
  
  /**
   * Create a staggered animation for a list of elements
   */
  export function staggerAnimation(
    targets: string | Element | Element[] | NodeListOf<Element>,
    options: any = {},
    staggerDelay: number = 100,
    callback: (() => void) | null = null
  ) {
    if (prefersReducedMotion()) return;
    
    const manager = AnimationPerformanceManager.getInstance();
    
    const defaultOptions = {
      duration: 800 * manager.getDurationMultiplier(),
      easing: 'easeOutCubic',
      delay: anime.stagger(staggerDelay),
    };
    
    const animationOptions = {
      ...defaultOptions,
      ...options,
      targets,
      complete: callback,
    };
    
    return anime(animationOptions);
  }
  
  /**
   * Create a fade-in animation
   */
  export function fadeIn(
    targets: string | Element | Element[] | NodeListOf<Element>,
    duration: number = 800,
    delay: number | object = 0,
    callback: (() => void) | null = null
  ) {
    if (prefersReducedMotion()) return;
    
    const manager = AnimationPerformanceManager.getInstance();
    
    return anime({
      targets,
      opacity: [0, 1],
      duration: duration * manager.getDurationMultiplier(),
      delay,
      easing: 'easeOutCubic',
      complete: callback,
    });
  }
  
  /**
   * Create a fade-in-up animation
   */
  export function fadeInUp(
    targets: string | Element | Element[] | NodeListOf<Element>,
    duration: number = 800,
    delay: number | object = 0,
    callback: (() => void) | null = null
  ) {
    if (prefersReducedMotion()) return;
    
    const manager = AnimationPerformanceManager.getInstance();
    
    return anime({
      targets,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: duration * manager.getDurationMultiplier(),
      delay,
      easing: 'easeOutCubic',
      complete: callback,
    });
  }
  
  /**
   * Create a fade-in-down animation
   */
  export function fadeInDown(
    targets: string | Element | Element[] | NodeListOf<Element>,
    duration: number = 800,
    delay: number | object = 0,
    callback: (() => void) | null = null
  ) {
    if (prefersReducedMotion()) return;
    
    const manager = AnimationPerformanceManager.getInstance();
    
    return anime({
      targets,
      opacity: [0, 1],
      translateY: [-20, 0],
      duration: duration * manager.getDurationMultiplier(),
      delay,
      easing: 'easeOutCubic',
      complete: callback,
    });
  }
  
  /**
   * Create a fade-in-left animation
   */
  export function fadeInLeft(
    targets: string | Element | Element[] | NodeListOf<Element>,
    duration: number = 800,
    delay: number | object = 0,
    callback: (() => void) | null = null
  ) {
    if (prefersReducedMotion()) return;
    
    const manager = AnimationPerformanceManager.getInstance();
    
    return anime({
      targets,
      opacity: [0, 1],
      translateX: [-20, 0],
      duration: duration * manager.getDurationMultiplier(),
      delay,
      easing: 'easeOutCubic',
      complete: callback,
    });
  }
  
  /**
   * Create a fade-in-right animation
   */
  export function fadeInRight(
    targets: string | Element | Element[] | NodeListOf<Element>,
    duration: number = 800,
    delay: number | object = 0,
    callback: (() => void) | null = null
  ) {
    if (prefersReducedMotion()) return;
    
    const manager = AnimationPerformanceManager.getInstance();
    
    return anime({
      targets,
      opacity: [0, 1],
      translateX: [20, 0],
      duration: duration * manager.getDurationMultiplier(),
      delay,
      easing: 'easeOutCubic',
      complete: callback,
    });
  }
  
  /**
   * Create a zoom-in animation
   */
  export function zoomIn(
    targets: string | Element | Element[] | NodeListOf<Element>,
    duration: number = 800,
    delay: number | object = 0,
    callback: (() => void) | null = null
  ) {
    if (prefersReducedMotion()) return;
    
    const manager = AnimationPerformanceManager.getInstance();
    
    return anime({
      targets,
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: duration * manager.getDurationMultiplier(),
      delay,
      easing: 'easeOutCubic',
      complete: callback,
    });
  }
  
  /**
   * Create a drawing animation for SVG paths
   */
  export function drawSVGPath(
    targets: string | Element | Element[] | NodeListOf<Element>,
    duration: number = 1500,
    delay: number | object = 0,
    callback: (() => void) | null = null
  ) {
    if (prefersReducedMotion()) return;
    
    const manager = AnimationPerformanceManager.getInstance();
    
    return anime({
      targets,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: duration * manager.getDurationMultiplier(),
      delay,
      direction: 'normal',
      complete: callback,
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
    const particles: HTMLElement[] = [];
    
    for (let i = 0; i < actualCount; i++) {
      const particle = document.createElement('div');
      
      // Random properties
      const particleSize = size.min + Math.random() * (size.max - size.min);
      const particleColor = colors[Math.floor(Math.random() * colors.length)];
      const particleOpacity = opacity.min + Math.random() * (opacity.max - opacity.min);
      
      // Set styles
      particle.style.position = 'absolute';
      particle.style.width = `${particleSize}px`;
      particle.style.height = `${particleSize}px`;
      particle.style.backgroundColor = particleColor;
      particle.style.borderRadius = '50%';
      particle.style.opacity = particleOpacity.toString();
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.pointerEvents = 'none';
      
      // Add to container
      container.appendChild(particle);
      particles.push(particle);
      
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
    
    // Return a cleanup function
    return () => {
      particles.forEach(particle => {
        anime.remove(particle);
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
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
    
    const nodeListeners = new Map();
    const edgeListeners = new Map();
    
    // Add hover effects to nodes
    nodes.forEach(node => {
      const enterHandler = () => {
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
      };
      
      const leaveHandler = () => {
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
      };
      
      node.addEventListener('mouseenter', enterHandler);
      node.addEventListener('mouseleave', leaveHandler);
      
      // Store listeners for cleanup
      nodeListeners.set(node, { enter: enterHandler, leave: leaveHandler });
    });
    
    // Add hover effects to edges
    edges.forEach(edge => {
      const enterHandler = () => {
        if (prefersReducedMotion()) return;
        
        // Get edge path
        const path = edge.querySelector('.path');
        if (!path) return;
        
        // Apply hover effect
        (path as HTMLElement).style.strokeWidth = '3px';
        (path as HTMLElement).style.transition = 'stroke-width 0.3s ease';
      };
      
      const leaveHandler = () => {
        if (prefersReducedMotion()) return;
        
        // Get edge path
        const path = edge.querySelector('.path');
        if (!path) return;
        
        // Remove hover effect
        (path as HTMLElement).style.strokeWidth = '1.5px';
      };
      
      edge.addEventListener('mouseenter', enterHandler);
      edge.addEventListener('mouseleave', leaveHandler);
      
      // Store listeners for cleanup
      edgeListeners.set(edge, { enter: enterHandler, leave: leaveHandler });
    });
    
    // Return cleanup function
    return () => {
      // Remove all event listeners
      nodeListeners.forEach((handlers, node) => {
        node.removeEventListener('mouseenter', handlers.enter);
        node.removeEventListener('mouseleave', handlers.leave);
      });
      
      edgeListeners.forEach((handlers, edge) => {
        edge.removeEventListener('mouseenter', handlers.enter);
        edge.removeEventListener('mouseleave', handlers.leave);
      });
    };
  }
  
  // Export anime.js for direct use
  export { anime };
  
}

// Export empty module for SSR
export default function() {};