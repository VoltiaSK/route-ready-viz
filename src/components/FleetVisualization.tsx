
import { useState } from "react";
import { VehicleData } from "@/types/VehicleData";
import VehicleDetail from "./VehicleDetail";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FleetAnalysis from "./FleetAnalysis";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import FleetHeader from "./FleetHeader";
import FleetOverview from "./FleetOverview";
import { useFleetData } from "@/hooks/useFleetData";
import { useFleetFilters } from "@/hooks/useFleetFilters";

interface FleetVisualizationProps {
  jsonUrl?: string;
  className?: string;
}

const FleetVisualization = ({ jsonUrl, className }: FleetVisualizationProps) => {
  const { vehicles, loading, error, usingMockData, fleetStats } = useFleetData(jsonUrl);
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
  
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  
  const handleSelectVehicle = (vehicle: VehicleData) => {
    setSelectedVehicle(vehicle);
  };
  
  const handleCloseDetail = () => {
    setSelectedVehicle(null);
  };

  // For better embedding, we'll ensure the component doesn't overflow its container
  return (
    <div className={cn(
      "fleet-viz-container font-sans bg-fleet-viz-background rounded-lg overflow-hidden shadow-sm",
      className
    )}>
      {loading ? (
        <LoadingState />
      ) : selectedVehicle ? (
        <VehicleDetail 
          vehicle={selectedVehicle} 
          onClose={handleCloseDetail} 
        />
      ) : (
        <div className="fleet-viz-wrapper p-4 md:p-6 bg-fleet-viz-cardsBackground">
          {/* Show warning banner if using mock data due to error */}
          {error && usingMockData && (
            <ErrorState error={error} showingMockData={true} />
          )}
          
          {/* Header with Title and Stats */}
          <FleetHeader
            evReadyCount={fleetStats.evReadyCount}
            evReadyPercentage={fleetStats.evReadyPercentage}
            totalVehicles={fleetStats.totalVehicles}
          />
          
          {/* Main Tabs */}
          <Tabs defaultValue="fleet" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="fleet">Fleet Overview</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fleet">
              <FleetOverview
                currentVehicles={currentVehicles}
                filteredVehicles={filteredVehicles}
                totalVehicles={vehicles.length}
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
        </div>
      )}
    </div>
  );
};

export default FleetVisualization;
