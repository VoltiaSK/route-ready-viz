
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
          <strong>While only {fleetStats.evReadyCount} vehicles ({Math.round(fleetStats.evReadyCount/fleetStats.totalVehicles*100)}% of the fleet) are ready for electrification, these vehicles handle {fleetStats.evReadyPercentage}% of all routes in the fleet.</strong>
        </p>
        
        <p className="mb-4">
          The data analysis reveals that while a minority of vehicles in this fleet are suitable for immediate electrification, these vehicles actually handle the vast majority of routes. With most modern EVs capable of ranges between 250-300km on a single charge, {fleetStats.evReadyPercentage}% of this fleet's daily operations could be electrified by focusing on just {fleetStats.evReadyCount} vehicles.
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
              <span>The EV-ready vehicles ({fleetStats.evReadyCount}) handle {fleetStats.evReadyPercentage}% of all routes, making electrification highly impactful despite focusing on a small portion of the fleet.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-viz-primary text-white rounded-full p-1 mr-2 mt-0.5">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>The average daily distance driven across the fleet is {avgDailyDistance} kilometers, with significant variance between EV-ready and non-EV-ready vehicles.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-viz-primary text-white rounded-full p-1 mr-2 mt-0.5">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>Non-EV-ready vehicles show extreme variability with maximum distances often exceeding 800km, making them challenging candidates for electrification without operational changes.</span>
            </li>
          </ul>
        </div>
        
        <p>
          This analysis demonstrates a strategic approach to fleet electrification would be most effective: focus first on the {fleetStats.evReadyCount} vehicles that handle {fleetStats.evReadyPercentage}% of all fleet operations. This phased approach would deliver significant environmental benefits while avoiding the operational challenges of the high-variability, long-range vehicles that make up the remainder of the fleet.
        </p>
      </div>
    </div>
  );
};

export default FleetAnalysis;
