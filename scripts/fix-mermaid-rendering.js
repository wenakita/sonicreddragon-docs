// ExecutionEnvironment is not needed in Node.js scripts
// const ExecutionEnvironment = require('@docusaurus/ExecutionEnvironment');

// Node.js script - no browser environment check needed
/**
 * Fix Mermaid Rendering Script
 * 
 * This script ensures Mermaid diagrams render properly with the dark theme.
 * It updates the Mermaid initialization code to work with the new dark sidebar.
 */

const fs = require('fs');
const path = require('path');

console.log('Starting to fix Mermaid rendering...');

// Path to the Mermaid initialization module
const mermaidInitPath = path.join(__dirname, '..', 'src', 'clientModules', 'mermaidInit.js');

// Check if the file exists
if (!fs.existsSync(mermaidInitPath)) {
  console.error(`Mermaid initialization file not found at ${mermaidInitPath}`);
  process.exit(1);
}

// Read the current content
let content = fs.readFileSync(mermaidInitPath, 'utf8');

// Updated Mermaid initialization code
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
    // Wait a bit to ensure Mermaid is loaded
    setTimeout(() => {
      try {
        // Check if mermaid is available
        if (typeof window.mermaid !== 'undefined') {
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
          }
        } else {
          console.warn('Mermaid library not found. Diagrams may not render correctly.');
        }
      } catch (error) {
        console.error('Error initializing Mermaid:', error);
      }
    }, 1000); // Wait 1 second to ensure everything is loaded
  }
}`;

// Write the updated content
fs.writeFileSync(mermaidInitPath, updatedMermaidInit);
console.log(`Updated Mermaid initialization file at ${mermaidInitPath}`);

// Create a CSS file to ensure Mermaid diagrams are visible after processing
const mermaidVisibilityCssPath = path.join(__dirname, '..', 'static', 'css', 'mermaid-visibility.css');
const mermaidVisibilityCss = `/**
 * Mermaid Visibility CSS
 *
 * This CSS ensures Mermaid diagrams are visible after processing.
 */

/* Hide diagrams until processed */
.mermaid:not([data-processed="true"]) {
  visibility: hidden;
}

/* Show diagrams after processing */
.mermaid[data-processed="true"],
.mermaid-visible {
  visibility: visible !important;
  display: block !important;
}

/* Add a loading indicator for diagrams that are not yet processed */
.mermaid:not([data-processed="true"])::before {
  content: "Loading diagram...";
  display: block;
  text-align: center;
  padding: 1rem;
  color: #e0e0e0;
  background-color: #1e1e1e;
  border-radius: 0.5rem;
  visibility: visible;
}
`;

// Write the visibility CSS file
fs.writeFileSync(mermaidVisibilityCssPath, mermaidVisibilityCss);
console.log(`Created Mermaid visibility CSS file at ${mermaidVisibilityCssPath}`);

// Update docusaurus.config.ts to include the new CSS file
const docusaurusConfigPath = path.join(__dirname, '..', 'docusaurus.config.ts');
let docusaurusConfig = fs.readFileSync(docusaurusConfigPath, 'utf8');

// Check if the CSS file is already included
if (!docusaurusConfig.includes('/css/mermaid-visibility.css')) {
  // Find the stylesheets array
  const stylesheetsMatch = docusaurusConfig.match(/stylesheets:\s*\[([\s\S]*?)\]/);
  if (stylesheetsMatch) {
    // Add the new CSS file to the end of the array
    const updatedStylesheets = stylesheetsMatch[0].replace(
      /\]$/,
      ',\n    { href: \'/css/mermaid-visibility.css\', type: \'text/css\' }\n  ]'
    );
    docusaurusConfig = docusaurusConfig.replace(stylesheetsMatch[0], updatedStylesheets);
    
    // Write the updated config
    fs.writeFileSync(docusaurusConfigPath, docusaurusConfig);
    console.log(`Updated docusaurus.config.ts to include mermaid-visibility.css`);
  } else {
    console.error('Could not find stylesheets array in docusaurus.config.ts');
  }
}

console.log('Finished fixing Mermaid rendering.');

// No need for browser environment check in Node.js scripts