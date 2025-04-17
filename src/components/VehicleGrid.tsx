
import { VehicleData } from "@/types/VehicleData";
import VehicleCard from "./VehicleCard";
import EmptyState from "./EmptyState";
import { useEffect, useRef } from "react";

interface VehicleGridProps {
  vehicles: VehicleData[];
  onSelectVehicle: (vehicle: VehicleData) => void;
}

const VehicleGrid = ({ vehicles, onSelectVehicle }: VehicleGridProps) => {
  // Create placeholder array for empty spaces when fewer than 12 vehicles
  const placeholders = vehicles.length > 0 && vehicles.length < 12 
    ? Array(12 - vehicles.length).fill(null) 
    : [];
    
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Fix card sizing and clickability in embedded contexts
  useEffect(() => {
    const handleResize = () => {
      if (gridRef.current) {
        const isEmbedded = window !== window.parent;
        if (isEmbedded) {
          gridRef.current.classList.add('embedded-grid');
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!vehicles || vehicles.length === 0) {
    return <EmptyState />;
  }

  console.log(`Rendering VehicleGrid with ${vehicles.length} vehicles`);

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 min-h-[768px]"
    >
      {vehicles.map((vehicle, index) => (
        <div 
          key={`grid-${vehicle.lorry}-${index}`} 
          className="transform transition-transform duration-150 hover:scale-105 relative z-10"
          onClick={() => {
            console.log("Vehicle card clicked:", vehicle.lorry);
            onSelectVehicle(vehicle);
          }}
          role="button"
          tabIndex={0}
          aria-label={`View details for vehicle ${vehicle.lorry}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelectVehicle(vehicle);
            }
          }}
        >
          <VehicleCard 
            vehicle={vehicle} 
            onClick={() => {
              console.log("Vehicle card component clicked:", vehicle.lorry);
              onSelectVehicle(vehicle);
            }} 
          />
        </div>
      ))}
      
      {/* Placeholder cards to keep consistent grid height */}
      {placeholders.map((_, idx) => (
        <div 
          key={`placeholder-${idx}`}
          className="bg-transparent h-[232px] rounded-lg"
          aria-hidden="true"
        />
      ))}
      
      <style>
        {`
          /* Ensure consistent card sizing in embedded contexts */
          .embedded-grid > div {
            min-height: 232px;
          }
          
          /* Ensure cards are clickable in embedded contexts */
          .embedded-grid > div:hover {
            z-index: 20;
          }
          
          /* Improved clickability */
          [role="button"] {
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export default VehicleGrid;
