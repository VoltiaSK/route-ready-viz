
interface ErrorStateProps {
  error: string;
  showingMockData?: boolean;
}

const ErrorState = ({ error, showingMockData = false }: ErrorStateProps) => {
  // If we're showing mock data, we should render a less alarming component
  if (showingMockData) {
    return (
      <div className="fleet-viz-warning flex flex-col items-center justify-center p-4 text-center mb-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="fleet-viz-warning-icon text-amber-500 mb-2">⚠️</div>
        <p className="fleet-viz-warning-message text-sm text-amber-700 mb-1">{error}</p>
        <p className="fleet-viz-warning-fallback text-sm text-amber-600 font-medium">Using demo data instead</p>
      </div>
    );
  }
  
  // If not showing mock data, show the full error state
  return (
    <div className="fleet-viz-error flex flex-col items-center justify-center h-64 p-8 text-center">
      <div className="fleet-viz-error-icon text-red-500 mb-2">⚠️</div>
      <h3 className="fleet-viz-error-title text-lg font-medium mb-2 text-fleet-viz-dark">Data Loading Error</h3>
      <p className="fleet-viz-error-message text-sm text-gray-500 mb-4">{error}</p>
      <p className="fleet-viz-error-fallback text-sm text-gray-400">Showing mock data instead</p>
    </div>
  );
};

export default ErrorState;
