
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
    
    return scriptUrl.substring(0, scriptUrl.lastIndexOf('/'));
  }
  
  private loadStyles(shadow: ShadowRoot) {
    const baseUrl = this.getBaseUrl();
    const cssUrl = `${baseUrl}/assets/main.css`;
    console.log('Loading fleet visualization styles from:', cssUrl);

    // Create style element
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = cssUrl;
    
    // Add to shadow DOM
    shadow.appendChild(style);
    
    // Also add a base style to ensure proper isolation and consistent presentation
    const baseStyle = document.createElement('style');
    baseStyle.textContent = `
      :host {
        all: initial;
        display: block;
        width: 100%;
        height: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      
      .fleet-visualization-root {
        width: 100%;
        height: 100%;
        background: #ffffff;
        color: #000000;
        font-size: 16px;
        box-sizing: border-box;
      }
      
      .fleet-visualization-root * {
        box-sizing: border-box;
      }
      
      /* Ensure spacing consistency */
      .fleet-viz-container {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: #ecefff;
        color: #0f1034;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      
      /* Override any host page styles */
      .fleet-viz-wrapper {
        padding: 1rem;
        background: #ffffff;
        border-radius: 0.5rem;
      }
    `;
    shadow.appendChild(baseStyle);
    
    style.onload = () => console.log('Fleet visualization styles loaded successfully from:', cssUrl);
    style.onerror = () => {
      console.error('Failed to load fleet visualization styles from:', cssUrl);
      // Add a fallback inline style
      const fallbackStyle = document.createElement('style');
      fallbackStyle.textContent = `
        /* Minimal required styles */
        .fleet-viz-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #ecefff;
          color: #0f1034;
          padding: 1rem;
          border-radius: 0.5rem;
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
        jsonUrl: this._jsonUrl || undefined,
        className: "embedded-fleet-viz" // Add a class to help with any specific embedded styling
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
