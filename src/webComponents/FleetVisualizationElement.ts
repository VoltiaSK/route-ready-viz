import React from 'react';
import ReactDOM from 'react-dom/client';
import FleetVisualization from '../components/FleetVisualization';

class FleetVisualizationElement extends HTMLElement {
  private root: ReactDOM.Root | null = null;
  private _jsonUrl: string | null = null;
  private shadowContainer: HTMLDivElement | null = null;
  private stylesElement: HTMLLinkElement | null = null;

  static get observedAttributes() {
    return ['data-url'];
  }

  get jsonUrl() {
    return this._jsonUrl;
  }

  set jsonUrl(value) {
    this._jsonUrl = value;
    this.render();
  }

  connectedCallback() {
    console.log('FleetVisualization web component connecting to DOM');
    
    // Create a shadow DOM to isolate styles
    const shadow = this.attachShadow({ mode: 'open' });
    
    // Create a container for the component
    this.shadowContainer = document.createElement('div');
    this.shadowContainer.className = 'fleet-visualization-root';
    this.shadowContainer.style.width = '100%';
    this.shadowContainer.style.height = '100%';
    this.shadowContainer.style.minHeight = '900px'; // Set minimum height
    
    // Apply base styles to ensure consistent appearance
    this.shadowContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
    this.shadowContainer.style.fontSize = '16px';
    this.shadowContainer.style.lineHeight = '1.5';
    this.shadowContainer.style.color = '#0f1034';
    this.shadowContainer.style.background = 'transparent';
    
    shadow.appendChild(this.shadowContainer);
    
    // Get the data-url attribute
    this._jsonUrl = this.getAttribute('data-url');
    
    // Load styles
    this.loadStyles(shadow);
    
    // Create root and render with a small delay to ensure DOM is ready
    setTimeout(() => {
      if (this.shadowContainer) {
        console.log('Creating React root for FleetVisualization');
        this.root = ReactDOM.createRoot(this.shadowContainer);
        this.render();
      }
    }, 100);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'data-url' && oldValue !== newValue) {
      console.log('FleetVisualization data-url changed:', newValue);
      this._jsonUrl = newValue;
      this.render();
    }
  }

  disconnectedCallback() {
    console.log('FleetVisualization web component disconnecting from DOM');
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
  
  // Get the base URL of the script
  private getBaseUrl() {
    const scripts = document.getElementsByTagName('script');
    let scriptUrl = '';
    
    // Find the fleet-visualization.js script
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.includes('fleet-visualization')) {
        scriptUrl = scripts[i].src;
        break;
      }
    }
    
    if (!scriptUrl) {
      console.warn('Could not find fleet-visualization script tag. Using current origin instead.');
      return window.location.origin;
    }
    
    // Extract directory path from script URL
    const url = new URL(scriptUrl);
    return `${url.origin}${url.pathname.substring(0, url.pathname.lastIndexOf('/'))}`;
  }
  
  private loadStyles(shadow: ShadowRoot) {
    // Get base URL for loading assets
    const baseUrl = this.getBaseUrl();
    const cssUrl = `${baseUrl}/assets/main.css`;
    console.log('Loading fleet visualization styles from:', cssUrl);

    // Create style element
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = cssUrl;
    style.setAttribute('crossorigin', 'anonymous');
    
    // Add to shadow DOM
    shadow.appendChild(style);
    
    // Add critical styles to ensure proper appearance
    const baseStyle = document.createElement('style');
    baseStyle.textContent = `
      :host {
        all: initial;
        display: block;
        width: 100%;
        height: 100%;
        min-height: 900px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      
      .fleet-visualization-root {
        width: 100%;
        height: 100%;
        min-height: 900px;
        background: transparent;
        color: #0f1034;
        font-size: 16px;
        line-height: 1.5;
        box-sizing: border-box;
      }
      
      .fleet-visualization-root * {
        box-sizing: border-box;
      }
      
      /* Dialog/Modal styling */
      [data-state="open"] {
        pointer-events: auto;
      }
      
      /* Make sure colors match the standalone version */
      .fleet-viz-container {
        width: 100%;
        height: 100%;
        min-height: 900px;
        margin: 0;
        padding: 0;
        background: #ecefff;
        color: #0f1034;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        border-radius: 0.5rem;
        overflow: hidden;
      }
      
      .fleet-viz-wrapper {
        padding: 1rem;
        background: #f7f9ff;
        border-radius: 0.5rem;
        min-height: 900px;
      }
      
      /* Match color scheme with standalone version */
      .text-viz-ready {
        color: #17B26A;
      }
      
      .text-viz-warning {
        color: #F97316;
      }
      
      .text-viz-critical {
        color: #D82C2C;
      }
      
      .text-viz-primary {
        color: #9b87f5;
      }
      
      .text-viz-secondary {
        color: #7E69AB;
      }
      
      .text-viz-dark {
        color: #0f1034;
      }
      
      .bg-viz-ready {
        background-color: #17B26A;
      }
      
      .bg-viz-warning {
        background-color: #F97316;
      }
      
      .bg-viz-critical {
        background-color: #D82C2C;
      }
      
      .bg-viz-primary {
        background-color: #9b87f5;
      }
      
      .bg-viz-secondary {
        background-color: #7E69AB;
      }
      
      .bg-viz-dark {
        background-color: #0f1034;
      }
      
      .bg-viz-light {
        background-color: #E5DEFF;
      }
      
      .bg-fleet-viz-background {
        background-color: #ecefff;
      }
      
      .bg-fleet-viz-cardsBackground {
        background-color: #f7f9ff;
      }
      
      /* Fix for cards */
      .bg-white {
        background-color: #ffffff;
      }
      
      /* Fix for driving profile */
      .bg-viz-highway {
        background-color: #0f1034;
      }
      
      .bg-viz-city {
        background-color: #f7f9ff;
      }
      
      /* Tabs styling fixes */
      [data-state="active"][data-orientation="horizontal"] {
        border-bottom-color: #0f1034;
        color: #0f1034;
        font-weight: 600;
      }
      
      /* Fix button styling */
      button {
        font-family: inherit;
      }
      
      /* Dialog styling */
      [role="dialog"] {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      /* Tailwind classes - ensure common styles are available */
      .grid {
        display: grid;
      }
      
      .grid-cols-1 {
        grid-template-columns: repeat(1, minmax(0, 1fr));
      }
      
      @media (min-width: 640px) {
        .sm\\:grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      
      @media (min-width: 768px) {
        .md\\:grid-cols-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
      
      @media (min-width: 1024px) {
        .lg\\:grid-cols-4 {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }
      
      .gap-4 {
        gap: 1rem;
      }
      
      .mb-4 {
        margin-bottom: 1rem;
      }
      
      .mb-6 {
        margin-bottom: 1.5rem;
      }
      
      .p-4 {
        padding: 1rem;
      }
      
      .md\\:p-6 {
        padding: 1.5rem;
      }
      
      .rounded-lg {
        border-radius: 0.5rem;
      }
      
      .shadow-sm {
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      }
      
      /* Min height for grid to ensure consistent page height */
      .min-h-\\[800px\\] {
        min-height: 800px;
      }
      
      /* Dialog backdrop styles */
      .bg-black\\/50 {
        background-color: rgba(0, 0, 0, 0.5);
      }
      
      /* Opacity for background content when modal is open */
      .opacity-50 {
        opacity: 0.5;
      }
      
      .pointer-events-none {
        pointer-events: none;
      }
      
      .transition-opacity {
        transition-property: opacity;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
      }
    `;
    shadow.appendChild(baseStyle);
    
    style.onload = () => console.log('Fleet visualization styles loaded successfully from:', cssUrl);
    style.onerror = () => {
      console.error('Failed to load fleet visualization styles from:', cssUrl);
      console.log('Applying fallback inline styles');
      // Add a fallback inline style with all necessary styles
      const fallbackStyle = document.createElement('style');
      fallbackStyle.textContent = `
        /* Full Tailwind-compatible styling to ensure consistent appearance */
        .fleet-viz-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #ecefff;
          color: #0f1034;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .fleet-viz-wrapper {
          padding: 1rem;
          background-color: #f7f9ff;
          border-radius: 0.5rem;
        }
        
        /* Add all other necessary styling to match the standalone version */
        .bg-white {
          background-color: #ffffff;
        }
        
        .rounded-lg {
          border-radius: 0.5rem;
        }
        
        .shadow-sm {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        
        .shadow-md {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .text-sm {
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
        
        .text-xs {
          font-size: 0.75rem;
          line-height: 1rem;
        }
        
        .text-lg {
          font-size: 1.125rem;
          line-height: 1.75rem;
        }
        
        .text-xl {
          font-size: 1.25rem;
          line-height: 1.75rem;
        }
        
        .text-2xl {
          font-size: 1.5rem;
          line-height: 2rem;
        }
        
        .font-bold {
          font-weight: 700;
        }
        
        .font-medium {
          font-weight: 500;
        }
        
        .p-4 {
          padding: 1rem;
        }
        
        .p-6 {
          padding: 1.5rem;
        }
        
        .px-4 {
          padding-left: 1rem;
          padding-right: 1rem;
        }
        
        .py-2 {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        
        .m-4 {
          margin: 1rem;
        }
        
        .my-4 {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        
        .mx-4 {
          margin-left: 1rem;
          margin-right: 1rem;
        }
        
        .mt-4 {
          margin-top: 1rem;
        }
        
        .mb-4 {
          margin-bottom: 1rem;
        }
        
        /* Grid styles for vehicle layout */
        .grid {
          display: grid;
        }
        
        .grid-cols-1 {
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }
        
        @media (min-width: 640px) {
          .sm\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 768px) {
          .md\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 1024px) {
          .lg\\:grid-cols-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        
        .gap-4 {
          gap: 1rem;
        }
      `;
      shadow.appendChild(fallbackStyle);
    };
  }

  private render() {
    if (!this.root) {
      console.warn('Cannot render FleetVisualization - React root not created yet');
      return;
    }
    
    console.log('Rendering FleetVisualization with jsonUrl:', this._jsonUrl);
    
    this.root.render(
      React.createElement(FleetVisualization, {
        dataSourceUrl: this._jsonUrl || undefined,
        className: "embedded-fleet-viz" // Add a class to help with specific embedded styling
      })
    );
  }
}

// Define the custom element
if (!customElements.get('fleet-visualization')) {
  console.log('Defining fleet-visualization custom element');
  customElements.define('fleet-visualization', FleetVisualizationElement);
}

export default FleetVisualizationElement;
