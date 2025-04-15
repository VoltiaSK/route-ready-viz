
import { FilterX, Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  searchTerm: string;
  filterBy: "all" | "ev-ready" | "not-ready";
  onSearchChange: (term: string) => void;
  onFilterChange: (filter: "all" | "ev-ready" | "not-ready") => void;
  onClearFilters: () => void;
}

const FilterBar = ({
  searchTerm,
  filterBy,
  onSearchChange,
  onFilterChange,
  onClearFilters,
}: FilterBarProps) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by vehicle ID or depot"
          className="pl-9 bg-white shadow-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="relative">
        <Button
          variant="outline"
          className="bg-white w-full sm:w-auto flex items-center justify-between px-4 shadow-sm"
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
                onFilterChange("all");
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
                onFilterChange("ev-ready");
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
                onFilterChange("not-ready");
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
          className="flex items-center justify-center shadow-sm"
          onClick={onClearFilters}
        >
          <FilterX size={16} />
        </Button>
      )}
    </div>
  );
};

export default FilterBar;
