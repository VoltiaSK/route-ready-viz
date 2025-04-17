
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { VehicleData } from "@/types/VehicleData";
import { isVehicleEVReady } from "@/utils/dataFetcher";

interface FleetElectrificationChartProps {
  vehicles: VehicleData[];
  evReadyPercentage: number;
}

const FleetElectrificationChart = ({ vehicles, evReadyPercentage }: FleetElectrificationChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const evReadyGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !evReadyGroupRef.current) return;

    // Set up GSAP animation for the EV ready vehicles section
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true
    });

    // Animate the EV ready section with a pulsating gradient effect
    tl.to(evReadyGroupRef.current, {
      backgroundPosition: "200% center",
      duration: 4,
      ease: "sine.inOut"
    });
    
    // Subtle scale animation
    gsap.to(evReadyGroupRef.current.querySelectorAll('.vehicle-dot.ev-ready'), {
      scale: 1.1,
      duration: 0.7,
      stagger: 0.01,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    return () => {
      // Cleanup animations when component unmounts
      tl.kill();
      gsap.killTweensOf(evReadyGroupRef.current?.querySelectorAll('.vehicle-dot.ev-ready'));
    };
  }, [vehicles]);

  const evReadyVehicles = vehicles.filter(isVehicleEVReady);
  const nonEvReadyVehicles = vehicles.filter(vehicle => !isVehicleEVReady(vehicle));

  const evReadyCount = evReadyVehicles.length;
  const totalVehicles = vehicles.length;
  const evReadyFleetPercentage = Math.round((evReadyCount / totalVehicles) * 100);

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-lg font-bold mb-2 text-fleet-viz-dark">Fleet Electrification Readiness</h2>
      <div className="flex flex-wrap gap-1 text-sm text-gray-500 mb-4">
        <p>{evReadyPercentage}% of routes are covered by EV-ready vehicles</p>
        <p className="text-xs">({evReadyFleetPercentage}% of the fleet / {evReadyCount} vehicles)</p>
      </div>
      
      <div ref={chartRef} className="relative h-24 flex items-center mb-2">
        {/* EV Ready vehicles (with animation) */}
        <div 
          ref={evReadyGroupRef}
          className="absolute left-0 h-full flex items-center bg-gradient-to-r from-viz-primary via-[#b3a5f7] to-viz-primary bg-[length:200%_100%]" 
          style={{ 
            width: `${evReadyPercentage}%`, 
            borderRadius: '8px 0 0 8px',
            overflow: evReadyPercentage === 100 ? 'hidden' : 'visible',
          }}
        >
          <div className="flex flex-wrap justify-center items-center h-full py-1 px-2 overflow-hidden">
            {evReadyVehicles.map((vehicle) => (
              <div 
                key={vehicle.lorry}
                className="vehicle-dot ev-ready m-0.5 w-2 h-2 rounded-full bg-white opacity-60"
                title={`Vehicle ${vehicle.lorry}: ${vehicle.max_95_perc}km`}
              />
            ))}
          </div>
        </div>
        
        {/* Non-EV Ready vehicles */}
        <div 
          className="absolute h-full bg-gray-300 flex items-center"
          style={{ 
            left: `${evReadyPercentage}%`,
            width: `${100 - evReadyPercentage}%`,
            borderRadius: evReadyPercentage === 0 ? '8px' : '0 8px 8px 0'
          }}
        >
          <div className="flex flex-wrap justify-center items-center h-full py-1 px-2 overflow-hidden">
            {nonEvReadyVehicles.map((vehicle) => (
              <div 
                key={vehicle.lorry}
                className="vehicle-dot m-0.5 w-2 h-2 rounded-full bg-gray-500 opacity-50"
                title={`Vehicle ${vehicle.lorry}: ${vehicle.max_95_perc}km`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-viz-primary mr-1.5"></span>
          EV Ready ({evReadyVehicles.length} vehicles)
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-gray-300 mr-1.5"></span>
          Needs Additional Range ({nonEvReadyVehicles.length} vehicles)
        </div>
      </div>
    </div>
  );
};

export default FleetElectrificationChart;
