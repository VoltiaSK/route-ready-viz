
import React from 'react';

interface ErrorStateProps {
  error: string;
  showingMockData?: boolean;
}

const ErrorState = ({ error, showingMockData = false }: ErrorStateProps) => {
  return (
    <div className="fleet-viz-error flex flex-col items-center justify-center h-64 p-8 text-center bg-red-50 border border-red-200 rounded-lg">
      <div className="fleet-viz-error-icon text-red-500 mb-3 text-3xl">⚠️</div>
      <h3 className="fleet-viz-error-title text-lg font-medium mb-2 text-red-700">Data Loading Error</h3>
      <p className="fleet-viz-error-message text-sm text-red-600 mb-4">{error}</p>
      <div className="fleet-viz-error-help text-sm text-gray-600">
        <p>Please check that the data source is accessible and contains valid vehicle data.</p>
        <p className="mt-2 text-xs">Expected file: <code>https://raw.githubusercontent.com/VoltiaSK/route-ready-viz/refs/heads/main/public/fleetData150.json</code></p>
        <p className="mt-1 text-xs">The file should contain a JSON object with a 'data' property that is an array of vehicle objects.</p>
        <p className="mt-1 text-xs">Example format: <code>{`{"data": [{"depot": "SK", "lorry": "7M12345", ...}]}`}</code></p>
        {showingMockData && (
          <p className="mt-2 text-xs text-amber-600">Currently showing mock data as a fallback.</p>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
