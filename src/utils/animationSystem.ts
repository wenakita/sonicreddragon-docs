import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

export class AnimationSystem {
  private static instance: AnimationSystem;
  private animations: Map<string, gsap.core.Tween | gsap.core.Timeline> = new Map();
  private scrollTriggers: ScrollTrigger[] = [];
  private particleSystems: Map<string, ParticleSystem> = new Map();
  private webglScenes: Map<string, WebGLScene> = new Map();
  private observers: IntersectionObserver[] = [];
  private performanceMode: 'high' | 'medium' | 'low' = 'high';

  private constructor() {
    this.detectPerformanceMode();
    this.setupGlobalAnimationDefaults();
    this.initializeWebGL();
  }

  static getInstance(): AnimationSystem {
    if (!AnimationSystem.instance) {
      AnimationSystem.instance = new AnimationSystem();
    }
    return AnimationSystem.instance;
  }

  private detectPerformanceMode() {
    if (typeof window === 'undefined') return;

    const isLowPowerMode = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;

    if (isLowPowerMode || deviceMemory < 4 || hardwareConcurrency < 4) {
      this.performanceMode = 'low';
    } else if (deviceMemory < 8 || hardwareConcurrency < 8) {
      this.performanceMode = 'medium';
    }
  }

  private setupGlobalAnimationDefaults() {
    gsap.defaults({
      ease: "power3.inOut",
      duration: 0.8,
    });

    // Configure ScrollTrigger
    if (typeof window !== 'undefined') {
      ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: true,
        syncInterval: 40,
      });
    }
  }

  private initializeWebGL() {
    if (typeof window === 'undefined' || this.performanceMode === 'low') return;
    // Initialize Three.js for WebGL effects
  }

  // Text animations with typewriter and morphing effects
  animateText(element: HTMLElement, options: TextAnimationOptions = {}) {
    const {
      type = 'typewriter',
      duration = 2,
      stagger = 0.05,
      scrambleText = false,
    } = options;

    if (type === 'typewriter') {
      const text = element.textContent || '';
      element.textContent = '';
      
      return gsap.to(element, {
        duration,
        text: {
          value: text,
          delimiter: "",
        },
        ease: "none",
      });
    }

    if (type === 'split') {
      // Split text into characters/words for individual animation
      const chars = element.textContent?.split('') || [];
      element.innerHTML = chars.map(char => 
        `<span class="char" style="display: inline-block">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');

      return gsap.fromTo(
        element.querySelectorAll('.char'),
        {
          opacity: 0,
          y: 50,
          rotationX: -90,
          transformOrigin: "50% 50% -50",
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration,
          stagger: {
            each: stagger,
            from: "start",
            ease: "power2.inOut",
          },
          ease: "back.out(1.7)",
        }
      );
    }

    if (type === 'glitch') {
      return this.createGlitchEffect(element, duration);
    }

    if (type === 'wave') {
      return this.createWaveAnimation(element, duration);
    }
  }

  // Advanced scroll-based animations
  createScrollAnimation(element: HTMLElement, options: ScrollAnimationOptions = {}) {
    const {
      trigger = element,
      start = "top 80%",
      end = "bottom 20%",
      scrub = 1,
      pin = false,
      parallax = false,
      parallaxSpeed = 0.5,
      onUpdate,
      onComplete,
    } = options;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub,
        pin,
        onUpdate: (self) => {
          if (onUpdate) onUpdate(self.progress);
          if (parallax) {
            gsap.set(element, {
              y: self.progress * 100 * parallaxSpeed,
            });
          }
        },
        onComplete,
      },
    });

    return tl;
  }

  // Particle system for ambient effects
  createParticleSystem(container: HTMLElement, options: ParticleOptions = {}) {
    const particleSystem = new ParticleSystem(container, options);
    const id = `particles-${Date.now()}`;
    this.particleSystems.set(id, particleSystem);
    
    if (this.performanceMode !== 'low') {
      particleSystem.start();
    }

    return id;
  }

  // WebGL 3D scene for hero sections
  create3DScene(container: HTMLElement, options: Scene3DOptions = {}) {
    if (this.performanceMode === 'low' || typeof window === 'undefined') return null;

    const scene = new WebGLScene(container, options);
    const id = `scene-${Date.now()}`;
    this.webglScenes.set(id, scene);
    scene.start();

    return id;
  }

  // SVG path morphing animation
  morphPath(element: SVGPathElement, newPath: string, options: MorphOptions = {}) {
    const {
      duration = 1.5,
      ease = "power2.inOut",
      repeat = 0,
      yoyo = false,
    } = options;

    return gsap.to(element, {
      duration,
      ease,
      repeat,
      yoyo,
      attr: { d: newPath },
    });
  }

  // Create cinematic page transitions
  createPageTransition(options: TransitionOptions = {}) {
    const {
      type = 'fade',
      duration = 0.6,
      direction = 'in',
    } = options;

    const tl = gsap.timeline();

    switch (type) {
      case 'fade':
        if (direction === 'in') {
          tl.fromTo('.page-content', 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration, ease: "power3.out" }
          );
        } else {
          tl.to('.page-content', 
            { opacity: 0, y: -30, duration, ease: "power3.in" }
          );
        }
        break;

      case 'slide':
        if (direction === 'in') {
          tl.fromTo('.page-content',
            { x: '100%', opacity: 0 },
            { x: '0%', opacity: 1, duration, ease: "power3.out" }
          );
        } else {
          tl.to('.page-content',
            { x: '-100%', opacity: 0, duration, ease: "power3.in" }
          );
        }
        break;

      case 'morph':
        this.createMorphTransition(tl, direction, duration);
        break;

      case 'portal':
        this.createPortalTransition(tl, direction, duration);
        break;
    }

    return tl;
  }

  // Glitch effect for text
  private createGlitchEffect(element: HTMLElement, duration: number) {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    const text = element.textContent || '';

    tl.to(element, {
      duration: 0.1,
      skewX: 20,
      ease: "power4.inOut",
      repeat: 3,
      yoyo: true,
    })
    .to(element, {
      duration: 0.05,
      opacity: 0,
      ease: "power2.inOut",
      repeat: 1,
      yoyo: true,
    }, "-=0.1")
    .to(element, {
      duration: 0.05,
      skewX: 0,
      ease: "power4.inOut",
      onComplete: () => {
        element.textContent = text;
      },
    });

    return tl;
  }

  // Wave animation for text
  private createWaveAnimation(element: HTMLElement, duration: number) {
    const chars = element.textContent?.split('') || [];
    element.innerHTML = chars.map((char, i) => 
      `<span class="wave-char" style="display: inline-block; position: relative;">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');

    const charElements = element.querySelectorAll('.wave-char');

    return gsap.to(charElements, {
      duration: duration * 0.5,
      y: -20,
      ease: "power2.inOut",
      stagger: {
        each: 0.05,
        yoyo: true,
        repeat: -1,
      },
    });
  }

  // Morphing page transition
  private createMorphTransition(tl: gsap.core.Timeline, direction: string, duration: number) {
    const morphOverlay = document.createElement('div');
    morphOverlay.className = 'morph-overlay';
    morphOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--ifm-color-primary);
      clip-path: circle(0% at 50% 50%);
      z-index: 9999;
      pointer-events: none;
    `;

    document.body.appendChild(morphOverlay);

    if (direction === 'in') {
      tl.to(morphOverlay, {
        duration,
        clipPath: 'circle(150% at 50% 50%)',
        ease: "power2.inOut",
      })
      .set(morphOverlay, { display: 'none' });
    } else {
      tl.set(morphOverlay, { display: 'block' })
      .fromTo(morphOverlay, 
        { clipPath: 'circle(0% at 50% 50%)' },
        { clipPath: 'circle(150% at 50% 50%)', duration, ease: "power2.inOut" }
      );
    }
  }

  // Portal transition with WebGL
  private createPortalTransition(tl: gsap.core.Timeline, direction: string, duration: number) {
    const portal = document.createElement('canvas');
    portal.className = 'portal-transition';
    portal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      pointer-events: none;
    `;

    document.body.appendChild(portal);
    tl.to(portal, { opacity: 0, duration, onComplete: () => portal.remove() });
  }

  // Create a magnetic effect for interactive elements
  createMagneticEffect(element: HTMLElement, strength: number = 0.5) {
    let bounds: DOMRect;

    const onMouseEnter = () => {
      bounds = element.getBoundingClientRect();
    };

    const onMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.left;
      const topY = mouseY - bounds.top;
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2,
      };
      const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

      if (distance < bounds.width / 2) {
        gsap.to(element, {
          duration: 0.3,
          x: center.x * strength,
          y: center.y * strength,
          scale: 1.1,
          ease: "power2.out",
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to(element, {
        duration: 0.3,
        x: 0,
        y: 0,
        scale: 1,
        ease: "elastic.out(1, 0.3)",
      });
    };

    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseleave', onMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseleave', onMouseLeave);
    };
  }

  // Clean up resources
  cleanup() {
    this.animations.forEach(animation => animation.kill());
    this.scrollTriggers.forEach(trigger => trigger.kill());
    this.particleSystems.forEach(system => system.destroy());
    this.webglScenes.forEach(scene => scene.destroy());
    this.observers.forEach(observer => observer.disconnect());

    this.animations.clear();
    this.scrollTriggers = [];
    this.particleSystems.clear();
    this.webglScenes.clear();
    this.observers = [];
  }
}

