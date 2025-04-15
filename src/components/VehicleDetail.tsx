
import { VehicleData } from "@/types/VehicleData";
import { isVehicleEVReady } from "@/utils/dataFetcher";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Battery, 
  Building2,
  Car, 
  ChevronLeft, 
  Clock, 
  MapPin, 
  Maximize2, 
  Minimize2, 
  Route, 
  Router, 
  TrendingUp 
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface VehicleDetailProps {
  vehicle: VehicleData;
  onClose: () => void;
}

const VehicleDetail = ({ vehicle, onClose }: VehicleDetailProps) => {
  const isEVReady = isVehicleEVReady(vehicle);
  const cityPercentage = Math.max(0, Math.min(100, 100 - Math.round((vehicle.average_highway_distance / vehicle.average_distance) * 100) || 0));
  const highwayPercentage = 100 - cityPercentage;
  
  const evReadinessColor = isEVReady 
    ? "text-viz-ready" 
    : vehicle.max_95_perc <= 300 
      ? "text-viz-warning" 
      : "text-viz-critical";
      
  // Create simulated distribution data for the chart
  const chartData = generateDistributionChart(vehicle);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onClose} 
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft size={16} />
          <span>Back to fleet</span>
        </button>
        
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          isEVReady ? "bg-green-50 text-viz-ready" : "bg-red-50 text-viz-critical"
        )}>
          {isEVReady ? "EV Ready" : "Not EV Ready"}
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Car size={18} className="text-viz-primary" />
            <h2 className="text-xl font-bold">{vehicle.lorry}</h2>
          </div>
          <div className="flex items-center mt-1 space-x-1 text-gray-500">
            <MapPin size={14} />
            <span className="text-sm">{vehicle.depot} Depot</span>
          </div>
        </div>
        
        <div className={cn(
          "flex items-center space-x-1",
          isEVReady ? "text-viz-ready" : "text-viz-critical"
        )}>
          <Battery size={20} />
          <span className="text-sm font-medium">
            {isEVReady ? "EV Compatible" : "Not EV Compatible"}
          </span>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Daily Distance Chart - Updated gradient colors */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <TrendingUp size={16} className="mr-2" />
            Daily Distance Distribution
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d09974" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#995730" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="distance" 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `${value}km`}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Frequency']}
                  labelFormatter={(value) => `${value}km`}
                />
                <Area 
                  type="monotone" 
                  dataKey="frequency" 
                  stroke="#d09974" 
                  fillOpacity={1} 
                  fill="url(#colorDistance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Route size={16} className="text-viz-primary" />
              <h4 className="text-xs font-medium text-gray-600">Average Daily</h4>
            </div>
            <p className="text-lg font-bold">{vehicle.average_distance} km</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock size={16} className="text-viz-primary" />
              <h4 className="text-xs font-medium text-gray-600">Median Daily</h4>
            </div>
            <p className="text-lg font-bold">{vehicle.median_distance} km</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Minimize2 size={16} className="text-viz-primary" />
              <h4 className="text-xs font-medium text-gray-600">Minimum</h4>
            </div>
            <p className="text-lg font-bold">{vehicle.minimum_distance} km</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Maximize2 size={16} className="text-viz-primary" />
              <h4 className="text-xs font-medium text-gray-600">Maximum</h4>
            </div>
            <p className="text-lg font-bold">{vehicle.maximum_distance} km</p>
          </div>
        </div>
        
        {/* 95% Range */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <BarChart3 size={16} className="mr-2" />
            95% of Daily Routes
          </h3>
          <div className="bg-gray-100 h-6 rounded-full overflow-hidden relative">
            <div 
              className={cn(
                "h-full rounded-full transition-all",
                isEVReady ? "bg-viz-ready" : vehicle.max_95_perc <= 300 ? "bg-viz-warning" : "bg-viz-critical"
              )}
              style={{ width: `${Math.min(100, (vehicle.max_95_perc / 400) * 100)}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium">
              <span>{vehicle.min_95_perc} km</span>
              <span>{vehicle.max_95_perc} km</span>
            </div>
          </div>
        </div>
        
        {/* City vs Highway */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Router size={16} className="mr-2" />
            Driving Profile
          </h3>
          <div className="bg-gray-100 h-6 rounded-full overflow-hidden relative">
            <div className="flex h-full">
              <div 
                className="bg-viz-city h-full transition-all flex items-center justify-center"
                style={{ width: `${cityPercentage}%` }}
              >
                {cityPercentage > 15 && (
                  <div className="flex items-center space-x-1 text-xs">
                    <Building2 size={12} />
                    <span>City</span>
                  </div>
                )}
              </div>
              <div 
                className="bg-viz-highway h-full transition-all flex items-center justify-center"
                style={{ width: `${highwayPercentage}%` }}
              >
                {highwayPercentage > 15 && (
                  <div className="flex items-center space-x-1 text-xs text-white">
                    <Route size={12} />
                    <span>Highway</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-600">
            <span>{cityPercentage}% city</span>
            <span>{highwayPercentage}% highway</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate distribution chart data
function generateDistributionChart(vehicle: VehicleData) {
  const { minimum_distance, maximum_distance, average_distance, median_distance } = vehicle;
  const range = maximum_distance - minimum_distance;
  const step = Math.max(5, Math.floor(range / 10));
  
  const chartData = [];
  
  // Generate normal-ish distribution around median/average
  for (let dist = minimum_distance; dist <= maximum_distance; dist += step) {
    // Create a rough bell curve
    const distFromAvg = Math.abs(dist - average_distance);
    const maxDist = Math.max(maximum_distance - average_distance, average_distance - minimum_distance);
    let frequency = 10 * Math.exp(-0.5 * Math.pow(distFromAvg / (maxDist / 2), 2));
    
    // Add some randomization
    frequency *= (0.8 + Math.random() * 0.4);
    
    chartData.push({
      distance: dist,
      frequency: Number(frequency.toFixed(1))
    });
  }
  
  return chartData;
}

export default VehicleDetail;
