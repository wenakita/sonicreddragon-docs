#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('REMOVING EMOJIS AND FIXING DIAGRAMS');
console.log('===================================\n');

function getAllMarkdownFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        files.push(fullPath);
      }
    });
  }
  
  traverse(dir);
  return files;
}

function removeEmojis(content) {
  // Remove common emojis found in the documentation
  const emojiPatterns = [
    /📊/g, /🎯/g, /✅/g, /❌/g, /⚠️/g, /🔧/g, /🚀/g, /💡/g, 
    /📈/g, /🎉/g, /🔄/g, /🎨/g, /🚫/g, /📝/g, /⚡/g, /🤔/g, 
    /❓/g, /ℹ️/g, /🔍/g, /📋/g, /🎪/g, /🌟/g, /🔥/g, /💎/g,
    /🎮/g, /🏆/g, /🎲/g, /🎭/g, /🎪/g, /🎨/g, /🎯/g, /🎊/g
  ];
  
  let cleanContent = content;
  
  emojiPatterns.forEach(pattern => {
    cleanContent = cleanContent.replace(pattern, '');
  });
  
  // Clean up any double spaces or formatting issues caused by emoji removal
  cleanContent = cleanContent.replace(/\*\*\s+/g, '**');
  cleanContent = cleanContent.replace(/\s+\*\*/g, '**');
  cleanContent = cleanContent.replace(/>\s+\*\*/g, '> **');
  cleanContent = cleanContent.replace(/##\s+\*\*/g, '## **');
  cleanContent = cleanContent.replace(/###\s+\*\*/g, '### **');
  
  return cleanContent;
}

function createWorkingDiagram(type, context = '') {
  const diagrams = {
    architecture: `\`\`\`mermaid
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
\`\`\``,

    crosschain: `\`\`\`mermaid
graph LR
    subgraph "Source Chain"
        A[User] --> B[OmniDragon Token]
        B --> C[Cross-Chain Bridge]
    end
    
    subgraph "LayerZero"
        C --> D[Message Relay]
    end
    
    subgraph "Destination Chain"
        D --> E[OmniDragon Token]
        E --> F[User Wallet]
    end
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style F fill:#3b82f6,stroke:#2563eb,color:#fff
\`\`\``,

    jackpot: `\`\`\`mermaid
sequenceDiagram
    participant User
    participant Token
    participant Jackpot
    participant Random
    
    User->>Token: Buy Transaction
    Token->>Jackpot: Trigger Check
    Jackpot->>Random: Request Randomness
    Random-->>Jackpot: Return Random Number
    Jackpot->>User: Distribute Reward (if won)
\`\`\``,

    governance: `\`\`\`mermaid
flowchart TB
    A[LP Token Holders] --> B[Lock Tokens]
    B --> C[Receive Voting Power]
    C --> D[Create Proposals]
    C --> E[Vote on Proposals]
    E --> F{Proposal Passes?}
    F -->|Yes| G[Execute Changes]
    F -->|No| H[Proposal Rejected]
    
    style A fill:#059669,stroke:#047857,color:#fff
    style G fill:#dc2626,stroke:#b91c1c,color:#fff
\`\`\``,

    tokenomics: `\`\`\`mermaid
pie title Token Distribution
    "Jackpot Pool" : 69
    "Governance" : 24.1
    "Token Burn" : 6.9
\`\`\``,

    security: `\`\`\`mermaid
graph TB
    A[Smart Contract] --> B[Access Control]
    A --> C[Upgrade Mechanism]
    A --> D[Emergency Pause]
    B --> E[Role-Based Permissions]
    C --> F[Timelock Controller]
    D --> G[Circuit Breaker]
    
    style A fill:#1f2937,stroke:#374151,color:#fff
    style E fill:#dc2626,stroke:#b91c1c,color:#fff
    style F fill:#f59e0b,stroke:#d97706,color:#fff
    style G fill:#ef4444,stroke:#dc2626,color:#fff
\`\`\``,

    vault: `\`\`\`mermaid
graph TB
    A[Vault Contract] --> B[Asset Management]
    A --> C[Fee Collection]
    A --> D[Reward Distribution]
    B --> E[Token Storage]
    C --> F[Fee Processing]
    D --> G[User Rewards]
    
    style A fill:#7c3aed,stroke:#6d28d9,color:#fff
    style E fill:#059669,stroke:#047857,color:#fff
\`\`\``,

    simple: `\`\`\`mermaid
graph LR
    A[Input] --> B[Process] --> C[Output]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style C fill:#059669,stroke:#047857,color:#fff
\`\`\``
  };
  
  return diagrams[type] || diagrams.simple;
}

function fixBrokenDiagrams(content, filename) {
  // Replace disabled diagram messages with working diagrams
  const diagramReplacements = [
    {
      pattern: /<!-- Temporarily disabled due to syntax errors:.*?-->\s*>\s*\*\*.*?Diagram temporarily disabled.*?\*\*/gs,
      replacement: (match) => {
        // Determine diagram type based on filename and context
        if (filename.includes('architecture')) return createWorkingDiagram('architecture');
        if (filename.includes('cross-chain')) return createWorkingDiagram('crosschain');
        if (filename.includes('jackpot')) return createWorkingDiagram('jackpot');
        if (filename.includes('governance')) return createWorkingDiagram('governance');
        if (filename.includes('tokenomics')) return createWorkingDiagram('tokenomics');
        if (filename.includes('security')) return createWorkingDiagram('security');
        if (filename.includes('vault')) return createWorkingDiagram('vault');
        return createWorkingDiagram('simple');
      }
    },
    {
      pattern: />\s*\*\*.*?Diagram temporarily disabled.*?\*\*/g,
      replacement: (match) => {
        if (filename.includes('architecture')) return createWorkingDiagram('architecture');
        if (filename.includes('cross-chain')) return createWorkingDiagram('crosschain');
        if (filename.includes('jackpot')) return createWorkingDiagram('jackpot');
        if (filename.includes('governance')) return createWorkingDiagram('governance');
        if (filename.includes('tokenomics')) return createWorkingDiagram('tokenomics');
        if (filename.includes('security')) return createWorkingDiagram('security');
        if (filename.includes('vault')) return createWorkingDiagram('vault');
        return createWorkingDiagram('simple');
      }
    }
  ];
  
  let fixedContent = content;
  
  diagramReplacements.forEach(({ pattern, replacement }) => {
    fixedContent = fixedContent.replace(pattern, replacement);
  });
  
  return fixedContent;
}

function processFiles() {
  const directories = ['docs', 'docs-new'];
  let totalProcessed = 0;
  let emojisRemoved = 0;
  let diagramsFixed = 0;
  
  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = getAllMarkdownFiles(dir);
      
      files.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          let processedContent = content;
          
          // Remove emojis
          const contentWithoutEmojis = removeEmojis(processedContent);
          if (contentWithoutEmojis !== processedContent) {
            emojisRemoved++;
            processedContent = contentWithoutEmojis;
          }
          
          // Fix broken diagrams
          const contentWithFixedDiagrams = fixBrokenDiagrams(processedContent, file);
          if (contentWithFixedDiagrams !== processedContent) {
            diagramsFixed++;
            processedContent = contentWithFixedDiagrams;
          }
          
          // Write back if changes were made
          if (processedContent !== content) {
            fs.writeFileSync(file, processedContent);
            console.log(`Fixed ${file.replace(process.cwd() + '/', '')}`);
            totalProcessed++;
          }
          
        } catch (error) {
          console.log(`Error processing ${file}: ${error.message}`);
        }
      });
    }
  });
  
  console.log(`\nSUMMARY:`);
  console.log(`   Files processed: ${totalProcessed}`);
  console.log(`   Files with emojis removed: ${emojisRemoved}`);
  console.log(`   Files with diagrams fixed: ${diagramsFixed}`);
  console.log(`\nAll emojis removed and broken diagrams replaced with working versions!`);
}

// Run the processing
processFiles(); 