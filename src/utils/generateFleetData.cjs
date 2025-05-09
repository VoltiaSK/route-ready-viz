
// Generate fleet data and save to JSON file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate vehicle ID (license plate)
const generateVehicleId = () => {
  const prefixes = ["7M", "8L", "9P"];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNumber = String(Math.floor(10000 + Math.random() * 90000)).substring(0, 5);
  return `${randomPrefix}${randomNumber}`;
};

// Generate the full dataset according to specifications
const generateTemplateJSON = () => {
  console.log("Generating fleet data with 150 vehicles (92% EV ready)");
  
  const totalVehicles = 150;
  const evReadyTarget = Math.floor(totalVehicles * 0.92); // 92% EV ready
  
  const vehicles = [];
  
  // EV Ready vehicles (most daily routes between 60km and 240km)
  for (let i = 0; i < evReadyTarget; i++) {
    const avgDistance = Math.floor(60 + Math.random() * 180); // 60-240km average
    const minDistance = Math.floor(Math.max(10, avgDistance * 0.3 + (Math.random() * 20 - 10)));
    const maxDistance = Math.floor(avgDistance * 1.5 + Math.random() * 60);
    const medianDistance = Math.floor(avgDistance * 0.9 + Math.random() * 20);
    
    // 95% range - must be <= 250 for EV ready
    const min95perc = Math.floor(Math.max(15, avgDistance * 0.4));
    const max95perc = Math.min(250, Math.floor(avgDistance * 1.2 + Math.random() * 40));
    
    const avgHighwayDistance = Math.floor(avgDistance * (0.2 + Math.random() * 0.5));
    const medianHighway = Math.floor(avgHighwayDistance * 0.9 + Math.random() * 10);
    
    vehicles.push({
      depot: Math.random() > 0.5 ? "SK" : "CZ",
      lorry: generateVehicleId(),
      average_distance: avgDistance,
      minimum_distance: minDistance,
      maximum_distance: maxDistance,
      median_distance: medianDistance,
      min_95_perc: min95perc,
      max_95_perc: max95perc,
      average_highway_distance: avgHighwayDistance,
      median_highway: medianHighway
    });
  }
  
  // Non-EV Ready vehicles (higher mileage)
  for (let i = evReadyTarget; i < totalVehicles; i++) {
    const avgDistance = Math.floor(230 + Math.random() * 120); // 230-350km average
    const minDistance = Math.floor(Math.max(40, avgDistance * 0.3));
    const maxDistance = Math.floor(avgDistance * 1.8 + Math.random() * 100);
    const medianDistance = Math.floor(avgDistance * 0.95 + Math.random() * 30);
    
    // 95% range - must be > 250 for non-EV ready
    const min95perc = Math.floor(Math.max(40, avgDistance * 0.5));
    const max95perc = Math.floor(Math.max(251, avgDistance * 1.3 + Math.random() * 60));
    
    const avgHighwayDistance = Math.floor(avgDistance * (0.4 + Math.random() * 0.4));
    const medianHighway = Math.floor(avgHighwayDistance * 0.9 + Math.random() * 15);
    
    vehicles.push({
      depot: Math.random() > 0.5 ? "SK" : "CZ",
      lorry: generateVehicleId(),
      average_distance: avgDistance,
      minimum_distance: minDistance,
      maximum_distance: maxDistance,
      median_distance: medianDistance,
      min_95_perc: min95perc,
      max_95_perc: max95perc,
      average_highway_distance: avgHighwayDistance,
      median_highway: medianHighway
    });
  }
  
  // Shuffle the array to mix EV ready and non-EV ready
  const shuffledVehicles = vehicles.sort(() => Math.random() - 0.5);
  console.log(`Generated ${shuffledVehicles.length} vehicles with ${evReadyTarget} EV-ready (${Math.round(evReadyTarget/totalVehicles*100)}%)`);
  
  return {
    data: shuffledVehicles
  };
};

// Make sure the FleetData directory exists
const fleetDataDir = path.join(__dirname, '../../src/FleetData');
if (!fs.existsSync(fleetDataDir)) {
  fs.mkdirSync(fleetDataDir, { recursive: true });
  console.log(`Created FleetData directory at: ${fleetDataDir}`);
}

// Generate the JSON file
const jsonData = generateTemplateJSON();

// Convert to JSON string with nice formatting
const jsonString = JSON.stringify(jsonData, null, 2);

// Write to FleetData folder (private to app)
const fleetDataPath = path.join(fleetDataDir, 'fleetData.json');
fs.writeFileSync(fleetDataPath, jsonString, 'utf8');
console.log(`Fleet data with 150 vehicles saved to: ${fleetDataPath}`);
