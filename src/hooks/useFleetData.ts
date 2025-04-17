
import { useState, useEffect, useRef } from "react";
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
  
  const loadAttempts = useRef(0);
  const externalDataUrl = "https://route-ready-viz.vercel.app/fleetData.json";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      setUsingMockData(false);
      
      try {
        // Use the external data URL first, then fall back to jsonUrl parameter, then local file
        const dataUrl = externalDataUrl || jsonUrl || '/fleetData.json';
        const currentAttempt = ++loadAttempts.current;
        console.log(`[Attempt ${currentAttempt}] Attempting to load fleet data from: ${dataUrl}`);
        
        const vehicleData = await fetchVehicleData(dataUrl);
        
        if (!vehicleData || vehicleData.length === 0) {
          throw new Error("No vehicle data was returned");
        }
        
        console.log(`[Attempt ${currentAttempt}] Successfully loaded ALL ${vehicleData.length} vehicles from ${dataUrl}`);
        
        const stats = getFleetEVReadiness(vehicleData);
        
        console.log(`[CRITICAL] Setting state with ${vehicleData.length} vehicles`);
        console.log(`[Data Source] Using data from: ${dataUrl}`);
        
        setVehicles(vehicleData);
        setFleetStats(stats);
        
        setTimeout(() => {
          console.log(`[State Check] Vehicles array in state now has ${vehicleData.length} vehicles`);
        }, 0);
        
        setLoading(false);
      } catch (err: any) {
        console.error("Failed to load fleet data:", err);
        setError(err.message || "Failed to load fleet data. Please check the data source.");
        
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

  useEffect(() => {
    console.log(`[State Update] Vehicles state changed: ${vehicles.length} vehicles`);
    console.log(`[State Update] Fleet stats: ${fleetStats.evReadyCount}/${fleetStats.totalVehicles} vehicles are EV-ready`);
  }, [vehicles, fleetStats]);

  return { vehicles, loading, error, usingMockData, fleetStats };
};
