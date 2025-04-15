
import React from "react";
import FleetStats from "./FleetStats";

interface FleetHeaderProps {
  evReadyCount: number;
  evReadyPercentage: number;
  totalVehicles: number;
}

const FleetHeader = ({ evReadyCount, evReadyPercentage, totalVehicles }: FleetHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-fleet-viz-dark">Fleet Electrification Analysis</h1>
        <p className="text-sm text-gray-500 mt-1">
          {evReadyCount} of {totalVehicles} vehicles ready for EV transition
        </p>
      </div>
      
      <FleetStats 
        evReadyCount={evReadyCount}
        evReadyPercentage={evReadyPercentage}
        totalVehicles={totalVehicles}
      />
    </div>
  );
};

export default FleetHeader;
