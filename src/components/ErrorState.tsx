
interface ErrorStateProps {
  error: string;
}

const ErrorState = ({ error }: ErrorStateProps) => {
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
