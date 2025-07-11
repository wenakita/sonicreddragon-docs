// ExecutionEnvironment is not needed in Node.js scripts
// const ExecutionEnvironment = require('@docusaurus/ExecutionEnvironment');

// Node.js script - no browser environment check needed
/**
 * Fix Mermaid Diagrams Script
 * 
 * This script provides a comprehensive fix for Mermaid diagrams in the documentation.
 * It updates the Mermaid initialization code, CSS, and ensures proper rendering.
 */

const fs = require('fs');
const path = require('path');

console.log('Starting to fix Mermaid diagrams...');

// Path to the Mermaid initialization module
const mermaidInitPath = path.join(__dirname, '..', 'src', 'clientModules', 'mermaidInit.js');

// Updated Mermaid initialization code with more robust initialization
const updatedMermaidInit = `/**
 * Mermaid Initialization Module
 * 
 * This module initializes Mermaid diagrams with proper dark theme support.
 */

export default function() {
  // Only run in browser context
  if (typeof window === 'undefined') {
    return;
  }

  // Wait for the document to be fully loaded
  if (document.readyState === 'complete') {
    initializeMermaid();
  } else {
    window.addEventListener('load', initializeMermaid);
  }

  function initializeMermaid() {
    // Create a more robust initialization that retries multiple times
    let attempts = 0;
    const maxAttempts = 10;
    const attemptInterval = 500; // 500ms between attempts

    function attemptInitialization() {
      attempts++;
      console.log(\`Attempting to initialize Mermaid (attempt \${attempts}/\${maxAttempts})...\`);
      
      try {
        // Check if mermaid is available
        if (typeof window.mermaid !== 'undefined') {
          console.log('Mermaid library found. Initializing...');
          
          // Configure mermaid
          window.mermaid.initialize({
            startOnLoad: true,
            theme: 'dark',
            securityLevel: 'loose',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: 14,
            themeVariables: {
              darkMode: true,
              primaryColor: '#2A2A2A',
              primaryTextColor: '#FFFFFF',
              primaryBorderColor: '#3b82f6',
              lineColor: '#3b82f6',
              secondaryColor: '#1A1A1A',
              tertiaryColor: '#0A0A0A',
              background: '#1e1e1e',
              mainBkg: '#2A2A2A',
              secondBkg: '#1A1A1A',
              textColor: '#FFFFFF',
              labelColor: '#FFFFFF',
              edgeLabelBackground: '#1A1A1A',
              clusterBkg: 'rgba(59, 130, 246, 0.1)',
              clusterBorder: '#3b82f6',
              defaultLinkColor: '#3b82f6',
            },
            flowchart: {
              htmlLabels: true,
              curve: 'basis',
            },
            sequence: {
              diagramMarginX: 50,
              diagramMarginY: 10,
              actorMargin: 50,
              width: 150,
              height: 65,
              boxMargin: 10,
              boxTextMargin: 5,
              noteMargin: 10,
              messageMargin: 35,
              mirrorActors: true,
              bottomMarginAdj: 1,
              useMaxWidth: true,
            },
          });

          // Force re-render all diagrams
          const diagrams = document.querySelectorAll('.mermaid');
          if (diagrams.length > 0) {
            console.log(\`Re-rendering \${diagrams.length} Mermaid diagrams...\`);
            
            // Clear any existing diagrams
            diagrams.forEach(diagram => {
              // Keep the original content
              const content = diagram.textContent;
              
              // Reset the diagram
              diagram.removeAttribute('data-processed');
              diagram.innerHTML = content;
            });
            
            // Re-render all diagrams
            window.mermaid.init(undefined, diagrams);
            
            // Add visibility class after processing
            diagrams.forEach(diagram => {
              diagram.classList.add('mermaid-visible');
            });
            
            // Add a global flag to indicate Mermaid has been initialized
            window.mermaidInitialized = true;
            
            console.log('Mermaid diagrams initialized successfully.');
          } else {
            console.warn('No Mermaid diagrams found on the page.');
          }
          
          return; // Initialization successful, exit the retry loop
        } else {
          console.warn(\`Mermaid library not found (attempt \${attempts}/\${maxAttempts}). Retrying...\`);
          
          if (attempts < maxAttempts) {
            setTimeout(attemptInitialization, attemptInterval);
          } else {
            console.error(\`Failed to initialize Mermaid after \${maxAttempts} attempts.\`);
          }
        }
      } catch (error) {
        console.error('Error initializing Mermaid:', error);
        
        if (attempts < maxAttempts) {
          console.log(\`Retrying initialization (attempt \${attempts}/\${maxAttempts})...\`);
          setTimeout(attemptInitialization, attemptInterval);
        } else {
          console.error(\`Failed to initialize Mermaid after \${maxAttempts} attempts.\`);
        }
      }
    }
    
    // Start the initialization process
    attemptInitialization();
    
    // Add a mutation observer to handle dynamically added Mermaid diagrams
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              
              // Check if this is a Mermaid diagram
              if (element.classList && element.classList.contains('mermaid') && !element.getAttribute('data-processed')) {
                console.log('New Mermaid diagram detected. Initializing...');
                
                if (window.mermaidInitialized && window.mermaid) {
                  // Initialize the new diagram
                  window.mermaid.init(undefined, [element]);
                  element.classList.add('mermaid-visible');
                }
              }
              
              // Check for Mermaid diagrams within the added node
              const nestedDiagrams = element.querySelectorAll('.mermaid:not([data-processed])');
              if (nestedDiagrams.length > 0) {
                console.log(\`\${nestedDiagrams.length} new nested Mermaid diagrams detected. Initializing...\`);
                
                if (window.mermaidInitialized && window.mermaid) {
                  // Initialize the new diagrams
                  window.mermaid.init(undefined, nestedDiagrams);
                  nestedDiagrams.forEach(diagram => {
                    diagram.classList.add('mermaid-visible');
                  });
                }
              }
            }
          });
        }
      });
    });
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}`;

