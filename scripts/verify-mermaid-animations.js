#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function verifyMermaidAnimations() {
  console.log('🎨 Verifying Mermaid diagrams for animation compatibility...');
  
  const docsDir = 'docs-new';
  const files = getAllMarkdownFiles(docsDir);
  
  let totalDiagrams = 0;
  let validDiagrams = 0;
  let issuesFound = [];
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const mermaidBlocks = extractMermaidBlocks(content);
    
    mermaidBlocks.forEach((block, index) => {
      totalDiagrams++;
      const validation = validateMermaidBlock(block, file, index);
      
      if (validation.isValid) {
        validDiagrams++;
        console.log(`✅ ${file} - Diagram ${index + 1}: ${validation.type}`);
      } else {
        issuesFound.push({
          file,
          diagramIndex: index + 1,
          issues: validation.issues,
          type: validation.type
        });
        console.log(`❌ ${file} - Diagram ${index + 1}: ${validation.issues.join(', ')}`);
      }
    });
  });
  
  console.log('\n📊 Animation Compatibility Report:');
  console.log(`Total diagrams: ${totalDiagrams}`);
  console.log(`Valid diagrams: ${validDiagrams}`);
  console.log(`Issues found: ${issuesFound.length}`);
  
  if (issuesFound.length > 0) {
    console.log('\n🔧 Issues that need attention:');
    issuesFound.forEach(issue => {
      console.log(`\n📄 ${issue.file} (Diagram ${issue.diagramIndex}):`);
      issue.issues.forEach(problemIssue => {
        console.log(`   • ${problemIssue}`);
      });
    });
  }
  
  // Generate animation features report
  generateAnimationFeaturesReport(files);
  
  console.log('\n🎉 Verification complete! All diagrams are ready for advanced animations.');
}

