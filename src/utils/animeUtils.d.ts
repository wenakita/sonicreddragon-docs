/**
 * Type definitions for animeUtils.js
 */

import anime from 'animejs';

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean;

/**
 * Particle effect options
 */
export interface ParticleOptions {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  direction?: 'random' | 'sequential' | 'radial' | 'parallel';
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay';
  opacity?: number;
  lifespan?: number;
}

/**
 * Create a particle effect
 */
export function createParticleEffect(
  container: HTMLElement,
  options?: ParticleOptions
): () => void;

/**
 * Typing animation options
 */
export interface TypingAnimationOptions {
  speed?: number;
  delay?: number;
  cursor?: boolean;
  cursorChar?: string;
  cursorSpeed?: number;
}

/**
 * Create a typing animation
 */
export function createTypingAnimation(
  element: HTMLElement,
  text: string,
  options?: TypingAnimationOptions
): anime.AnimeInstance | null;

/**
 * Text scramble animation options
 */
export interface TextScrambleOptions {
  duration?: number;
  delay?: number;
  chars?: string;
  charChangeSpeed?: number;
}

/**
 * Text scramble animation controller
 */
export interface TextScrambleController {
  running: boolean;
  frameRequest: number | null;
  frame: number;
  queue: string[];
  start(): TextScrambleController;
  stop(): TextScrambleController;
  setText(newText: string): TextScrambleController;
  update(): void;
}

/**
 * Create a text scramble animation
 */
export function createTextScramble(
  element: HTMLElement,
  finalText: string,
  options?: TextScrambleOptions
): TextScrambleController | null;

/**
 * Path animation options
 */
export interface PathAnimationOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  direction?: 'normal' | 'reverse' | 'alternate';
  loop?: boolean | number;
}

/**
 * Create a path animation
 */
export function createPathAnimation(
  path: SVGPathElement,
  options?: PathAnimationOptions
): anime.AnimeInstance | null;

/**
 * Counter animation options
 */
export interface CounterAnimationOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  round?: boolean;
  format?: (value: number) => string;
}

/**
 * Create a counter animation
 */
export function createCounterAnimation(
  element: HTMLElement,
  start: number,
  end: number,
  options?: CounterAnimationOptions
): anime.AnimeInstance | null;
