
import React from 'react';
import ReactDOM from 'react-dom/client';
import FleetVisualization from '../components/FleetVisualization';

class FleetVisualizationElement extends HTMLElement {
  private root: ReactDOM.Root | null = null;
  private _jsonUrl: string | null = null;
  private shadowContainer: HTMLDivElement | null = null;

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
    
    // Create a container for the component
    this.shadowContainer = document.createElement('div');
    this.shadowContainer.style.width = '100%';
    this.shadowContainer.style.height = '100%';
    this.appendChild(this.shadowContainer);
    
    // Get the data-url attribute
    this._jsonUrl = this.getAttribute('data-url');
    
    // Inject critical styles directly
    this.injectBasicStyles();
    
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
    
    // Remove styles if we've injected them
    const styleElement = document.getElementById('fleet-visualization-inline-styles');
    if (styleElement) {
      document.head.removeChild(styleElement);
    }
  }
  
  // Inject critical CSS directly instead of loading external file
  private injectBasicStyles() {
    // Check if styles already exist
    if (document.getElementById('fleet-visualization-inline-styles')) {
      return;
    }
    
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.id = 'fleet-visualization-inline-styles';
    styleElement.textContent = `
      /* Critical styles for fleet visualization */
      .ev-viz-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: #333;
        background-color: #f9fafb;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1);
        overflow: hidden;
        width: 100%;
        height: 100%;
      }
      
      .bg-viz-background {
        background-color: #f9fafb;
      }
      
      .bg-viz-cardsBackground {
        background-color: white;
      }
      
      .text-viz-dark {
        color: #1e293b;
      }
      
      /* Responsive grid for vehicle cards */
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
    `;
    
    document.head.appendChild(styleElement);
    console.log('Critical styles injected for fleet visualization');
  }

  private render() {
    if (!this.root) {
      console.warn('Cannot render FleetVisualization - React root not created yet');
      return;
    }
    
    console.log('Rendering FleetVisualization with jsonUrl:', this._jsonUrl);
    
    this.root.render(
      React.createElement(FleetVisualization, {
        jsonUrl: this._jsonUrl || undefined
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
