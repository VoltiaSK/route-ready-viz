
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
  
  console.log(`Chart rendering with ${evReadyVehicles.length} EV-ready and ${nonEvReadyVehicles.length} non-EV-ready vehicles`);
  
  // Main animation sequence
  useEffect(() => {
    if (chartRef.current) {
      // Step 1: Fade in the entire chart
      const masterTimeline = gsap.timeline();
      
      masterTimeline.fromTo(
        chartRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.inOut" }
      );
      
      // Step 2: Animate the bar filling to show the proportions with constant speed
      masterTimeline.fromTo(
        ".ev-ready-section",
        { width: "0%" },
        { 
          width: `${evReadyPercentage}%`, 
          duration: 2, 
          ease: "linear" // Linear easing for consistent speed
        }
      );
      
      masterTimeline.fromTo(
        ".non-ev-ready-section",
        { width: "0%" },
        { 
          width: `${100 - evReadyPercentage}%`, 
          duration: 2, 
          ease: "linear" // Linear easing for consistent speed
        },
        "<" // Start at the same time as the previous animation
      );
      
      // Step 3: Animate each vehicle icon one by one, but AFTER the bar animation completes
      masterTimeline.add(() => {
        // Animate EV-ready vehicle icons (top-left aligned)
        const evIcons = document.querySelectorAll('.ev-ready .vehicle-icon');
        evIcons.forEach((icon, index) => {
          gsap.fromTo(
            icon,
            { opacity: 0, scale: 0 },
            { 
              opacity: 0.85, 
              scale: 1,
              duration: 0.15, 
              delay: index * 0.01, // Small sequential delay between each icon
              ease: "back.out(1.7)" 
            }
          );
        });
        
        // Animate non-EV-ready vehicle icons
        const nonEvIcons = document.querySelectorAll('.non-ev-ready .vehicle-icon');
        nonEvIcons.forEach((icon, index) => {
          gsap.fromTo(
            icon,
            { opacity: 0, scale: 0 },
            { 
              opacity: 0.6, 
              scale: 1,
              duration: 0.15, 
              delay: index * 0.01, // Small sequential delay between each icon
              ease: "back.out(1.7)" 
            }
          );
        });
      });
      
      // Step 4: Start the moving gradient effect after all animations complete
      masterTimeline.add(() => {
        setIsAnimated(true);
      });
    }
  }, [evReadyPercentage, evReadyVehicles.length, nonEvReadyVehicles.length]);

  // Moving gradient effect with seamless animation
  useEffect(() => {
    if (isAnimated) {
      // Create a seamless animation by using a larger gradient and animating 
      // the background position from left to right continuously
      gsap.fromTo(
        ".ev-ready-gradient",
        { 
          backgroundPosition: "0% 0%",
          opacity: 0.7
        },
        { 
          backgroundPosition: "100% 0%", 
          opacity: 0.7,
          duration: 3,
          repeat: -1,
          ease: "none", // Use "none" instead of "linear" for perfectly smooth motion
          repeatRefresh: false, // Don't refresh values between repeats
          immediateRender: true // Render immediately to avoid initial flash
        }
      );
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
        {/* EV Ready Section with moving gradient */}
        <div
          className="ev-ready-section h-full transition-all duration-500 ease-in-out relative overflow-hidden"
          style={{ 
            width: "0%", // Start at 0 for animation
            minWidth: "0%",
            borderRadius: evReadyPercentage === 100 ? '8px' : '8px 0 0 8px',
            backgroundColor: "#F2FCE2", // Base color
          }}
        >
          {/* Smooth flowing gradient overlay with specific colors */}
          <div 
            className="ev-ready-gradient absolute inset-0 z-10 opacity-0"
            style={{ 
              background: "linear-gradient(90deg, #17B26A 0%, #1BD081 50%, #17B26A 100%)", // Repeating gradient for seamless loop
              backgroundSize: "200% 100%" // Double width for smooth looping
            }}
          />
          
          <div className="ev-ready flex flex-wrap content-start justify-start items-start h-full py-2 px-1 overflow-hidden z-20 relative">
            {evReadyVehicles.map((vehicle, index) => (
              <div 
                key={`ev-${vehicle.lorry}-${index}`}
                className="vehicle-icon m-px text-green-700 opacity-0"
                title={`Vehicle ${vehicle.lorry}: ${vehicle.max_95_perc}km`}
              >
                <CarFront size={8} strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Non-EV Ready Section */}
        <div
          className="non-ev-ready-section bg-gray-300 h-full transition-all duration-500 ease-in-out"
          style={{ 
            width: "0%", // Start at 0 for animation
            minWidth: "0%",
            borderRadius: evReadyPercentage === 0 ? '8px' : '0 8px 8px 0'
          }}
        >
          <div className="non-ev-ready flex flex-wrap justify-start content-start items-start h-full py-2 px-1 overflow-hidden">
            {/* Make sure we display ALL non-EV ready vehicles */}
            {nonEvReadyVehicles.map((vehicle, index) => (
              <div 
                key={`nonev-${vehicle.lorry}-${index}`}
                className="vehicle-icon m-px text-gray-600 opacity-0"
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
