
import FleetVisualization from "@/components/FleetVisualization";

const Index = () => {
  // Using the local insSKCZ.json file from the public directory
  const dataUrl = "/insSKCZ.json";
  
  console.log("Index.tsx: Setting up FleetVisualization with data URL:", dataUrl);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-[#ecefff]">
      <div className="w-full max-w-7xl">
        <FleetVisualization jsonUrl={dataUrl} />
      </div>
    </div>
  );
};

export default Index;
