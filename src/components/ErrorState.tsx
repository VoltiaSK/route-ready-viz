
import React from 'react';

interface ErrorStateProps {
  error: string;
  showingMockData?: boolean;
}

const ErrorState = ({ error, showingMockData = false }: ErrorStateProps) => {
  return (
    <div className="fleet-viz-error flex flex-col items-center justify-center h-full min-h-64 p-8 text-center bg-red-50 border border-red-200 rounded-lg">
      <div className="fleet-viz-error-icon text-red-500 mb-3 text-3xl">⚠️</div>
      <h3 className="fleet-viz-error-title text-lg font-medium mb-2 text-red-700">Data Loading Error</h3>
      <p className="fleet-viz-error-message text-sm text-red-600 mb-4">{error}</p>
      <div className="fleet-viz-error-help text-sm text-gray-600">
        <p>Please check that the data source is accessible and contains valid vehicle data.</p>
        <p className="mt-2 text-xs">
          Expected file: <code>/fleetdata_insurance.json</code>
        </p>
        <p className="mt-1 text-xs">The file should contain a JSON object with a 'data' property that is an array of vehicle objects.</p>
        <p className="mt-1 text-xs">Example format: <code>{`{"data": [{"depot": "SK", "lorry": "7M12345", ...}]}`}</code></p>
        {showingMockData && (
          <p className="mt-2 text-xs text-amber-600">Currently showing mock data as a fallback.</p>
        )}
        
        {/* Additional troubleshooting information */}
        <div className="mt-4 p-3 border border-gray-200 rounded-md bg-gray-50 text-left">
          <h4 className="font-medium text-xs text-gray-700 mb-1">Troubleshooting steps:</h4>
          <ol className="list-decimal list-inside text-xs text-gray-600">
            <li>Verify the file exists in the 'public' directory</li>
            <li>Check that the file name matches exactly 'fleetdata_insurance.json'</li>
            <li>Ensure the JSON format matches the expected structure</li>
            <li>Try refreshing the page</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
