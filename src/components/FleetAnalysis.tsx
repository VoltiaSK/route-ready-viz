
import { VehicleData } from "@/types/VehicleData";

interface FleetAnalysisProps {
  vehicles: VehicleData[];
  fleetStats: {
    evReadyCount: number;
    evReadyPercentage: number;
    totalVehicles: number;
  };
}

const FleetAnalysis = ({ vehicles, fleetStats }: FleetAnalysisProps) => {
  const avgDailyDistance = Math.round(vehicles.reduce((sum, v) => sum + v.average_distance, 0) / vehicles.length);
  const avg95PercRange = Math.round(vehicles.reduce((sum, v) => sum + v.max_95_perc, 0) / vehicles.length);
  const avgHighwayPercentage = Math.round(vehicles.reduce((sum, v) => sum + (v.average_highway_distance / v.average_distance) * 100, 0) / vehicles.length);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 text-viz-dark">Fleet Electrification Analysis</h2>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          <strong>Despite some high-mileage outliers, the overwhelming majority of daily routes in this 150-car ICE fleet fall well within the range of current EV capabilities — making {fleetStats.evReadyPercentage}% of them ready for electrification.</strong>
        </p>
        
        <p className="mb-4">
          The data analysis reveals that a significant majority of vehicles in this fleet operate within daily ranges that are perfectly suited for electric vehicle capabilities. With most modern EVs capable of ranges between 250-300km on a single charge, {fleetStats.evReadyPercentage}% of this fleet's daily operations could be transitioned without operational disruption.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-4 my-6 hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-viz-primary mb-2">Key Insights:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="inline-block bg-viz-primary text-white rounded-full p-1 mr-2 mt-0.5">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>The average daily distance driven across the fleet is {avgDailyDistance} kilometers.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-viz-primary text-white rounded-full p-1 mr-2 mt-0.5">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>95% of daily trips fall under {avg95PercRange} kilometers.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-viz-primary text-white rounded-full p-1 mr-2 mt-0.5">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>Highway driving accounts for approximately {avgHighwayPercentage}% of total distance, favorable for EV efficiency.</span>
            </li>
          </ul>
        </div>
        
        <p>
          This analysis demonstrates that transitioning to an electric fleet would not only be environmentally beneficial but operationally feasible for the vast majority of vehicles in this fleet. The few outliers with longer daily routes could be addressed through strategic charging solutions or by maintaining a small number of conventional vehicles for specific long-range needs.
        </p>
      </div>
    </div>
  );
};

export default FleetAnalysis;
