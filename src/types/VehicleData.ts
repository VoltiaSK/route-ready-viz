
export interface VehicleData {
  depot: string;
  lorry: string;
  average_distance: number;
  minimum_distance: number;
  maximum_distance: number;
  median_distance: number;
  min_95_perc: number;
  max_95_perc: number;
  average_highway_distance: number;
  median_highway: number;
}

export interface VehicleDataResponse {
  data: VehicleData[];
}
