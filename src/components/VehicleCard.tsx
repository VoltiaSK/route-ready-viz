
import { VehicleData } from "@/types/VehicleData";
import { cn } from "@/lib/utils";
import { isVehicleEVReady } from "@/utils/dataFetcher";
import { 
  BarChart3, 
  Battery, 
  Building2,
  Car, 
  ChevronRight, 
  MapPin, 
  Route, 
  TrendingUp 
} from "lucide-react";

interface VehicleCardProps {
  vehicle: VehicleData;
  onClick: () => void;
}

const VehicleCard = ({ vehicle, onClick }: VehicleCardProps) => {
  const isEVReady = isVehicleEVReady(vehicle);
  const cityPercentage = Math.max(0, Math.min(100, 100 - Math.round((vehicle.average_highway_distance / vehicle.average_distance) * 100) || 0));
  const highwayPercentage = 100 - cityPercentage;
  
  const evReadinessColor = isEVReady 
    ? "text-viz-ready" 
    : vehicle.max_95_perc <= 300 
      ? "text-viz-warning" 
      : "text-viz-critical";

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Car size={16} className="text-viz-primary" />
          <h3 className="font-bold text-sm">{vehicle.lorry}</h3>
        </div>
        <div className="flex items-center space-x-1">
          <MapPin size={14} className="text-gray-500" />
          <span className="text-xs text-gray-500">{vehicle.depot}</span>
        </div>
      </div>
      
      <div className="space-y-3 mt-3">
        {/* Average Daily Distance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Route size={14} className="text-gray-500" />
            <span className="text-xs">Avg. daily:</span>
          </div>
          <span className="font-medium text-sm">{vehicle.average_distance} km</span>
        </div>
        
        {/* Range (95% of trips) */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp size={14} className={cn(evReadinessColor)} />
              <span className="text-xs">95% range:</span>
            </div>
            <span className={cn("font-medium text-sm", evReadinessColor)}>
              {vehicle.min_95_perc}-{vehicle.max_95_perc} km
            </span>
          </div>
          
          <div className="mt-1 bg-gray-100 h-2 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                isEVReady ? "bg-viz-ready" : vehicle.max_95_perc <= 300 ? "bg-viz-warning" : "bg-viz-critical"
              )}
              style={{ width: `${Math.min(100, (vehicle.max_95_perc / 400) * 100)}%` }}
            />
          </div>
        </div>
        
        {/* City vs Highway */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 size={14} className="text-gray-500" />
              <span className="text-xs">Driving profile:</span>
            </div>
          </div>
          
          <div className="mt-1 flex items-center space-x-2">
            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="flex h-full">
                <div className="bg-viz-city h-full" style={{ width: `${cityPercentage}%` }} />
                <div className="bg-viz-highway h-full" style={{ width: `${highwayPercentage}%` }} />
              </div>
            </div>
            <span className="text-xs text-gray-500">{cityPercentage}% city</span>
          </div>
        </div>
        
        {/* EV Ready Indicator */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Battery size={14} className={cn(isEVReady ? "text-viz-ready" : "text-viz-critical")} />
            <span className={cn(
              "text-xs font-medium",
              isEVReady ? "text-viz-ready" : "text-viz-critical"
            )}>
              {isEVReady ? "EV Ready" : "Not EV Ready"}
            </span>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
