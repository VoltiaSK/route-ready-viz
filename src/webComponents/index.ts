
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

// Instructions for deployment:
// 1. Run 'npm run build' to generate the dist folder
// 2. After building, manually copy the generated CSS file from dist/assets/ and rename it to 'main.css'
// 3. The CSS file must be placed in the dist/assets/ directory as 'main.css'
// 4. Deploy all files to Vercel or your hosting platform
