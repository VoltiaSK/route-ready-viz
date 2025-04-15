
import { useState, useEffect } from "react";
import { VehicleData } from "@/types/VehicleData";
import { fetchVehicleData, getMockVehicleData, getFleetEVReadiness } from "@/utils/dataFetcher";

export const useFleetData = (jsonUrl?: string) => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [fleetStats, setFleetStats] = useState({
    evReadyCount: 0,
    evReadyPercentage: 0,
    totalVehicles: 0
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setUsingMockData(false);
      try {
        let data: VehicleData[];
        
        if (jsonUrl) {
          try {
            data = await fetchVehicleData(jsonUrl);
            if (data && data.length > 0) {
              setVehicles(data);
              setFleetStats(getFleetEVReadiness(data));
              setError(null);
            } else {
              throw new Error("No vehicle data found");
            }
          } catch (err) {
            console.error("Failed to load vehicle data:", err);
            setError(`Failed to load vehicle data. Please check your JSON URL.`);
            
            // Fall back to mock data
            setUsingMockData(true);
            const mockData = getMockVehicleData();
            console.log("Falling back to mock data:", mockData.length, "vehicles loaded");
            setVehicles(mockData);
            setFleetStats(getFleetEVReadiness(mockData));
          }
        } else {
          // Use mock data if no URL is provided
          const mockData = getMockVehicleData();
          console.log("Using mock data:", mockData.length, "vehicles loaded");
          setVehicles(mockData);
          setFleetStats(getFleetEVReadiness(mockData));
          setUsingMockData(true);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [jsonUrl]);

  return { vehicles, loading, error, usingMockData, fleetStats };
};
