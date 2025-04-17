
import React from "react";
import { VehicleData } from "@/types/VehicleData";
import { isVehicleEVReady } from "@/utils/dataFetcher";
import { CarFront } from "lucide-react";

interface FleetElectrificationChartProps {
  vehicles: VehicleData[];
  evReadyPercentage: number;
}

const FleetElectrificationChart = ({ vehicles, evReadyPercentage }: FleetElectrificationChartProps) => {
  const evReadyVehicles = vehicles.filter(isVehicleEVReady);
  const nonEvReadyVehicles = vehicles.filter(vehicle => !isVehicleEVReady(vehicle));
  const evReadyFleetPercentage = Math.round((evReadyVehicles.length / vehicles.length) * 100);
  
  console.log(`Chart rendering with ${evReadyVehicles.length} EV-ready and ${nonEvReadyVehicles.length} non-EV-ready vehicles`);
  
  return (
    <div className="my-6 bg-white rounded-lg p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Fleet Electrification Potential</h3>
        <div className="flex items-center mt-2 md:mt-0">
          <span className="text-sm font-medium">{evReadyFleetPercentage}% of fleet vehicles EV Ready</span>
          <span className="mx-2 text-gray-400">|</span>
          <span className="text-sm text-gray-600">Supporting {evReadyPercentage}% of routes</span>
        </div>
      </div>
      
      <div className="rounded-lg overflow-hidden mb-3 flex flex-col h-48 bg-gray-100 border border-gray-200">
        {/* EV Ready Section (Top) */}
        <div className="ev-ready-section h-1/2 w-full bg-[#F2FCE2]">
          <div className="ev-ready flex flex-wrap content-start justify-start items-start h-full py-2 px-1 overflow-hidden">
            {evReadyVehicles.map((vehicle, index) => (
              <div 
                key={`ev-${vehicle.lorry}-${index}`}
                className="vehicle-icon m-px text-green-700"
                title={`Vehicle ${vehicle.lorry}: ${vehicle.max_95_perc}km`}
              >
                <CarFront size={8} strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Non-EV Ready Section (Bottom) */}
        <div className="non-ev-ready-section bg-gray-300 h-1/2 w-full">
          <div className="non-ev-ready flex flex-wrap justify-start content-start items-start h-full py-2 px-1 overflow-hidden">
            {nonEvReadyVehicles.map((vehicle, index) => (
              <div 
                key={`nonev-${vehicle.lorry}-${index}`}
                className="vehicle-icon m-px text-gray-600"
                title={`Vehicle ${vehicle.lorry}: ${vehicle.max_95_perc}km`}
              >
                <CarFront size={8} strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between text-sm">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-[#17B26A] rounded-full mr-2"></span>
          <span>EV Ready ({evReadyVehicles.length} vehicles)</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
          <span>Needs different solution ({nonEvReadyVehicles.length} vehicles)</span>
        </div>
      </div>
    </div>
  );
};

export default FleetElectrificationChart;
