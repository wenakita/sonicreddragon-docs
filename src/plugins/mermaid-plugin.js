const remarkMermaid = (options = {}) => {
  const transformer = async (ast) => {
    const { visit } = await import('unist-util-visit');
    
    visit(ast, 'code', (node) => {
      const { lang, value } = node;
      
      // Only process mermaid code blocks
      if (lang !== 'mermaid') {
        return;
      }
      
      // Add metadata to mermaid code blocks for our components to use
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hChildren = node.data.hChildren || [];
      
      // Add class to identify mermaid blocks
      node.data.hProperties.className = (node.data.hProperties.className || '') + ' mermaid-wrapper';
      
      // Store original code as attribute for our component to access
      node.data.hProperties.mermaidCode = value;
    });
  };
  
  return transformer;
};

module.exports = remarkMermaid; 