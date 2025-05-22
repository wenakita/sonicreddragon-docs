// Enhanced mermaid initialization
import mermaid from 'mermaid';
import anime from 'animejs/lib/anime.es.js';

// Function to sanitize mermaid diagram code at runtime
function sanitizeMermaidDiagram(element) {
  if (!element || !element.textContent) return;
  
  // Get the original content
  const originalContent = element.textContent;
  
  // Apply comprehensive sanitization
  let sanitized = originalContent
    // Fix classDef with problematic Unicode
    .replace(/classDef\s+(\w+)\s+fill:[^\n;]*/g, (match, className) => {
      return `classDef ${className} fill:#4a80d1`;
    })
    // FIX: Properly handle class statements with commas and highlight keyword
    // Example: "class Token,LZ,Governance,JackpotSystem highlight" -> "class Token LZ Governance JackpotSystem highlight"
    .replace(/class\s+([^;\n]+)(\s+highlight)/g, (match, classList, highlight) => {
      // Replace commas with spaces in the class list
      const fixedClassList = classList.replace(/,/g, ' ');
      return `class ${fixedClassList}${highlight}`;
    })
    // Fix commas in class names in class diagrams that don't have highlight
    .replace(/class\s+([^;\n]+)(?!\s+highlight)/g, (match, classList) => {
      // Replace commas with spaces
      const fixedClassList = classList.replace(/,/g, ' ');
      return `class ${fixedClassList}`;
    })
    // Replace all non-ASCII characters
    .replace(/[^\x00-\x7F]/g, '')
    // Ensure spaces around relationships
    .replace(/(\w+)--+>(\w+)/g, '$1 --> $2')
    .replace(/(\w+)<--+(\w+)/g, '$1 <-- $2')
    .replace(/(\w+)-.+->(\w+)/g, '$1 --> $2')
    // Replace any remaining problematic characters
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[—–]/g, '-');
  
  // Only update if there were changes
  if (sanitized !== originalContent) {
    console.log('Sanitized Mermaid diagram');
    element.textContent = sanitized;
  }
}

// --- ANIMATION LOGIC ---
function animateMermaidElements(container) {
  const svg = container?.tagName === 'svg' ? container : container?.querySelector('svg');
  if (!svg) return;
  const timeline = anime.timeline({ easing: 'easeOutExpo', duration: 800 });
  const nodes = svg.querySelectorAll('g.node rect, g.node circle, g.node ellipse, .actor');
  if (nodes.length) {
    timeline.add({ targets: nodes, opacity: [0, 1], scale: [0.85, 1], duration: 800, delay: anime.stagger(70) });
  }
  const labels = svg.querySelectorAll('g.node .label, .messageText, .loopText, text:not(.actor)');
  if (labels.length) {
    timeline.add({ targets: labels, opacity: [0, 1], duration: 600, delay: anime.stagger(50) }, '-=600');
  }
  const edges = svg.querySelectorAll('.edgePath path, .messageLine0, .messageLine1');
  if (edges.length) {
    edges.forEach(path => { if (path.getTotalLength) { const length = path.getTotalLength(); path.style.strokeDasharray = length; path.style.strokeDashoffset = length; } });
    timeline.add({ targets: edges, strokeDashoffset: [anime.setDashoffset, 0], duration: 800, delay: anime.stagger(100), easing: 'easeInOutSine' }, '-=400');
  }
  const markers = svg.querySelectorAll('marker, .marker');
  if (markers.length) {
    timeline.add({ targets: markers, opacity: [0, 1], duration: 300 }, '-=200');
  }
}

function initializeAllAnimations(targetElement) {
  if (targetElement) {
    if (!targetElement.dataset.animated) {
      targetElement.dataset.animated = 'true';
      animateMermaidElements(targetElement);
    }
    return;
  }
  document.querySelectorAll('.mermaid').forEach(el => {
    if (!el.dataset.animated && el.querySelector('svg')) {
      el.dataset.animated = 'true';
      animateMermaidElements(el);
    }
  });
}

