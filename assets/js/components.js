/**
 * Component loader for static HTML pages
 * Loads and renders header and sidebar components dynamically
 */

class ComponentLoader {
  constructor() {
    this.config = null;
    this.init();
  }

  async init() {
    try {
      // Load site configuration
      await this.loadConfig();
      
      // Load and render components
      await this.loadComponents();
      
      console.log('Components loaded successfully');
    } catch (error) {
      console.error('Failed to load components:', error);
      // Fallback to existing static content if component loading fails
    }
  }

  async loadConfig() {
    try {
      const response = await fetch('/doodle-note/config/config.json');
      this.config = await response.json();
    } catch (error) {
      console.warn('Could not load config.json, using fallback configuration');
      // Fallback configuration
      this.config = {
        "site": {
          "title": "社内手順書・仕様書",
          "description": "社内向け技術文書管理システム"
        }
      };
    }
  }

  async loadComponents() {
    // Only load components if we're on the static index page
    // (The build process handles components for generated pages)
    if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/') {
      await this.loadHeader();
      await this.loadSidebar();
    }
  }

  async loadHeader() {
    try {
      const response = await fetch('/doodle-note/templates/header.html');
      if (!response.ok) return;
      
      let headerHtml = await response.text();
      
      // Replace template variables
      headerHtml = headerHtml
        .replace(/\{\{RELATIVE_PATH\}\}/g, '')
        .replace(/\{\{SITE_TITLE\}\}/g, this.config.site.title)
        .replace(/\{\{SITE_DESCRIPTION\}\}/g, this.config.site.description);
      
      // Find existing header and replace it
      const existingHeader = document.querySelector('.site-header');
      if (existingHeader) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = headerHtml;
        const newHeader = tempDiv.firstElementChild;
        existingHeader.parentNode.replaceChild(newHeader, existingHeader);
      }
    } catch (error) {
      console.warn('Could not load header component:', error);
    }
  }

  async loadSidebar() {
    try {
      const response = await fetch('/doodle-note/templates/sidebar-index.html');
      if (!response.ok) return;
      
      let sidebarHtml = await response.text();
      
      // The sidebar content (search and navigation) is already in place
      // We just need to replace the outer structure if needed
      const existingSidebar = document.querySelector('.sidebar');
      if (existingSidebar) {
        // Keep the existing content but update the structure if needed
        const existingContent = existingSidebar.innerHTML;
        
        // Replace template variables (though sidebar-index doesn't have SIDEBAR_CONTENT)
        sidebarHtml = sidebarHtml.replace(/\{\{SIDEBAR_CONTENT\}\}/g, existingContent);
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sidebarHtml;
        const newSidebar = tempDiv.firstElementChild;
        
        // Preserve the existing content
        const sidebarContent = existingSidebar.querySelector('.sidebar-content');
        const newSidebarContent = newSidebar.querySelector('.sidebar-content');
        if (sidebarContent && newSidebarContent) {
          newSidebarContent.innerHTML = sidebarContent.innerHTML;
        }
        
        existingSidebar.parentNode.replaceChild(newSidebar, existingSidebar);
      }
    } catch (error) {
      console.warn('Could not load sidebar component:', error);
    }
  }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if we're on a static page (not a generated page)
  if (!document.querySelector('[data-generated-page]')) {
    window.componentLoader = new ComponentLoader();
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComponentLoader;
}