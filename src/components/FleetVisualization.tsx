
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
import { useFleetFilters } from "@/hooks/useFleetFilters";

interface FleetVisualizationProps {
  dataSourceUrl?: string;
  jsonUrl?: string;
  className?: string;
}

const FleetVisualization = ({ dataSourceUrl, jsonUrl }: FleetVisualizationProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  
  // Initialize with no data - only load if URL is provided
  const { vehicles, loading, error, usingMockData, fleetStats } = useFleetData(jsonUrl || "");
  
  // Use the fleetFilters hook to manage filtering and pagination
  const {
    filteredVehicles,
    currentVehicles,
    totalPages,
    currentPage,
    searchTerm,
    filterBy,
    handlePageChange,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters
  } = useFleetFilters(vehicles);
  
  // Track vehicles count for debugging
  const [debugInfo, setDebugInfo] = useState({
    vehicleCount: 0,
    lastLogged: new Date(),
    dataSourceUrl: jsonUrl || "No data source"
  });

  // Log data for debugging
  useEffect(() => {
    console.log(`🔄 [FleetVisualization] Vehicles count changed: ${vehicles.length}`);
    console.log(`📊 [FleetVisualization] Stats: ${fleetStats.evReadyCount}/${fleetStats.totalVehicles} vehicles are EV-ready`);
    
    // CRITICAL: Check for exactly 150 vehicles
    if (vehicles.length !== 150 && vehicles.length > 0) {
      console.error(`⚠️ CRITICAL: Expected 150 vehicles but found ${vehicles.length}!`);
      
      // Get vehicle IDs to see if we can identify which one might be missing
      const vehicleIds = vehicles.map(v => v.lorry).sort();
      console.log(`Vehicle IDs (sorted): ${vehicleIds.join(', ')}`);
    }
    
    setDebugInfo({
      vehicleCount: vehicles.length,
      lastLogged: new Date(),
      dataSourceUrl: jsonUrl || "No data source"
    });
    
    if (vehicles.length > 0) {
      toast({
        title: `${vehicles.length} vehicles loaded`,
        description: `Fleet breakdown: ${fleetStats.evReadyCount} EV-ready (${Math.round((fleetStats.evReadyCount/vehicles.length)*100)}%)`,
        duration: 3000,
      });
      
      // Force a check on the next render cycle to compare against expected count
      setTimeout(() => {
        console.log(`⏱️ DELAYED CHECK: Current vehicle count is still ${vehicles.length}`);
      }, 1000);
    }
  }, [vehicles, fleetStats, jsonUrl]);

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

  const noDataMessage = !jsonUrl ? (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Fleet Visualization Ready</h2>
      <p className="text-gray-500 mb-4">
        No data source provided. The visualization is ready to accept external data.
      </p>
      <p className="text-sm text-gray-400">
        To load data, provide a jsonUrl parameter.
      </p>
    </div>
  ) : null;

  if (error) {
    return <ErrorState error={error} showingMockData={usingMockData} />;
  }

  // Display empty state when no data source is provided
  if (!jsonUrl) {
    return noDataMessage;
  }

  // Safety check - if somehow we got no vehicles but no error either
  if (!vehicles || vehicles.length === 0) {
    return <ErrorState 
      error="No vehicle data was loaded, but no specific error was detected. Please check the data source."
      showingMockData={false}
    />;
  }

  console.log(`[FleetVisualization render] Displaying ${vehicles.length} vehicles`);

  // IMPORTANT: Add detailed diagnostics to the UI if we have fewer than 150 vehicles
  const debugWarning = vehicles.length !== 150 ? (
    <div className="text-xs text-amber-600 mb-2 p-2 border border-amber-300 bg-amber-50 rounded">
      Warning: Expected 150 vehicles but loaded {vehicles.length}. Please check the browser console for details.
    </div>
  ) : null;

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6">
      {/* Debug info */}
      <div className="text-xs text-gray-400 mb-2">
        Loaded {vehicles.length} vehicles • Last updated: {debugInfo.lastLogged.toLocaleTimeString()} • 
        Source: {debugInfo.dataSourceUrl}
      </div>
      
      {/* Show debug warning if vehicle count is not 150 */}
      {debugWarning}
      
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
            currentVehicles={currentVehicles}
            filteredVehicles={filteredVehicles}
            totalVehicles={fleetStats.totalVehicles}
            currentPage={currentPage}
            totalPages={totalPages}
            searchTerm={searchTerm}
            filterBy={filterBy}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onPageChange={handlePageChange}
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
