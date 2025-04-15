
import './FleetVisualizationElement';

// This file is the entry point for the web component bundle
console.log('Fleet Visualization Web Component loaded');

// Add a message to verify the component is working
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, Fleet Visualization Web Component ready');
  
  // Look for any fleet-visualization elements on the page
  const elements = document.getElementsByTagName('fleet-visualization');
  console.log(`Found ${elements.length} fleet-visualization elements on the page`);
  
  // Check if we have access to the shadow DOM for debugging
  if (elements.length > 0) {
    const firstElement = elements[0];
    console.log('First fleet-visualization element:', firstElement);
    // Note: we can't directly log the shadow DOM from outside the component
  }
});

// Instructions for deployment:
// 1. Run 'npm run build' to generate the dist folder
// 2. Use the component in your website with:
//    <fleet-visualization data-url="path-to-your-data.json"></fleet-visualization>
// 3. Make sure to include the script in your HTML:
//    <script src="path-to-your-server/fleet-visualization.js"></script>
// 4. IMPORTANT: The data-url should point to a valid JSON file with this structure:
//    { "data": [ {vehicle objects} ] }
// 5. IMPORTANT: JSON must be valid - NO COMMENTS allowed in JSON files!
// 6. If no data-url is provided, or if there's an error loading the data,
//    the component will automatically use realistic mock data.
// 7. To ensure consistent styling when embedded, all CSS is scoped within
//    the shadow DOM and all class names are prefixed with 'fleet-viz-'.
