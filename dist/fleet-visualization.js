var d=Object.defineProperty;var c=(i,n,e)=>n in i?d(i,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[n]=e;var r=(i,n,e)=>c(i,typeof n!="symbol"?n+"":n,e);import{s as m,n as g,F as f}from"./assets/FleetVisualization-D5BPT73c.js";class h extends HTMLElement{constructor(){super(...arguments);r(this,"root",null);r(this,"_jsonUrl",null);r(this,"shadowContainer",null);r(this,"stylesElement",null)}static get observedAttributes(){return["data-url"]}get jsonUrl(){return this._jsonUrl}set jsonUrl(e){this._jsonUrl=e,this.render()}connectedCallback(){console.log("FleetVisualization web component connecting to DOM");const e=this.attachShadow({mode:"open"});this.shadowContainer=document.createElement("div"),this.shadowContainer.className="fleet-visualization-root",this.shadowContainer.style.width="100%",this.shadowContainer.style.height="100%",this.shadowContainer.style.fontFamily='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',this.shadowContainer.style.fontSize="16px",this.shadowContainer.style.lineHeight="1.5",this.shadowContainer.style.color="#0f1034",this.shadowContainer.style.background="transparent",e.appendChild(this.shadowContainer),this._jsonUrl=this.getAttribute("data-url"),this.loadStyles(e),setTimeout(()=>{this.shadowContainer&&(console.log("Creating React root for FleetVisualization"),this.root=m.createRoot(this.shadowContainer),this.render())},100)}attributeChangedCallback(e,a,t){e==="data-url"&&a!==t&&(console.log("FleetVisualization data-url changed:",t),this._jsonUrl=t,this.render())}disconnectedCallback(){console.log("FleetVisualization web component disconnecting from DOM"),this.root&&(this.root.unmount(),this.root=null)}getBaseUrl(){const e=document.getElementsByTagName("script");let a="";for(let o=0;o<e.length;o++)if(e[o].src&&e[o].src.includes("fleet-visualization")){a=e[o].src;break}if(!a)return console.warn("Could not find fleet-visualization script tag. Using current origin instead."),window.location.origin;const t=new URL(a);return`${t.origin}${t.pathname.substring(0,t.pathname.lastIndexOf("/"))}`}loadStyles(e){const t=`${this.getBaseUrl()}/assets/main.css`;console.log("Loading fleet visualization styles from:",t);const o=document.createElement("link");o.rel="stylesheet",o.href=t,o.setAttribute("crossorigin","anonymous"),e.appendChild(o);const l=document.createElement("style");l.textContent=`
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
        background: transparent;
        color: #0f1034;
        font-size: 16px;
        line-height: 1.5;
        box-sizing: border-box;
      }
      
      .fleet-visualization-root * {
        box-sizing: border-box;
      }
      
      /* Make sure colors match the standalone version */
      .fleet-viz-container {
        width: 100%;
        height: 100%;
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
        color: #d09974;
      }
      
      .text-viz-secondary {
        color: #995730;
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
        background-color: #d09974;
      }
      
      .bg-viz-secondary {
        background-color: #995730;
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
      
      /* Add more critical Tailwind classes as needed */
    `,e.appendChild(l),o.onload=()=>console.log("Fleet visualization styles loaded successfully from:",t),o.onerror=()=>{console.error("Failed to load fleet visualization styles from:",t),console.log("Applying fallback inline styles");const s=document.createElement("style");s.textContent=`
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
      `,e.appendChild(s)}}render(){if(!this.root){console.warn("Cannot render FleetVisualization - React root not created yet");return}console.log("Rendering FleetVisualization with jsonUrl:",this._jsonUrl),this.root.render(g.createElement(f,{jsonUrl:this._jsonUrl||void 0,className:"embedded-fleet-viz"}))}}customElements.get("fleet-visualization")||(console.log("Defining fleet-visualization custom element"),customElements.define("fleet-visualization",h));console.log("Fleet Visualization Web Component loaded");window.addEventListener("DOMContentLoaded",()=>{console.log("DOM fully loaded, Fleet Visualization Web Component ready");const i=document.getElementsByTagName("fleet-visualization");if(console.log(`Found ${i.length} fleet-visualization elements on the page`),i.length>0){const n=i[0];console.log("First fleet-visualization element:",n)}});