// Particle System Class
class ParticleSystem {
  private container: HTMLElement;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private options: ParticleOptions;

  constructor(container: HTMLElement, options: ParticleOptions = {}) {
    this.container = container;
    this.options = {
      count: options.count || 50,
      size: options.size || { min: 2, max: 8 },
      speed: options.speed || { min: 0.5, max: 2 },
      color: options.color || ['#2563eb', '#3b82f6', '#60a5fa'],
      shape: options.shape || 'circle',
      glow: options.glow !== false,
      interactive: options.interactive !== false,
    };
    
    this.init();
  }

  private init() {
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';

    for (let i = 0; i < this.options.count; i++) {
      this.createParticle();
    }

    if (this.options.interactive) {
      this.setupInteraction();
    }
  }

  private createParticle() {
    const particle = new Particle(this.container, this.options);
    this.particles.push(particle);
  }

  private setupInteraction() {
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.particles.forEach(particle => {
        particle.attractTo(x, y);
      });
    });
  }

  start() {
    const animate = () => {
      this.particles.forEach(particle => particle.update());
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    this.stop();
    this.particles.forEach(particle => particle.destroy());
    this.particles = [];
  }
}

// Individual Particle Class
class Particle {
  private element: HTMLElement;
  private x: number;
  private y: number;
  private vx: number;
  private vy: number;
  private size: number;
  private container: HTMLElement;
  private options: ParticleOptions;

