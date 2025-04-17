
import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
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
  
  const chartRef = useRef<HTMLDivElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  
  useEffect(() => {
    if (chartRef.current && !isAnimated) {
      // Animate the split between EV-ready and non-EV-ready vehicles
      gsap.fromTo(
        ".ev-ready-section",
        { width: "0%" },
        { 
          width: `${evReadyPercentage}%`, 
          duration: 1.5, 
          ease: "power2.inOut",
          onComplete: () => setIsAnimated(true)
        }
      );
      
      gsap.fromTo(
        ".non-ev-ready-section",
        { width: "100%" },
        { 
          width: `${100 - evReadyPercentage}%`, 
          duration: 1.5, 
          ease: "power2.inOut" 
        }
      );
    }
  }, [chartRef, isAnimated, evReadyPercentage]);

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
      
      <div
        ref={chartRef}
        className="rounded-lg overflow-hidden mb-3 flex h-24 bg-gray-100 border border-gray-200 relative"
      >
        {/* EV Ready Section */}
        <div
          className="ev-ready-section bg-viz-ready h-full transition-all duration-500 ease-in-out"
          style={{ 
            width: isAnimated ? `${evReadyPercentage}%` : "0%",
            borderRadius: evReadyPercentage === 100 ? '8px' : '8px 0 0 8px',
            overflow: evReadyPercentage === 100 ? 'hidden' : 'visible',
          }}
        >
          <div className="flex flex-wrap justify-center items-center h-full py-2 px-1 overflow-hidden">
            {evReadyVehicles.map((vehicle) => (
              <div 
                key={`ev-${vehicle.lorry}`}
                className="vehicle-icon ev-ready m-0.5 text-white opacity-70 hover:opacity-100 transition-opacity"
                title={`Vehicle ${vehicle.lorry}: ${vehicle.max_95_perc}km`}
              >
                <CarFront size={12} strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Non-EV Ready Section */}
        <div
          className="non-ev-ready-section bg-viz-critical h-full transition-all duration-500 ease-in-out"
          style={{ 
            width: isAnimated ? `${100 - evReadyPercentage}%` : "100%",
            borderRadius: evReadyPercentage === 0 ? '8px' : '0 8px 8px 0'
          }}
        >
          <div className="flex flex-wrap justify-center items-center h-full py-2 px-1 overflow-hidden">
            {nonEvReadyVehicles.map((vehicle) => (
              <div 
                key={`nonev-${vehicle.lorry}`}
                className="vehicle-icon m-0.5 text-gray-600 opacity-50 hover:opacity-80 transition-opacity"
                title={`Vehicle ${vehicle.lorry}: ${vehicle.max_95_perc}km`}
              >
                <CarFront size={12} strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between text-sm">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-viz-ready rounded-full mr-2"></span>
          <span>EV Ready ({evReadyVehicles.length} vehicles)</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-viz-critical rounded-full mr-2"></span>
          <span>Needs different solution ({nonEvReadyVehicles.length} vehicles)</span>
        </div>
      </div>
    </div>
  );
};

export default FleetElectrificationChart;
