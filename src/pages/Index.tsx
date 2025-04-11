
import FleetVisualization from "@/components/FleetVisualization";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-100">
      <div className="w-full max-w-7xl">
        <FleetVisualization />
        
        {/* Instructions for embedding */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 text-sm">
          <h3 className="text-lg font-bold mb-2">Embedding Instructions</h3>
          <p className="mb-4">To embed this visualization in Webflow, follow these steps:</p>
          
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Deploy this component on a platform like Vercel or Netlify.</li>
            <li>In Webflow, add an "Embed" element where you want the visualization to appear.</li>
            <li>Use an iframe to embed the visualization, for example:</li>
          </ol>
          
          <div className="bg-gray-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
            {`<iframe src="https://your-deployment-url.com" width="100%" height="800" frameborder="0" scrolling="no"></iframe>`}
          </div>
          
          <h4 className="font-medium mt-6 mb-2">Loading Data from External JSON:</h4>
          <p className="mb-2">You can pass your JSON URL as a query parameter:</p>
          
          <div className="bg-gray-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
            {`<iframe src="https://your-deployment-url.com?dataUrl=https://example.com/your-vehicle-data.json" width="100%" height="800" frameborder="0" scrolling="no"></iframe>`}
          </div>
          
          <p className="mt-4 text-gray-500">
            Note: Ensure your JSON data follows the expected format with the required fields.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