  constructor(container: HTMLElement, options: ParticleOptions) {
    this.container = container;
    this.options = options;
    
    this.x = Math.random() * container.offsetWidth;
    this.y = Math.random() * container.offsetHeight;
    
    const speed = this.randomBetween(options.speed?.min || 0.5, options.speed?.max || 2);
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    
    this.size = this.randomBetween(options.size?.min || 2, options.size?.max || 8);
    
    this.createElement();
  }

  private createElement() {
    this.element = document.createElement('div');
    this.element.className = 'particle';
    
    const color = Array.isArray(this.options.color) 
      ? this.options.color[Math.floor(Math.random() * this.options.color.length)]
      : this.options.color;

    this.element.style.cssText = `
      position: absolute;
      width: ${this.size}px;
      height: ${this.size}px;
      background: ${color};
      border-radius: ${this.options.shape === 'circle' ? '50%' : '0'};
      pointer-events: none;
      transition: transform 0.1s ease-out;
      ${this.options.glow ? `box-shadow: 0 0 ${this.size * 2}px ${color}40;` : ''}
    `;

    this.container.appendChild(this.element);
    this.updatePosition();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges
    if (this.x < -this.size) this.x = this.container.offsetWidth + this.size;
    if (this.x > this.container.offsetWidth + this.size) this.x = -this.size;
    if (this.y < -this.size) this.y = this.container.offsetHeight + this.size;
    if (this.y > this.container.offsetHeight + this.size) this.y = -this.size;

    this.updatePosition();
  }

