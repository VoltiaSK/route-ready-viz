
import { useState, useEffect } from "react";
import { VehicleData } from "@/types/VehicleData";
import { fetchVehicleData, getFleetEVReadiness } from "@/utils/dataFetcher";

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
      setError(null);
      setUsingMockData(false);
      
      try {
        // Use the provided JSON file URL or default to public/fleetData.json
        const dataUrl = jsonUrl || '/fleetData.json';
        console.log(`Attempting to load fleet data from: ${dataUrl}`);
        
        const vehicleData = await fetchVehicleData(dataUrl);
        
        if (!vehicleData || vehicleData.length === 0) {
          throw new Error("No vehicle data was returned");
        }
        
        // Log the actual number of vehicles to verify
        console.log(`Successfully loaded ${vehicleData.length} vehicles from ${dataUrl}`);
        
        // Calculate fleet statistics
        const stats = getFleetEVReadiness(vehicleData);
        
        // Update state with the loaded data
        setVehicles(vehicleData);
        setFleetStats(stats);
        setLoading(false);
      } catch (err: any) {
        console.error("Failed to load fleet data:", err);
        setError(err.message || "Failed to load fleet data. Please check the data source.");
        
        // Reset to empty state on error
        setVehicles([]);
        setFleetStats({
          evReadyCount: 0,
          evReadyPercentage: 0,
          totalVehicles: 0
        });
        setUsingMockData(false);
        setLoading(false);
      }
    };
    
    loadData();
  }, [jsonUrl]);

  return { vehicles, loading, error, usingMockData, fleetStats };
};
