
import React from 'react';

const LoadingState = () => {
  return (
    <div className="fleet-viz-loading flex items-center justify-center h-64 p-8 w-full">
      <div className="fleet-viz-loading-container space-y-3 text-center">
        <div 
          className="fleet-viz-spinner w-12 h-12 mx-auto rounded-full border-4 border-t-transparent animate-spin" 
          style={{ borderColor: '#d09974', borderTopColor: 'transparent' }}
        />
        <p className="fleet-viz-loading-text text-sm text-[#0f1034]">Loading fleet data...</p>
      </div>
    </div>
  );
};

export default LoadingState;