  attractTo(targetX: number, targetY: number) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 100) {
      const force = (100 - distance) / 100;
      this.vx += (dx / distance) * force * 0.5;
      this.vy += (dy / distance) * force * 0.5;
      
      // Damping
      this.vx *= 0.95;
      this.vy *= 0.95;
    }
  }

  private updatePosition() {
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  private randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  destroy() {
    this.element.remove();
  }
}

// WebGL Scene Class
class WebGLScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private animationId: number | null = null;
  private objects: THREE.Object3D[] = [];

  constructor(container: HTMLElement, options: Scene3DOptions = {}) {
    this.container = container;
    this.init(options);
  }

  private init(options: Scene3DOptions) {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 1, 1000);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.offsetWidth / this.container.offsetHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Post-processing
    this.setupPostProcessing();

    // Add objects based on options
    if (options.type === 'particles') {
      this.createParticleField();
    } else if (options.type === 'geometry') {
      this.createGeometricShapes();
    } else if (options.type === 'fluid') {
      this.createFluidSimulation();
    }

    // Handle resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, 0.4, 0.85
    );
    this.composer.addPass(bloomPass);

    const filmPass = new FilmPass(0.35, 0.025, 648, false);
    this.composer.addPass(filmPass);
  }

  private createParticleField() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    for (let i = 0; i < 5000; i++) {
      vertices.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );

      colors.push(Math.random(), Math.random(), Math.random());
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);
    this.objects.push(particles);
  }

  private createGeometricShapes() {
    // Create various geometric shapes with glowing materials
    const shapes = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0),
    ];

    shapes.forEach((geometry, index) => {
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(index * 0.3, 0.7, 0.5),
        emissive: new THREE.Color().setHSL(index * 0.3, 0.7, 0.3),
        emissiveIntensity: 0.5,
        wireframe: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (index - 1) * 2;
      
      this.scene.add(mesh);
      this.objects.push(mesh);
    });

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 0, 10);
    this.scene.add(pointLight);
  }

  private createFluidSimulation() {
    // Simplified fluid simulation using shader materials
    // This would be a complex implementation with custom shaders
  }

  start() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);

      // Animate objects
      this.objects.forEach((object, index) => {
        object.rotation.x += 0.001 * (index + 1);
        object.rotation.y += 0.002 * (index + 1);
      });

      // Render scene
      this.composer.render();
    };

    animate();
  }

  private handleResize() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.objects.forEach(object => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    this.renderer.dispose();
    this.renderer.domElement.remove();
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
}

// TypeScript interfaces
interface TextAnimationOptions {
  type?: 'typewriter' | 'split' | 'glitch' | 'wave';
  duration?: number;
  stagger?: number;
  scrambleText?: boolean;
}

interface ScrollAnimationOptions {
  trigger?: HTMLElement | string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  parallax?: boolean;
  parallaxSpeed?: number;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
}

interface ParticleOptions {
  count?: number;
  size?: { min: number; max: number };
  speed?: { min: number; max: number };
  color?: string | string[];
  shape?: 'circle' | 'square';
  glow?: boolean;
  interactive?: boolean;
}

interface Scene3DOptions {
  type?: 'particles' | 'geometry' | 'fluid';
  interactive?: boolean;
  colors?: string[];
}

interface MorphOptions {
  duration?: number;
  ease?: string;
  repeat?: number;
  yoyo?: boolean;
}

interface TransitionOptions {
  type?: 'fade' | 'slide' | 'morph' | 'portal';
  duration?: number;
  direction?: 'in' | 'out';
}

export { AnimationSystem as default }; 