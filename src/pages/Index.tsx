
import FleetVisualization from "@/components/FleetVisualization";

const Index = () => {
  // Using the external GitHub URL for fleet data
  const dataUrl = "https://raw.githubusercontent.com/VoltiaSK/route-ready-viz/refs/heads/main/public/fleetData150.json";
  
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