// Write the updated content
fs.writeFileSync(mermaidInitPath, updatedMermaidInit);
console.log(`Updated Mermaid initialization file at ${mermaidInitPath}`);

// Create an enhanced CSS file for Mermaid diagrams
const mermaidEnhancedCssPath = path.join(__dirname, '..', 'static', 'css', 'mermaid-enhanced.css');
const mermaidEnhancedCss = `/**
 * Mermaid Enhanced CSS
 *
 * This CSS provides comprehensive styling for Mermaid diagrams.
 */

/* Base styles for Mermaid diagrams */
.mermaid {
  display: block !important;
  visibility: visible !important;
  background-color: #1e1e1e;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  overflow: auto;
  min-height: 100px;
}

/* Ensure SVG is visible */
.mermaid svg {
  display: block !important;
  margin: 0 auto;
  max-width: 100%;
  height: auto !important;
  min-height: 50px;
}

/* Loading indicator for diagrams that are not yet processed */
.mermaid:not([data-processed="true"])::before {
  content: "Loading diagram...";
  display: block;
  text-align: center;
  padding: 1rem;
  color: #e0e0e0;
  background-color: #1e1e1e;
  border-radius: 0.5rem;
  visibility: visible;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Ensure text in diagrams is visible */
.mermaid .label {
  color: #e0e0e0 !important;
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
}

/* Fix for Mermaid nodes */
.mermaid .node rect,
.mermaid .node circle,
.mermaid .node ellipse,
.mermaid .node polygon,
.mermaid .node path {
  fill: #2a2a2a !important;
  stroke: #3b82f6 !important;
}

/* Fix for Mermaid clusters */
.mermaid .cluster rect,
.mermaid .cluster polygon {
  fill: rgba(59, 130, 246, 0.1) !important;
  stroke: #3b82f6 !important;
}

/* Fix for Mermaid edges */
.mermaid .edgePath .path {
  stroke: #3b82f6 !important;
  stroke-width: 2px !important;
}

/* Fix for Mermaid arrowheads */
.mermaid .arrowheadPath {
  fill: #3b82f6 !important;
  stroke: none !important;
}

/* Fix for Mermaid markers */
.mermaid marker {
  fill: #3b82f6 !important;
}

/* Fix for Mermaid flowchart labels */
.mermaid .edgeLabel {
  background-color: #1e1e1e !important;
  color: #e0e0e0 !important;
  font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
}

/* Fix for Mermaid sequence diagram actors */
.mermaid .actor {
  fill: #2a2a2a !important;
  stroke: #3b82f6 !important;
}

/* Fix for Mermaid sequence diagram notes */
.mermaid .note {
  fill: rgba(59, 130, 246, 0.1) !important;
  stroke: #3b82f6 !important;
}

/* Fix for Mermaid sequence diagram text */
.mermaid text.actor {
  fill: #e0e0e0 !important;
}

/* Fix for Mermaid class diagram */
.mermaid .classGroup rect {
  fill: #2a2a2a !important;
  stroke: #3b82f6 !important;
}

.mermaid .classGroup text {
  fill: #e0e0e0 !important;
}

/* Fix for Mermaid state diagram */
.mermaid .stateGroup rect {
  fill: #2a2a2a !important;
  stroke: #3b82f6 !important;
}

.mermaid .stateGroup text {
  fill: #e0e0e0 !important;
}

/* Fix for Mermaid gantt chart */
.mermaid .taskText {
  fill: #e0e0e0 !important;
}

.mermaid .taskTextOutsideRight {
  fill: #e0e0e0 !important;
}

.mermaid .taskTextOutsideLeft {
  fill: #e0e0e0 !important;
}

/* Fix for Mermaid pie chart */
.mermaid .pieTitleText {
  fill: #e0e0e0 !important;
}

.mermaid .pieSectionText {
  fill: #e0e0e0 !important;
}

/* Fix for Mermaid ER diagram */
.mermaid .entityBox {
  fill: #2a2a2a !important;
  stroke: #3b82f6 !important;
}

.mermaid .entityLabel {
  fill: #e0e0e0 !important;
}

/* Ensure Mermaid initialization works properly */
.mermaid:not([data-processed="true"]) {
  position: relative;
}

.mermaid[data-processed="true"],
.mermaid-visible {
  visibility: visible !important;
  display: block !important;
}

/* Fix for Docusaurus Mermaid container */
.docusaurus-mermaid-container {
  background-color: #1e1e1e !important;
  padding: 1rem !important;
  border-radius: 0.5rem !important;
  margin: 1.5rem 0 !important;
  overflow: auto !important;
}

/* Fix for Unified Mermaid component */
.unified-mermaid-wrapper {
  margin: 2rem 0 !important;
}

/* Fix for Mermaid diagrams in MDX */
.mdx-page .mermaid {
  background-color: #1e1e1e !important;
  padding: 1rem !important;
  border-radius: 0.5rem !important;
  margin: 1.5rem 0 !important;
}

/* Fix for Mermaid diagrams in dark mode */
[data-theme='dark'] .mermaid {
  background-color: #1e1e1e !important;
}

[data-theme='dark'] .mermaid .label {
  color: #e0e0e0 !important;
}

[data-theme='dark'] .mermaid .node rect,
[data-theme='dark'] .mermaid .node circle,
[data-theme='dark'] .mermaid .node ellipse,
[data-theme='dark'] .mermaid .node polygon,
[data-theme='dark'] .mermaid .node path {
  fill: #2a2a2a !important;
  stroke: #3b82f6 !important;
}

/* Fix for Mermaid diagrams in light mode */
[data-theme='light'] .mermaid {
  background-color: #f8fafc !important;
}

[data-theme='light'] .mermaid .label {
  color: #1e293b !important;
}

[data-theme='light'] .mermaid .node rect,
[data-theme='light'] .mermaid .node circle,
[data-theme='light'] .mermaid .node ellipse,
[data-theme='light'] .mermaid .node polygon,
[data-theme='light'] .mermaid .node path {
  fill: #e2e8f0 !important;
  stroke: #2563eb !important;
}
`;

