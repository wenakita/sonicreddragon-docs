#!/usr/bin/env node

/**
 * Mermaid Diagram Fixer
 * 
 * This script demonstrates how to fix common Mermaid diagram issues
 * while preserving diagram complexity. It serves as a proof of concept
 * for the requirements outlined in MERMAID_FIX_REQUIREMENTS.md.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  diagramDirs: ['docs', 'docs-new'],
  backupDir: 'backups',
  fixTypes: {
    subgraphEnd: true,
    arrowSyntax: true,
    classDefinitions: true,
    styleSyntax: true,
    nestedBlocks: true,
    malformedDeclarations: true
  }
};

// Create backup directory if it doesn't exist
if (!fs.existsSync(config.backupDir)) {
  fs.mkdirSync(config.backupDir, { recursive: true });
}

// Utility functions
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

function backupFile(filePath) {
  const backupPath = path.join(config.backupDir, path.basename(filePath) + '.backup');
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

// Fix functions for specific issues
function fixSubgraphEnd(content) {
  // Count subgraph declarations and end statements
  const subgraphMatches = content.match(/subgraph\s+["']?[^"'\n]+["']?/g) || [];
  const endStatements = (content.match(/end\s*(\n|$)/g) || []).length;
  
  if (subgraphMatches.length > endStatements) {
    // Add missing end statements
    return content + '\n' + 'end'.repeat(subgraphMatches.length - endStatements);
  }
  
  return content;
}

function fixArrowSyntax(content) {
  // Fix arrow syntax
  let fixed = content;
  
  // Fix -> to -->
  fixed = fixed.replace(/(\w+|\])\s*->\s*(\w+|\[)/g, '$1 --> $2');
  
  // Fix text on arrows
  fixed = fixed.replace(/(\w+|\])\s*--\s*([^-]+?)\s*-->\s*(\w+|\[)/g, '$1 -->|$2| $3');
  
  return fixed;
}

function fixClassDefinitions(content) {
  // Fix class definitions
  return content.replace(/class\s+(\w+)\s+(\w+)/g, 'class $1 $2');
}

function fixStyleSyntax(content) {
  // Fix style syntax
  return content.replace(/style\s+(\w+)\s+fill:([^,\s]+)\s+stroke:([^,\s]+)/g, 'style $1 fill:$2,stroke:$3');
}

function fixNestedBlocks(content) {
  // Fix nested mermaid blocks
  let fixed = content;
  
  // Find nested blocks
  const nestedPattern = /```mermaid[\s\S]*?```mermaid[\s\S]*?```/g;
  const nestedMatches = content.match(nestedPattern);
  
  if (nestedMatches) {
    nestedMatches.forEach(match => {
      // Split into separate blocks
      const blocks = match.split('```mermaid').filter(Boolean);
      const fixedBlocks = blocks.map(block => {
        // Clean up and ensure proper encapsulation
        let cleaned = block.trim();
        if (!cleaned.endsWith('```')) {
          cleaned += '\n```';
        }
        return '```mermaid' + cleaned;
      });
      
      // Replace the nested block with separate blocks
      fixed = fixed.replace(match, fixedBlocks.join('\n\n'));
    });
  }
  
  return fixed;
}

function fixMalformedDeclarations(content) {
  // Fix malformed mermaid declarations
  let fixed = content;
  
  // Fix ```mermaidgraph
  fixed = fixed.replace(/```mermaidgraph/g, '```mermaid\ngraph');
  
  // Fix other malformed declarations
  fixed = fixed.replace(/```mermaid([a-zA-Z])/g, '```mermaid\n$1');
  
  return fixed;
}

// Main fix function
function fixMermaidBlock(block) {
  // Remove the opening and closing backticks to get just the content
  const content = block.replace(/```mermaid\s*/, '').replace(/\s*```$/, '');
  
  // Apply fixes
  let fixedContent = content;
  
  if (config.fixTypes.subgraphEnd) {
    fixedContent = fixSubgraphEnd(fixedContent);
  }
  
  if (config.fixTypes.arrowSyntax) {
    fixedContent = fixArrowSyntax(fixedContent);
  }
  
  if (config.fixTypes.classDefinitions) {
    fixedContent = fixClassDefinitions(fixedContent);
  }
  
  if (config.fixTypes.styleSyntax) {
    fixedContent = fixStyleSyntax(fixedContent);
  }
  
  // If the content was fixed, reconstruct the block
  if (fixedContent !== content) {
    return '```mermaid\n' + fixedContent + '\n```';
  }
  
  // If no fixes were needed, return the original block
  return block;
}

// Process a single file
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let fixedContent = content;
    
    // Fix malformed declarations first
    if (config.fixTypes.malformedDeclarations) {
      fixedContent = fixMalformedDeclarations(fixedContent);
    }
    
    // Fix nested blocks
    if (config.fixTypes.nestedBlocks) {
      fixedContent = fixNestedBlocks(fixedContent);
    }
    
    // Find all mermaid blocks
    const mermaidBlocks = fixedContent.match(/```mermaid[\s\S]*?```/g) || [];
    
    if (mermaidBlocks.length > 0) {
      // Fix each mermaid block
      mermaidBlocks.forEach(block => {
        const fixedBlock = fixMermaidBlock(block);
        if (fixedBlock !== block) {
          fixedContent = fixedContent.replace(block, fixedBlock);
        }
      });
      
      // If changes were made, backup and write the file
      if (fixedContent !== content) {
        backupFile(filePath);
        fs.writeFileSync(filePath, fixedContent);
        console.log(`  ✅ Fixed Mermaid diagrams in ${filePath}`);
        return true;
      } else {
        console.log(`  ℹ️ No fixes needed for ${filePath}`);
        return false;
      }
    } else {
      console.log(`  ℹ️ No Mermaid diagrams found in ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Process a specific file or all files
function main() {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Process a specific file
    const filePath = args[0];
    if (fs.existsSync(filePath)) {
      processFile(filePath);
    } else {
      console.error(`File not found: ${filePath}`);
    }
  } else {
    // Process all files in configured directories
    let totalFiles = 0;
    let fixedFiles = 0;
    
    config.diagramDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = getAllMarkdownFiles(dir);
        totalFiles += files.length;
        
        files.forEach(file => {
          if (processFile(file)) {
            fixedFiles++;
          }
        });
      }
    });
    
    console.log(`\n📊 Summary: Fixed Mermaid diagrams in ${fixedFiles} of ${totalFiles} files`);
  }
}

// Run the main function
main();
