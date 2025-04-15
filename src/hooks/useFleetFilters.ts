
import { useState, useEffect } from "react";
import { VehicleData } from "@/types/VehicleData";
import { isVehicleEVReady } from "@/utils/dataFetcher";

export const useFleetFilters = (vehicles: VehicleData[]) => {
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "ev-ready" | "not-ready">("all");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 24;
  
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