// --- INTERACTIVE CONTROLS ---
function setupMermaidDiagrams() {
  const mermaidDivs = document.querySelectorAll('.mermaid');
  mermaidDivs.forEach((mermaidDiv, index) => {
    if (mermaidDiv.parentElement.classList.contains('mermaid-wrapper')) return;
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'mermaid-wrapper expandable';
    wrapper.setAttribute('data-diagram-id', `diagram-${index}`);
    mermaidDiv.parentNode.insertBefore(wrapper, mermaidDiv);
    wrapper.appendChild(mermaidDiv);
    // Controls
    const controls = document.createElement('div');
    controls.className = 'mermaid-controls';
    controls.style.display = 'flex';
    controls.style.justifyContent = 'center';
    controls.style.background = 'rgba(0,0,0,0.05)';
    controls.style.borderRadius = '8px 8px 0 0';
    // Zoom in/out
    const zoomIn = document.createElement('button');
    zoomIn.className = 'mermaid-control zoom-in';
    zoomIn.innerHTML = '🔍+';
    zoomIn.title = 'Zoom in';
    zoomIn.onclick = () => {
      const svg = mermaidDiv.querySelector('svg');
      if (svg) svg.style.transform = `scale(${(parseFloat(svg.style.transform?.replace('scale(',''))||1)+0.1})`;
    };
    const zoomOut = document.createElement('button');
    zoomOut.className = 'mermaid-control zoom-out';
    zoomOut.innerHTML = '🔍-';
    zoomOut.title = 'Zoom out';
    zoomOut.onclick = () => {
      const svg = mermaidDiv.querySelector('svg');
      if (svg) svg.style.transform = `scale(${Math.max((parseFloat(svg.style.transform?.replace('scale(',''))||1)-0.1,0.1)})`;
    };
    // Reset zoom
    const resetZoom = document.createElement('button');
    resetZoom.className = 'mermaid-control reset-zoom';
    resetZoom.innerHTML = '🔄';
    resetZoom.title = 'Reset zoom';
    resetZoom.onclick = () => {
      const svg = mermaidDiv.querySelector('svg');
      if (svg) svg.style.transform = 'scale(1)';
    };
    // Export as image
    const exportImg = document.createElement('button');
    exportImg.className = 'mermaid-control export-img';
    exportImg.innerHTML = '📥';
    exportImg.title = 'Export as image';
    exportImg.onclick = () => {
      const svg = mermaidDiv.querySelector('svg');
      if (!svg) return;
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svg);
      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    // Copy source
    const copySource = document.createElement('button');
    copySource.className = 'mermaid-control copy-source';
    copySource.innerHTML = '📋';
    copySource.title = 'Copy source';
    copySource.onclick = () => {
      navigator.clipboard.writeText(mermaidDiv.textContent || '');
    };
    // Expand
    const expand = document.createElement('button');
    expand.className = 'mermaid-control expand';
    expand.innerHTML = '⛶';
    expand.title = 'Expand';
    expand.onclick = () => {
      wrapper.classList.add('expanded');
      let backdrop = document.querySelector('.mermaid-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'mermaid-backdrop visible';
        document.body.appendChild(backdrop);
      }
      backdrop.classList.add('visible');
      document.body.style.overflow = 'hidden';
      backdrop.onclick = () => {
        wrapper.classList.remove('expanded');
        backdrop.classList.remove('visible');
        document.body.style.overflow = '';
      };
    };
    // Animation play
    const play = document.createElement('button');
    play.className = 'mermaid-control play';
    play.innerHTML = '▶️';
    play.title = 'Play animation';
    play.onclick = () => animateMermaidElements(mermaidDiv);
    // Add all controls
    [zoomIn, zoomOut, resetZoom, exportImg, copySource, expand, play].forEach(btn => controls.appendChild(btn));
    wrapper.insertBefore(controls, mermaidDiv);
  });
}

// --- KEYBOARD ACCESSIBILITY ---
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const expandedDiagram = document.querySelector('.mermaid-wrapper.expanded');
    if (expandedDiagram) {
      expandedDiagram.classList.remove('expanded');
      const backdrop = document.querySelector('.mermaid-backdrop');
      if (backdrop) backdrop.classList.remove('visible');
      document.body.style.overflow = '';
    }
  }
});

