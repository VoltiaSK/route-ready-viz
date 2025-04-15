
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
// 2. The build process will automatically name the CSS file "main.css" in dist/assets/ 
// 3. Deploy all files to Vercel or your hosting platform
// 4. Use the component in your website with:
//    <fleet-visualization data-url="path-to-your-data.json"></fleet-visualization>
// 5. Make sure to include the script in your HTML:
//    <script src="path-to-your-server/fleet-visualization.js"></script>

