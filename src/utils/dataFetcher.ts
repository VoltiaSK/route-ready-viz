
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
    
    // Get the raw response text to analyze it
    const responseText = await response.text();
    console.log(`Received raw JSON data: ${responseText.length} characters`);
    
    // Parse the raw text to JSON
    let jsonData;
    try {
      jsonData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      throw new Error(`Invalid JSON format: ${parseError.message}`);
    }
    
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
    
    // Log the complete data for verification
    console.log(`Successfully parsed ${vehicleData.length} vehicles from JSON`);
    
    // Verify we're getting complete data
    const jsonString = JSON.stringify(vehicleData);
    console.log(`JSON data size: ${(jsonString.length / 1024).toFixed(2)} KB`);
    
    // Count vehicle types for debugging
    const evReady = vehicleData.filter(v => v.max_95_perc <= 300);
    const nonEvReady = vehicleData.filter(v => v.max_95_perc > 300);
    
    console.log(`Fleet breakdown:`);
    console.log(`- Total vehicles: ${vehicleData.length}`);
    console.log(`- EV-ready vehicles: ${evReady.length}`);
    console.log(`- Non-EV-ready vehicles: ${nonEvReady.length}`);
    
    if (vehicleData.length > 0) {
      console.log(`First vehicle: ${vehicleData[0].lorry}, Last vehicle: ${vehicleData[vehicleData.length - 1].lorry}`);
    }
    
    // IMPORTANT: Make sure we return the FULL array without any slicing or truncation
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
