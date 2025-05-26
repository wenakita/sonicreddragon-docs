module.exports = function contextualSidebarPlugin(context, options) {
  return {
    name: 'contextual-sidebar-plugin',
    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      
      // Define section mappings
      const sectionMappings = {
        '/': ['intro', 'getting-started', 'System Overview'],
        '/category/overview': ['System Overview'],
        '/category/security': ['Security & Audit'],
        '/category/contracts': ['Smart Contracts'],
        '/category/deployment': ['Deployment & Operations'],
        '/category/integrations': ['Integrations'],
        '/category/user-guides': ['User Guides'],
        '/category/architecture': ['Technical Architecture'],
        '/category/reference': ['Reference'],
        '/category/updates': ['Updates & Changes'],
      };
      
      setGlobalData({ sectionMappings });
    },
    
    getClientModules() {
      return ['./src/clientModules/contextualSidebarModule.js'];
    },
  };
}; 