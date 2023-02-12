type RestaurantRequest = {
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

type RestaurantPage = {
  total_pages: number;
  current_page: number;
  data: Restaurant[];
};

type Restaurant = {
  id: number;
  active: boolean;
  address: string;
  address_notes: string;
  closed_at: string;
  distance: string;
  for_day: string;
  image: {
    url: string;
  };
  important_notes: string;
  latitude: string;
  logo: {
    url: string;
  };
  longitude: string;
  meal: {
    description: string;
    original_price: string;
    price: string;
  };
  meals_amount: number;
  name: string;
  opened_at: string;
  package_day: {
    availability_label: string;
    availability_label_number: number;
    isNew: boolean;
    collection_day: {
      id: number;
      week_day: number;
      schedule_id: number;
      meals_amount: number;
      active: boolean;
      closed_at: string;
      opened_at: string;
    };
    meals_left: null | number;
    soldOut: null | number;
  };
  package_id: number;
  package_type: string;
  parent_id: number;
  phone: string;
  url: string;
  what_you_need_to_know: string;
};

export { RestaurantRequest, RestaurantPage, Restaurant };
