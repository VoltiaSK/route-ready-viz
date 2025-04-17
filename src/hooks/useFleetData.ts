
import { useState, useEffect } from "react";
import { VehicleData } from "@/types/VehicleData";
import { fetchVehicleData, getFleetEVReadiness, isVehicleEVReady } from "@/utils/dataFetcher";
import fleetDataJson from "@/FleetData/fleetData.json";

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
            const fetchedVehicles = await fetchVehicleData(jsonUrl);
            
            if (fetchedVehicles && fetchedVehicles.length > 0) {
              console.log(`Successfully loaded ${fetchedVehicles.length} vehicles from external URL: ${jsonUrl}`);
              setVehicles(fetchedVehicles);
              const stats = getFleetEVReadiness(fetchedVehicles);
              setFleetStats(stats);
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
          
          // Verify the expected count
          if (internalData.length !== 150) {
            console.warn(`Expected 150 vehicles but found ${internalData.length}. This may indicate a data issue.`);
          }
          
          setVehicles(internalData);
          const stats = getFleetEVReadiness(internalData);
          setFleetStats(stats);
          
          // Verify that we have 92% EV ready vehicles
          const evReadyPercent = stats.evReadyPercentage;
          if (evReadyPercent !== 92) {
            console.warn(`Expected 92% EV-ready vehicles but found ${evReadyPercent}%. This may indicate a data issue.`);
          }
          
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

  return { vehicles, loading, error, usingMockData, fleetStats };
};
