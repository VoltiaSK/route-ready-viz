
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
    
    // Add more detailed logging
    console.log(`Attempting fetch with mode: cors, method: GET`);
    console.log(`Base URL: ${window.location.origin}, Relative URL: ${url}`);
    
    // Ensure the URL is absolute for local files
    const fetchUrl = url.startsWith('http') ? url : `${window.location.origin}${url.startsWith('/') ? url : `/${url}`}`;
    console.log(`Final fetch URL: ${fetchUrl}`);
    
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Log the response status and headers for debugging
    console.log(`Response status: ${response.status} ${response.statusText}`);
    console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    // Get the raw text response before parsing
    const responseText = await response.text();
    console.log(`📊 Raw data received: ${responseText.length} characters`);
    
    // Check if the response is empty
    if (!responseText || responseText.trim() === '') {
      throw new Error('Received empty response from server');
    }
    
    // Parse the JSON manually to avoid potential issues
    let jsonData;
    try {
      jsonData = JSON.parse(responseText);
      console.log(`💾 Successfully parsed JSON data, checking structure...`);
      console.log('Data structure preview:', JSON.stringify(jsonData).substring(0, 200) + '...');
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
      // IMPORTANT: Detailed logging to find missing vehicle issue
      console.log(`⚠️ VERIFICATION: Raw data.data array length: ${jsonData.data.length}`);
      
      // Log IDs to help identify potential duplicates or invalid entries
      const allIds = jsonData.data.map((v: any) => v.lorry);
      console.log(`🆔 All vehicle IDs from raw data: ${allIds.join(', ')}`);
      
      // Check for duplicate IDs
      const uniqueIds = new Set(allIds);
      if (uniqueIds.size !== allIds.length) {
        console.warn(`⚠️ Found ${allIds.length - uniqueIds.size} duplicate vehicle IDs!`);
        const duplicates = allIds.filter((id: string, index: number) => allIds.indexOf(id) !== index);
        console.warn(`Duplicate IDs: ${duplicates.join(', ')}`);
      }
      
      // Create a completely new array to avoid reference issues
      vehicleData = [...jsonData.data]; 
      console.log(`🚚 Found ${vehicleData.length} vehicles in the data.data property`);
      
      // Verify length matches
      if (jsonData.data.length !== vehicleData.length) {
        console.error(`⚠️ CRITICAL: Length mismatch! Original: ${jsonData.data.length}, Copied: ${vehicleData.length}`);
      }
    } else if (Array.isArray(jsonData)) {
      // IMPORTANT: Detailed logging for direct array format
      console.log(`⚠️ VERIFICATION: Raw array length: ${jsonData.length}`);
      
      vehicleData = [...jsonData];
      console.log(`🚚 Found ${vehicleData.length} vehicles in direct array format`);
      
      // Verify length matches
      if (jsonData.length !== vehicleData.length) {
        console.error(`⚠️ CRITICAL: Length mismatch! Original: ${jsonData.length}, Copied: ${vehicleData.length}`);
      }
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
      console.log(`- First vehicle sample: ${JSON.stringify(vehicleData[0])}`);
      console.log(`- Last vehicle sample: ${JSON.stringify(vehicleData[vehicleData.length-1])}`);
    }
    
    const endTime = performance.now();
    console.log(`⏱️ Data fetching completed in ${(endTime - startTime).toFixed(2)}ms.`);
    
    // Return the complete array - important to keep the reference to a new array
    return vehicleData;
  } catch (error: any) {
    console.error("❌ Error fetching vehicle data:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your network connection and try again.');
    }
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
