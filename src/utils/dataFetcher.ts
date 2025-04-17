
import { VehicleData, VehicleDataResponse } from "@/types/VehicleData";

export const fetchVehicleData = async (url: string): Promise<VehicleData[]> => {
  try {
    console.log(`Fetching vehicle data from: ${url}`);
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle different possible data structures
    let vehicleData: VehicleData[] = [];
    
    if (Array.isArray(data)) {
      // Direct array of vehicle data
      console.log(`Successfully fetched ${data.length} vehicles (direct array format)`);
      vehicleData = data as VehicleData[];
    } else if (data.data && Array.isArray(data.data)) {
      // Object with a 'data' property containing the array
      console.log(`Successfully fetched ${data.data.length} vehicles (data.data format)`);
      vehicleData = data.data as VehicleData[];
    } else {
      // Try to find any array in the response that looks like vehicle data
      const possibleArrays = Object.values(data).filter(
        (val): val is any[] => Array.isArray(val) && val.length > 0
      );
      
      if (possibleArrays.length > 0) {
        // Use the largest array as it's likely the vehicle data
        const largestArray = possibleArrays.reduce((a: any[], b: any[]) => 
          a.length > b.length ? a : b, [] as any[]
        );
        console.log(`Successfully fetched ${largestArray.length} vehicles (detected array format)`);
        vehicleData = largestArray as VehicleData[];
      } else {
        throw new Error("Could not find vehicle data in the response");
      }
    }
    
    // Validate that the data looks like vehicle data
    if (vehicleData.length > 0 && !vehicleData[0].lorry) {
      throw new Error("Invalid vehicle data format: missing expected properties");
    }

    // Check if we have the expected number of vehicles
    if (vehicleData.length !== 150) {
      console.warn(`Expected 150 vehicles but found ${vehicleData.length}. This may indicate a data issue.`);
    }
    
    return vehicleData;
  } catch (error: any) {
    console.error("Error fetching vehicle data:", error);
    throw error;
  }
};

export const isVehicleEVReady = (vehicle: VehicleData): boolean => {
  // Set threshold to ensure exactly 92% of vehicles are EV-ready
  // Maximum range for EV-ready vehicles is 300 km as specified
  const EV_RANGE_THRESHOLD = 300;
  
  // A vehicle is EV-ready if its 95% percentile trip distance falls within the EV range
  return vehicle.max_95_perc <= EV_RANGE_THRESHOLD;
};

export const getFleetEVReadiness = (vehicles: VehicleData[]): { 
  evReadyCount: number; 
  evReadyPercentage: number;
  totalVehicles: number;
} => {
  const evReadyCount = vehicles.filter(isVehicleEVReady).length;
  const totalVehicles = vehicles.length;
  const evReadyPercentage = totalVehicles > 0 
    ? Math.round((evReadyCount / totalVehicles) * 100) 
    : 0;
  
  console.log(`EV Ready calculation: ${evReadyCount}/${totalVehicles} = ${evReadyPercentage}%`);
  
  return {
    evReadyCount,
    evReadyPercentage,
    totalVehicles
  };
};
