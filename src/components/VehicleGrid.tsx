
import { VehicleData } from "@/types/VehicleData";
import VehicleCard from "./VehicleCard";
import EmptyState from "./EmptyState";

interface VehicleGridProps {
  vehicles: VehicleData[];
  onSelectVehicle: (vehicle: VehicleData) => void;
}

const VehicleGrid = ({ vehicles, onSelectVehicle }: VehicleGridProps) => {
  if (vehicles.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
      {vehicles.map((vehicle) => (
        <VehicleCard 
          key={vehicle.lorry} 
          vehicle={vehicle} 
          onClick={() => onSelectVehicle(vehicle)} 
        />
      ))}
    </div>
  );
};

export default VehicleGrid;
