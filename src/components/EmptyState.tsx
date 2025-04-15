
import { Search } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="text-center py-12 bg-viz-cardsBackground rounded-lg shadow-sm">
      <div className="inline-block p-3 rounded-full bg-gray-100 mb-3">
        <Search size={24} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-1 text-viz-dark">No vehicles found</h3>
      <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
    </div>
  );
};

export default EmptyState;
