
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { VehicleData } from "@/types/VehicleData";
import { isVehicleEVReady } from "@/utils/dataFetcher";
import { Car } from "lucide-react";

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
    
    // Subtle scale animation for car icons
    gsap.to(evReadyGroupRef.current.querySelectorAll('.vehicle-icon.ev-ready'), {
      scale: 1.05,
      duration: 0.7,
      stagger: 0.01,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    return () => {
      // Cleanup animations when component unmounts
      tl.kill();
      gsap.killTweensOf(evReadyGroupRef.current?.querySelectorAll('.vehicle-icon.ev-ready'));
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
        <p><span className="font-bold">{evReadyFleetPercentage}% of fleet vehicles EV Ready</span>, handling {evReadyPercentage}% of all routes</p>
      </div>
      
      <div ref={chartRef} className="relative h-28 flex items-center mb-4 overflow-hidden rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 shadow-inner">
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
          <div className="flex flex-wrap justify-center items-center h-full py-2 px-3 overflow-hidden">
            {evReadyVehicles.map((vehicle) => (
              <div 
                key={vehicle.lorry}
                className="vehicle-icon ev-ready m-1 text-white opacity-70 hover:opacity-100 transition-opacity"
                title={`Vehicle ${vehicle.lorry}: ${vehicle.max_95_perc}km`}
              >
                <Car size={16} strokeWidth={1.5} />
              </div>
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
          <div className="flex flex-wrap justify-center items-center h-full py-2 px-3 overflow-hidden">
            {nonEvReadyVehicles.map((vehicle) => (
              <div 
                key={vehicle.lorry}
                className="vehicle-icon m-1 text-gray-600 opacity-50 hover:opacity-80 transition-opacity"
                title={`Vehicle ${vehicle.lorry}: ${vehicle.max_95_perc}km`}
              >
                <Car size={16} strokeWidth={1.5} />
              </div>
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
          Needs different solution ({nonEvReadyVehicles.length} vehicles)
        </div>
      </div>
    </div>
  );
};

export default FleetElectrificationChart;
