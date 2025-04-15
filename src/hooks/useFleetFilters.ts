
import { useState, useEffect, useMemo } from "react";
import { VehicleData } from "@/types/VehicleData";
import { isVehicleEVReady } from "@/utils/dataFetcher";

export const useFleetFilters = (vehicles: VehicleData[]) => {
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "ev-ready" | "not-ready">("all");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 12; // Show 12 vehicles per page (changed from 24)
  
  // Apply filters and search whenever the dependencies change
  useEffect(() => {
    console.log(`Applying filters: ${filterBy}, search: "${searchTerm}", total vehicles: ${vehicles.length}`);
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
    
    console.log(`Filtered to ${result.length} vehicles`);
    setFilteredVehicles(result);
    
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [vehicles, filterBy, searchTerm]);
  
  // Calculate pagination values
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  
  // Use useMemo to avoid recalculating currentVehicles on every render
  const currentVehicles = useMemo(() => {
    console.log(`Slicing vehicles from ${indexOfFirstVehicle} to ${indexOfLastVehicle}, out of ${filteredVehicles.length}`);
    return filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  }, [filteredVehicles, indexOfFirstVehicle, indexOfLastVehicle]);
  
  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / vehiclesPerPage));
  
  // Change page
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    console.log(`Changing to page ${pageNumber} of ${totalPages}`);
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filter: "all" | "ev-ready" | "not-ready") => {
    setFilterBy(filter);
  };
  
  const handleClearFilters = () => {
    setFilterBy("all");
    setSearchTerm("");
  };
  
  return {
    filteredVehicles,
    currentVehicles,
    totalPages,
    currentPage,
    searchTerm,
    filterBy,
    handlePageChange,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters
  };
};
