/**
 * Enhanced Mermaid Animations
 * 
 * This file provides animation utilities for Mermaid diagrams using anime.js
 */

import anime from 'animejs';

/**
 * Animate a path with drawing effect
 * @param paths - The path elements to animate
 * @param options - Animation options
 */
export function drawPath(paths: NodeListOf<SVGPathElement> | SVGPathElement[] | HTMLElement[], options: any = {}) {
  const defaultOptions = {
    duration: 1500,
    easing: 'easeInOutSine',
    delay: (el: Element, i: number) => i * 150
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return anime({
    targets: paths,
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: mergedOptions.easing,
    duration: mergedOptions.duration,
    delay: mergedOptions.delay,
    direction: 'normal',
    loop: false
  });
}

/**
 * Add particle effects to a container
 * @param container - The container element
 * @param options - Particle options
 * @returns Cleanup function
 */
export function addParticleEffects(container: HTMLElement, options: any = {}): () => void {
  const defaultOptions = {
    particleCount: 30,
    color: '#3b82f6',
    size: 2,
    speed: 0.5,
    opacity: 0.3,
    linkOpacity: 0.2,
    linkDistance: 150
  };

  const mergedOptions = { ...defaultOptions, ...options };
  
  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  
  // Append canvas to container
  container.appendChild(canvas);
  
  // Get canvas context
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get canvas context');
    return () => {};
  }
  
  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  };
  
  // Call resize initially
  resizeCanvas();
  
  // Add resize listener
  window.addEventListener('resize', resizeCanvas);
  
  // Create particles
  const particles: Particle[] = [];
  
  class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    opacity: number;
    
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * mergedOptions.size + 1;
      this.speedX = (Math.random() - 0.5) * mergedOptions.speed;
      this.speedY = (Math.random() - 0.5) * mergedOptions.speed;
      this.color = mergedOptions.color;
      this.opacity = Math.random() * mergedOptions.opacity + 0.1;
    }
    
    update() {
      // Update position
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) {
        this.speedX *= -1;
      }
      
      if (this.y < 0 || this.y > canvas.height) {
        this.speedY *= -1;
      }
    }
    
    draw() {
      if (!ctx) return;
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  
  // Create particles
  for (let i = 0; i < mergedOptions.particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Draw links between particles
  function drawLinks() {
    if (!ctx) return;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mergedOptions.linkDistance) {
          const opacity = (1 - distance / mergedOptions.linkDistance) * mergedOptions.linkOpacity;
          
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = mergedOptions.color;
          ctx.globalAlpha = opacity;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }
  
  // Animation loop
  let animationFrameId: number;
  
  function animate() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    for (const particle of particles) {
      particle.update();
      particle.draw();
    }
    
    // Draw links
    drawLinks();
    
    // Request next frame
    animationFrameId = requestAnimationFrame(animate);
  }
  
  // Start animation
  animate();
  
  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resizeCanvas);
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  };
}

/**
 * Animate a Mermaid diagram
 * @param container - The container element
 */
export function animateMermaidDiagram(container: HTMLElement) {
  // Get SVG element
  const svg = container.querySelector('svg');
  if (!svg) return;
  
  // Animate paths
  const paths = svg.querySelectorAll('path');
  if (paths.length > 0) {
    drawPath(paths, {
      duration: 1500,
      easing: 'easeInOutSine',
      delay: (el: Element, i: number) => i * 150
    });
  }
  
  // Animate nodes
  const nodes = svg.querySelectorAll('.node');
  nodes.forEach((node, index) => {
    const element = node as HTMLElement;
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px) scale(0.95)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    element.style.transitionDelay = `${index * 120}ms`;
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0) scale(1)';
    }, 100);
  });
  
  // Animate edges
  const edges = svg.querySelectorAll('.edgePath');
  edges.forEach((edge, index) => {
    const element = edge as HTMLElement;
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.6s ease';
    element.style.transitionDelay = `${(nodes.length * 120) + (index * 100)}ms`;
    
    setTimeout(() => {
      element.style.opacity = '1';
    }, (nodes.length * 120) + 100);
  });
  
  // Animate clusters
  const clusters = svg.querySelectorAll('.cluster');
  clusters.forEach((cluster, index) => {
    const element = cluster as HTMLElement;
    element.style.opacity = '0';
    element.style.transform = 'scale(0.95)';
    element.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
    element.style.transitionDelay = `${index * 150}ms`;
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    }, 100);
  });
  
  // Animate labels
  const labels = svg.querySelectorAll('.label');
  labels.forEach((label, index) => {
    const element = label as HTMLElement;
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.6s ease';
    element.style.transitionDelay = `${(nodes.length * 120) + (edges.length * 100) + (index * 50)}ms`;
    
    setTimeout(() => {
      element.style.opacity = '1';
    }, (nodes.length * 120) + (edges.length * 100) + 100);
  });
}

