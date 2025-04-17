
// Command line tool to generate fleet data
const fs = require('fs');
const path = require('path');

// Generate vehicle ID (license plate)
const generateVehicleId = () => {
  const prefixes = ["7M", "8L", "9P", "5K", "6J", "7B", "8D", "9F"];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNumber = String(Math.floor(10000 + Math.random() * 90000)).substring(0, 5);
  return `${randomPrefix}${randomNumber}`;
};

// Generate the full dataset according to specifications
const generateFleetData = () => {
  console.log("Generating fleet data with 150 vehicles (92% EV ready = 138 vehicles)");
  
  const totalVehicles = 150;
  const evReadyCount = Math.round(totalVehicles * 0.92); // 92% EV ready = 138 vehicles
  const nonEvReadyCount = totalVehicles - evReadyCount; // 12 vehicles
  
  console.log(`Generating ${evReadyCount} EV-ready vehicles and ${nonEvReadyCount} non-EV-ready vehicles`);
  
  const vehicles = [];
  
  // EV Ready vehicles (daily routes between 60km and 240km, max_95_perc <= 300km)
  for (let i = 0; i < evReadyCount; i++) {
    const avgDistance = Math.floor(60 + Math.random() * 180); // 60-240km average
    const minDistance = Math.floor(Math.max(10, avgDistance * 0.3 + (Math.random() * 20 - 10)));
    const maxDistance = Math.floor(avgDistance * 1.5 + Math.random() * 60);
    const medianDistance = Math.floor(avgDistance * 0.9 + Math.random() * 20);
    
    // 95% range - must be <= 300 for EV ready
    const min95perc = Math.floor(Math.max(15, avgDistance * 0.4));
    const max95perc = Math.min(300, Math.floor(avgDistance * 1.2 + Math.random() * 40));
    
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
  
  // Non-EV Ready vehicles (higher mileage with extreme peaks)
  for (let i = 0; i < nonEvReadyCount; i++) {
    const avgDistance = Math.floor(70 + Math.random() * 300); // 70-370km average
    const minDistance = Math.floor(Math.max(20, avgDistance * 0.2));
    const maxDistance = Math.floor(avgDistance * 3 + Math.random() * 200); // Some vehicles with peak distances over 900km
    const medianDistance = Math.floor(avgDistance * 1.1 + Math.random() * 50);
    
    // 95% range - must be > 300 for non-EV ready with high variability
    const min95perc = Math.floor(Math.max(30, avgDistance * 0.4));
    const max95perc = Math.floor(Math.max(350, avgDistance * 2 + Math.random() * 300)); // Some with 95th percentile over 800km
    
    const avgHighwayDistance = Math.floor(avgDistance * (0.5 + Math.random() * 0.4));
    const medianHighway = Math.floor(avgHighwayDistance * 1.1 + Math.random() * 30);
    
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
  
  // Verify the EV readiness percentage
  const actualEvReady = shuffledVehicles.filter(v => v.max_95_perc <= 300).length;
  const actualPercentage = Math.round((actualEvReady / totalVehicles) * 100);
  
  console.log(`Generated ${shuffledVehicles.length} vehicles with ${actualEvReady} EV-ready (${actualPercentage}%)`);
  
  return {
    data: shuffledVehicles
  };
};

// Generate the JSON file
const jsonData = generateFleetData();

// Convert to JSON string with nice formatting
const jsonString = JSON.stringify(jsonData, null, 2);

// Make sure the FleetData directory exists
const fleetDataDir = path.join(__dirname, '../../src/FleetData');
if (!fs.existsSync(fleetDataDir)) {
  fs.mkdirSync(fleetDataDir, { recursive: true });
  console.log(`Created FleetData directory at: ${fleetDataDir}`);
}

// Write to FleetData folder (private to app)
const fleetDataPath = path.join(fleetDataDir, 'fleetData.json');
fs.writeFileSync(fleetDataPath, jsonString, 'utf8');
console.log(`Fleet data with ${jsonData.data.length} vehicles saved to: ${fleetDataPath}`);

// Also update public file for direct access
const publicDataPath = path.join(__dirname, '../../public/fleetData.json');
fs.writeFileSync(publicDataPath, jsonString, 'utf8');
console.log(`Fleet data also saved to public folder: ${publicDataPath}`);

console.log('Done! Run the app to see the updated fleet data.');
