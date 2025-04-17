
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
}

const FleetVisualization = ({ dataSourceUrl }: FleetVisualizationProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { vehicles, loading, error, usingMockData, fleetStats } = useFleetData(dataSourceUrl);

  if (loading) {
    return <LoadingState message="Loading fleet data..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <FleetStats 
        totalVehicles={fleetStats.totalVehicles} 
        evReadyPercentage={fleetStats.evReadyPercentage} 
        usingMockData={usingMockData} 
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
          <FleetOverview vehicles={vehicles} />
        </TabsContent>
        <TabsContent value="analysis">
          <FleetAnalysis vehicles={vehicles} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FleetVisualization;