/**
 * Add interactive features to a Mermaid diagram
 * @param container - The container element
 */
export function addMermaidInteractivity(container: HTMLElement) {
  // Get SVG element
  const svg = container.querySelector('svg');
  if (!svg) return;
  
  // Add hover effects to nodes
  const nodes = svg.querySelectorAll('.node');
  nodes.forEach(node => {
    node.classList.add('interactive-node');
    
    // Add click handler to highlight connected paths
    node.addEventListener('click', () => {
      // Reset all nodes and edges
      nodes.forEach(n => n.classList.remove('highlighted-node'));
      svg.querySelectorAll('.edgePath').forEach(e => e.classList.remove('highlighted-edge'));
      
      // Highlight this node
      node.classList.add('highlighted-node');
      
      // Find connected edges
      const nodeId = node.id;
      const connectedEdges = svg.querySelectorAll(`.edgePath[id*="${nodeId}"]`);
      connectedEdges.forEach(edge => {
        edge.classList.add('highlighted-edge');
        
        // Extract the other node ID from the edge ID
        const edgeId = edge.id;
        const [sourceId, targetId] = edgeId.split('-').map(id => id.replace('L-', '').replace('-R', ''));
        const otherNodeId = sourceId === nodeId ? targetId : sourceId;
        
        // Highlight the connected node
        const connectedNode = svg.querySelector(`#${otherNodeId}`);
        if (connectedNode) {
          connectedNode.classList.add('highlighted-node');
        }
      });
    });
  });
  
  // Add hover effects to edges
  const edges = svg.querySelectorAll('.edgePath');
  edges.forEach(edge => {
    edge.classList.add('interactive-edge');
  });
  
  // Add click handler to reset highlights when clicking on the background
  svg.addEventListener('click', (event) => {
    if (event.target === svg) {
      nodes.forEach(n => n.classList.remove('highlighted-node'));
      edges.forEach(e => e.classList.remove('highlighted-edge'));
    }
  });
}

/**
 * Add controls to a Mermaid diagram
 * @param container - The container element
 */
export function addMermaidControls(container: HTMLElement) {
  // Get SVG element
  const svg = container.querySelector('svg');
  if (!svg) return;
  
  // Check if controls already exist
  if (container.querySelector('.mermaid-controls')) return;
  
  // Create controls container
  const controls = document.createElement('div');
  controls.className = 'mermaid-controls';
  
  // Add replay button
  const replayButton = document.createElement('button');
  replayButton.className = 'mermaid-control-button';
  replayButton.title = 'Replay animation';
  replayButton.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
    </svg>
  `;
  replayButton.addEventListener('click', () => {
    animateMermaidDiagram(container);
  });
  
  // Add fullscreen button
  const fullscreenButton = document.createElement('button');
  fullscreenButton.className = 'mermaid-control-button';
  fullscreenButton.title = 'Toggle fullscreen';
  fullscreenButton.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
    </svg>
  `;
  fullscreenButton.addEventListener('click', () => {
    // Toggle fullscreen
    container.classList.toggle('mermaid-fullscreen');
    
    // Update button icon
    if (container.classList.contains('mermaid-fullscreen')) {
      fullscreenButton.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
        </svg>
      `;
    } else {
      fullscreenButton.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
        </svg>
      `;
    }
  });
  
  // Add download button
  const downloadButton = document.createElement('button');
  downloadButton.className = 'mermaid-control-button';
  downloadButton.title = 'Download SVG';
  downloadButton.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    </svg>
  `;
  downloadButton.addEventListener('click', () => {
    // Download SVG
    const svg = container.querySelector('svg');
    if (!svg) return;
    
    // Create a blob from the SVG
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram.svg';
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
  
  // Add buttons to controls
  controls.appendChild(replayButton);
  controls.appendChild(fullscreenButton);
  controls.appendChild(downloadButton);
  
  // Add controls to container
  container.appendChild(controls);
}

/**
 * Add glow effect to a Mermaid diagram
 * @param container - The container element
 */
export function addMermaidGlowEffect(container: HTMLElement) {
  // Get SVG element
  const svg = container.querySelector('svg');
  if (!svg) return;
  
  // Add glow effect class
  svg.classList.add('glow-effect');
  
  // Add filter for glow effect
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  `;
  
  // Add defs to SVG
  svg.insertBefore(defs, svg.firstChild);
  
  // Apply filter to nodes
  const nodes = svg.querySelectorAll('.node');
  nodes.forEach(node => {
    (node as SVGElement).style.filter = 'url(#glow)';
  });
}

/**
 * Check if user prefers reduced motion
 * @returns True if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
