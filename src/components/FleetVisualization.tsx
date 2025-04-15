
import { useState, useEffect } from "react";
import { VehicleData } from "@/types/VehicleData";
import VehicleDetail from "./VehicleDetail";
import { fetchVehicleData, getMockVehicleData, getFleetEVReadiness, isVehicleEVReady } from "@/utils/dataFetcher";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FleetStats from "./FleetStats";
import FilterBar from "./FilterBar";
import VehicleGrid from "./VehicleGrid";
import FleetAnalysis from "./FleetAnalysis";
import FleetPagination from "./FleetPagination";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 24;
  
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
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [vehicles, filterBy, searchTerm]);
  
  // Calculate pagination values
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);
  
  // Change page
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  
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

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filter: "all" | "ev-ready" | "not-ready") => {
    setFilterBy(filter);
  };

  // For better embedding, we'll ensure the component doesn't overflow its container
  return (
    <div className={cn(
      "ev-viz-container font-sans bg-viz-background rounded-lg overflow-hidden shadow-sm",
      className
    )}>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
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
            
            <FleetStats 
              evReadyCount={fleetStats.evReadyCount}
              evReadyPercentage={fleetStats.evReadyPercentage}
              totalVehicles={fleetStats.totalVehicles}
            />
          </div>
          
          {/* Main Tabs */}
          <Tabs defaultValue="fleet" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="fleet">Fleet Overview</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fleet">
              {/* Search and Filters */}
              <FilterBar
                searchTerm={searchTerm}
                filterBy={filterBy}
                onSearchChange={handleSearchChange}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
              
              {/* Results Count */}
              <p className="text-sm text-gray-500 mb-4">
                Showing {currentVehicles.length} of {filteredVehicles.length} vehicles
                {filteredVehicles.length !== vehicles.length && ` (filtered from ${vehicles.length} total)`}
              </p>
              
              {/* Vehicle Grid */}
              <VehicleGrid 
                vehicles={currentVehicles} 
                onSelectVehicle={handleSelectVehicle} 
              />
              
              {/* Pagination */}
              <FleetPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </TabsContent>
            
            <TabsContent value="analysis">
              <FleetAnalysis 
                vehicles={vehicles} 
                fleetStats={fleetStats} 
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default FleetVisualization;
