
interface ErrorStateProps {
  error: string;
}

const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
      <div className="text-red-500 mb-2">⚠️</div>
      <h3 className="text-lg font-medium mb-2 text-viz-dark">Data Loading Error</h3>
      <p className="text-sm text-gray-500 mb-4">{error}</p>
      <p className="text-sm text-gray-400">Showing mock data instead</p>
    </div>
  );
};

export default ErrorState;
