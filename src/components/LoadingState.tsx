
const LoadingState = () => {
  return (
    <div className="flex items-center justify-center h-64 p-8">
      <div className="space-y-3 text-center">
        <div className="w-12 h-12 mx-auto rounded-full border-4 border-viz-primary border-t-transparent animate-spin" />
        <p className="text-sm text-gray-500">Loading fleet data...</p>
      </div>
    </div>
  );
};

export default LoadingState;