// Write the enhanced CSS file
fs.writeFileSync(mermaidEnhancedCssPath, mermaidEnhancedCss);
console.log(`Created enhanced Mermaid CSS file at ${mermaidEnhancedCssPath}`);

// Update docusaurus.config.ts to include the new CSS file
const docusaurusConfigPath = path.join(__dirname, '..', 'docusaurus.config.ts');
let docusaurusConfig = fs.readFileSync(docusaurusConfigPath, 'utf8');

// Check if the CSS file is already included
if (!docusaurusConfig.includes('/css/mermaid-enhanced.css')) {
  // Find the stylesheets array
  const stylesheetsMatch = docusaurusConfig.match(/stylesheets:\s*\[([\s\S]*?)\]/);
  if (stylesheetsMatch) {
    // Add the new CSS file to the end of the array
    const updatedStylesheets = stylesheetsMatch[0].replace(
      /\]$/,
      ',\n    { href: \'/css/mermaid-enhanced.css\', type: \'text/css\' }\n  ]'
    );
    docusaurusConfig = docusaurusConfig.replace(stylesheetsMatch[0], updatedStylesheets);
    
    // Write the updated config
    fs.writeFileSync(docusaurusConfigPath, docusaurusConfig);
    console.log(`Updated docusaurus.config.ts to include mermaid-enhanced.css`);
  } else {
    console.error('Could not find stylesheets array in docusaurus.config.ts');
  }
}

