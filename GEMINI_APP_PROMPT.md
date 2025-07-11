# Prompt for Building a Markdown Fixer Application

## Task Description

I need you to build a complete application that can:

1. Import all Markdown files from a specified documents folder
2. Analyze and fix common issues in these files, particularly:
   - Mermaid diagram syntax errors
   - Broken links between documents
   - Add support for animations in Mermaid diagrams
3. Output the fixed files, either in-place or to a new location
4. Provide a simple UI to control the process

## Technical Requirements

### Core Functionality

The application should:

1. **Scan and Import**: Recursively scan a specified directory for all .md and .mdx files
2. **Parse and Analyze**: Parse each file to identify:
   - Mermaid diagram blocks and their syntax
   - Links to other documents (relative and absolute)
   - Heading structure and document organization
3. **Fix Issues**:
   - Correct Mermaid syntax (missing end statements, arrow syntax, class definitions, etc.)
   - Resolve broken links by either creating placeholder files or updating paths
   - Add animation capabilities to Mermaid diagrams
4. **Update Configuration**: Modify Docusaurus configuration to support Mermaid and animations
5. **Output**: Save the fixed files, maintaining the original directory structure

### Technical Specifications

Here are the specific fixes the application needs to implement:

#### 1. Mermaid Diagram Fixes

- Fix missing end statements in subgraphs
- Correct arrow syntax (e.g., `->` to `-->`)
- Fix class definitions
- Fix style syntax
- Fix nested Mermaid blocks
- Fix malformed Mermaid declarations

#### 2. Link Fixes

- Create placeholder files for missing linked documents
- Update relative paths to ensure correct linking
- Handle anchor links correctly

#### 3. Animation Support

- Add CSS-based animations for Mermaid diagrams
- Add support for anime.js animations
- Implement interactive features like zoom controls and tooltips

### User Interface

The application should have:

1. A simple GUI with:
   - Input field for the documents directory
   - Output directory selection
   - Options for which fixes to apply
   - Progress indicator
   - Log of changes made
2. Alternatively, a command-line interface with similar options

## Reference Implementation

I've already created scripts that implement these fixes individually. Here's how they work:

### Mermaid Diagram Fixer

```javascript
// This script fixes common Mermaid syntax issues
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

// More fix functions...
```

### Broken Links Fixer

```javascript
function fixBrokenLink(source, target, action) {
  // Get the full paths
  const sourcePath = getFilePath(source);
  const targetPath = getFilePath(target);
  
  // Fix the link based on the action
  switch (action) {
    case 'create':
      // Create the target file if it doesn't exist
      if (!fs.existsSync(targetPath)) {
        return createMissingFile(targetPath, sourcePath);
      }
      break;
    
    case 'update':
      // Calculate the relative path from source to target
      const sourceDir = path.dirname(sourcePath);
      const targetRelative = path.relative(sourceDir, targetPath);
      
      // Update the link in the source file
      return updateLink(sourcePath, target, targetRelative);
  }
}
```

### Animation Support

```javascript
// Client-side code for animations
function enhanceDiagram(diagram) {
  // Get parent container
  const container = diagram.closest('.docusaurus-mermaid-container') || diagram.parentNode;
  
  // Add animation container class
  container.classList.add('mermaid-animation-container');
  
  // Get diagram type
  const diagramType = getDiagramType(diagram);
  
  // Apply type-specific enhancements
  switch (diagramType) {
    case 'flowchart':
      enhanceFlowchart(diagram, container);
      break;
    case 'sequenceDiagram':
      enhanceSequenceDiagram(diagram, container);
      break;
    // More cases...
  }
  
  // Add zoom controls
  addZoomControls(diagram, container);
  
  // Add node interactivity
  addNodeInteractivity(diagram, container);
}
```

## Development Approach

Please build this application using:

1. A modern programming language suitable for file processing and UI development (Python, JavaScript/Node.js, etc.)
2. A modular architecture that separates concerns:
   - File scanning and parsing
   - Issue detection
   - Issue fixing
   - Configuration updating
   - UI/CLI interface
3. Proper error handling and logging
4. A simple, intuitive user interface

## Deliverables

1. Complete source code for the application
2. Installation and usage instructions
3. Documentation of the architecture and how each component works
4. Examples of before/after fixes

## Additional Context

This application will be used to fix documentation for a Docusaurus site that currently has build errors due to broken links and Mermaid diagram issues. The solution needs to be comprehensive enough to fix all these issues automatically.

The application should be designed to be run periodically as documentation evolves, not just as a one-time fix.
