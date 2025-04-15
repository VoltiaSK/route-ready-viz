
import { Battery, CarFront } from "lucide-react";

interface FleetStatsProps {
  evReadyCount: number;
  evReadyPercentage: number;
  totalVehicles: number;
}

const FleetStats = ({ evReadyCount, evReadyPercentage, totalVehicles }: FleetStatsProps) => {
  return (
    <div className="flex items-center space-x-2 mt-4 md:mt-0">
      <div className="bg-white rounded-lg px-3 py-2 shadow-sm flex items-center space-x-2">
        <Battery size={18} className="text-viz-primary" />
        <span className="font-bold text-lg">{evReadyPercentage}%</span>
        <span className="text-sm text-gray-500">EV Ready</span>
      </div>
      
      <div className="bg-white rounded-lg px-3 py-2 shadow-sm flex items-center space-x-2">
        <CarFront size={18} className="text-viz-primary" />
        <span className="font-bold text-lg">{totalVehicles}</span>
        <span className="text-sm text-gray-500">Vehicles</span>
      </div>
    </div>
  );
};

export default FleetStats;
