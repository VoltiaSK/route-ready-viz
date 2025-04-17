
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFleetData } from "@/hooks/useFleetData";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import FleetStats from "@/components/FleetStats";
import FleetOverview from "@/components/FleetOverview";
import FleetAnalysis from "@/components/FleetAnalysis";
import FleetElectrificationChart from "@/components/FleetElectrificationChart";
import VehicleDetailModal from "@/components/VehicleDetailModal";
import { VehicleData } from "@/types/VehicleData";
import { toast } from "@/components/ui/use-toast";

interface FleetVisualizationProps {
  dataSourceUrl?: string;
  jsonUrl?: string;
  className?: string;
}

const FleetVisualization = ({ dataSourceUrl, jsonUrl }: FleetVisualizationProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  
  // Use the fleetData hook to load and manage vehicle data
  const { vehicles, loading, error, usingMockData, fleetStats } = useFleetData();
  
  // Track vehicles count for debugging
  const [debugInfo, setDebugInfo] = useState({
    vehicleCount: 0,
    lastLogged: new Date(),
    dataSourceUrl: "https://route-ready-viz.vercel.app/fleetData.json"
  });

  // Log data for debugging
  useEffect(() => {
    console.log(`🔄 [FleetVisualization] Vehicles count changed: ${vehicles.length}`);
    console.log(`📊 [FleetVisualization] Stats: ${fleetStats.evReadyCount}/${fleetStats.totalVehicles} vehicles are EV-ready`);
    
    // Make sure we have the right data before updating debug info
    if (vehicles.length > 0) {
      setDebugInfo({
        vehicleCount: vehicles.length,
        lastLogged: new Date(),
        dataSourceUrl: "https://route-ready-viz.vercel.app/fleetData.json"
      });
      
      toast({
        title: `${vehicles.length} vehicles loaded`,
        description: `Fleet breakdown: ${fleetStats.evReadyCount} EV-ready (${Math.round((fleetStats.evReadyCount/vehicles.length)*100)}%)`,
        duration: 3000,
      });
    }
  }, [vehicles, fleetStats]);

  const handleSelectVehicle = (vehicle: VehicleData) => {
    console.log("Vehicle selected:", vehicle.lorry);
    setSelectedVehicle(vehicle);
  };

  const handleCloseModal = () => {
    setSelectedVehicle(null);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} showingMockData={usingMockData} />;
  }

  // Safety check - if somehow we got no vehicles but no error either
  if (!vehicles || vehicles.length === 0) {
    return <ErrorState 
      error="No vehicle data was loaded, but no specific error was detected. Please check the data source."
      showingMockData={false}
    />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6">
      {/* Debug info */}
      <div className="text-xs text-gray-400 mb-2">
        Loaded {vehicles.length} vehicles • Last updated: {debugInfo.lastLogged.toLocaleTimeString()} • 
        Source: {debugInfo.dataSourceUrl}
      </div>
      
      <FleetStats 
        totalVehicles={fleetStats.totalVehicles} 
        evReadyCount={fleetStats.evReadyCount}
        evReadyPercentage={fleetStats.evReadyPercentage} 
      />

      {/* Fleet Electrification Chart - Placed above the tabs */}
      <FleetElectrificationChart 
        vehicles={vehicles} 
        evReadyPercentage={fleetStats.evReadyPercentage} 
      />
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="overview"
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Fleet Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <FleetOverview 
            currentVehicles={vehicles}
            filteredVehicles={vehicles}
            totalVehicles={fleetStats.totalVehicles}
            currentPage={1}
            totalPages={1}
            searchTerm=""
            filterBy="all"
            onSearchChange={() => {}}
            onFilterChange={() => {}}
            onClearFilters={() => {}}
            onPageChange={() => {}}
            onSelectVehicle={handleSelectVehicle}
          />
        </TabsContent>
        <TabsContent value="analysis">
          <FleetAnalysis 
            vehicles={vehicles} 
            fleetStats={fleetStats}
          />
        </TabsContent>
      </Tabs>

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <VehicleDetailModal 
          vehicle={selectedVehicle} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default FleetVisualization;
