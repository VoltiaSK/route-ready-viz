
import { VehicleData } from "@/types/VehicleData";
import VehicleCard from "./VehicleCard";
import EmptyState from "./EmptyState";

interface VehicleGridProps {
  vehicles: VehicleData[];
  onSelectVehicle: (vehicle: VehicleData) => void;
}

const VehicleGrid = ({ vehicles, onSelectVehicle }: VehicleGridProps) => {
  // Create placeholder array for empty spaces when fewer than 12 vehicles
  const placeholders = vehicles.length > 0 && vehicles.length < 12 
    ? Array(12 - vehicles.length).fill(null) 
    : [];

  if (!vehicles || vehicles.length === 0) {
    return <EmptyState />;
  }

  console.log(`Rendering VehicleGrid with ${vehicles.length} vehicles`);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 min-h-[768px]">
      {vehicles.map((vehicle) => (
        <div 
          key={vehicle.lorry}
          className="cursor-pointer transform transition-transform duration-150 hover:scale-102"
          onClick={() => onSelectVehicle(vehicle)}
        >
          <VehicleCard 
            vehicle={vehicle} 
            onClick={() => onSelectVehicle(vehicle)} 
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
    </div>
  );
};

export default VehicleGrid;
