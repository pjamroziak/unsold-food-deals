export type AuthByRequestPollingIdResponse = {
  access_token: string;
  access_token_ttl_seconds: number;
  refresh_token: string;

  startup_data: {
    user: {
      user_id: string;
    };
  };
};
