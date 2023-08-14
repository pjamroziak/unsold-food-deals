import { Axios, RawAxiosResponseHeaders } from 'axios';

export function setAxiosCookie(
  headers: RawAxiosResponseHeaders,
  instance: Axios
) {
  const setCookieHeaders = headers['set-cookie'];

  if (setCookieHeaders && setCookieHeaders.length > 0) {
    instance.defaults.headers.common['Cookie'] = setCookieHeaders[0];
  }
}
