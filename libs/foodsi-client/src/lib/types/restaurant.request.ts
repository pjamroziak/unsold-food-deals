export type RestaurantRequest = {
  page: number;
  per_page: number;
  distance: {
    lat: number;
    lng: number;
    range: number;
  };
  hide_unavailable: boolean;
  food_type: string[];
  collection_time: {
    from: string;
    to: string;
  };
};
