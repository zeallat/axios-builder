// Request 로깅 인터셉터
import { AxiosRequestConfig } from 'axios';
import { format } from 'date-fns';

export const requestLoggingIntercepter = (config: AxiosRequestConfig) => {

    console.groupCollapsed(
        `[${ format(new Date(), 'HH:mm:ss.SSS') }][Request][${ config.method?.toUpperCase() }] ${ config.baseURL }${
            config.url
        }`,
    );
    const {
        headers,
        params,
        data,
    } = config;
    console.log('[headers]', headers);
    console.log('[params]', params);
    console.log('[data]', data);
    console.groupEnd();
    return config;
};
