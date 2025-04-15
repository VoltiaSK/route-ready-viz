
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface FleetPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const FleetPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: FleetPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i} 
              onClick={() => onPageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            isActive={currentPage === 1} 
            onClick={() => onPageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      let startPage, endPage;
      if (currentPage <= 3) {
        // Current page is near the start
        startPage = 2;
        endPage = 4;
        
        items.push(
          ...Array.from({ length: endPage - startPage + 1 }, (_, i) => (
            <PaginationItem key={startPage + i}>
              <PaginationLink 
                isActive={currentPage === startPage + i} 
                onClick={() => onPageChange(startPage + i)}
              >
                {startPage + i}
              </PaginationLink>
            </PaginationItem>
          ))
        );
        
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else if (currentPage >= totalPages - 2) {
        // Current page is near the end
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        
        startPage = totalPages - 3;
        endPage = totalPages - 1;
        
        items.push(
          ...Array.from({ length: endPage - startPage + 1 }, (_, i) => (
            <PaginationItem key={startPage + i}>
              <PaginationLink 
                isActive={currentPage === startPage + i} 
                onClick={() => onPageChange(startPage + i)}
              >
                {startPage + i}
              </PaginationLink>
            </PaginationItem>
          ))
        );
      } else {
        // Current page is in the middle
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        
        startPage = currentPage - 1;
        endPage = currentPage + 1;
        
        items.push(
          ...Array.from({ length: endPage - startPage + 1 }, (_, i) => (
            <PaginationItem key={startPage + i}>
              <PaginationLink 
                isActive={currentPage === startPage + i} 
                onClick={() => onPageChange(startPage + i)}
              >
                {startPage + i}
              </PaginationLink>
            </PaginationItem>
          ))
        );
        
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
        
        {renderPaginationItems()}
        
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default FleetPagination;
