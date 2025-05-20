// Enhanced plugin to transform mermaid code blocks
module.exports = function mermaidPlugin() {
  return function transformer(ast) {
    // Counter for unique IDs
    let counter = 0;
    
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
        const diagramCode = node.value.trim();
        
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