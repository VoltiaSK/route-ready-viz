
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
      try {
        // Use the public JSON file URL if not provided
        const dataUrl = jsonUrl || '/fleetData.json';
        console.log("Attempting to load data from:", dataUrl);
        
        try {
          const fetchedVehicles = await fetchVehicleData(dataUrl);
          
          if (fetchedVehicles && fetchedVehicles.length > 0) {
            console.log(`Successfully loaded ${fetchedVehicles.length} vehicles from URL: ${dataUrl}`);
            setVehicles(fetchedVehicles);
            const stats = getFleetEVReadiness(fetchedVehicles);
            setFleetStats(stats);
            setError(null);
            setUsingMockData(false);
            setLoading(false);
            return;
          } else {
            throw new Error("Fetched vehicle data is empty");
          }
        } catch (err) {
          console.error("Failed to load data from URL:", err);
          setError("Failed to load fleet data. Please check the data source.");
          setUsingMockData(true);
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
