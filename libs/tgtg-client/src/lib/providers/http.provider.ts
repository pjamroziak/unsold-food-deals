import axios, { Axios } from 'axios';

export const HttpProvider = {
  provide: Axios,
  useFactory: () =>
    axios.create({
      baseURL: 'https://apptoogoodtogo.com/api',
      withCredentials: true,
      headers: {
        'accept-language': 'en-GB',
        'user-agent':
          'TGTG/23.7.12 Dalvik/2.1.0 (Linux; Android 12; SM-G920V Build/MMB29K)',
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Encoding': 'gzip',
        accept: 'application/json',
      },
    }),
};