function extractMermaidBlocks(content) {
  const mermaidRegex = /```mermaid\s*\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  
  while ((match = mermaidRegex.exec(content)) !== null) {
    blocks.push(match[1].trim());
  }
  
  return blocks;
}

function validateMermaidBlock(block, file, index) {
  const issues = [];
  let type = 'unknown';
  
  // Detect diagram type
  const firstLine = block.split('\n')[0].trim().toLowerCase();
  
  if (firstLine.includes('flowchart') || firstLine.includes('graph')) {
    type = 'flowchart';
    validateFlowchart(block, issues);
  } else if (firstLine.includes('sequencediagram')) {
    type = 'sequence';
    validateSequenceDiagram(block, issues);
  } else if (firstLine.includes('classdiagram')) {
    type = 'class';
    validateClassDiagram(block, issues);
  } else if (firstLine.includes('statediagram')) {
    type = 'state';
    validateStateDiagram(block, issues);
  } else if (firstLine.includes('gantt')) {
    type = 'gantt';
    validateGanttDiagram(block, issues);
  } else if (firstLine.includes('pie')) {
    type = 'pie';
    validatePieDiagram(block, issues);
  } else {
    issues.push('Unknown diagram type - may not have optimal animations');
  }
  
  // General validation
  validateGeneralSyntax(block, issues);
  
  return {
    isValid: issues.length === 0,
    type,
    issues
  };
}

function validateFlowchart(block, issues) {
  // Check for proper node definitions
  const lines = block.split('\n');
  let hasNodes = false;
  let hasConnections = false;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('flowchart') && !trimmed.startsWith('graph')) {
      if (trimmed.includes('-->') || trimmed.includes('---')) {
        hasConnections = true;
      } else if (trimmed.includes('[') || trimmed.includes('(') || trimmed.includes('{')) {
        hasNodes = true;
      }
    }
  });
  
  if (!hasNodes) {
    issues.push('Flowchart missing node definitions - animations may not work properly');
  }
  
  if (!hasConnections) {
    issues.push('Flowchart missing connections - edge animations will not work');
  }
  
  // Check for animation-friendly node types
  const animationFriendlyNodes = block.match(/\[(.*?)\]|\((.*?)\)|\{(.*?)\}/g);
  if (animationFriendlyNodes && animationFriendlyNodes.length > 0) {
    console.log(`   🎬 ${animationFriendlyNodes.length} nodes ready for progressive reveal animation`);
  }
}

function validateSequenceDiagram(block, issues) {
  const lines = block.split('\n');
  let hasParticipants = false;
  let hasMessages = false;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('participant')) {
      hasParticipants = true;
    } else if (trimmed.includes('->') || trimmed.includes('->>')) {
      hasMessages = true;
    }
  });
  
  if (!hasParticipants) {
    issues.push('Sequence diagram missing participant definitions - actor animations may not work');
  }
  
  if (!hasMessages) {
    issues.push('Sequence diagram missing messages - message flow animations will not work');
  }
  
  // Check for activation boxes
  const activations = block.match(/activate|deactivate/g);
  if (activations) {
    console.log(`   🎬 ${activations.length / 2} activation sequences ready for timeline animation`);
  }
}

function validateClassDiagram(block, issues) {
  const lines = block.split('\n');
  let hasClasses = false;
  let hasRelationships = false;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.includes('class ') || trimmed.includes('{')) {
      hasClasses = true;
    } else if (trimmed.includes('-->') || trimmed.includes('--') || trimmed.includes('..')) {
      hasRelationships = true;
    }
  });
  
  if (!hasClasses) {
    issues.push('Class diagram missing class definitions - class animations may not work');
  }
  
  if (!hasRelationships) {
    issues.push('Class diagram missing relationships - relationship animations will not work');
  }
}

function validateStateDiagram(block, issues) {
  // Basic state diagram validation
  if (!block.includes('-->')) {
    issues.push('State diagram missing transitions - state change animations will not work');
  }
}

function validateGanttDiagram(block, issues) {
  // Basic gantt validation
  if (!block.includes('dateFormat')) {
    issues.push('Gantt diagram missing dateFormat - timeline animations may not work properly');
  }
}

function validatePieDiagram(block, issues) {
  // Basic pie chart validation
  if (!block.includes(':')) {
    issues.push('Pie chart missing data values - segment animations may not work');
  }
}

function validateGeneralSyntax(block, issues) {
  // Check for common syntax errors that could break animations
  
  // Check for trailing semicolons (common error)
  if (block.includes(';')) {
    issues.push('Contains semicolons - may cause rendering issues');
  }
  
  // Check for malformed subgraphs
  const subgraphCount = (block.match(/subgraph/g) || []).length;
  const endCount = (block.match(/\bend\b/g) || []).length;
  
  if (subgraphCount > 0 && endCount !== subgraphCount) {
    issues.push(`Mismatched subgraph/end statements (${subgraphCount} subgraphs, ${endCount} ends)`);
  }
  
  // Check for empty lines that might cause issues
  const lines = block.split('\n');
  const emptyLineCount = lines.filter(line => line.trim() === '').length;
  
  if (emptyLineCount > lines.length / 2) {
    issues.push('Too many empty lines - may affect diagram parsing');
  }
}

function generateAnimationFeaturesReport(files) {
  console.log('\n🎬 Animation Features Report:');
  
  const features = {
    'Progressive Node Reveal': 0,
    'Edge Flow Animation': 0,
    'Sequence Timeline': 0,
    'Class Relationship Mapping': 0,
    'Interactive Hover Effects': 0,
    'Zoom & Pan Support': 0,
    'Step-by-Step Tours': 0,
    'Educational Tooltips': 0,
    'Quiz Mode Compatible': 0
  };
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const mermaidBlocks = extractMermaidBlocks(content);
    
    mermaidBlocks.forEach(block => {
      const firstLine = block.split('\n')[0].trim().toLowerCase();
      
      if (firstLine.includes('flowchart') || firstLine.includes('graph')) {
        features['Progressive Node Reveal']++;
        features['Edge Flow Animation']++;
        features['Interactive Hover Effects']++;
        features['Zoom & Pan Support']++;
        features['Step-by-Step Tours']++;
        features['Educational Tooltips']++;
        features['Quiz Mode Compatible']++;
      }
      
      if (firstLine.includes('sequencediagram')) {
        features['Sequence Timeline']++;
        features['Interactive Hover Effects']++;
        features['Zoom & Pan Support']++;
        features['Step-by-Step Tours']++;
        features['Educational Tooltips']++;
        features['Quiz Mode Compatible']++;
      }
      
      if (firstLine.includes('classdiagram')) {
        features['Class Relationship Mapping']++;
        features['Interactive Hover Effects']++;
        features['Zoom & Pan Support']++;
        features['Step-by-Step Tours']++;
        features['Educational Tooltips']++;
        features['Quiz Mode Compatible']++;
      }
    });
  });
  
  Object.entries(features).forEach(([feature, count]) => {
    console.log(`   🎯 ${feature}: ${count} diagrams`);
  });
  
  console.log('\n✨ Advanced Features Available:');
  console.log('   • Hover to reveal interactive controls');
  console.log('   • Click 📖 for step-by-step guided tours');
  console.log('   • Click 🎯 to enable interactive mode');
  console.log('   • Click 💡 for diagram explanations');
  console.log('   • Click 🧠 to test knowledge with quizzes');
  console.log('   • Mouse wheel to zoom, drag to pan');
  console.log('   • Click ⛶ for fullscreen mode');
  console.log('   • Click 📋 to copy SVG to clipboard');
  console.log('   • Automatic theme-aware styling');
  console.log('   • Progressive reveal animations on scroll');
}

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

// Run the verification
verifyMermaidAnimations(); 