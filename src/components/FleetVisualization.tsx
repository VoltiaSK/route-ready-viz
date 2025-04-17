
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFleetData } from "@/hooks/useFleetData";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import FleetStats from "@/components/FleetStats";
import FleetOverview from "@/components/FleetOverview";
import FleetAnalysis from "@/components/FleetAnalysis";
import FleetElectrificationChart from "@/components/FleetElectrificationChart";

interface FleetVisualizationProps {
  dataSourceUrl?: string;
  jsonUrl?: string; // Add jsonUrl prop to match what's used in App.tsx
  className?: string; // Add className prop to match what's used in webComponents
}

const FleetVisualization = ({ dataSourceUrl, jsonUrl }: FleetVisualizationProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  // Use either dataSourceUrl or jsonUrl (for backward compatibility)
  const { vehicles, loading, error, usingMockData, fleetStats } = useFleetData(jsonUrl || dataSourceUrl);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} showingMockData={usingMockData} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6">
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
            onSelectVehicle={() => {}}
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
  );
};

export default FleetVisualization;
