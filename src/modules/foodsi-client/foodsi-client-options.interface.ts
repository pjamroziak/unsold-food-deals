export interface FoodsiClientOptions {
  baseUrl: string;
  offersEndpoint: string;
  headers: {
    'Content-type': string;
    'system-version': string;
    'user-agent': string;
  };
  request: {
    distance: {
      range: number;
    };
  };
}
