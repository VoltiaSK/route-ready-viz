
import React from "react";
import { VehicleData } from "@/types/VehicleData";
import FilterBar from "./FilterBar";
import VehicleGrid from "./VehicleGrid";
import FleetPagination from "./FleetPagination";

interface FleetOverviewProps {
  currentVehicles: VehicleData[];
  filteredVehicles: VehicleData[];
  totalVehicles: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  filterBy: "all" | "ev-ready" | "not-ready";
  onSearchChange: (term: string) => void;
  onFilterChange: (filter: "all" | "ev-ready" | "not-ready") => void;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
  onSelectVehicle: (vehicle: VehicleData) => void;
}

const FleetOverview = ({
  currentVehicles,
  filteredVehicles,
  totalVehicles,
  currentPage,
  totalPages,
  searchTerm,
  filterBy,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  onPageChange,
  onSelectVehicle
}: FleetOverviewProps) => {
  return (
    <>
      <FilterBar
        searchTerm={searchTerm}
        filterBy={filterBy}
        onSearchChange={onSearchChange}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
      />
      
      <p className="text-sm text-gray-500 mb-4">
        Showing {currentVehicles.length} of {filteredVehicles.length} vehicles
        {filteredVehicles.length !== totalVehicles && ` (filtered from ${totalVehicles} total)`}
      </p>
      
      <VehicleGrid 
        vehicles={currentVehicles} 
        onSelectVehicle={onSelectVehicle} 
      />
      
      <FleetPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default FleetOverview;
