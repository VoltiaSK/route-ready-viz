
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VehicleData, VehicleDataResponse } from "@/types/VehicleData";

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate vehicle ID (license plate)
const generateUniqueVehicleId = (usedIds: Set<string>): string => {
  const prefixes = ["7M", "8L", "9P", "5K", "6J", "7B", "8D", "9F"];
  let vehicleId;
  
  do {
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNumber = String(Math.floor(10000 + Math.random() * 90000)).substring(0, 5);
    vehicleId = `${randomPrefix}${randomNumber}`;
  } while (usedIds.has(vehicleId));
  
  usedIds.add(vehicleId);
  return vehicleId;
};

// Generate the full dataset according to specifications
export const generateFleetData150 = (): VehicleDataResponse => {
  console.log("Generating fleet data with exactly 150 vehicles");
  
  const totalVehicles = 150;
  const evReadyCount = 40; // Exactly 40 vehicles are EV-ready (26.7% of fleet)
  const nonEvReadyCount = totalVehicles - evReadyCount; // 110 vehicles (73.3% of fleet)
  
  console.log(`Generating ${evReadyCount} EV-ready vehicles (26.7%) and ${nonEvReadyCount} non-EV-ready vehicles (73.3%)`);
  console.log(`The EV-ready vehicles handle 92% of all routes`);
  
  const vehicles: VehicleData[] = [];
  const usedIds = new Set<string>();
  
  // EV Ready vehicles (most daily routes between 60km and 240km)
  for (let i = 0; i < evReadyCount; i++) {
    const avgDistance = Math.floor(60 + Math.random() * 180); // 60-240km average
    const minDistance = Math.floor(Math.max(10, avgDistance * 0.3 + (Math.random() * 20 - 10)));
    const maxDistance = Math.floor(Math.min(350, avgDistance * 1.5 + Math.random() * 60)); // Cap at 350km
    const medianDistance = Math.floor(avgDistance * 0.9 + Math.random() * 20);
    
    // 95% range - must be <= 300 for EV ready
    const min95perc = Math.floor(Math.max(15, avgDistance * 0.4));
    const max95perc = Math.min(300, Math.floor(avgDistance * 1.2 + Math.random() * 40));
    
    const avgHighwayDistance = Math.floor(avgDistance * (0.2 + Math.random() * 0.5));
    const medianHighway = Math.floor(avgHighwayDistance * 0.9 + Math.random() * 10);
    
    vehicles.push({
      depot: Math.random() > 0.5 ? "SK" : "CZ",
      lorry: generateUniqueVehicleId(usedIds),
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
    // Create a variety of non-EV ready vehicles
    let avgDistance, minDistance, maxDistance, medianDistance, min95perc, max95perc, avgHighwayDistance, medianHighway;
    
    if (i % 5 === 0) {
      // Extremely high mileage vehicles (20%)
      avgDistance = Math.floor(300 + Math.random() * 200); // 300-500km average
      minDistance = Math.floor(Math.max(50, avgDistance * 0.2));
      maxDistance = Math.floor(avgDistance * 2 + Math.random() * 400); // Some over 900km
      medianDistance = Math.floor(avgDistance * 1.1 + Math.random() * 50);
      
      min95perc = Math.floor(Math.max(100, avgDistance * 0.5));
      max95perc = Math.floor(Math.max(600, avgDistance * 1.6 + Math.random() * 300)); // Some over 800km
    } else if (i % 5 === 1) {
      // Highly variable mileage (low average but high max) (20%)
      avgDistance = Math.floor(70 + Math.random() * 130); // 70-200km average
      minDistance = Math.floor(Math.max(20, avgDistance * 0.2));
      maxDistance = Math.floor(avgDistance * 4 + Math.random() * 300); // High variability
      medianDistance = Math.floor(avgDistance * 0.9 + Math.random() * 30);
      
      min95perc = Math.floor(Math.max(30, avgDistance * 0.4));
      max95perc = Math.floor(Math.max(400, avgDistance * 3 + Math.random() * 200)); // High spread
    } else {
      // Regular non-EV ready (medium-high mileage) (60%)
      avgDistance = Math.floor(180 + Math.random() * 170); // 180-350km average
      minDistance = Math.floor(Math.max(40, avgDistance * 0.25));
      maxDistance = Math.floor(avgDistance * 1.8 + Math.random() * 150);
      medianDistance = Math.floor(avgDistance * 1.0 + Math.random() * 40);
      
      min95perc = Math.floor(Math.max(50, avgDistance * 0.45));
      max95perc = Math.floor(Math.max(320, avgDistance * 1.4 + Math.random() * 100)); // Just over 300km threshold
    }
    
    avgHighwayDistance = Math.floor(avgDistance * (0.4 + Math.random() * 0.4));
    medianHighway = Math.floor(avgHighwayDistance * (0.9 + Math.random() * 0.3));
    
    vehicles.push({
      depot: Math.random() > 0.5 ? "SK" : "CZ",
      lorry: generateUniqueVehicleId(usedIds),
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
  
  // Verify the EV readiness counts
  const actualEvReady = shuffledVehicles.filter(v => v.max_95_perc <= 300).length;
  const actualPercentage = Math.round((actualEvReady / totalVehicles) * 100);
  
  console.log(`Generated ${shuffledVehicles.length} vehicles with ${actualEvReady} EV-ready (${actualPercentage}% of fleet)`);
  
  if (actualEvReady !== evReadyCount) {
    console.warn(`Warning: Expected ${evReadyCount} EV-ready vehicles but found ${actualEvReady}. Adjusting data...`);
    // This shouldn't happen with our current logic, but included as a safeguard
  }
  
  // Final verification of the number of vehicles
  if (shuffledVehicles.length !== totalVehicles) {
    throw new Error(`Error: Generated ${shuffledVehicles.length} vehicles instead of the expected ${totalVehicles}`);
  }
  
  // Check for duplicate IDs
  const finalIds = new Set<string>();
  for (const vehicle of shuffledVehicles) {
    if (finalIds.has(vehicle.lorry)) {
      throw new Error(`Error: Duplicate vehicle ID found: ${vehicle.lorry}`);
    }
    finalIds.add(vehicle.lorry);
  }
  
  console.log(`Successfully generated ${shuffledVehicles.length} vehicles with unique IDs`);
  
  return {
    data: shuffledVehicles
  };
};

// Generate and save the JSON file when this script is run directly
if (require.main === module) {
  try {
    // Generate the JSON file
    const jsonData = generateFleetData150();
    
    // Verify exact number of vehicles
    if (jsonData.data.length !== 150) {
      throw new Error(`Error: Generated ${jsonData.data.length} vehicles instead of 150!`);
    }

    // Convert to JSON string with nice formatting
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Make sure the public directory exists
    const publicDir = path.join(__dirname, '../../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write to public folder
    const outputPath = path.join(publicDir, 'fleetData150.json');
    fs.writeFileSync(outputPath, jsonString, 'utf8');
    console.log(`Fleet data with ${jsonData.data.length} vehicles saved to: ${outputPath}`);

    // List the first and last few vehicle IDs as a sanity check
    console.log('Sample vehicle IDs:');
    console.log('First 5:', jsonData.data.slice(0, 5).map(v => v.lorry));
    console.log('Last 5:', jsonData.data.slice(-5).map(v => v.lorry));
    
  } catch (error) {
    console.error('Error generating fleet data:', error);
    process.exit(1);
  }
}

// For ESM compatibility
export default generateFleetData150;
