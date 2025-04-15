
import FleetVisualization from "@/components/FleetVisualization";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-[#ecefff]">
      <div className="w-full max-w-7xl">
        <FleetVisualization />
      </div>
    </div>
  );
};

export default Index;
