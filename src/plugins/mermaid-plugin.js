// Enhanced plugin to transform mermaid code blocks
module.exports = function mermaidPlugin() {
  return function transformer(ast) {
    // Counter for unique IDs
    let counter = 0;
    
    // Function to sanitize mermaid code
    function sanitizeMermaidCode(code) {
      if (!code) return '';
      
      // Fix specific issues with Unicode characters in classDef statements
      // Replace any non-standard quotes, dashes or problematic Unicode
      let sanitized = code
        // Normalize quotes
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        // Normalize dashes
        .replace(/[—–]/g, '-')
        // Fix common Unicode errors in classDef lines
        .replace(/classDef\s+(\w+)\s+fill:([^\n,;]+)/g, (match, className, fill) => {
          // Clean up the fill value to ensure it only has valid hex colors or CSS color names
          const cleanFill = fill
            .replace(/[^\w#(),.\s-]/g, '') // Remove any non-alphanumeric characters except those valid in colors
            .replace(/\s+/g, ' ');         // Normalize whitespace
          
          return `classDef ${className} fill:${cleanFill}`;
        })
        // Ensure semicolons in style definitions are properly spaced
        .replace(/;(\w)/g, '; $1')
        // Replace any lingering problematic Unicode characters
        .replace(/[^\x00-\x7F]/g, '');
      
      return sanitized;
    }
    
    // Create a properly defined visit function for traversing the AST
    function visitNodes(node, visitor) {
      // Apply visitor to current node
      visitor(node);
      
      // Visit children recursively if they exist
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          visitNodes(child, visitor);
        }
      }
    }
    
    // Find and process all mermaid code blocks
    visitNodes(ast, (node) => {
      if (node.type === 'code' && node.lang === 'mermaid') {
        // Create unique ID for this diagram
        const uniqueId = `mermaid-${Date.now()}-${counter++}`;
        const rawDiagramCode = node.value.trim();
        
        // Sanitize the diagram code to prevent parsing errors
        const diagramCode = sanitizeMermaidCode(rawDiagramCode);
        
        // Log if there were significant changes for debugging
        if (diagramCode.length !== rawDiagramCode.length) {
          console.log(`Sanitized mermaid diagram ${uniqueId} (removed ${rawDiagramCode.length - diagramCode.length} characters)`);
        }
        
        // Convert to direct HTML rendering with StandardMermaid data attributes
        node.type = 'html';
        node.value = `
<div class="mermaid-diagram-container">
  <div id="${uniqueId}" class="mermaid" data-diagram="${encodeURIComponent(diagramCode)}">
    ${diagramCode}
  </div>
</div>`;
      }
    });
  };
}; 