
import { useState, useEffect } from "react";
import { VehicleData } from "@/types/VehicleData";
import VehicleCard from "./VehicleCard";
import VehicleDetail from "./VehicleDetail";
import { fetchVehicleData, getMockVehicleData, getFleetEVReadiness, isVehicleEVReady } from "@/utils/dataFetcher";
import { Battery, CarFront, ChevronDown, FilterX, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FleetVisualizationProps {
  jsonUrl?: string;
  className?: string;
}

const FleetVisualization = ({ jsonUrl, className }: FleetVisualizationProps) => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleData[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "ev-ready" | "not-ready">("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // Fleet stats
  const [fleetStats, setFleetStats] = useState({
    evReadyCount: 0,
    evReadyPercentage: 0,
    totalVehicles: 0
  });
  
  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let data: VehicleData[];
        
        if (jsonUrl) {
          data = await fetchVehicleData(jsonUrl);
        } else {
          // Use mock data if no URL is provided
          data = getMockVehicleData();
        }
        
        setVehicles(data);
        setFilteredVehicles(data);
        setFleetStats(getFleetEVReadiness(data));
      } catch (err) {
        console.error("Failed to load vehicle data:", err);
        setError("Failed to load vehicle data. Please check your JSON URL.");
        
        // Fall back to mock data
        const mockData = getMockVehicleData();
        setVehicles(mockData);
        setFilteredVehicles(mockData);
        setFleetStats(getFleetEVReadiness(mockData));
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [jsonUrl]);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...vehicles];
    
    // Apply EV readiness filter
    if (filterBy === "ev-ready") {
      result = result.filter(isVehicleEVReady);
    } else if (filterBy === "not-ready") {
      result = result.filter(vehicle => !isVehicleEVReady(vehicle));
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        vehicle => 
          vehicle.lorry.toLowerCase().includes(term) || 
          vehicle.depot.toLowerCase().includes(term)
      );
    }
    
    setFilteredVehicles(result);
  }, [vehicles, filterBy, searchTerm]);
  
  const handleSelectVehicle = (vehicle: VehicleData) => {
    setSelectedVehicle(vehicle);
  };
  
  const handleCloseDetail = () => {
    setSelectedVehicle(null);
  };
  
  const handleClearFilters = () => {
    setFilterBy("all");
    setSearchTerm("");
  };

  // For better embedding, we'll ensure the component doesn't overflow its container
  return (
    <div className={cn(
      "ev-viz-container font-sans bg-viz-background rounded-lg overflow-hidden shadow-sm",
      className
    )}>
      {loading ? (
        <div className="flex items-center justify-center h-64 p-8">
          <div className="space-y-3 text-center">
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-viz-primary border-t-transparent animate-spin" />
            <p className="text-sm text-gray-500">Loading fleet data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <h3 className="text-lg font-medium mb-2">Data Loading Error</h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <p className="text-sm text-gray-400">Showing mock data instead</p>
        </div>
      ) : selectedVehicle ? (
        <VehicleDetail 
          vehicle={selectedVehicle} 
          onClose={handleCloseDetail} 
        />
      ) : (
        <div className="p-4 md:p-6">
          {/* Header with Title and Stats */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-viz-dark">Fleet Electrification Analysis</h1>
              <p className="text-sm text-gray-500 mt-1">
                {fleetStats.evReadyCount} of {fleetStats.totalVehicles} vehicles ready for EV transition
              </p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <div className="bg-white rounded-lg px-3 py-2 shadow-sm flex items-center space-x-2">
                <Battery size={18} className="text-viz-primary" />
                <span className="font-bold text-lg">{fleetStats.evReadyPercentage}%</span>
                <span className="text-sm text-gray-500">EV Ready</span>
              </div>
              
              <div className="bg-white rounded-lg px-3 py-2 shadow-sm flex items-center space-x-2">
                <CarFront size={18} className="text-viz-primary" />
                <span className="font-bold text-lg">{fleetStats.totalVehicles}</span>
                <span className="text-sm text-gray-500">Vehicles</span>
              </div>
            </div>
          </div>
          
          {/* Main Tabs */}
          <Tabs defaultValue="fleet" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="fleet">Fleet Overview</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fleet">
              {/* Search and Filters */}
              <div className="mb-4 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by vehicle ID or depot"
                    className="pl-9 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <Button
                    variant="outline"
                    className="bg-white w-full sm:w-auto flex items-center justify-between px-4"
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                  >
                    <div className="flex items-center">
                      <SlidersHorizontal size={16} className="mr-2" />
                      <span>
                        {filterBy === "all" ? "All Vehicles" : 
                         filterBy === "ev-ready" ? "EV Ready" : "Not EV Ready"}
                      </span>
                    </div>
                    <ChevronDown size={16} className="ml-2" />
                  </Button>
                  
                  {showFilterMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md py-1 z-10 w-48">
                      <button
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm hover:bg-gray-100",
                          filterBy === "all" && "text-viz-primary font-medium"
                        )}
                        onClick={() => {
                          setFilterBy("all");
                          setShowFilterMenu(false);
                        }}
                      >
                        All Vehicles
                      </button>
                      <button
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm hover:bg-gray-100",
                          filterBy === "ev-ready" && "text-viz-primary font-medium"
                        )}
                        onClick={() => {
                          setFilterBy("ev-ready");
                          setShowFilterMenu(false);
                        }}
                      >
                        EV Ready
                      </button>
                      <button
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm hover:bg-gray-100",
                          filterBy === "not-ready" && "text-viz-primary font-medium"
                        )}
                        onClick={() => {
                          setFilterBy("not-ready");
                          setShowFilterMenu(false);
                        }}
                      >
                        Not EV Ready
                      </button>
                    </div>
                  )}
                </div>
                
                {(filterBy !== "all" || searchTerm) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex items-center justify-center"
                    onClick={handleClearFilters}
                  >
                    <FilterX size={16} />
                  </Button>
                )}
              </div>
              
              {/* Results Count */}
              <p className="text-sm text-gray-500 mb-4">
                Showing {filteredVehicles.length} of {vehicles.length} vehicles
              </p>
              
              {/* Vehicle Grid */}
              {filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard 
                      key={vehicle.lorry} 
                      vehicle={vehicle} 
                      onClick={() => handleSelectVehicle(vehicle)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <div className="inline-block p-3 rounded-full bg-gray-100 mb-3">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No vehicles found</h3>
                  <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="analysis">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6 text-viz-dark">Fleet Electrification Analysis</h2>
                
                <div className="prose max-w-none">
                  <p className="text-lg mb-4">
                    <strong>Despite some high-mileage outliers, the overwhelming majority of daily routes in this 150-car ICE fleet fall well within the range of current EV capabilities — making 92% of them ready for electrification.</strong>
                  </p>
                  
                  <p className="mb-4">
                    The data analysis reveals that a significant majority of vehicles in this fleet operate within daily ranges that are perfectly suited for electric vehicle capabilities. With most modern EVs capable of ranges between 250-300km on a single charge, {fleetStats.evReadyPercentage}% of this fleet's daily operations could be transitioned without operational disruption.
                  </p>
                  
                  <div className="bg-viz-light rounded-lg p-4 my-6">
                    <h3 className="font-bold text-viz-primary mb-2">Key Insights:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="inline-block bg-viz-primary text-white rounded-full p-1 mr-2 mt-0.5">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>The average daily distance driven across the fleet is {Math.round(vehicles.reduce((sum, v) => sum + v.average_distance, 0) / vehicles.length)} kilometers.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block bg-viz-primary text-white rounded-full p-1 mr-2 mt-0.5">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>95% of daily trips fall under {Math.round(vehicles.reduce((sum, v) => sum + v.max_95_perc, 0) / vehicles.length)} kilometers.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block bg-viz-primary text-white rounded-full p-1 mr-2 mt-0.5">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>Highway driving accounts for approximately {Math.round(vehicles.reduce((sum, v) => sum + (v.average_highway_distance / v.average_distance) * 100, 0) / vehicles.length)}% of total distance, favorable for EV efficiency.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p>
                    This analysis demonstrates that transitioning to an electric fleet would not only be environmentally beneficial but operationally feasible for the vast majority of vehicles in this fleet. The few outliers with longer daily routes could be addressed through strategic charging solutions or by maintaining a small number of conventional vehicles for specific long-range needs.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default FleetVisualization;
