
import { useState, useEffect } from "react";
import { VehicleData } from "@/types/VehicleData";
import { fetchVehicleData, getMockVehicleData, getFleetEVReadiness } from "@/utils/dataFetcher";
import fleetData from "@/FleetData/fleetData.json";

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
        // If jsonUrl is provided, try to fetch from there first
        if (jsonUrl) {
          try {
            const externalData = await fetchVehicleData(jsonUrl);
            if (externalData && externalData.length > 0) {
              console.log(`Successfully loaded ${externalData.length} vehicles from external URL: ${jsonUrl}`);
              setVehicles(externalData);
              setFleetStats(getFleetEVReadiness(externalData));
              setError(null);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error("Failed to load data from external URL:", err);
            // Continue to use internal data
          }
        }

        // Use internal pre-generated data from FleetData folder
        if (fleetData && fleetData.data && fleetData.data.length > 0) {
          const internalData = fleetData.data as VehicleData[];
          console.log(`Using internal fleet data: ${internalData.length} vehicles loaded`);
          setVehicles(internalData);
          setFleetStats(getFleetEVReadiness(internalData));
          setError(null);
        } else {
          // Fall back to mock data if internal data is empty
          console.warn("Internal fleet data is empty, using mock data");
          setUsingMockData(true);
          const mockData = getMockVehicleData();
          setVehicles(mockData);
          setFleetStats(getFleetEVReadiness(mockData));
        }
      } catch (err) {
        console.error("Error loading fleet data:", err);
        setError("Failed to load fleet data. Using mock data instead.");
        
        // Fall back to mock data
        setUsingMockData(true);
        const mockData = getMockVehicleData();
        console.log("Falling back to mock data:", mockData.length, "vehicles loaded");
        setVehicles(mockData);
        setFleetStats(getFleetEVReadiness(mockData));
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [jsonUrl]);

  return { vehicles, loading, error, usingMockData, fleetStats };
};
