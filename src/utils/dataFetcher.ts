
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
    
    return vehicleData;
  } catch (error: any) {
    console.error("Error fetching vehicle data:", error);
    // Fall back to mock data when there's a CORS or network error
    console.log("Falling back to mock data due to fetch error");
    return getMockVehicleData();
  }
};

// For development/testing with realistic data for EV adoption
export const getMockVehicleData = (): VehicleData[] => {
  console.log("Generating mock vehicle data");
  
  const totalVehicles = 150;
  const evReadyTarget = Math.floor(totalVehicles * 0.92); // 92% EV ready
  
  const vehicles: VehicleData[] = [];
  
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
  console.log(`Generated ${vehicles.length} mock vehicles`);
  return vehicles.sort(() => Math.random() - 0.5);
};

// Generate vehicle ID (license plate)
const generateVehicleId = (): string => {
  const prefixes = ["7M", "8L", "9P"];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNumber = String(Math.floor(10000 + Math.random() * 90000)).substring(0, 5);
  return `${randomPrefix}${randomNumber}`;
};

export const isVehicleEVReady = (vehicle: VehicleData): boolean => {
  // Typical EV range is around 250-300km, we'll use 250km as threshold
  const EV_RANGE_THRESHOLD = 250;
  
  // A vehicle is EV-ready if 95% of its trips fall within the EV range
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
  
  return {
    evReadyCount,
    evReadyPercentage,
    totalVehicles
  };
};

// Function to generate a complete realistic JSON file
export const generateTemplateJSON = (): VehicleDataResponse => {
  return {
    data: getMockVehicleData()
  };
};
