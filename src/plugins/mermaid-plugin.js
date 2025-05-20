// Simple plugin to transform mermaid code blocks
module.exports = function mermaidPlugin() {
  return function transformer(ast) {
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
        // Convert to direct HTML rendering
        node.type = 'html';
        node.value = `<div class="mermaid">${node.value}</div>`;
      }
    });
  };
}; 