// Update package.json to include the new script
const packageJsonPath = path.join(__dirname, '..', 'package.json');
let packageJson = fs.readFileSync(packageJsonPath, 'utf8');
const packageJsonObj = JSON.parse(packageJson);

// Add the new script if it doesn't exist
if (!packageJsonObj.scripts['fix-mermaid-diagrams']) {
  packageJsonObj.scripts['fix-mermaid-diagrams'] = 'node ./scripts/fix-mermaid-diagrams.js';
  
  // Update the build script to include the new fix
  packageJsonObj.scripts['build'] = packageJsonObj.scripts['build'].replace(
    'fix-all-markdown-links',
    'fix-all-markdown-links && npm run fix-mermaid-diagrams'
  );
  
  // Update the rebuild-with-mermaid-fix script
  if (packageJsonObj.scripts['rebuild-with-mermaid-fix']) {
    packageJsonObj.scripts['rebuild-with-mermaid-fix'] = 'node ./scripts/rebuild-with-mermaid-fix.js';
  }
  
  // Write the updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonObj, null, 2));
  console.log(`Updated package.json to include fix-mermaid-diagrams script`);
}

// Update the rebuild-with-mermaid-fix.js script
const rebuildScriptPath = path.join(__dirname, '..', 'scripts', 'rebuild-with-mermaid-fix.js');
if (fs.existsSync(rebuildScriptPath)) {
  let rebuildScript = fs.readFileSync(rebuildScriptPath, 'utf8');
  
  // Check if the script already includes the fix-mermaid-diagrams step
  if (!rebuildScript.includes('fix-mermaid-diagrams')) {
    // Replace the fix-mermaid-rendering step with fix-mermaid-diagrams
    rebuildScript = rebuildScript.replace(
      /\/\/ Step 4: Fix Mermaid rendering[\s\S]*?execSync\('node \.\/scripts\/fix-mermaid-rendering\.js', { stdio: 'inherit' }\);/,
      `// Step 4: Fix Mermaid diagrams\nconsole.log('\\n=== Step 4: Fixing Mermaid diagrams ===');\nexecSync('node ./scripts/fix-mermaid-diagrams.js', { stdio: 'inherit' });`
    );
    
    // Write the updated script
    fs.writeFileSync(rebuildScriptPath, rebuildScript);
    console.log(`Updated rebuild-with-mermaid-fix.js to use fix-mermaid-diagrams`);
  }
}

console.log('Finished fixing Mermaid diagrams.');

// No need for browser environment check in Node.js scripts