// This runs on client-side browser only
export default {
  onRouteUpdate() {
    if (typeof window === 'undefined') return;
    
    console.log('Initializing mermaid from client module');
    
    try {
      // Get current theme
      const isDarkTheme = document.documentElement.dataset.theme === 'dark';
      
      // Patch the mermaid render function to sanitize diagrams before rendering
      if (!mermaid._originalRender && mermaid.render) {
        mermaid._originalRender = mermaid.render;
        mermaid.render = function(id, text, ...args) {
          // Sanitize the text before rendering
          let sanitizedText = text
            // Fix classDef with problematic Unicode
            .replace(/classDef\s+(\w+)\s+fill:[^\n;]*/g, (match, className) => {
              return `classDef ${className} fill:#4a80d1`;
            })
            // FIX: Properly handle class statements with commas and highlight keyword
            // Example: "class Token,LZ,Governance,JackpotSystem highlight" -> "class Token LZ Governance JackpotSystem highlight"
            .replace(/class\s+([^;\n]+)(\s+highlight)/g, (match, classList, highlight) => {
              // Replace commas with spaces in the class list
              const fixedClassList = classList.replace(/,/g, ' ');
              return `class ${fixedClassList}${highlight}`;
            })
            // Fix commas in class names in class diagrams that don't have highlight
            .replace(/class\s+([^;\n]+)(?!\s+highlight)/g, (match, classList) => {
              // Replace commas with spaces
              const fixedClassList = classList.replace(/,/g, ' ');
              return `class ${fixedClassList}`;
            })
            // Replace all non-ASCII characters
            .replace(/[^\x00-\x7F]/g, '')
            // Ensure spaces around relationships
            .replace(/(\w+)--+>(\w+)/g, '$1 --> $2')
            .replace(/(\w+)<--+(\w+)/g, '$1 <-- $2')
            .replace(/(\w+)-.+->(\w+)/g, '$1 --> $2')
            // Replace any remaining problematic characters
            .replace(/[""]/g, '"')
            .replace(/['']/g, "'")
            .replace(/[—–]/g, '-');
          
          // Call the original render with sanitized text
          return mermaid._originalRender.call(this, id, sanitizedText, ...args);
        };
      }
      
      // Initialize mermaid with detailed configuration
      mermaid.initialize({
        startOnLoad: true,
        theme: isDarkTheme ? 'dark' : 'default',
        securityLevel: 'loose', // Needed for some diagram features
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontSize: 16,
        flowchart: {
          curve: 'basis',
          htmlLabels: true,
        },
        sequence: {
          diagramMarginX: 50,
          diagramMarginY: 10,
          actorMargin: 50,
          width: 150,
          height: 65,
        },
        // Add class diagram settings
        classDiagram: {
          useMaxWidth: true,
          diagramPadding: 20,
        },
        // Configuration to handle error cases more gracefully
        logLevel: 'error',
        deterministicIds: true,
        deterministicSelection: true,
      });
      
      // Store an initialized flag
      window.mermaidInitialized = true;
      
      // Sanitize all mermaid diagrams before processing
      document.querySelectorAll('.mermaid').forEach(sanitizeMermaidDiagram);
      
      // Process all diagrams
      const renderAllDiagrams = () => {
        const diagrams = document.querySelectorAll('.mermaid:not([data-processed="true"])');
        if (diagrams.length > 0) {
          console.log(`Found ${diagrams.length} unprocessed diagrams, rendering...`);
          diagrams.forEach(sanitizeMermaidDiagram);
          
          // Try to render each diagram individually for better error handling
          diagrams.forEach(diagram => {
            try {
              mermaid.init(undefined, [diagram]);
            } catch (diagramError) {
              console.error('Error rendering individual diagram:', diagramError);
              diagram.classList.add('mermaid-error');
              const errorDiv = document.createElement('div');
              errorDiv.className = 'mermaid-error-message';
              errorDiv.textContent = 'Error rendering diagram. Check browser console for details.';
              diagram.parentNode.insertBefore(errorDiv, diagram.nextSibling);
            }
          });
        }
      };
      
      // Render with a slight delay to ensure the DOM is fully ready
      setTimeout(renderAllDiagrams, 300);
      
      // Also re-render on theme change
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-theme') {
            // Theme changed, reinitialize with new theme
            const newIsDarkTheme = document.documentElement.dataset.theme === 'dark';
            mermaid.initialize({
              ...mermaid.mermaidAPI.getConfig(),
              theme: newIsDarkTheme ? 'dark' : 'default'
            });
            
            // Re-render diagrams with new theme
            renderAllDiagrams();
          }
        });
      });
      
      // Start observing theme changes
      observer.observe(document.documentElement, { attributes: true });
      
      // Initialize animations
      initializeAllAnimations();
      
    } catch (error) {
      console.error('Mermaid initialization error:', error);
    }
  }
}; 