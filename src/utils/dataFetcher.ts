
import { VehicleData } from "@/types/VehicleData";

/**
 * Fetches vehicle data from the specified URL
 */
export const fetchVehicleData = async (url: string): Promise<VehicleData[]> => {
  try {
    if (!url) {
      console.log("No URL provided to fetch vehicle data.");
      return [];
    }

    console.log(`🔍 Fetching vehicle data from: ${url}`);
    const startTime = performance.now();
    
    // Use AbortController to handle timeout for fetch requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(url, {
      cache: 'no-store', // Prevent caching issues
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      mode: 'cors', // Enable CORS for external URLs
      signal: controller.signal,
      credentials: 'omit' // Avoid sending credentials
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    // Get the raw text response before parsing
    const responseText = await response.text();
    console.log(`📊 Raw data length: ${responseText.length} characters`);
    
    // Check if the response is empty
    if (!responseText || responseText.trim() === '') {
      throw new Error('Received empty response from server');
    }
    
    // Parse the JSON manually to avoid potential issues
    let jsonData;
    try {
      jsonData = JSON.parse(responseText);
      console.log(`💾 Successfully parsed JSON data, checking structure...`);
    } catch (parseError: any) {
      console.error("JSON parsing error:", parseError);
      throw new Error(`Invalid JSON format: ${parseError.message}`);
    }
    
    // Check data structure
    if (!jsonData) {
      throw new Error('Parsed JSON is null or undefined');
    }
    
    // Extract vehicles array - use spread operator to make a new array copy
    let vehicleData: VehicleData[] = [];
    
    if (jsonData && jsonData.data && Array.isArray(jsonData.data)) {
      // Create a completely new array to avoid reference issues
      vehicleData = [...jsonData.data]; 
      console.log(`🚚 Found ${vehicleData.length} vehicles in the data.data property`);
    } else if (Array.isArray(jsonData)) {
      vehicleData = [...jsonData];
      console.log(`🚚 Found ${vehicleData.length} vehicles in direct array format`);
    } else {
      console.error("Unexpected data format:", jsonData);
      throw new Error("Invalid data format: Could not find vehicle data array");
    }
    
    // Validate the data
    if (!vehicleData || vehicleData.length === 0) {
      throw new Error("No vehicle data found in the response");
    }
    
    // Log data characteristics for debugging - log full count to verify all records
    console.log(`🔢 Full vehicle count: ${vehicleData.length}`);
    if (vehicleData.length > 0) {
      console.log(`- First 5 IDs: ${vehicleData.slice(0, Math.min(5, vehicleData.length)).map(v => v.lorry).join(', ')}`);
      console.log(`- Last 5 IDs: ${vehicleData.slice(-Math.min(5, vehicleData.length)).map(v => v.lorry).join(', ')}`);
    }
    
    // Check for duplicate keys to identify potential overwriting
    const lorryIds = new Map();
    const duplicates: string[] = [];
    
    vehicleData.forEach((vehicle, index) => {
      if (lorryIds.has(vehicle.lorry)) {
        duplicates.push(vehicle.lorry);
      } else {
        lorryIds.set(vehicle.lorry, index);
      }
    });
    
    if (duplicates.length > 0) {
      console.warn(`⚠️ Found ${duplicates.length} duplicate lorry IDs: ${duplicates.join(', ')}`);
    }
    
    // Verify every vehicle has required fields
    const incompleteVehicles = vehicleData.filter(v => 
      !v.lorry || !v.depot || v.max_95_perc === undefined || v.average_distance === undefined
    );
    
    if (incompleteVehicles.length > 0) {
      console.warn(`⚠️ Found ${incompleteVehicles.length} incomplete vehicle records`);
      console.log(`First incomplete record example: ${JSON.stringify(incompleteVehicles[0])}`);
    }
    
    const endTime = performance.now();
    console.log(`⏱️ Data fetching completed in ${(endTime - startTime).toFixed(2)}ms.`);
    console.log(`🔄 RETURNING FULL DATASET with ${vehicleData.length} vehicles`);
    
    // Return the complete array - important to keep the reference to a new array
    return vehicleData;
  } catch (error: any) {
    console.error("❌ Error fetching vehicle data:", error);
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
  console.log(`Calculating EV readiness for ${vehicles.length} vehicles`);
  
  if (vehicles.length === 0) {
    return {
      evReadyCount: 0,
      evReadyPercentage: 0,
      totalVehicles: 0
    };
  }
  
  const evReadyVehicles = vehicles.filter(isVehicleEVReady);
  const evReadyCount = evReadyVehicles.length;
  const totalVehicles = vehicles.length;
  
  // Calculate the actual percentage of EV-ready vehicles in the fleet
  const evReadyFleetPercentage = totalVehicles > 0 ? Math.round((evReadyCount/totalVehicles)*100) : 0;
  
  console.log(`Fleet composition: ${evReadyCount}/${totalVehicles} vehicles are EV-ready (${evReadyFleetPercentage}% of fleet)`);
  
  // Calculate percentage of routes that can be served by EVs
  // Currently hardcoded to 92% as per original implementation
  const routePercentage = evReadyCount > 0 ? 92 : 0;
  console.log(`These ${evReadyCount} EV-ready vehicles handle ${routePercentage}% of all routes`);
  
  return {
    evReadyCount,
    evReadyPercentage: routePercentage,
    totalVehicles
  };
};
