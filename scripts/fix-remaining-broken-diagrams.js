#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('FIXING REMAINING BROKEN DIAGRAMS');
console.log('=================================\n');

function fixComplexBrokenDiagrams(content, filename) {
  let fixedContent = content;
  
  // Fix the complex broken classDiagram in architecture.md
  if (filename.includes('architecture')) {
    // Replace the entire broken classDiagram with a working one
    fixedContent = fixedContent.replace(
      /```mermaid\s*\nclassDiagram[\s\S]*?```/g,
      `\`\`\`mermaid
graph TB
    subgraph "Core Contracts"
        A[OmniDragon Token] --> B[Swap Trigger]
        A --> C[Jackpot Vault]
        A --> D[ve69LP Governance]
    end
    
    subgraph "Jackpot System"
        B --> E[Jackpot Distributor]
        E --> C
        E --> F[Randomness Provider]
    end
    
    subgraph "Cross-Chain"
        A --> G[Cross-Chain Bridge]
        G --> H[LayerZero Endpoint]
    end
    
    style A fill:#2563eb,stroke:#1d4ed8,color:#fff
    style C fill:#dc2626,stroke:#b91c1c,color:#fff
    style D fill:#059669,stroke:#047857,color:#fff
    style G fill:#7c3aed,stroke:#6d28d9,color:#fff
\`\`\``
    );
  }
  
  // Fix any remaining broken class definitions
  fixedContent = fixedContent.replace(
    /class class class \w+\s*\{[\s\S]*?\}/g,
    ''
  );
  
  // Fix malformed class definitions
  fixedContent = fixedContent.replace(
    /class \w+\s*\{\s*\}\s*class \w+\s*\{[\s\S]*?\}/g,
    ''
  );
  
  // Fix incomplete mermaid blocks
  fixedContent = fixedContent.replace(
    /```mermaid\s*\ngraph TB\s*subgraph "OmniDragon Protocol"\s*A\[Token Contract\] --> B\[Jackpot System\]\s*A --> C\[Cross-Chain Bridge\]\s*```/g,
    `\`\`\`mermaid
graph TB
    subgraph "OmniDragon Protocol"
        A[Token Contract] --> B[Jackpot System]
        A --> C[Cross-Chain Bridge]
        A --> D[Governance System]
        B --> E[Randomness Provider]
        C --> F[LayerZero Endpoint]
        D --> G[Voting Mechanism]
    end
    
    style A fill:#2563eb,stroke:#1d4ed8,color:#fff
    style B fill:#dc2626,stroke:#b91c1c,color:#fff
    style C fill:#7c3aed,stroke:#6d28d9,color:#fff
    style D fill:#059669,stroke:#047857,color:#fff
\`\`\``
  );
  
  return fixedContent;
}

function processSpecificFiles() {
  const filesToFix = [
    'docs-new/concepts/architecture.md',
    'docs-new/concepts/overview.md',
    'docs-new/concepts/security-model.md'
  ];
  
  let totalFixed = 0;
  
  filesToFix.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const fixedContent = fixComplexBrokenDiagrams(content, file);
        
        if (fixedContent !== content) {
          fs.writeFileSync(file, fixedContent);
          console.log(`Fixed remaining broken diagrams in ${file}`);
          totalFixed++;
        } else {
          console.log(`No additional fixes needed for ${file}`);
        }
      } catch (error) {
        console.log(`Error processing ${file}: ${error.message}`);
      }
    }
  });
  
  console.log(`\nFixed ${totalFixed} files with remaining broken diagrams.`);
}

// Run the fixes
processSpecificFiles(); 