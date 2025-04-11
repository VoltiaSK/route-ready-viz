
import { VehicleData, VehicleDataResponse } from "@/types/VehicleData";

export const fetchVehicleData = async (url: string): Promise<VehicleData[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    const data: VehicleDataResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
    throw error;
  }
};

// For development/testing without external JSON
export const getMockVehicleData = (): VehicleData[] => {
  return Array(150).fill(null).map((_, index) => ({
    depot: ["CZ", "DE", "PL", "SK"][Math.floor(Math.random() * 4)],
    lorry: `${["9P", "8L", "7M"][Math.floor(Math.random() * 3)]}${String(Math.floor(10000 + Math.random() * 90000)).substring(0, 5)}`,
    average_distance: Math.floor(50 + Math.random() * 150),
    minimum_distance: Math.floor(5 + Math.random() * 20),
    maximum_distance: Math.floor(180 + Math.random() * 400),
    median_distance: Math.floor(40 + Math.random() * 120),
    min_95_perc: Math.floor(10 + Math.random() * 30),
    max_95_perc: Math.floor(120 + Math.random() * 200),
    average_highway_distance: Math.floor(Math.random() * 100),
    median_highway: Math.floor(Math.random() * 80)
  }));
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
