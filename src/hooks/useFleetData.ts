
import { useState, useEffect, useRef } from "react";
import { VehicleData } from "@/types/VehicleData";
import { fetchVehicleData, getFleetEVReadiness } from "@/utils/dataFetcher";
import { toast } from "@/components/ui/use-toast";

export const useFleetData = (jsonUrl: string = "fleetData150.json") => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [fleetStats, setFleetStats] = useState({
    evReadyCount: 0,
    evReadyPercentage: 0,
    totalVehicles: 0
  });
  
  // Store vehicles count for debugging
  const vehiclesCountRef = useRef<number>(0);
  const loadAttempts = useRef(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      setUsingMockData(false);
      
      try {
        const dataUrl = jsonUrl;
        const currentAttempt = ++loadAttempts.current;
        console.log(`⏳ [Attempt ${currentAttempt}] Loading fleet data from: ${dataUrl}`);
        
        // Fetch the vehicle data as a new array
        const vehicleData = await fetchVehicleData(dataUrl);
        
        // Validate the data
        if (!vehicleData || vehicleData.length === 0) {
          throw new Error("No vehicle data was returned");
        }
        
        // Store the count for later comparison
        vehiclesCountRef.current = vehicleData.length;
        
        console.log(`✅ [Attempt ${currentAttempt}] Successfully loaded ALL ${vehicleData.length} vehicles from ${dataUrl}`);
        console.log(`📱 Vehicle data details: First ID=${vehicleData[0]?.lorry}, Last ID=${vehicleData[vehicleData.length-1]?.lorry}`);
        
        // Calculate fleet stats
        const stats = getFleetEVReadiness(vehicleData);
        
        console.log(`🔄 [CRITICAL] Setting state with ${vehicleData.length} vehicles`);
        console.log(`📊 [Data Source] Using data from: ${dataUrl}`);
        
        // Important: Create a completely new array to avoid any reference issues
        const vehiclesToSet = [...vehicleData];
        
        // Set state with the new data
        setVehicles(vehiclesToSet);
        setFleetStats(stats);
        
        setLoading(false);
        toast({
          title: "Fleet data loaded",
          description: `Successfully loaded ${vehicleData.length} vehicles from ${dataUrl}`,
          duration: 5000,
        });
      } catch (err: any) {
        console.error("❌ Failed to load fleet data:", err);
        setError(err.message || "Failed to load fleet data. Please check the data source.");
        
        setVehicles([]);
        setFleetStats({
          evReadyCount: 0,
          evReadyPercentage: 0,
          totalVehicles: 0
        });
        setUsingMockData(false);
        setLoading(false);
        
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: err.message || "Failed to load vehicle data",
          duration: 5000,
        });
      }
    };
    
    loadData();
  }, [jsonUrl]);

  useEffect(() => {
    // This will run after each state update with the latest values
    console.log(`📊 [State Update] Vehicles state changed: ${vehicles.length} vehicles`);
    console.log(`📊 [State Update] Fleet stats: ${fleetStats.evReadyCount}/${fleetStats.totalVehicles} vehicles are EV-ready`);
  }, [vehicles, fleetStats]);

  return { vehicles, loading, error, usingMockData, fleetStats };
};
