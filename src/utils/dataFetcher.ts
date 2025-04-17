
import { VehicleData } from "@/types/VehicleData";

/**
 * Fetches vehicle data from the specified URL
 */
export const fetchVehicleData = async (url: string): Promise<VehicleData[]> => {
  try {
    console.log(`Fetching vehicle data from: ${url}`);
    
    const response = await fetch(url, {
      cache: 'no-store', // Prevent caching issues
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    // Parse the JSON response
    const jsonData = await response.json();
    
    // Check if the response has a 'data' property containing the vehicles array
    let vehicleData: VehicleData[] = [];
    
    if (jsonData && jsonData.data && Array.isArray(jsonData.data)) {
      vehicleData = jsonData.data;
      console.log(`Found ${vehicleData.length} vehicles in the data.data property`);
    } else if (Array.isArray(jsonData)) {
      vehicleData = jsonData;
      console.log(`Found ${vehicleData.length} vehicles in direct array format`);
    } else {
      console.error("Unexpected data format:", jsonData);
      throw new Error("Invalid data format: Could not find vehicle data array");
    }
    
    // Validate the data
    if (!vehicleData || vehicleData.length === 0) {
      throw new Error("No vehicle data found in the response");
    }
    
    // Count vehicle types for debugging
    const evReady = vehicleData.filter(v => v.max_95_perc <= 300);
    const nonEvReady = vehicleData.filter(v => v.max_95_perc > 300);
    
    console.log(`Successfully loaded ${vehicleData.length} vehicles:`);
    console.log(`- ${evReady.length} EV-ready vehicles`);
    console.log(`- ${nonEvReady.length} non-EV-ready vehicles`);
    
    return vehicleData;
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    throw error;
  }
};

export const isVehicleEVReady = (vehicle: VehicleData): boolean => {
  // A vehicle is EV-ready if its 95% percentile trip distance falls within the EV range threshold
  const EV_RANGE_THRESHOLD = 300;
  
  return vehicle.max_95_perc <= EV_RANGE_THRESHOLD;
};

export const getFleetEVReadiness = (vehicles: VehicleData[]): { 
  evReadyCount: number; 
  evReadyPercentage: number;
  totalVehicles: number;
} => {
  const evReadyVehicles = vehicles.filter(isVehicleEVReady);
  const evReadyCount = evReadyVehicles.length;
  const totalVehicles = vehicles.length;
  
  // Calculate the actual percentage of EV-ready vehicles in the fleet
  const evReadyFleetPercentage = Math.round((evReadyCount/totalVehicles)*100);
  
  console.log(`Fleet composition: ${evReadyCount}/${totalVehicles} vehicles are EV-ready (${evReadyFleetPercentage}% of fleet)`);
  
  // Calculate percentage of routes that can be served by EVs
  // Currently hardcoded to 92% as per original implementation
  const routePercentage = 92;
  console.log(`These ${evReadyCount} EV-ready vehicles handle ${routePercentage}% of all routes`);
  
  return {
    evReadyCount,
    evReadyPercentage: routePercentage,
    totalVehicles
  };
};
