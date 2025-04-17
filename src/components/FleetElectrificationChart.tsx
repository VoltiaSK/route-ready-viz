
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
  
  // Animate icons one by one
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
      
      // Animate vehicle icons one by one with slight delay
      const evIcons = document.querySelectorAll('.ev-ready .vehicle-icon');
      evIcons.forEach((icon, index) => {
        gsap.fromTo(
          icon,
          { opacity: 0, scale: 0.5 },
          { 
            opacity: 0.85, 
            scale: 1,
            duration: 0.2, 
            delay: 1.5 + (index * 0.01), // Small delay between each icon
            ease: "back.out(1.7)" 
          }
        );
      });
      
      const nonEvIcons = document.querySelectorAll('.non-ev-ready .vehicle-icon');
      nonEvIcons.forEach((icon, index) => {
        gsap.fromTo(
          icon,
          { opacity: 0, scale: 0.5 },
          { 
            opacity: 0.6, 
            scale: 1,
            duration: 0.2, 
            delay: 1.5 + (index * 0.01), // Small delay between each icon
            ease: "back.out(1.7)" 
          }
        );
      });
    }
  }, [chartRef, isAnimated, evReadyPercentage, vehicles.length]);

  // Create pulsating effect for the EV-ready section
  useEffect(() => {
    if (isAnimated) {
      gsap.to(".ev-ready-gradient", {
        opacity: 0.7,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, [isAnimated]);

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
        {/* EV Ready Section with pulsating gradient */}
        <div
          className="ev-ready-section h-full transition-all duration-500 ease-in-out relative overflow-hidden"
          style={{ 
            width: isAnimated ? `${evReadyPercentage}%` : "0%",
            borderRadius: evReadyPercentage === 100 ? '8px' : '8px 0 0 8px',
            backgroundColor: "#F2FCE2", // Base color
          }}
        >
          {/* Pulsating gradient overlay */}
          <div 
            className="ev-ready-gradient absolute inset-0 z-10 opacity-0"
            style={{ 
              background: "linear-gradient(45deg, rgba(155,135,245,0.4) 0%, rgba(155,135,245,0) 70%)",
            }}
          />
          
          <div className="ev-ready flex flex-wrap justify-center items-center h-full py-2 px-1 overflow-hidden z-20 relative">
            {evReadyVehicles.map((vehicle, index) => (
              <div 
                key={`ev-${vehicle.lorry}-${index}`}
                className="vehicle-icon m-0.5 text-green-700 opacity-0"
                title={`Vehicle ${vehicle.lorry}: ${vehicle.max_95_perc}km`}
              >
                <CarFront size={10} strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Non-EV Ready Section */}
        <div
          className="non-ev-ready-section bg-gray-300 h-full transition-all duration-500 ease-in-out"
          style={{ 
            width: isAnimated ? `${100 - evReadyPercentage}%` : "100%",
            borderRadius: evReadyPercentage === 0 ? '8px' : '0 8px 8px 0'
          }}
        >
          <div className="non-ev-ready flex flex-wrap justify-center items-center h-full py-2 px-1 overflow-hidden">
            {nonEvReadyVehicles.map((vehicle, index) => (
              <div 
                key={`nonev-${vehicle.lorry}-${index}`}
                className="vehicle-icon m-0.5 text-gray-600 opacity-0"
                title={`Vehicle ${vehicle.lorry}: ${vehicle.max_95_perc}km`}
              >
                <CarFront size={10} strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between text-sm">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-[#F2FCE2] rounded-full mr-2"></span>
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
