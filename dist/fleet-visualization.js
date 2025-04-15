var c=Object.defineProperty;var d=(o,n,e)=>n in o?c(o,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[n]=e;var s=(o,n,e)=>d(o,typeof n!="symbol"?n+"":n,e);import{q as u,n as f,F as h}from"./assets/FleetVisualization-DTqk4joq.js";class g extends HTMLElement{constructor(){super(...arguments);s(this,"root",null);s(this,"_jsonUrl",null);s(this,"shadowContainer",null);s(this,"stylesElement",null)}static get observedAttributes(){return["data-url"]}get jsonUrl(){return this._jsonUrl}set jsonUrl(e){this._jsonUrl=e,this.render()}connectedCallback(){console.log("FleetVisualization web component connecting to DOM");const e=this.attachShadow({mode:"open"});this.shadowContainer=document.createElement("div"),this.shadowContainer.className="fleet-visualization-root",this.shadowContainer.style.width="100%",this.shadowContainer.style.height="100%",e.appendChild(this.shadowContainer),this._jsonUrl=this.getAttribute("data-url"),this.loadStyles(e),setTimeout(()=>{this.shadowContainer&&(console.log("Creating React root for FleetVisualization"),this.root=u.createRoot(this.shadowContainer),this.render())},100)}attributeChangedCallback(e,i,t){e==="data-url"&&i!==t&&(console.log("FleetVisualization data-url changed:",t),this._jsonUrl=t,this.render())}disconnectedCallback(){console.log("FleetVisualization web component disconnecting from DOM"),this.root&&(this.root.unmount(),this.root=null)}getBaseUrl(){const e=document.getElementsByTagName("script");let i="";for(let t=0;t<e.length;t++)if(e[t].src&&e[t].src.includes("fleet-visualization")){i=e[t].src;break}return i?i.substring(0,i.lastIndexOf("/")):(console.warn("Could not find fleet-visualization script tag. Using current origin instead."),window.location.origin)}loadStyles(e){const t=`${this.getBaseUrl()}/assets/main.css`;console.log("Loading fleet visualization styles from:",t);const l=document.createElement("link");l.rel="stylesheet",l.href=t,e.appendChild(l);const a=document.createElement("style");a.textContent=`
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
    `,e.appendChild(a),l.onload=()=>console.log("Fleet visualization styles loaded successfully from:",t),l.onerror=()=>{console.error("Failed to load fleet visualization styles from:",t);const r=document.createElement("style");r.textContent=`
        /* Minimal required styles */
        .fleet-viz-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #ecefff;
          color: #0f1034;
          padding: 1rem;
          border-radius: 0.5rem;
        }
      `,e.appendChild(r)}}render(){if(!this.root){console.warn("Cannot render FleetVisualization - React root not created yet");return}console.log("Rendering FleetVisualization with jsonUrl:",this._jsonUrl),this.root.render(f.createElement(h,{jsonUrl:this._jsonUrl||void 0,className:"embedded-fleet-viz"}))}}customElements.get("fleet-visualization")||(console.log("Defining fleet-visualization custom element"),customElements.define("fleet-visualization",g));console.log("Fleet Visualization Web Component loaded");window.addEventListener("DOMContentLoaded",()=>{console.log("DOM fully loaded, Fleet Visualization Web Component ready");const o=document.getElementsByTagName("fleet-visualization");if(console.log(`Found ${o.length} fleet-visualization elements on the page`),o.length>0){const n=o[0];console.log("First fleet-visualization element:",n)}});
