
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
    
    // CRITICAL: Verify we have the right count before filtering
    console.log(`⚠️ [useFleetFilters] Pre-filter check: Starting with exactly ${vehicles.length} vehicles`);
    
    // Create a completely new array to avoid reference issues
    let result = [...vehicles];
    
    console.log(`⚠️ [useFleetFilters] After creating new array: ${result.length} vehicles`);
    
    // Apply EV readiness filter
    if (filterBy === "ev-ready") {
      const beforeCount = result.length;
      result = result.filter(isVehicleEVReady);
      console.log(`After EV-ready filter: ${result.length} vehicles (filtered out ${beforeCount - result.length})`);
    } else if (filterBy === "not-ready") {
      const beforeCount = result.length;
      result = result.filter(vehicle => !isVehicleEVReady(vehicle));
      console.log(`After not-ready filter: ${result.length} vehicles (filtered out ${beforeCount - result.length})`);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const beforeCount = result.length;
      result = result.filter(
        vehicle => 
          vehicle.lorry.toLowerCase().includes(term) || 
          vehicle.depot.toLowerCase().includes(term)
      );
      console.log(`After search filter: ${result.length} vehicles (filtered out ${beforeCount - result.length})`);
    }
    
    console.log(`Filtered to ${result.length} vehicles`);
    
    // CRITICAL: Final verification before setting state
    if (filterBy === "all" && !searchTerm && result.length !== vehicles.length) {
      console.error(`⚠️ CRITICAL ERROR: No filters applied but count changed from ${vehicles.length} to ${result.length}!`);
    }
    
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
    
    // CRITICAL: Make sure we're not losing vehicles in the slice operation
    const sliced = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
    console.log(`Sliced to ${sliced.length} vehicles for current page`);
    
    // Make sure we have the expected number of vehicles for this page
    const expectedCount = Math.min(vehiclesPerPage, filteredVehicles.length - indexOfFirstVehicle);
    if (sliced.length !== expectedCount) {
      console.error(`⚠️ SLICE ERROR: Expected ${expectedCount} vehicles but got ${sliced.length}`);
    }
    
    return sliced;
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
