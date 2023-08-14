export type ItemResponse = {
  items: Item[];
};
export type Item = {
  item: {
    item_id: string;
    item_price: {
      minor_units: number;
      decimals: number;
    };
    item_value: {
      minor_units: number;
      decimals: number;
    };
  };
  store: {
    store_id: string;
    store_name: string;
  };
  pickup_interval: {
    start: string;
    end: string;
  };
  items_available: number;
};

export type ItemRequest = {
  origin: {
    latitude: number;
    longitude: number;
  };

  radius: number;
  page_size: number;
  page: number;
  discover: boolean;
  favorites_only: boolean;
  with_stock_only: boolean;
  hidden_only: boolean;
  we_care_only: boolean;

  item_categories: string[];
  diet_categories: string[];
};
