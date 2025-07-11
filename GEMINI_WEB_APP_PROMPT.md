# Prompt for Building a Web-Based Markdown Fixer Application

## Task Overview

I need you to design and build a web application that helps fix Markdown documentation files for a Docusaurus site. The application should have a user-friendly interface that allows users to upload or select Markdown files, analyze them for issues, and automatically fix problems related to Mermaid diagrams and broken links.

## Application Requirements

### User Interface

Create a modern, responsive web interface with:

1. **File Selection**:
   - Directory browser or file upload interface
   - Support for selecting multiple files or entire directories
   - Preview of selected files

2. **Analysis Dashboard**:
   - Summary of issues found (counts by type)
   - Detailed list of issues with file locations
   - Severity indicators for different types of problems

3. **Fix Controls**:
   - Checkboxes to select which types of fixes to apply
   - Options for fixing in-place or creating new files
   - Batch processing capabilities

4. **Results View**:
   - Before/after comparison of changes
   - Log of all modifications made
   - Export options for fixed files

### Core Functionality

The application should implement these key features:

1. **Mermaid Diagram Fixing**:
   - Detect and fix syntax errors in Mermaid diagrams
   - Add proper end statements to subgraphs
   - Fix arrow syntax and class definitions
   - Resolve nested diagram issues

2. **Link Resolution**:
   - Identify broken internal links
   - Create placeholder files for missing targets
   - Fix relative path issues
   - Handle anchor links correctly

3. **Animation Enhancement**:
   - Add animation capabilities to Mermaid diagrams
   - Implement CSS animations
   - Add anime.js integration
   - Add interactive controls (zoom, tooltips)

4. **Configuration Management**:
   - Update Docusaurus configuration files
   - Add required dependencies
   - Configure client modules

## Technical Stack

Please build this as a web application using:

1. **Frontend**:
   - React for the UI components
   - Tailwind CSS for styling
   - Monaco Editor (or similar) for code previews/editing

2. **Backend** (choose one):
   - Node.js with Express
   - Python with Flask/FastAPI
   - Any other suitable backend technology

3. **File Processing**:
   - Parser for Markdown and Mermaid syntax
   - Link extraction and validation
   - File system operations

## Implementation Details

Here are code snippets from my existing scripts that you can use as reference:

### Mermaid Diagram Fixing

```javascript
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
```

### Link Fixing

```javascript
function updateLink(filePath, oldLink, newLink) {
  // Read the file
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the link
  const updatedContent = content.replace(
    new RegExp(`\\[([^\\]]+)\\]\\(${oldLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g'),
    `[$1](${newLink})`
  );
  
  // Write the updated content
  fs.writeFileSync(filePath, updatedContent);
}

function createMissingFile(targetPath) {
  // Get the file name without extension
  const fileName = path.basename(targetPath, path.extname(targetPath));
  
  // Create the file content
  const content = `---
title: ${fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/-/g, ' ')}
description: Documentation for ${fileName.replace(/-/g, ' ')}
---

# ${fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/-/g, ' ')}

This documentation is currently being developed. Please check back later for updates.
`;
  
  // Write the file
  fs.writeFileSync(targetPath, content);
}
```

### Animation Integration

```javascript
// Client-side code for the web app to generate
function addAnimationToMermaid(diagramElement, animationType, speed) {
  // Add animation container
  const container = document.createElement('div');
  container.setAttribute('data-animation', animationType);
  container.setAttribute('data-animation-speed', speed);
  
  // Move the diagram into the container
  diagramElement.parentNode.insertBefore(container, diagramElement);
  container.appendChild(diagramElement);
  
  // Add animation controls if needed
  if (animationType === 'interactive') {
    addAnimationControls(container, diagramElement);
  }
}

function addAnimationControls(container, diagram) {
  const controls = document.createElement('div');
  controls.className = 'mermaid-animation-controls';
  
  // Add play button
  const playButton = document.createElement('button');
  playButton.textContent = 'Play';
  playButton.addEventListener('click', () => {
    // Animation logic here
  });
  
  controls.appendChild(playButton);
  container.appendChild(controls);
}
```

## Application Flow

1. User selects or uploads Markdown files
2. Application analyzes files for issues
3. User selects which fixes to apply
4. Application processes files and applies fixes
5. User reviews changes and downloads or saves fixed files

## Advanced Features (if possible)

1. **Live Preview**: Show real-time rendering of Mermaid diagrams before/after fixes
2. **Custom Rules**: Allow users to define custom fix rules
3. **Project Profiles**: Save configurations for different projects
4. **Integration**: API endpoints for CI/CD pipeline integration
5. **Batch Scheduling**: Schedule regular checks and fixes

## Deliverables

1. Complete source code for the web application
2. Installation and deployment instructions
3. User documentation
4. Examples of before/after fixes

## Additional Context

This application will help maintain documentation for a Docusaurus site that has issues with Mermaid diagrams and broken links. The goal is to provide a user-friendly tool that can be used by technical writers and developers to ensure documentation quality.
