
const LoadingState = () => {
  return (
    <div className="flex items-center justify-center h-64 p-8">
      <div className="space-y-3 text-center">
        <div className="w-12 h-12 mx-auto rounded-full border-4 border-t-transparent" 
             style={{ borderColor: '#d09974', borderTopColor: 'transparent' }}
             className="animate-spin" />
        <p className="text-sm text-viz-dark">Loading fleet data...</p>
      </div>
    </div>
  );
};

export default LoadingState;
