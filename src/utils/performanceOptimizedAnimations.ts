import React from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

// Performance monitoring and optimization utilities
export class AnimationPerformanceManager {
  private static instance: AnimationPerformanceManager;
  private frameRate = 60;
  private lastFrameTime = 0;
  private frameCount = 0;
  private performanceThreshold = 30; // Minimum acceptable FPS
  private isLowPerformanceDevice = false;
  private prefersReducedMotion = false;
  private activeAnimations = new Set<string>();

  private constructor() {
    this.detectPerformanceCapabilities();
    this.detectMotionPreferences();
  }

  public static getInstance(): AnimationPerformanceManager {
    if (!AnimationPerformanceManager.instance) {
      AnimationPerformanceManager.instance = new AnimationPerformanceManager();
    }
    return AnimationPerformanceManager.instance;
  }

  private detectPerformanceCapabilities(): void {
    if (typeof window === 'undefined') return;

    // Check device memory (if available)
    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory && deviceMemory < 4) {
      this.isLowPerformanceDevice = true;
    }

    // Check hardware concurrency
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      this.isLowPerformanceDevice = true;
    }

    // Monitor frame rate
    this.monitorFrameRate();
  }

  private detectMotionPreferences(): void {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = mediaQuery.matches;

    // Listen for changes
    mediaQuery.addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
      if (this.prefersReducedMotion) {
        this.pauseAllAnimations();
      }
    });
  }

  private monitorFrameRate(): void {
    const measureFrame = (timestamp: number) => {
      if (this.lastFrameTime) {
        const delta = timestamp - this.lastFrameTime;
        this.frameRate = 1000 / delta;
        this.frameCount++;

        // Check performance every 60 frames
        if (this.frameCount % 60 === 0) {
          if (this.frameRate < this.performanceThreshold) {
            this.isLowPerformanceDevice = true;
            this.optimizeForLowPerformance();
          }
        }
      }
      this.lastFrameTime = timestamp;
      requestAnimationFrame(measureFrame);
    };

    if (typeof window !== 'undefined') {
      requestAnimationFrame(measureFrame);
    }
  }

  private optimizeForLowPerformance(): void {
    // Reduce animation complexity
    document.documentElement.style.setProperty('--animation-duration-multiplier', '0.5');
    document.documentElement.style.setProperty('--particle-count-multiplier', '0.3');
    
    // Disable complex animations
    document.documentElement.classList.add('low-performance-mode');
  }

  private pauseAllAnimations(): void {
    this.activeAnimations.forEach(animationId => {
      const element = document.querySelector(`[data-animation-id="${animationId}"]`);
      if (element) {
        (element as HTMLElement).style.animationPlayState = 'paused';
      }
    });
  }

  public shouldUseAnimation(): boolean {
    return !this.prefersReducedMotion && !this.isLowPerformanceDevice;
  }

  public shouldUseComplexAnimation(): boolean {
    return this.shouldUseAnimation() && this.frameRate > this.performanceThreshold;
  }

  public registerAnimation(id: string): void {
    this.activeAnimations.add(id);
  }

  public unregisterAnimation(id: string): void {
    this.activeAnimations.delete(id);
  }

  public getOptimalParticleCount(baseCount: number): number {
    if (this.prefersReducedMotion) return 0;
    if (this.isLowPerformanceDevice) return Math.floor(baseCount * 0.3);
    return baseCount;
  }

  public getOptimalAnimationDuration(baseDuration: number): number {
    if (this.prefersReducedMotion) return 0;
    if (this.isLowPerformanceDevice) return baseDuration * 0.5;
    return baseDuration;
  }
}

// Optimized animation hooks and utilities
export function useOptimizedAnimation() {
  const isBrowser = useIsBrowser();
  const manager = isBrowser ? AnimationPerformanceManager.getInstance() : null;

  return {
    shouldAnimate: manager?.shouldUseAnimation() ?? false,
    shouldUseComplexAnimation: manager?.shouldUseComplexAnimation() ?? false,
    getOptimalParticleCount: (count: number) => manager?.getOptimalParticleCount(count) ?? 0,
    getOptimalDuration: (duration: number) => manager?.getOptimalAnimationDuration(duration) ?? 0,
    registerAnimation: (id: string) => manager?.registerAnimation(id),
    unregisterAnimation: (id: string) => manager?.unregisterAnimation(id),
  };
}

// Throttled animation frame utility
export function useThrottledAnimationFrame(callback: () => void, fps = 60) {
  const isBrowser = useIsBrowser();
  let lastTime = 0;
  const interval = 1000 / fps;

  const throttledCallback = (currentTime: number) => {
    if (currentTime - lastTime >= interval) {
      callback();
      lastTime = currentTime;
    }
    if (isBrowser) {
      requestAnimationFrame(throttledCallback);
    }
  };

  if (isBrowser) {
    requestAnimationFrame(throttledCallback);
  }
}

// Intersection Observer for performance-aware animations
export function useIntersectionAnimation(
  elementRef: React.RefObject<HTMLElement>,
  animationCallback: () => void,
  options: IntersectionObserverInit = {}
) {
  const isBrowser = useIsBrowser();
  const manager = isBrowser ? AnimationPerformanceManager.getInstance() : null;

  React.useEffect(() => {
    if (!isBrowser || !elementRef.current || !manager?.shouldUseAnimation()) return;

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

// CSS-based animation utilities
export const optimizedAnimationClasses = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  scale: 'animate-scale',
  reduced: 'animate-reduced-motion',
  disabled: 'animate-disabled'
};

// Export performance manager instance
export const performanceManager = typeof window !== 'undefined' 
  ? AnimationPerformanceManager.getInstance() 
  : null; 