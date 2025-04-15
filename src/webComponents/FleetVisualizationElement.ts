
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
    
    // Create a container for the component
    this.shadowContainer = document.createElement('div');
    this.shadowContainer.style.width = '100%';
    this.shadowContainer.style.height = '100%';
    this.appendChild(this.shadowContainer);
    
    // Get the data-url attribute
    this._jsonUrl = this.getAttribute('data-url');
    
    // Create styles element to inject global styles
    this.loadStyles();
    
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
    
    if (this.stylesElement && document.head.contains(this.stylesElement)) {
      document.head.removeChild(this.stylesElement);
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
  
  private loadStyles() {
    // If there's already a style element with our ID, don't add another one
    const existingStyle = document.getElementById('fleet-visualization-styles');
    if (existingStyle) {
      console.log('Fleet visualization styles already loaded');
      return;
    }
    
    this.stylesElement = document.createElement('link');
    this.stylesElement.id = 'fleet-visualization-styles';
    this.stylesElement.rel = 'stylesheet';
    const baseUrl = this.getBaseUrl();
    this.stylesElement.href = `${baseUrl}/assets/main-DPm-0b7F.css`;
    this.stylesElement.onload = () => console.log('Fleet visualization styles loaded successfully');
    this.stylesElement.onerror = (err) => console.error('Failed to load fleet visualization styles:', err);
    
    document.head.appendChild(this.stylesElement);
    console.log('Component styles loading from:', this.stylesElement.href);
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
