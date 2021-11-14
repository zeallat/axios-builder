// Response 로깅 인터셉터
import { AxiosResponse } from 'axios';
import { format } from 'date-fns';

export const responseLoggingIntercepter = (response: AxiosResponse) => {
  console.groupCollapsed(
    `[${format(new Date(), 'HH:mm:ss.SSS')}][Response][${response.config.method?.toUpperCase()}][${
      response.status
    }] ${response.config.baseURL}${response.config.url}`,
  );
  console.log('[data]', response.data);
  console.groupEnd();
  return response;
};
