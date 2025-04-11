
import React from 'react';
import ReactDOM from 'react-dom/client';
import FleetVisualization from '../components/FleetVisualization';

class FleetVisualizationElement extends HTMLElement {
  private root: ReactDOM.Root | null = null;
  private _jsonUrl: string | null = null;

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
    // Create a shadow root
    const mountPoint = document.createElement('div');
    mountPoint.style.width = '100%';
    this.appendChild(mountPoint);
    
    // Get the data-url attribute
    this._jsonUrl = this.getAttribute('data-url');
    
    // Create root and render
    this.root = ReactDOM.createRoot(mountPoint);
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'data-url' && oldValue !== newValue) {
      this._jsonUrl = newValue;
      this.render();
    }
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

  private render() {
    if (this.root) {
      this.root.render(
        React.createElement(FleetVisualization, {
          jsonUrl: this._jsonUrl || undefined
        })
      );
    }
  }
}

// Define the custom element
if (!customElements.get('fleet-visualization')) {
  customElements.define('fleet-visualization', FleetVisualizationElement);
}

export default FleetVisualizationElement;
