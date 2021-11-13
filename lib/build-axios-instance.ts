import {
    Axios,
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import { format } from 'date-fns';
import _ from 'lodash';
import curlirize from 'axios-curlirize';

interface Params {
    axiosRequestConfig?: AxiosRequestConfig;
    loggingEnabled?: boolean; // 로깅 활성화 여부
}

const DEFAULT_TIME_OUT_IN_MILLIS = 30 * 1000;

const DEFAULT_PARAMS: Params = {
    axiosRequestConfig:{
        timeout:DEFAULT_TIME_OUT_IN_MILLIS,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    },
    loggingEnabled:true,
};


// Request 로깅 인터셉터
const requestLoggingIntercepter = (config: AxiosRequestConfig) => {

    console.groupCollapsed(
        `[${format(new Date(),'HH:mm:ss.SSS')}][Request][${config.method?.toUpperCase()}] ${config.baseURL}${
            config.url
        }`,
    );
    const {headers, params, data} = config;
    console.log('[headers]', headers);
    console.log('[params]', params);
    console.log('[data]', data);
    console.groupEnd();
    return config;
};

// Response 로깅 인터셉터
const responseLoggingIntercepter = (response: AxiosResponse) => {
    console.groupCollapsed(
        `[${format(new Date(),'HH:mm:ss.SSS')}][Response][${response.config.method?.toUpperCase()}][${
            response.status
        }] ${response.config.baseURL}${response.config.url}`,
    );
    console.log('[data]', response.data);
    console.groupEnd();
    return response;
};

export const isAxiosError = (value: any): value is AxiosError =>
    value?.isAxiosError;

// Error 로깅 인터셉터
const errorLoggingInterceptor = (error: any) => {
    // Axios 오류일 경우 리스폰스 로깅 인터셉터에게 위임합니다.
    if (isAxiosError(error) && error.response) {
        error.response = responseLoggingIntercepter(error.response);
    }
    throw error;
};

export const buildAxiosInstance = (params: Params = DEFAULT_PARAMS) => {
    const {axiosRequestConfig,loggingEnabled} = <Params>(_.defaultsDeep(params, DEFAULT_PARAMS));
    const instance =  new Axios(axiosRequestConfig);


    // Logging 설정
    if (loggingEnabled) {
        // @ts-ignore
        curlirize(axios);
        instance.interceptors.request.use(
            requestLoggingIntercepter,
            errorLoggingInterceptor,
        );
        instance.interceptors.response.use(
            responseLoggingIntercepter,
            errorLoggingInterceptor,
        );
    }
}
