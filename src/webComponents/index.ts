
import './FleetVisualizationElement';

// This file is the entry point for the web component bundle
console.log('Fleet Visualization Web Component loaded');

// Add a message to verify the component is working
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, Fleet Visualization Web Component ready');
  
  // Look for any fleet-visualization elements on the page
  const elements = document.getElementsByTagName('fleet-visualization');
  console.log(`Found ${elements.length} fleet-visualization elements on the page`);
});
