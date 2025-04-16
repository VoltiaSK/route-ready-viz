
import { useState, useEffect } from "react";
import { VehicleData } from "@/types/VehicleData";
import { isVehicleEVReady } from "@/utils/dataFetcher";
import fleetDataJson from "@/FleetData/fleetData.json"; // Updated import path with capital F

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
      try {
        // If jsonUrl is provided, try to fetch from there first
        if (jsonUrl) {
          try {
            const response = await fetch(jsonUrl, {
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
            let vehicleData: VehicleData[] = [];
            
            // Handle different possible data structures
            if (Array.isArray(data)) {
              vehicleData = data as VehicleData[];
            } else if (data.data && Array.isArray(data.data)) {
              vehicleData = data.data as VehicleData[];
            } else {
              throw new Error("Invalid data format from external source");
            }
            
            if (vehicleData.length > 0) {
              console.log(`Successfully loaded ${vehicleData.length} vehicles from external URL: ${jsonUrl}`);
              setVehicles(vehicleData);
              updateFleetStats(vehicleData);
              setError(null);
              setUsingMockData(false);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error("Failed to load data from external URL:", err);
            // Continue to use internal data
          }
        }

        // Use internal data from the imported JSON file
        if (fleetDataJson && fleetDataJson.data && fleetDataJson.data.length > 0) {
          const internalData = fleetDataJson.data as VehicleData[];
          console.log(`Using internal fleet data: ${internalData.length} vehicles loaded from FleetData/fleetData.json`);
          setVehicles(internalData);
          updateFleetStats(internalData);
          setError(null);
          setUsingMockData(jsonUrl ? true : false); // Only mark as mock data if we tried to load from URL
        } else {
          throw new Error("Fleet data is not available");
        }
      } catch (err) {
        console.error("Error loading fleet data:", err);
        setError("Failed to load fleet data.");
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [jsonUrl]);

  // Calculate fleet EV readiness stats
  const updateFleetStats = (vehicleData: VehicleData[]) => {
    const evReadyCount = vehicleData.filter(isVehicleEVReady).length;
    const totalVehicles = vehicleData.length;
    const evReadyPercentage = totalVehicles > 0 
      ? Math.round((evReadyCount / totalVehicles) * 100) 
      : 0;
    
    setFleetStats({
      evReadyCount,
      evReadyPercentage,
      totalVehicles
    });
  };

  return { vehicles, loading, error, usingMockData, fleetStats };
};
